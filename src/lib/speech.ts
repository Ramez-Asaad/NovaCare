/**
 * Speech Services - STT (Speech-to-Text) and TTS (Text-to-Speech)
 * Uses Web Speech API for browser-native speech recognition and synthesis
 */

// ============================================================================
// Types
// ============================================================================

export interface STTOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  voice?: string;
}

export type STTCallback = (text: string, confidence: number) => void;
export type STTErrorCallback = (error: string, message: string) => void;

// ============================================================================
// Speech-to-Text (STT)
// ============================================================================

class STTService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private onTranscriptCallback: STTCallback | null = null;
  private onErrorCallback: STTErrorCallback | null = null;
  private onStartCallback: (() => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private lastTranscript: string | null = null;
  private lastTranscriptTime = 0;
  private options: STTOptions;

  constructor(options: STTOptions = {}) {
    this.options = {
      lang: options.lang || 'en-US',
      continuous: options.continuous || false,
      interimResults: options.interimResults !== false,
    };
    this.initialize();
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn('[STT] Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognitionAPI();
    this.recognition.continuous = this.options.continuous || false;
    this.recognition.interimResults = this.options.interimResults || false;
    this.recognition.lang = this.options.lang || 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('[STT] Recognition started');
      this.onStartCallback?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      let confidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
          confidence = event.results[i][0].confidence;
        }
      }

      if (!transcript && event.results.length > 0) {
        const lastResult = event.results[event.results.length - 1];
        transcript = lastResult[0].transcript;
        confidence = lastResult[0].confidence;
      }

      if (!transcript || transcript.trim() === '') return;

      // Prevent duplicate transcripts
      const now = Date.now();
      const normalizedTranscript = transcript.trim().toLowerCase();
      if (
        this.lastTranscript === normalizedTranscript &&
        now - this.lastTranscriptTime < 500
      ) {
        return;
      }

      this.lastTranscript = normalizedTranscript;
      this.lastTranscriptTime = now;

      this.onTranscriptCallback?.(transcript.trim(), confidence);
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('[STT] Error:', event.error);
      this.isListening = false;

      let errorMessage = 'Recognition error: ' + event.error;
      if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please speak clearly.';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Microphone permission denied. Please allow microphone access.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'No microphone found. Please check your microphone.';
      } else if (event.error === 'network') {
        errorMessage = 'Network error occurred. Please check your connection.';
      } else if (event.error === 'aborted') {
        return;
      }

      if (event.error !== 'no-speech') {
        this.onErrorCallback?.(event.error, errorMessage);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('[STT] Recognition ended');
      this.onEndCallback?.();
    };
  }

  start(): boolean {
    if (!this.recognition) {
      this.onErrorCallback?.('not-supported', 'Voice recognition not supported in this browser.');
      return false;
    }

    if (this.isListening) {
      console.log('[STT] Already listening');
      return false;
    }

    try {
      this.lastTranscript = null;
      this.lastTranscriptTime = 0;
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('[STT] Failed to start:', error);
      this.onErrorCallback?.('start-failed', 'Failed to start recognition. Please try again.');
      return false;
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  abort(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  onTranscript(callback: STTCallback): void {
    this.onTranscriptCallback = callback;
  }

  onError(callback: STTErrorCallback): void {
    this.onErrorCallback = callback;
  }

  onStart(callback: () => void): void {
    this.onStartCallback = callback;
  }

  onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }
}

// ============================================================================
// Text-to-Speech (TTS)
// ============================================================================

class TTSService {
  private enabled = true;
  private speaking = false;
  private options: TTSOptions;
  private voices: SpeechSynthesisVoice[] = [];

  constructor(options: TTSOptions = {}) {
    this.options = {
      rate: options.rate ?? 0.9,
      pitch: options.pitch ?? 1.0,
      volume: options.volume ?? 1.0,
      lang: options.lang ?? 'en-US',
      voice: options.voice ?? undefined,
    };
    this.initVoices();
  }

  private initVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
    };

    loadVoices();

    if (!this.voices.length) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  private selectVoice(name?: string): SpeechSynthesisVoice | null {
    if (!this.voices.length) return null;

    if (name) {
      const found = this.voices.find((v) =>
        v.name.toLowerCase().includes(name.toLowerCase())
      );
      if (found) return found;
    }

    // Prefer English voices
    const englishVoice = this.voices.find((v) => v.lang.startsWith('en'));
    return englishVoice || this.voices[0];
  }

  speak(text: string, options: Partial<TTSOptions> = {}): boolean {
    if (!this.enabled) return false;
    if (!this.isSupported()) {
      console.warn('[TTS] Not supported in this browser');
      return false;
    }
    if (!text || !text.trim()) return false;

    this.stop();

    // Clean text for TTS
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options.rate ?? this.options.rate ?? 0.9;
    utterance.pitch = options.pitch ?? this.options.pitch ?? 1.0;
    utterance.volume = options.volume ?? this.options.volume ?? 1.0;
    utterance.lang = options.lang ?? this.options.lang ?? 'en-US';

    const voice = this.selectVoice(options.voice ?? this.options.voice);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      this.speaking = true;
    };

    utterance.onend = () => {
      this.speaking = false;
    };

    utterance.onerror = () => {
      this.speaking = false;
    };

    window.speechSynthesis.speak(utterance);
    return true;
  }

  stop(): void {
    if (!this.isSupported()) return;
    window.speechSynthesis.cancel();
    this.speaking = false;
  }

  pause(): void {
    if (this.isSupported() && this.speaking) {
      window.speechSynthesis.pause();
    }
  }

  resume(): void {
    if (this.isSupported()) {
      window.speechSynthesis.resume();
    }
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    if (!this.enabled) this.stop();
    return this.enabled;
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
    this.stop();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  isCurrentlySpeaking(): boolean {
    return this.speaking || (this.isSupported() && window.speechSynthesis.speaking);
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

// ============================================================================
// Exports
// ============================================================================

export { STTService, TTSService };

// Create singleton instances for easy use
let sttInstance: STTService | null = null;
let ttsInstance: TTSService | null = null;

export function getSTT(options?: STTOptions): STTService {
  if (!sttInstance) {
    sttInstance = new STTService(options);
  }
  return sttInstance;
}

export function getTTS(options?: TTSOptions): TTSService {
  if (!ttsInstance) {
    ttsInstance = new TTSService(options);
  }
  return ttsInstance;
}
