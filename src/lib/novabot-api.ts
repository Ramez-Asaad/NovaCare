/**
 * NovaBot API Service
 * Handles communication with the NovaBot LLM backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_NOVABOT_API_URL || 'http://localhost:5000';

interface ChatResponse {
  response: string;
  status: 'success' | 'error';
  error?: string;
}

interface HealthResponse {
  status: string;
  service: string;
}

/**
 * Send a message to the NovaBot AI and get a response
 * @param message - The user's message
 * @returns The AI's response
 */
export async function sendMessage(message: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();

    if (data.status === 'error') {
      throw new Error(data.error || 'Unknown error occurred');
    }

    return data.response;
  } catch (error) {
    console.error('[NovaBot API] Error:', error);
    
    // Return a fallback response if the API is unavailable
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return "I'm having trouble connecting to my brain right now. Please make sure the NovaBot server is running and try again.";
    }
    
    throw error;
  }
}

/**
 * Clear the conversation history on the server
 */
export async function clearHistory(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('[NovaBot API] Error clearing history:', error);
    throw error;
  }
}

/**
 * Check if the NovaBot API is available
 * @returns True if the API is healthy
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      return false;
    }

    const data: HealthResponse = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('[NovaBot API] Health check failed:', error);
    return false;
  }
}

/**
 * Get the API base URL
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
