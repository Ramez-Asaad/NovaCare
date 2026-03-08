class NovaBotClient {
    constructor(options = {}) {
        // API Configuration
        this.apiUrl = options.apiUrl || 'http://localhost:5000';
        this.apiEndpoint = options.apiEndpoint || '/api/chat';
        
        // Initialize STT and TTS
        this.stt = new STT({
            lang: options.sttLang || 'en-US',
            continuous: options.continuous || false
        });
        
        this.tts = new TTS({
            enabled: options.ttsEnabled !== false,
            rate: options.ttsRate || 0.9,
            pitch: options.ttsPitch || 1.0,
            volume: options.ttsVolume || 1.0
        });
        
        // State
        this.isProcessing = false;
        this.conversationHistory = [];
        this.lastProcessedMessage = null;  // Prevent duplicate processing
        this.lastProcessedTime = 0;
        
        // Callbacks
        this.onResponseCallback = null;
        this.onErrorCallback = null;
        this.onStatusCallback = null;
        
        // Setup STT callbacks
        this.setupSTTCallbacks();
    }

    /**
     * Setup STT event handlers
     */
    setupSTTCallbacks() {
        this.stt.onTranscript((text, confidence) => {
            console.log('[NovaBot] User said:', text, 'Confidence:', confidence);
            
            // Only prevent exact duplicates within a shorter time (1 second)
            const now = Date.now();
            const normalizedText = text.trim().toLowerCase();
            if (this.lastProcessedMessage === normalizedText && 
                (now - this.lastProcessedTime) < 1000) {
                console.log('[NovaBot] Duplicate message ignored:', text);
                return;
            }
            
            // Update tracking
            this.lastProcessedMessage = normalizedText;
            this.lastProcessedTime = now;
            
            // Process the message
            this.updateStatus('Processing your message...');
            this.sendMessage(text);
        });

        this.stt.onError((error, message) => {
            console.error('[NovaBot] STT Error:', error, message);
            this.updateStatus('Voice recognition error: ' + message);
            if (this.onErrorCallback) {
                this.onErrorCallback('stt', error, message);
            }
        });

        this.stt.onStart(() => {
            this.updateStatus('Listening...');
        });

        this.stt.onEnd(() => {
            if (!this.isProcessing) {
                this.updateStatus('Ready');
            }
        });
    }

    /**
     * Start voice interaction (STT → AI → TTS)
     */
    startVoiceInteraction() {
        if (this.isProcessing) {
            console.log('[NovaBot] Already processing a request');
            return false;
        }

        if (!this.stt.isSupported()) {
            const error = 'Speech recognition not supported in this browser';
            this.updateStatus(error);
            if (this.onErrorCallback) {
                this.onErrorCallback('stt', 'not-supported', error);
            }
            return false;
        }

        this.updateStatus('Listening...');
        return this.stt.start();
    }

    /**
     * Stop voice interaction
     */
    stopVoiceInteraction() {
        this.stt.stop();
        this.tts.stop();
        this.isProcessing = false;
        this.updateStatus('Stopped');
    }

    /**
     * Send message to AI and get response
     * @param {string} message - User message
     * @returns {Promise<string>} AI response
     */
    async sendMessage(message) {
        if (!message || message.trim() === '') {
            return;
        }

        // Prevent duplicate processing
        const normalizedMessage = message.trim().toLowerCase();
        const now = Date.now();
        if (this.lastProcessedMessage === normalizedMessage && 
            (now - this.lastProcessedTime) < 2000) {
            console.log('[NovaBot] Duplicate message ignored in sendMessage');
            return;
        }

        if (this.isProcessing) {
            console.log('[NovaBot] Already processing, queuing message');
            // Could implement a queue here
            return;
        }
        
        // Update last processed message
        this.lastProcessedMessage = normalizedMessage;
        this.lastProcessedTime = now;

        this.isProcessing = true;
        this.updateStatus('Thinking...');

        try {
            // Add to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: message
            });

            // Call API
            const response = await fetch(`${this.apiUrl}${this.apiEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    history: this.conversationHistory.slice(-5) // Send last 5 messages for context
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Extract response text
            let aiResponse = '';
            if (data.response) {
                aiResponse = data.response;
            } else if (data.message) {
                aiResponse = data.message;
            } else if (typeof data === 'string') {
                aiResponse = data;
            } else {
                aiResponse = 'I received your message, but I could not generate a response.';
            }

            // Add to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: aiResponse
            });

            // Call response callback
            if (this.onResponseCallback) {
                this.onResponseCallback(message, aiResponse);
            }

            // Speak the response
            this.speakResponse(aiResponse);

            this.isProcessing = false;
            this.updateStatus('Ready');

            return aiResponse;

        } catch (error) {
            console.error('[NovaBot] API Error:', error);
            this.isProcessing = false;
            
            const errorMessage = `Failed to connect to AI: ${error.message}`;
            this.updateStatus('Connection error');
            
            if (this.onErrorCallback) {
                this.onErrorCallback('api', error, errorMessage);
            }

            // Speak error message
            this.tts.speak('Sorry, I encountered an error. Please try again.');

            throw error;
        }
    }

    /**
     * Speak AI response using TTS
     * @param {string} text - Text to speak
     */
    speakResponse(text) {
        if (!text || text.trim() === '') {
            return;
        }

        // Clean text for TTS (remove markdown, special chars)
        const cleanText = text
            .replace(/\*\*/g, '')  // Remove bold markdown
            .replace(/\*/g, '')     // Remove italic markdown
            .replace(/#{1,6}\s/g, '') // Remove headers
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to text
            .trim();

        this.updateStatus('Speaking...');
        this.tts.speak(cleanText);
    }

    /**
     * Send text message (without STT)
     * @param {string} text - Text message
     */
    async sendTextMessage(text) {
        return await this.sendMessage(text);
    }

    /**
     * Toggle TTS on/off
     */
    toggleTTS() {
        return this.tts.toggle();
    }

    /**
     * Enable TTS
     */
    enableTTS() {
        this.tts.enable();
    }

    /**
     * Disable TTS
     */
    disableTTS() {
        this.tts.disable();
    }

    /**
     * Check if TTS is enabled
     */
    isTTSEnabled() {
        return this.tts.enabled;
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
        console.log('[NovaBot] Conversation history cleared');
    }

    /**
     * Get conversation history
     */
    getHistory() {
        return this.conversationHistory;
    }

    /**
     * Set API URL
     * @param {string} url - API base URL
     */
    setApiUrl(url) {
        this.apiUrl = url;
    }

    /**
     * Set API endpoint
     * @param {string} endpoint - API endpoint path
     */
    setApiEndpoint(endpoint) {
        this.apiEndpoint = endpoint;
    }

    /**
     * Set response callback
     * @param {Function} callback - Function(userMessage, aiResponse)
     */
    onResponse(callback) {
        this.onResponseCallback = callback;
    }

    /**
     * Set error callback
     * @param {Function} callback - Function(type, error, message)
     */
    onError(callback) {
        this.onErrorCallback = callback;
    }

    /**
     * Set status callback
     * @param {Function} callback - Function(message)
     */
    onStatus(callback) {
        this.onStatusCallback = callback;
    }

    /**
     * Update status
     * @param {string} message - Status message
     */
    updateStatus(message) {
        if (this.onStatusCallback) {
            this.onStatusCallback(message);
        }
        console.log('[NovaBot] Status:', message);
    }

    /**
     * Check if currently processing
     */
    isCurrentlyProcessing() {
        return this.isProcessing;
    }

    /**
     * Check if currently listening
     */
    isCurrentlyListening() {
        return this.stt.isCurrentlyListening();
    }

    /**
     * Check if currently speaking
     */
    isCurrentlySpeaking() {
        return this.tts.isCurrentlySpeaking();
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaBotClient;
}

// Make available globally (optional)
// window.NovaBotClient = NovaBotClient;
