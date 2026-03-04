/**
 * Emotion Detection API Service
 * Handles communication with the emotion detection backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_NOVABOT_API_URL || 'http://localhost:5000';

export interface EmotionResult {
  emotion: string;
  confidence: number;
  face_detected: boolean;
  all_scores?: Record<string, number>;
  error?: string;
  status: 'success' | 'error';
}

export interface EmotionHealthResponse {
  status: 'available' | 'unavailable';
  message: string;
  device?: string;
  labels?: string[];
}

/**
 * Detect emotion from a base64 encoded image
 * @param imageBase64 - Base64 encoded image (with or without data URL prefix)
 * @returns Emotion detection result
 */
export async function detectEmotion(imageBase64: string): Promise<EmotionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emotion/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageBase64 }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Emotion API] Error:', error);
    return {
      emotion: 'unknown',
      confidence: 0,
      face_detected: false,
      error: error instanceof Error ? error.message : 'Connection failed',
      status: 'error',
    };
  }
}

/**
 * Check if emotion detection service is available
 */
export async function checkEmotionHealth(): Promise<EmotionHealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emotion/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      return {
        status: 'unavailable',
        message: 'Emotion detection service is not available',
      };
    }

    return await response.json();
  } catch (error) {
    console.error('[Emotion API] Health check failed:', error);
    return {
      status: 'unavailable',
      message: 'Could not connect to emotion detection service',
    };
  }
}

/**
 * Get emoji for emotion
 */
export function getEmotionEmoji(emotion: string): string {
  const emojiMap: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fear: '😨',
    surprise: '😲',
    disgust: '🤢',
    neutral: '😐',
    unknown: '❓',
  };
  return emojiMap[emotion.toLowerCase()] || '❓';
}

/**
 * Get color for emotion (for UI styling)
 */
export function getEmotionColor(emotion: string): string {
  const colorMap: Record<string, string> = {
    happy: '#22c55e',      // green
    sad: '#3b82f6',        // blue
    angry: '#ef4444',      // red
    fear: '#a855f7',       // purple
    surprise: '#f59e0b',   // amber
    disgust: '#84cc16',    // lime
    neutral: '#6b7280',    // gray
    unknown: '#9ca3af',    // gray
  };
  return colorMap[emotion.toLowerCase()] || '#6b7280';
}
