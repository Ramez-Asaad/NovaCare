class TTS {
    constructor(options = {}) {
        this.config = {
            enabled: options.enabled !== false,
            rate: options.rate ?? 0.9,
            pitch: options.pitch ?? 0.9,
            volume: options.volume ?? 1.0,
            lang: options.lang ?? 'en-US',
            voiceName: options.voice ?? null
        };

        this.state = {
            utterance: null,
            speaking: false
        };

        this.callbacks = {
            start: null,
            end: null,
            error: null,
            status: null
        };

        this.voices = [];
        this._initVoices();
    }

    /* ------------------------------------------------------------------ */
    /* Initialization                                                     */
    /* ------------------------------------------------------------------ */

    _initVoices() {
        if (!this.isSupported()) return;

        const loadVoices = () => {
            this.voices = window.speechSynthesis.getVoices();
        };

        loadVoices();

        if (!this.voices.length) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    /* ------------------------------------------------------------------ */
    /* Core API                                                           */
    /* ------------------------------------------------------------------ */

    speak(text, options = {}) {
        if (!this._canSpeak(text)) return false;

        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);
        this._applyOptions(utterance, options);
        this._attachEvents(utterance, text);

        window.speechSynthesis.speak(utterance);
        return true;
    }

    stop() {
        if (!this.isSupported()) return;

        window.speechSynthesis.cancel();
        this._resetState();
        this._updateStatus('Speech stopped');
    }

    pause() {
        if (this.isSupported() && this.isCurrentlySpeaking()) {
            window.speechSynthesis.pause();
            this._updateStatus('Paused');
        }
    }

    resume() {
        if (this.isSupported()) {
            window.speechSynthesis.resume();
            this._updateStatus('Speaking...');
        }
    }

    toggle() {
        this.config.enabled = !this.config.enabled;
        this._updateStatus(
            `Voice output ${this.config.enabled ? 'enabled' : 'disabled'}`
        );

        if (!this.config.enabled) this.stop();
        return this.config.enabled;
    }

    enable() {
        this.config.enabled = true;
    }

    disable() {
        this.config.enabled = false;
        this.stop();
    }

    /* ------------------------------------------------------------------ */
    /* Status Checks                                                      */
    /* ------------------------------------------------------------------ */

    isSupported() {
        return typeof window !== 'undefined' && 'speechSynthesis' in window;
    }

    isCurrentlySpeaking() {
        return (
            this.state.speaking ||
            (this.isSupported() && window.speechSynthesis.speaking)
        );
    }

    isPaused() {
        return this.isSupported() && window.speechSynthesis.paused;
    }

    getVoices() {
        return this.isSupported() ? window.speechSynthesis.getVoices() : [];
    }

    /* ------------------------------------------------------------------ */
    /* Voice Selection                                                    */
    /* ------------------------------------------------------------------ */

    _selectVoice(name) {
        if (!this.voices.length) return null;

        if (name) {
            return this.voices.find(v =>
                v.name.toLowerCase().includes(name.toLowerCase())
            );
        }

        return this._preferredMaleVoice()
            || this.voices.find(v => v.lang.startsWith('en'))
            || this.voices[0];
    }

    _preferredMaleVoice() {
        const priority = ['daniel', 'alex', 'david', 'mark', 'male'];

        return this.voices.find(v =>
            priority.some(p => v.name.toLowerCase().includes(p))
        );
    }

    setVoice(voiceName) {
        this.config.voiceName = voiceName;
    }

    /* ------------------------------------------------------------------ */
    /* Configuration                                                      */
    /* ------------------------------------------------------------------ */

    setRate(rate) {
        this.config.rate = this._clamp(rate, 0.1, 10);
    }

    setPitch(pitch) {
        this.config.pitch = this._clamp(pitch, 0, 2);
    }

    setVolume(volume) {
        this.config.volume = this._clamp(volume, 0, 1);
    }

    setLanguage(lang) {
        this.config.lang = lang;
    }

    /* ------------------------------------------------------------------ */
    /* Callbacks                                                          */
    /* ------------------------------------------------------------------ */

    onStart(cb)  { this.callbacks.start = cb; }
    onEnd(cb)    { this.callbacks.end = cb; }
    onError(cb)  { this.callbacks.error = cb; }
    onStatus(cb) { this.callbacks.status = cb; }

    /* ------------------------------------------------------------------ */
    /* Internal Helpers                                                   */
    /* ------------------------------------------------------------------ */

    _canSpeak(text) {
        if (!this.config.enabled) return false;
        if (!this.isSupported()) {
            this._emitError('not-supported', 'TTS not supported');
            return false;
        }
        if (!text || !text.trim()) return false;
        return true;
    }

    _applyOptions(utterance, options) {
        utterance.rate   = options.rate   ?? this.config.rate;
        utterance.pitch  = options.pitch  ?? this.config.pitch;
        utterance.volume = options.volume ?? this.config.volume;
        utterance.lang   = options.lang   ?? this.config.lang;

        utterance.voice = this._selectVoice(
            options.voice ?? this.config.voiceName
        );
    }

    _attachEvents(utterance, text) {
        utterance.onstart = () => {
            this.state.speaking = true;
            this.state.utterance = utterance;
            this._updateStatus('Speaking...');
            this.callbacks.start?.(text);
        };

        utterance.onend = () => {
            this._resetState();
            this._updateStatus('Finished speaking');
            this.callbacks.end?.(text);
        };

        utterance.onerror = (e) => {
            this._resetState();
            this._emitError(e.error, 'TTS error');
        };
    }

    _emitError(code, message) {
        this._updateStatus(message);
        this.callbacks.error?.(code, message);
    }

    _resetState() {
        this.state.speaking = false;
        this.state.utterance = null;
    }

    _updateStatus(message) {
        this.callbacks.status?.(message);
    }

    _clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }
}

/* ------------------------------------------------------------------ */
/* Exports                                                            */
/* ------------------------------------------------------------------ */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TTS;
}

// window.TTS = TTS;
