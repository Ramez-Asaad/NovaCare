"use client";

import { useState } from "react";
import { Settings, Volume2, Eye, Hand, Type, Moon, Sun, Bell, Lock, Info, ChevronRight, ArrowLeft, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SettingToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function RoverSettingsPage() {
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);
  const [textSize, setTextSize] = useState<"small" | "medium" | "large">("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [toggles, setToggles] = useState<SettingToggle[]>([
    { id: "voice", label: "Voice Feedback", description: "Speak responses aloud", enabled: true },
    { id: "vibration", label: "Vibration", description: "Tactile feedback on touch", enabled: true },
    { id: "signLanguage", label: "Sign Language Input", description: "Enable camera-based sign recognition", enabled: false },
    { id: "notifications", label: "Sound Alerts", description: "Audio for notifications", enabled: true },
  ]);

  const handleToggle = (id: string) => {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/rover"
          className="rover-btn w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-text-secondary dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary dark:text-white">Settings</h1>
          <p className="text-text-muted dark:text-gray-400">Customize your experience</p>
        </div>
      </div>

      {/* Volume Control */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center">
            <Volume2 className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-text-primary dark:text-white">Volume</h2>
            <p className="text-text-muted dark:text-gray-400">Adjust speaker volume</p>
          </div>
          <span className="text-2xl font-bold text-primary">{volume}%</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setVolume(Math.max(0, volume - 10))}
            className="rover-btn w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 text-text-primary dark:text-white"
          >
            <Minus className="w-6 h-6" />
          </button>
          <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${volume}%` }}
            />
          </div>
          <button
            onClick={() => setVolume(Math.min(100, volume + 10))}
            className="rover-btn w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 text-text-primary dark:text-white"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Brightness Control */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-secondary-100 dark:bg-secondary-900/50 rounded-2xl flex items-center justify-center">
            <Sun className="w-7 h-7 text-secondary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-text-primary dark:text-white">Brightness</h2>
            <p className="text-text-muted dark:text-gray-400">Adjust screen brightness</p>
          </div>
          <span className="text-2xl font-bold text-secondary">{brightness}%</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setBrightness(Math.max(20, brightness - 10))}
            className="rover-btn w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 text-text-primary dark:text-white"
          >
            <Minus className="w-6 h-6" />
          </button>
          <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all"
              style={{ width: `${brightness}%` }}
            />
          </div>
          <button
            onClick={() => setBrightness(Math.min(100, brightness + 10))}
            className="rover-btn w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 text-text-primary dark:text-white"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Text Size */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center">
            <Type className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary dark:text-white">Text Size</h2>
            <p className="text-text-muted dark:text-gray-400">Adjust text for readability</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {(["small", "medium", "large"] as const).map((size) => (
            <button
              key={size}
              onClick={() => setTextSize(size)}
              className={cn(
                "py-4 rounded-2xl font-medium capitalize transition-all",
                textSize === size
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              <span className={cn(
                size === "small" && "text-sm",
                size === "medium" && "text-base",
                size === "large" && "text-xl"
              )}>
                {size}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-text-primary dark:text-white mb-4">Display</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={cn(
              "p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
              highContrast ? "border-primary bg-primary-50 dark:bg-primary-900/30" : "border-gray-200 dark:border-gray-700"
            )}
          >
            <Eye className={cn("w-8 h-8", highContrast ? "text-primary" : "text-text-muted dark:text-gray-400")} />
            <span className="font-medium text-text-primary dark:text-white">High Contrast</span>
            <span className={cn(
              "px-3 py-1 rounded-full text-sm",
              highContrast ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-text-muted dark:text-gray-400"
            )}>
              {highContrast ? "On" : "Off"}
            </span>
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={cn(
              "p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
              darkMode ? "border-primary bg-primary-50 dark:bg-primary-900/30" : "border-gray-200 dark:border-gray-700"
            )}
          >
            <Moon className={cn("w-8 h-8", darkMode ? "text-primary" : "text-text-muted dark:text-gray-400")} />
            <span className="font-medium text-text-primary dark:text-white">Dark Mode</span>
            <span className={cn(
              "px-3 py-1 rounded-full text-sm",
              darkMode ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-text-muted dark:text-gray-400"
            )}>
              {darkMode ? "On" : "Off"}
            </span>
          </button>
        </div>
      </div>

      {/* Accessibility Toggles */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-text-primary dark:text-white">Accessibility</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {toggles.map((toggle) => (
            <div key={toggle.id} className="p-6 flex items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-text-primary dark:text-white">{toggle.label}</h3>
                <p className="text-text-muted dark:text-gray-400">{toggle.description}</p>
              </div>
              <button
                onClick={() => handleToggle(toggle.id)}
                className={cn(
                  "w-16 h-9 rounded-full transition-all relative",
                  toggle.enabled ? "bg-success" : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-7 h-7 bg-white rounded-full shadow transition-all",
                    toggle.enabled ? "right-1" : "left-1"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Other Options */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
        {[
          { icon: Bell, label: "Notifications", action: "Manage" },
          { icon: Lock, label: "Privacy", action: "Review" },
          { icon: Info, label: "About NovaCare", action: "v2.1.0" },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full p-6 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
              <item.icon className="w-6 h-6 text-text-muted dark:text-gray-400" />
            </div>
            <span className="flex-1 text-lg font-medium text-text-primary dark:text-white text-left">{item.label}</span>
            <span className="text-text-muted dark:text-gray-400">{item.action}</span>
            <ChevronRight className="w-6 h-6 text-text-muted dark:text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
}
