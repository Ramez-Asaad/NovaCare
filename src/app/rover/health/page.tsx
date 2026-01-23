"use client";

import { Heart, Activity, Thermometer, Moon, Droplets, Scale, ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const vitals = [
  {
    id: "heartRate",
    name: "Heart Rate",
    value: 72,
    unit: "bpm",
    status: "normal",
    trend: "stable",
    icon: Heart,
    color: "bg-accent",
    normalRange: "60-100",
  },
  {
    id: "oxygen",
    name: "Blood Oxygen",
    value: 98,
    unit: "%",
    status: "normal",
    trend: "up",
    icon: Activity,
    color: "bg-primary",
    normalRange: "95-100",
  },
  {
    id: "temperature",
    name: "Temperature",
    value: 98.6,
    unit: "°F",
    status: "normal",
    trend: "stable",
    icon: Thermometer,
    color: "bg-secondary",
    normalRange: "97-99",
  },
  {
    id: "sleep",
    name: "Sleep Last Night",
    value: 7.5,
    unit: "hours",
    status: "normal",
    trend: "up",
    icon: Moon,
    color: "bg-indigo-500",
    normalRange: "7-9",
  },
  {
    id: "hydration",
    name: "Hydration",
    value: 6,
    unit: "glasses",
    status: "low",
    trend: "stable",
    icon: Droplets,
    color: "bg-cyan-500",
    normalRange: "8+",
  },
  {
    id: "weight",
    name: "Weight",
    value: 145,
    unit: "lbs",
    status: "normal",
    trend: "down",
    icon: Scale,
    color: "bg-purple-500",
    normalRange: "Target: 140",
  },
];

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColors = {
  up: "text-success",
  down: "text-accent",
  stable: "text-text-muted",
};

export default function HealthPage() {
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
          <h1 className="text-3xl font-display font-bold text-text-primary dark:text-white">Health Check</h1>
          <p className="text-text-muted dark:text-gray-400">Your current vital signs</p>
        </div>
      </div>

      {/* Overall Status */}
      <div className="bg-success-50 dark:bg-success-900/30 border-2 border-success rounded-3xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-success rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-success mb-2">You're Doing Great! 💪</h2>
        <p className="text-lg text-text-secondary dark:text-gray-300">
          Most of your vitals are within normal range
        </p>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {vitals.map((vital) => {
          const TrendIcon = trendIcons[vital.trend as keyof typeof trendIcons];
          const trendColor = trendColors[vital.trend as keyof typeof trendColors];

          return (
            <div
              key={vital.id}
              className={cn(
                "rover-card bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 transition-all",
                vital.status === "normal" ? "border-gray-100 dark:border-gray-700" : "border-accent bg-accent-50 dark:bg-accent-900/30"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", vital.color)}>
                  <vital.icon className="w-7 h-7 text-white" />
                </div>
                <div className={cn("flex items-center gap-1", trendColor)}>
                  <TrendIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="mb-2">
                <span className="text-4xl font-bold text-text-primary dark:text-white">{vital.value}</span>
                <span className="text-xl text-text-muted dark:text-gray-400 ml-1">{vital.unit}</span>
              </div>

              <h3 className="text-lg font-medium text-text-secondary dark:text-gray-300 mb-1">{vital.name}</h3>
              
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-sm font-medium px-3 py-1 rounded-full",
                  vital.status === "normal" 
                    ? "bg-success-100 dark:bg-success-900/50 text-success" 
                    : "bg-accent-100 dark:bg-accent-900/50 text-accent"
                )}>
                  {vital.status === "normal" ? "Normal" : "Low"}
                </span>
                <span className="text-sm text-text-muted dark:text-gray-400">{vital.normalRange}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hydration Reminder */}
      <div className="bg-cyan-50 dark:bg-cyan-900/30 border-2 border-cyan-200 dark:border-cyan-800 rounded-3xl p-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center">
          <Droplets className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-cyan-700 dark:text-cyan-400">Stay Hydrated! 💧</h3>
          <p className="text-cyan-600 dark:text-cyan-300">You've had 6 glasses today. Try to drink 2 more!</p>
        </div>
        <button className="rover-btn px-6 py-3 bg-cyan-500 text-white rounded-2xl font-semibold hover:bg-cyan-600 transition-colors">
          Log Water
        </button>
      </div>

      {/* Last Updated */}
      <p className="text-center text-text-muted dark:text-gray-400 text-lg">
        Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}
