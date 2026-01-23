"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Camera, Hand, Check, Trash2, Space, Delete as DeleteIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { aslAPI, ASLAPIError } from "@/lib/asl-api";
import type { PredictionResponse } from "@/types/asl-types";

interface ASLRecognitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (text: string) => void;
}

export default function ASLRecognitionModal({
    isOpen,
    onClose,
    onConfirm,
}: ASLRecognitionModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastAddedTimeRef = useRef<number>(0); // Cooldown to prevent duplicates

    const [isRecognizing, setIsRecognizing] = useState(false);
    const [accumulatedText, setAccumulatedText] = useState("");
    const [currentPrediction, setCurrentPrediction] = useState<PredictionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "error">("checking");
    const [cameraReady, setCameraReady] = useState(false);

    // For auto-detection after stable recognition
    const [stableLetter, setStableLetter] = useState<string | null>(null);
    const [stableStartTime, setStableStartTime] = useState<number | null>(null);
    const [autoAddProgress, setAutoAddProgress] = useState(0);
    const [lastAddedTime, setLastAddedTime] = useState<number>(0); // Cooldown to prevent duplicates

    // Check API health on mount
    useEffect(() => {
        const checkAPI = async () => {
            try {
                await aslAPI.checkHealth();
                setApiStatus("connected");
                setError(null);
            } catch (err) {
                setApiStatus("error");
                setError(
                    "ASL API is not running. Please start the API server at http://localhost:8000"
                );
            }
        };

        if (isOpen) {
            checkAPI();
        }
    }, [isOpen]);

    // Initialize webcam
    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user",
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setCameraReady(true);
                setError(null);
            }
        } catch (err) {
            const error = err as Error;
            setError(
                `Camera access denied. Please allow camera permissions. ${error.message}`
            );
            setCameraReady(false);
        }
    }, []);

    // Stop webcam
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setCameraReady(false);
    }, []);

    // Capture frame from video and convert to base64
    const captureFrame = useCallback((): string | null => {
        if (!videoRef.current || !canvasRef.current) return null;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context || video.videoWidth === 0) return null;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        // Convert to base64 (remove data:image/jpeg;base64, prefix)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        return dataUrl.split(",")[1];
    }, []);

    // Start continuous prediction
    const startRecognition = useCallback(async () => {
        if (apiStatus !== "connected" || !cameraReady) {
            setError("Please ensure camera and API are ready");
            return;
        }

        setIsRecognizing(true);
        setError(null);
        setStableLetter(null);
        setStableStartTime(null);
        setAutoAddProgress(0);

        // Clear accumulator
        try {
            await aslAPI.clearAccumulator();
            setAccumulatedText("");
        } catch (err) {
            console.error("Failed to clear accumulator:", err);
        }

        // Start prediction loop (10 FPS = 100ms interval)
        intervalRef.current = setInterval(async () => {
            const frameData = captureFrame();
            if (!frameData) return;

            try {
                const prediction = await aslAPI.predict(frameData);
                setCurrentPrediction(prediction);

                // Auto-detection logic: track stable letter for 1.5 seconds
                if (prediction.hand_detected && prediction.letter && prediction.letter !== "?") {
                    setStableLetter((prevLetter) => {
                        const currentTime = Date.now();

                        // If same letter as before, check duration
                        if (prevLetter === prediction.letter) {
                            setStableStartTime((startTime) => {
                                if (startTime) {
                                    const duration = currentTime - startTime;
                                    const progress = Math.min((duration / 1500) * 100, 100);
                                    setAutoAddProgress(progress);

                                    // Auto-add after 1.5 seconds
                                    if (duration >= 1500 && prediction.letter) {
                                        // Check cooldown (1 second since last add)
                                        const now = Date.now();
                                        if (now - lastAddedTimeRef.current >= 1000) {
                                            // Add the letter automatically using /accumulator/add/{letter}
                                            lastAddedTimeRef.current = now; // Set cooldown immediately
                                            (async () => {
                                                try {
                                                    const accumulator = await aslAPI.addLetter(prediction.letter);
                                                    setAccumulatedText(accumulator.full_text);
                                                } catch (err) {
                                                    console.error("Auto-add error:", err);
                                                }
                                            })();
                                        }

                                        // Reset tracking completely
                                        setStableLetter(null);
                                        setStableStartTime(null);
                                        setAutoAddProgress(0);
                                        setLastAddedTime(Date.now()); // Set cooldown in state too
                                        return null;
                                    }
                                    return startTime;
                                } else {
                                    // Start tracking this letter
                                    return currentTime;
                                }
                            });
                            return prevLetter;
                        } else {
                            // Different letter detected, reset tracking
                            setStableStartTime(null);
                            setAutoAddProgress(0);
                            return prediction.letter;
                        }
                    });
                } else {
                    // No hand or no letter, reset tracking
                    setStableLetter(null);
                    setStableStartTime(null);
                    setAutoAddProgress(0);
                }
            } catch (err) {
                console.error("Prediction error:", err);
            }
        }, 100);
    }, [apiStatus, cameraReady, captureFrame]);

    // Stop continuous prediction
    const stopRecognition = useCallback(() => {
        setIsRecognizing(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setCurrentPrediction(null);
        setStableLetter(null);
        setStableStartTime(null);
        setAutoAddProgress(0);
    }, []);

    // Confirm current prediction and add to accumulator
    const confirmLetter = useCallback(async () => {
        if (!currentPrediction || !currentPrediction.hand_detected || !currentPrediction.letter) return;

        try {
            const accumulator = await aslAPI.addLetter(currentPrediction.letter);
            setAccumulatedText(accumulator.full_text);
        } catch (err) {
            if (err instanceof ASLAPIError) {
                setError(err.message);
            }
        }
    }, [currentPrediction]);

    // Add space manually  
    const addSpace = useCallback(async () => {
        try {
            const accumulator = await aslAPI.addLetter(" ");
            setAccumulatedText(accumulator.full_text);
        } catch (err) {
            if (err instanceof ASLAPIError) {
                setError(err.message);
            }
        }
    }, []);

    // Backspace: remove last character manually
    const handleBackspace = useCallback(() => {
        if (accumulatedText.length > 0) {
            const newText = accumulatedText.slice(0, -1);
            setAccumulatedText(newText);
        }
    }, [accumulatedText]);

    // Clear all text
    const clearText = useCallback(async () => {
        try {
            await aslAPI.clearAccumulator();
            setAccumulatedText("");
        } catch (err) {
            if (err instanceof ASLAPIError) {
                setError(err.message);
            }
        }
    }, []);

    // Confirm and send text to chat
    const handleConfirm = useCallback(() => {
        if (accumulatedText.trim()) {
            onConfirm(accumulatedText.trim());
            stopRecognition();
            stopCamera();
            onClose();
        }
    }, [accumulatedText, onConfirm, onClose, stopRecognition, stopCamera]);

    // Handle modal close
    const handleClose = useCallback(() => {
        stopRecognition();
        stopCamera();
        setAccumulatedText("");
        setCurrentPrediction(null);
        setError(null);
        onClose();
    }, [onClose, stopRecognition, stopCamera]);

    // Initialize camera when modal opens
    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
            stopRecognition();
        }

        return () => {
            stopCamera();
            stopRecognition();
        };
    }, [isOpen, startCamera, stopCamera, stopRecognition]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-secondary to-purple-600 rounded-2xl flex items-center justify-center">
                            <Hand className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary dark:text-white">
                                Sign Language Recognition
                            </h2>
                            <p className="text-sm text-text-muted dark:text-gray-400">
                                Show your hand signs to communicate
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                        <X className="w-6 h-6 text-text-secondary dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* API Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    "w-3 h-3 rounded-full",
                                    apiStatus === "connected" && "bg-success animate-pulse",
                                    apiStatus === "checking" && "bg-yellow-500 animate-pulse",
                                    apiStatus === "error" && "bg-accent"
                                )}
                            />
                            <span className="text-sm font-medium text-text-secondary dark:text-gray-400">
                                {apiStatus === "connected" && "API Connected"}
                                {apiStatus === "checking" && "Checking API..."}
                                {apiStatus === "error" && "API Not Available"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Camera
                                className={cn(
                                    "w-5 h-5",
                                    cameraReady ? "text-success" : "text-gray-400"
                                )}
                            />
                            <span className="text-sm font-medium text-text-secondary dark:text-gray-400">
                                {cameraReady ? "Camera Ready" : "Camera Off"}
                            </span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent rounded-2xl p-4">
                            <p className="text-accent text-sm">{error}</p>
                        </div>
                    )}

                    {/* Video Feed */}
                    <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                            style={{ transform: 'scaleX(-1)' }} // Mirror the video for natural ASL signing
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Prediction Overlay */}
                        {isRecognizing && currentPrediction && (
                            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-2xl p-4 min-w-[200px]">
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-white mb-2">
                                        {currentPrediction.hand_detected
                                            ? currentPrediction.letter
                                            : "?"}
                                    </div>
                                    <div className="text-sm text-gray-300 mb-2">
                                        {currentPrediction.hand_detected
                                            ? `${(currentPrediction.confidence * 100).toFixed(1)}% confidence`
                                            : "No hand detected"}
                                    </div>

                                    {/* Auto-add progress bar */}
                                    {currentPrediction.hand_detected && autoAddProgress > 0 && (
                                        <div className="mt-3">
                                            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                                <div
                                                    className="bg-success h-2 rounded-full transition-all duration-100"
                                                    style={{ width: `${autoAddProgress}%` }}
                                                />
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Hold for {((1500 - (autoAddProgress * 15)) / 1000).toFixed(1)}s to add
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Recognition Status Badge */}
                        <div className="absolute top-4 left-4">
                            <div
                                className={cn(
                                    "px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2",
                                    isRecognizing
                                        ? "bg-success text-white"
                                        : "bg-black/50 text-white backdrop-blur-sm"
                                )}
                            >
                                {isRecognizing && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isRecognizing ? "Recognizing..." : "Paused"}
                            </div>
                        </div>
                    </div>

                    {/* Accumulated Text Display */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 min-h-[100px]">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-text-primary dark:text-white">
                                Accumulated Text
                            </h3>
                            <button
                                onClick={clearText}
                                className="px-3 py-1.5 bg-accent-50 dark:bg-accent-900/20 text-accent rounded-lg text-sm font-medium hover:bg-accent-100 dark:hover:bg-accent-900/30 transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear
                            </button>
                        </div>
                        <div className="text-2xl font-mono text-text-primary dark:text-white min-h-[40px] break-words">
                            {accumulatedText || (
                                <span className="text-text-muted dark:text-gray-500">
                                    Your text will appear here...
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Text Editing Controls */}
                        <button
                            onClick={addSpace}
                            disabled={!accumulatedText}
                            className={cn(
                                "rover-btn py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all",
                                accumulatedText
                                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            <Space className="w-6 h-6" />
                            <span className="text-lg font-semibold">Add Space</span>
                        </button>

                        <button
                            onClick={handleBackspace}
                            disabled={!accumulatedText}
                            className={cn(
                                "rover-btn py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all",
                                accumulatedText
                                    ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            <DeleteIcon className="w-6 h-6" />
                            <span className="text-lg font-semibold">Backspace</span>
                        </button>

                        {/* Recognition Controls */}
                        {!isRecognizing ? (
                            <button
                                onClick={startRecognition}
                                disabled={apiStatus !== "connected" || !cameraReady}
                                className={cn(
                                    "rover-btn py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all col-span-2",
                                    apiStatus === "connected" && cameraReady
                                        ? "bg-success text-white hover:bg-success-600"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                <Hand className="w-6 h-6" />
                                <span className="text-lg font-semibold">Start Recognition</span>
                            </button>
                        ) : (
                            <button
                                onClick={stopRecognition}
                                className="rover-btn col-span-2 py-4 px-6 rounded-2xl bg-accent text-white hover:bg-accent-600 flex items-center justify-center gap-3 transition-all"
                            >
                                <X className="w-6 h-6" />
                                <span className="text-lg font-semibold">Stop Recognition</span>
                            </button>
                        )}

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirm}
                            disabled={!accumulatedText.trim()}
                            className={cn(
                                "rover-btn col-span-2 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all",
                                accumulatedText.trim()
                                    ? "bg-primary text-white hover:bg-primary-600"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            <Check className="w-6 h-6" />
                            <span className="text-lg font-semibold">
                                Send to Chat
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
