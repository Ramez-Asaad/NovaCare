"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Pill, Navigation, AlertTriangle, Heart, Music, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import EmotionDetectionModal from "@/components/EmotionDetectionModal";

const mainFeatures = [
  {
    href: "/rover/talk",
    icon: MessageCircle,
    label: "Talk to Nova",
    description: "Chat or speak with your AI assistant",
    color: "from-primary to-primary-600",
    textColor: "text-success",
  },
  {
    href: "/rover/medications",
    icon: Pill,
    label: "Medications",
    description: "View schedule and reminders",
    color: "from-purple-400 to-purple-600",
    textColor: "text-success",
    badge: "2 Due",
  },
  {
    href: "/rover/navigate",
    icon: Navigation,
    label: "Navigate",
    description: "Go somewhere or follow me",
    color: "from-secondary to-secondary-600",
    textColor: "text-success",
  },
  {
    href: "/rover/emergency",
    icon: AlertTriangle,
    label: "Emergency",
    description: "Get help immediately",
    color: "from-accent to-accent-600",
    textColor: "text-success",
  },
  {
    href: "/rover/health",
    icon: Heart,
    label: "Health Check",
    description: "View your vital signs",
    color: "from-success to-success-600",
    textColor: "text-success",
  },
  {
    href: "/rover/entertainment",
    icon: Music,
    label: "Entertainment",
    description: "Music, videos, and games",
    color: "from-indigo-400 to-indigo-600",
    textColor: "text-success",
  },
];

export default function RoverHomePage() {
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Emotion Detection Modal */}
      <EmotionDetectionModal 
        isOpen={isEmotionModalOpen} 
        onClose={() => setIsEmotionModalOpen(false)} 
      />
      {/* Greeting */}
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-text-primary dark:text-white mb-2">
          Hello, Sarah! 👋
        </h1>
        <p className="text-xl text-text-muted dark:text-gray-400">How can I help you today?</p>
      </div>

      {/* Main Feature Grid - 2x3 Large Touch Targets */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {mainFeatures.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className={cn(
              "rover-card relative overflow-hidden rounded-3xl p-8 transition-all transform hover:scale-[1.02] active:scale-[0.98]",
              "bg-gradient-to-br",
              feature.color,
              feature.href === "/rover/emergency" && "col-span-1 row-span-1"
            )}
            style={{ minHeight: "200px" }}
          >
            {/* Badge */}
            {feature.badge && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                {feature.badge}
              </span>
            )}

            <div className="flex flex-col h-full justify-between">
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
                  "bg-white/20 backdrop-blur-sm"
                )}
              >
                <feature.icon className={cn("w-8 h-8", feature.textColor)} />
              </div>

              <div>
                <h2 className={cn("text-2xl font-bold mb-2", feature.textColor)}>
                  {feature.label}
                </h2>
                <p className={cn("text-base opacity-90", feature.textColor)}>
                  {feature.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-accent" />
            <span className="text-3xl font-bold text-text-primary dark:text-white">72</span>
          </div>
          <p className="text-text-muted dark:text-gray-400">Heart Rate</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Pill className="w-6 h-6 text-purple-500" />
            <span className="text-3xl font-bold text-text-primary dark:text-white">2</span>
          </div>
          <p className="text-text-muted dark:text-gray-400">Medications Today</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Navigation className="w-6 h-6 text-secondary" />
            <span className="text-3xl font-bold text-success">Ready</span>
          </div>
          <p className="text-text-muted dark:text-gray-400">Rover Status</p>
        </div>
        {/* Detect Emotion Button */}
        <button
          onClick={() => setIsEmotionModalOpen(true)}
          className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 shadow-soft text-center transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Smile className="w-6 h-6 text-white" />
          </div>
          <p className="text-white font-semibold">Detect Emotion</p>
        </button>
      </div>

      {/* Voice Activation Hint */}
      <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-6 text-center border border-primary-100 dark:border-primary-800">
        <p className="text-lg text-primary">
          💡 <span className="font-medium">Tip:</span> You can say "Hey Nova" to talk to me anytime!
        </p>
      </div>
    </div>
  );
}
