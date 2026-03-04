"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Send, Volume2, VolumeX, Hand, ArrowLeft, Loader2, WifiOff, RefreshCw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { sendMessage as sendToNovaBot, checkHealth, clearHistory } from "@/lib/novabot-api";
import { STTService, TTSService } from "@/lib/speech";
import ASLRecognitionModal from "@/components/ASLRecognitionModal";

interface Message {
  id: number;
  type: "user" | "nova";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What time is my next medication?",
  "How am I feeling today?",
  "Call my guardian",
  "Play some music",
  "Take me to the kitchen",
];

export default function TalkPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "nova",
      content: "Hi! I'm Nova, your AI assistant. How can I help you today? You can type, speak, or use sign language.",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [isASLModalOpen, setIsASLModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sttRef = useRef<STTService | null>(null);
  const ttsRef = useRef<TTSService | null>(null);
  const messageIdRef = useRef(1);

  // Initialize STT and TTS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sttRef.current = new STTService({ lang: 'en-US', continuous: false });
      ttsRef.current = new TTSService({ rate: 0.9, pitch: 1.0, volume: 1.0 });

      // Set up STT callbacks
      sttRef.current.onTranscript((text) => {
        setInputText(text);
        setIsListening(false);
      });

      sttRef.current.onEnd(() => {
        setIsListening(false);
      });

      sttRef.current.onError((error, message) => {
        console.error('[STT Error]', error, message);
        setIsListening(false);
      });
    }

    return () => {
      sttRef.current?.stop();
      ttsRef.current?.stop();
    };
  }, []);

  // Check API health on mount
  useEffect(() => {
    const checkConnection = async () => {
      setIsCheckingConnection(true);
      const healthy = await checkHealth();
      setIsConnected(healthy);
      setIsCheckingConnection(false);
    };
    checkConnection();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessageContent = inputText.trim();
    messageIdRef.current += 1;
    const userMessage: Message = {
      id: messageIdRef.current,
      type: "user",
      content: userMessageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Get response from NovaBot LLM API
      const response = await sendToNovaBot(userMessageContent);
      
      messageIdRef.current += 1;
      const novaMessage: Message = {
        id: messageIdRef.current,
        type: "nova",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, novaMessage]);
      
      // Speak the response if TTS is enabled
      if (isTTSEnabled && ttsRef.current) {
        ttsRef.current.speak(response);
      }
    } catch (error) {
      console.error('[Talk] Error getting response:', error);
      
      messageIdRef.current += 1;
      const errorMessage: Message = {
        id: messageIdRef.current,
        type: "nova",
        content: "I'm sorry, I'm having trouble connecting right now. Please check if the NovaBot server is running and try again.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      setIsConnected(false);
    } finally {
      setIsTyping(false);
    }
  }, [inputText, isTyping, isTTSEnabled]);

  const handleVoiceToggle = useCallback(() => {
    if (!sttRef.current) return;

    if (isListening) {
      sttRef.current.stop();
      setIsListening(false);
    } else {
      // Stop TTS if speaking
      ttsRef.current?.stop();
      
      const started = sttRef.current.start();
      if (started) {
        setIsListening(true);
      }
    }
  }, [isListening]);

  const handleTTSToggle = useCallback(() => {
    if (ttsRef.current) {
      const newState = ttsRef.current.toggle();
      setIsTTSEnabled(newState);
    }
  }, []);

  const handleRetryConnection = useCallback(async () => {
    setIsCheckingConnection(true);
    const healthy = await checkHealth();
    setIsConnected(healthy);
    setIsCheckingConnection(false);
  }, []);

  const handleClearHistory = useCallback(async () => {
    try {
      await clearHistory();
      setMessages([
        {
          id: 1,
          type: "nova",
          content: "Hi! I'm Nova, your AI assistant. How can I help you today? You can type, speak, or use sign language.",
          timestamp: new Date(),
        },
      ]);
      messageIdRef.current = 1;
    } catch (error) {
      console.error('[Talk] Error clearing history:', error);
    }
  }, []);

  // Handle ASL text confirmation - set it as input and send
  const handleASLConfirm = useCallback((text: string) => {
    setIsASLModalOpen(false);
    if (text.trim()) {
      setInputText(text);
      // Auto-send the ASL text
      setTimeout(() => {
        const sendButton = document.querySelector('[data-send-button]') as HTMLButtonElement;
        if (sendButton) sendButton.click();
      }, 100);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col animate-fade-in">
      {/* Connection Status Banner */}
      {isConnected === false && (
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-orange-500" />
            <span className="text-orange-700 dark:text-orange-300">
              NovaBot server is not connected. Make sure it&apos;s running on port 5000.
            </span>
          </div>
          <button
            onClick={handleRetryConnection}
            disabled={isCheckingConnection}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", isCheckingConnection && "animate-spin")} />
            Retry
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/rover"
          className="rover-btn w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-text-secondary dark:text-gray-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-display font-bold text-text-primary dark:text-white">Talk to Nova</h1>
          <p className="text-text-muted dark:text-gray-400">Voice, text, or sign language input</p>
        </div>
        {/* Connection Status Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-3 h-3 rounded-full",
              isConnected === null
                ? "bg-gray-400 animate-pulse"
                : isConnected
                  ? "bg-green-500"
                  : "bg-red-500"
            )}
          />
          <span className="text-sm text-text-muted dark:text-gray-400">
            {isConnected === null ? "Connecting..." : isConnected ? "Connected" : "Offline"}
          </span>
        </div>
      </div>

      {/* Input Mode Selector */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleVoiceToggle}
          className={cn(
            "rover-btn flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all",
            isListening
              ? "bg-accent text-white animate-pulse"
              : "bg-white dark:bg-gray-800 border-2 border-primary text-primary"
          )}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          <span className="text-lg font-semibold">{isListening ? "Stop" : "Voice"}</span>
        </button>
        <button 
          onClick={() => setIsASLModalOpen(true)}
          className="rover-btn flex-1 py-4 px-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-secondary text-secondary flex items-center justify-center gap-3 hover:bg-secondary hover:text-white transition-all"
        >
          <Hand className="w-6 h-6" />
          <span className="text-lg font-semibold">Sign Language</span>
        </button>
        <button 
          onClick={handleTTSToggle}
          className={cn(
            "rover-btn flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all",
            isTTSEnabled
              ? "bg-purple-500 text-white"
              : "bg-white dark:bg-gray-800 border-2 border-purple-500 text-purple-600 dark:text-purple-400"
          )}
        >
          {isTTSEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          <span className="text-lg font-semibold">{isTTSEnabled ? "Audio On" : "Audio Off"}</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 overflow-y-auto mb-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-6 py-4",
                  message.type === "user"
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-gray-100 dark:bg-gray-700 text-text-primary dark:text-white rounded-bl-md"
                )}
              >
                <p className="text-lg">{message.content}</p>
                <p
                  className={cn(
                    "text-sm mt-2",
                    message.type === "user" ? "text-white/70" : "text-text-muted dark:text-gray-400"
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-6 py-4 flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-text-muted dark:text-gray-400">Nova is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4">
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => setInputText(question)}
            className="rover-btn whitespace-nowrap px-6 py-3 bg-primary-50 dark:bg-primary-900/30 text-primary rounded-2xl text-base font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            {question}
          </button>
        ))}
      </div>

      {/* Text Input */}
      <div className="flex gap-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder={isListening ? "Listening..." : "Type your message here..."}
          disabled={isTyping}
          className={cn(
            "flex-1 px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all",
            isTyping && "opacity-50 cursor-not-allowed"
          )}
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isTyping}
          data-send-button
          className={cn(
            "rover-btn px-8 py-4 rounded-2xl flex items-center gap-3 transition-all",
            inputText.trim() && !isTyping
              ? "bg-primary text-white hover:bg-primary-600"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          )}
        >
          {isTyping ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
          <span className="text-lg font-semibold">{isTyping ? "Sending" : "Send"}</span>
        </button>
      </div>

      {/* ASL Recognition Modal */}
      <ASLRecognitionModal
        isOpen={isASLModalOpen}
        onClose={() => setIsASLModalOpen(false)}
        onConfirm={handleASLConfirm}
      />
    </div>
  );
}
