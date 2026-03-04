/**
 * ASL Recognition API Client
 * Handles communication with the ASL recognition backend
 */

import type {
    HealthResponse,
    PredictionResponse,
    AccumulatorResponse,
} from "@/types/asl-types";

export class ASLAPIError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
        this.name = "ASLAPIError";
    }
}

export class ASLAPIClient {
    private baseUrl: string;

    constructor(baseUrl: string = "http://localhost:8000") {
        this.baseUrl = baseUrl;
    }

    /**
     * Check API health and model status
     */
    async checkHealth(): Promise<HealthResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/health`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new ASLAPIError(
                    `Health check failed: ${response.statusText}`,
                    response.status
                );
            }

            return await response.json();
        } catch (error) {
            if (error instanceof ASLAPIError) throw error;
            throw new ASLAPIError(
                "Failed to connect to ASL API. Make sure the API is running.",
                0
            );
        }
    }

    /**
     * Get list of supported ASL classes
     */
    async getSupportedClasses(): Promise<string[]> {
        try {
            const response = await fetch(`${this.baseUrl}/classes`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new ASLAPIError(
                    `Failed to get classes: ${response.statusText}`,
                    response.status
                );
            }

            const data = await response.json();
            return data.classes || [];
        } catch (error) {
            if (error instanceof ASLAPIError) throw error;
            throw new ASLAPIError("Failed to get supported classes", 0);
        }
    }

    /**
     * Send frame for prediction (continuous mode)
     */
    async predict(imageBase64: string): Promise<PredictionResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/predict`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: imageBase64 }),
            });

            if (!response.ok) {
                throw new ASLAPIError(
                    `Prediction failed: ${response.statusText}`,
                    response.status
                );
            }

            return await response.json();
        } catch (error) {
            if (error instanceof ASLAPIError) throw error;
            throw new ASLAPIError("Failed to get prediction", 0);
        }
    }

    /**
     * Confirm and add letter to accumulator
     */
    async confirmPrediction(imageBase64: string): Promise<PredictionResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/predict/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: imageBase64 }),
            });

            if (!response.ok) {
                throw new ASLAPIError(
                    `Confirm prediction failed: ${response.statusText}`,
                    response.status
                );
            }

            return await response.json();
        } catch (error) {
            if (error instanceof ASLAPIError) throw error;
            throw new ASLAPIError("Failed to confirm prediction", 0);
        }
    }

    /**
   * Get accumulated text
   */
    async getAccumulatedText(): Promise<AccumulatorResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/accumulator`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new ASLAPIError(
                    `Failed to get accumulated text: ${response.statusText}`,
                    response.status
                );
            }

            const data = await response.json();
            return {
                full_text: data.full_text || "",
                words: data.words || [],
                letter_count: data.full_text?.length || 0,
                word_count: data.words?.length || 0,
            };
        } catch (error) {
            if (error instanceof ASLAPIError) throw error;
            throw new ASLAPIError("Failed to get accumulated text", 0);
        }
    }

    /**
     * Clear accumulated text (uses /reset endpoint)
     */
    async clearAccumulator(): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/reset`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new ASLAPIError(
                    `Failed to clear accumulator: ${response.statusText}`,
                    response.status
                );
            }
        } catch (error) {
            if (error instanceof ASLAPIError) throw error;
            throw new ASLAPIError("Failed to clear accumulator", 0);
        }
    }

    /**
     * Manually add a letter to accumulator
     */
    async addLetter(letter: string): Promise<AccumulatorResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/accumulator/add/${letter}`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new ASLAPIError(
                    `Failed to add letter: ${response.statusText}`,
                    response.status
                );
            }

            const data = await response.json();
            return {
                full_text: data.text || "",
                words: [],
                letter_count: data.text?.length || 0,
                word_count: 0,
            };
        } catch (error) {
            if (error instanceof ASLAPIError) throw error;
            throw new ASLAPIError("Failed to add letter", 0);
        }
    }
}

// Default instance
export const aslAPI = new ASLAPIClient();
