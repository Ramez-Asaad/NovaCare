/**
 * ASL Recognition API Type Definitions
 */

export interface HealthResponse {
    status: string;
    model_loaded: boolean;
    device: string;
    version: string;
}

export interface PredictionResponse {
    letter: string;
    confidence: number;
    hand_detected: boolean;
    timestamp: number;
    api_latency_ms: number;
    inference_time_ms: number;
}

export interface AccumulatorResponse {
    full_text: string;
    words: string[];
    letter_count: number;
    word_count: number;
}

export interface ASLConfig {
    apiUrl: string;
    captureInterval: number; // milliseconds between frame captures
    confidenceThreshold: number; // minimum confidence to show prediction
}
