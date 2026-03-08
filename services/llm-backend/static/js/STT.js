/**
 * Speech-to-Text (STT) Module
 * Standalone module for voice recognition using Web Speech API
 * 
 * Usage:
 *   const stt = new STT();
 *   stt.start((text, confidence) => {
 *       console.log('You said:', text);
 *   });
 */

class STT {
    constructor(options = {}) {
        // Configuration
        this.lang = options.lang || 'en-US';
        this.continuous = options.continuous || false;
        this.interimResults = options.interimResults || true;  // Enable interim results for better feedback
        
        // Internal state
        this.recognition = null;
        this.isListening = false;
        this.lastTranscript = null;
        this.lastTranscriptTime = 0;
        this.onTranscriptCallback = null;
        this.onStatusCallback = null;
        this.onErrorCallback = null;
        this.onStartCallback = null;
        this.onEndCallback = null;
        
        // Initialize recognition
        this.initialize();
    }

    /**
     * Initialize Speech Recognition
     */
    initialize() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = this.continuous;
            this.recognition.interimResults = this.interimResults;
            this.recognition.lang = this.lang;

            // Event handlers
            this.recognition.onstart = () => {
                this.isListening = true;
                console.log('[STT] Recognition started');
                if (this.onStartCallback) {
                    this.onStartCallback();
                }
                this.updateStatus('Listening to voice...');
            };

            this.recognition.onresult = (event) => {
                // Get the final transcript (not interim results)
                let transcript = '';
                let confidence = 0;
                
                // Process all results to get the final one
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript;
                        confidence = event.results[i][0].confidence;
                    }
                }
                
                // If no final result, use the last one
                if (!transcript && event.results.length > 0) {
                    const lastResult = event.results[event.results.length - 1];
                    transcript = lastResult[0].transcript;
                    confidence = lastResult[0].confidence;
                }
                
                if (!transcript || transcript.trim() === '') {
                    return;
                }
                
                // Prevent duplicate transcripts (same text within 500ms - more lenient)
                const now = Date.now();
                const normalizedTranscript = transcript.trim().toLowerCase();
                if (this.lastTranscript === normalizedTranscript && 
                    (now - this.lastTranscriptTime) < 500) {
                    console.log('[STT] Duplicate transcript ignored:', transcript);
                    return;
                }
                
                this.lastTranscript = normalizedTranscript;
                this.lastTranscriptTime = now;
                console.log('[STT] Transcript:', transcript, 'Confidence:', confidence);
                
                // Call callback if provided
                if (this.onTranscriptCallback) {
                    this.onTranscriptCallback(transcript.trim(), confidence);
                }
            };

            this.recognition.onerror = (event) => {
                console.error('[STT] Error:', event.error);
                this.isListening = false;
                
                let errorMessage = 'Recognition error: ' + event.error;
                if (event.error === 'no-speech') {
                    errorMessage = 'No speech detected. Please speak clearly.';
                    // Don't treat no-speech as a critical error - just inform user
                } else if (event.error === 'not-allowed') {
                    errorMessage = 'Microphone permission denied. Please allow microphone access.';
                } else if (event.error === 'audio-capture') {
                    errorMessage = 'No microphone found. Please check your microphone.';
                } else if (event.error === 'network') {
                    errorMessage = 'Network error occurred. Please check your connection.';
                } else if (event.error === 'aborted') {
                    // Aborted is normal when stopping manually
                    return;
                }
                
                this.updateStatus(errorMessage);
                
                if (this.onErrorCallback && event.error !== 'no-speech') {
                    this.onErrorCallback(event.error, errorMessage);
                }
            };

            this.recognition.onend = () => {
                this.isListening = false;
                console.log('[STT] Recognition ended');
                if (this.onEndCallback) {
                    this.onEndCallback();
                }
                // Don't update status on end - let the caller handle it
            };
        } else {
            console.warn('[STT] Speech recognition not supported in this browser');
        }
    }

    /**
     * Start voice recognition
     * @param {Function} onTranscript - Callback function(text, confidence)
     * @returns {boolean} Success status
     */
    start(onTranscript = null) {
        if (!this.recognition) {
            const errorMsg = 'Voice recognition not supported in this browser.';
            this.updateStatus(errorMsg);
            console.error('[STT]', errorMsg);
            if (this.onErrorCallback) {
                this.onErrorCallback('not-supported', errorMsg);
            }
            return false;
        }

        if (this.isListening) {
            console.log('[STT] Already listening');
            return false;
        }

        // Set callback if provided
        if (onTranscript) {
            this.onTranscriptCallback = onTranscript;
        }

        try {
            // Reset duplicate tracking when starting fresh
            this.lastTranscript = null;
            this.lastTranscriptTime = 0;
            
            this.recognition.start();
            console.log('[STT] Recognition started, waiting for speech...');
            return true;
        } catch (error) {
            console.error('[STT] Failed to start:', error);
            this.updateStatus('Failed to start recognition. Please try again.');
            if (this.onErrorCallback) {
                this.onErrorCallback('start-failed', error.message);
            }
            return false;
        }
    }

    /**
     * Stop voice recognition
     */
    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.updateStatus('Stopped listening');
        }
    }

    /**
     * Abort voice recognition (immediate stop)
     */
    abort() {
        if (this.recognition && this.isListening) {
            this.recognition.abort();
            this.isListening = false;
            this.updateStatus('Aborted listening');
        }
    }

    /**
     * Check if STT is supported
     * @returns {boolean}
     */
    isSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    /**
     * Check if currently listening
     * @returns {boolean}
     */
    isCurrentlyListening() {
        return this.isListening;
    }

    /**
     * Set language
     * @param {string} lang - Language code (e.g., 'en-US', 'es-ES')
     */
    setLanguage(lang) {
        this.lang = lang;
        if (this.recognition) {
            this.recognition.lang = lang;
        }
    }

    /**
     * Set continuous mode
     * @param {boolean} continuous - Whether to keep listening after result
     */
    setContinuous(continuous) {
        this.continuous = continuous;
        if (this.recognition) {
            this.recognition.continuous = continuous;
        }
    }

    /**
     * Set interim results
     * @param {boolean} interim - Whether to return interim results
     */
    setInterimResults(interim) {
        this.interimResults = interim;
        if (this.recognition) {
            this.recognition.interimResults = interim;
        }
    }

    /**
     * Set transcript callback
     * @param {Function} callback - Function(text, confidence)
     */
    onTranscript(callback) {
        this.onTranscriptCallback = callback;
    }

    /**
     * Set error callback
     * @param {Function} callback - Function(error, message)
     */
    onError(callback) {
        this.onErrorCallback = callback;
    }

    /**
     * Set start callback
     * @param {Function} callback - Function()
     */
    onStart(callback) {
        this.onStartCallback = callback;
    }

    /**
     * Set end callback
     * @param {Function} callback - Function()
     */
    onEnd(callback) {
        this.onEndCallback = callback;
    }

    /**
     * Set status callback
     * @param {Function} callback - Function(message)
     */
    onStatus(callback) {
        this.onStatusCallback = callback;
    }

    /**
     * Update status (internal method, can be customized)
     * @param {string} message - Status message
     */
    updateStatus(message) {
        // Call custom callback if provided
        if (this.onStatusCallback) {
            this.onStatusCallback(message);
        }
    }
}

// Export for use in other files (Node.js/CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = STT;
}

// Make available globally (optional)
// window.STT = STT;
