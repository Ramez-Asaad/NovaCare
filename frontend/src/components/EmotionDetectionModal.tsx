"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Camera, RefreshCw, Smile, AlertCircle, Video, VideoOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  detectEmotion,
  checkEmotionHealth,
  getEmotionEmoji,
  getEmotionColor,
  EmotionResult,
} from "@/lib/emotion-api";

interface EmotionDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmotionDetectionModal({
  isOpen,
  onClose,
}: EmotionDetectionModalProps) {
  const [isServiceAvailable, setIsServiceAvailable] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check service health on mount
  useEffect(() => {
    if (isOpen) {
      checkEmotionHealth().then((health) => {
        setIsServiceAvailable(health.status === "available");
      });
    }
  }, [isOpen]);

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Stop camera when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setResult(null);
      setError(null);
    }
  }, [isOpen]);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("[Camera] Error:", err);
      setCameraError(
        err instanceof Error
          ? err.message
          : "Could not access camera. Please allow camera permissions."
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  }, []);

  const captureAndDetect = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsDetecting(true);
    setError(null);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0);

      // Convert to base64
      const imageBase64 = canvas.toDataURL("image/jpeg", 0.8);

      // Send to API
      const result = await detectEmotion(imageBase64);

      if (result.status === "error") {
        setError(result.error || "Detection failed");
        setResult(null);
      } else {
        setResult(result);
        setError(null);
      }
    } catch (err) {
      console.error("[Detection] Error:", err);
      setError(err instanceof Error ? err.message : "Detection failed");
      setResult(null);
    } finally {
      setIsDetecting(false);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Smile className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Emotion Detection
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Let me see how you&apos;re feeling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Service Status */}
          {isServiceAvailable === false && (
            <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className="text-orange-700 dark:text-orange-300">
                Emotion detection service is not available. Make sure the NovaBot server is running.
              </span>
            </div>
          )}

          {/* Camera View */}
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "w-full h-full object-cover",
                !isCameraOn && "hidden"
              )}
            />
            <canvas ref={canvasRef} className="hidden" />

            {!isCameraOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <VideoOff className="w-16 h-16 mb-4" />
                <p className="text-lg">Camera is off</p>
                {cameraError && (
                  <p className="text-sm text-red-400 mt-2 max-w-sm text-center">
                    {cameraError}
                  </p>
                )}
              </div>
            )}

            {/* Detection Overlay */}
            {isDetecting && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="w-12 h-12 text-white animate-spin" />
                  <p className="text-white text-lg">Analyzing...</p>
                </div>
              </div>
            )}
          </div>

          {/* Result Display */}
          {result && result.status === "success" && (
            <div
              className="mb-6 p-6 rounded-2xl border-2 transition-all"
              style={{
                borderColor: getEmotionColor(result.emotion),
                backgroundColor: `${getEmotionColor(result.emotion)}10`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{getEmotionEmoji(result.emotion)}</span>
                  <div>
                    <h3
                      className="text-2xl font-bold capitalize"
                      style={{ color: getEmotionColor(result.emotion) }}
                    >
                      {result.emotion}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {(result.confidence * 100).toFixed(1)}% confident
                    </p>
                  </div>
                </div>
                {!result.face_detected && (
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm">
                    No face detected
                  </span>
                )}
              </div>

              {/* All Scores */}
              {result.all_scores && Object.keys(result.all_scores).length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(result.all_scores)
                    .sort((a, b) => b[1] - a[1])
                    .map(([emotion, score]) => (
                      <div
                        key={emotion}
                        className="flex flex-col items-center p-2 rounded-xl bg-white/50 dark:bg-gray-700/50"
                      >
                        <span className="text-xl">{getEmotionEmoji(emotion)}</span>
                        <span className="text-xs capitalize text-gray-600 dark:text-gray-400">
                          {emotion}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {(score * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-4">
            {!isCameraOn ? (
              <button
                onClick={startCamera}
                disabled={isServiceAvailable === false}
                className={cn(
                  "flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold transition-all",
                  isServiceAvailable === false
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90"
                )}
              >
                <Video className="w-6 h-6" />
                Start Camera
              </button>
            ) : (
              <>
                <button
                  onClick={stopCamera}
                  className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  <VideoOff className="w-6 h-6" />
                  Stop
                </button>
                <button
                  onClick={captureAndDetect}
                  disabled={isDetecting}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold transition-all",
                    isDetecting
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90"
                  )}
                >
                  {isDetecting ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Camera className="w-6 h-6" />
                      Detect Emotion
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
