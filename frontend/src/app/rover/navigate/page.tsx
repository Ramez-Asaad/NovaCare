"use client";

import { useState } from "react";
import { Navigation, MapPin, Home, Utensils, Bath, Sofa, Bed, Coffee, ArrowLeft, Play, Pause, X, UserCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Destination {
  id: string;
  name: string;
  icon: any;
  color: string;
  distance: string;
}

const destinations: Destination[] = [
  { id: "kitchen", name: "Kitchen", icon: Utensils, color: "bg-secondary", distance: "15m" },
  { id: "bathroom", name: "Bathroom", icon: Bath, color: "bg-primary", distance: "8m" },
  { id: "living", name: "Living Room", icon: Sofa, color: "bg-purple-500", distance: "10m" },
  { id: "bedroom", name: "Bedroom", icon: Bed, color: "bg-indigo-500", distance: "12m" },
  { id: "dining", name: "Dining Room", icon: Coffee, color: "bg-success", distance: "18m" },
  { id: "entrance", name: "Front Door", icon: Home, color: "bg-accent", distance: "20m" },
];

export default function NavigatePage() {
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [followMode, setFollowMode] = useState(false);

  const startNavigation = () => {
    if (selectedDest) {
      setIsNavigating(true);
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setSelectedDest(null);
  };

  const toggleFollowMode = () => {
    setFollowMode(!followMode);
    setIsNavigating(false);
    setSelectedDest(null);
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
          <h1 className="text-3xl font-display font-bold text-text-primary dark:text-white">Navigation</h1>
          <p className="text-text-muted dark:text-gray-400">Choose a destination or follow me mode</p>
        </div>
      </div>

      {/* Follow Me Mode */}
      <button
        onClick={toggleFollowMode}
        className={cn(
          "w-full py-6 px-8 rounded-3xl flex items-center justify-center gap-4 transition-all",
          followMode
            ? "bg-success text-white animate-pulse"
            : "bg-success-50 dark:bg-success-900/30 text-success border-2 border-success hover:bg-success-100 dark:hover:bg-success-900/50"
        )}
      >
        <UserCheck className="w-10 h-10" />
        <div className="text-left">
          <h2 className="text-2xl font-bold">{followMode ? "Following You..." : "Follow Me Mode"}</h2>
          <p className={followMode ? "text-white/80" : "text-success"}>
            {followMode ? "Tap to stop following" : "I'll follow you wherever you go"}
          </p>
        </div>
      </button>

      {/* Active Navigation */}
      {isNavigating && selectedDest && (
        <div className="bg-primary-50 dark:bg-primary-900/30 border-2 border-primary rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", selectedDest.color)}>
                <selectedDest.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary">Navigating to {selectedDest.name}</h2>
                <p className="text-text-secondary dark:text-gray-300 text-lg">Estimated: {selectedDest.distance}</p>
              </div>
            </div>
            <button
              onClick={stopNavigation}
              className="rover-btn w-16 h-16 bg-accent text-white rounded-2xl flex items-center justify-center hover:bg-accent-600 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Navigation Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-muted dark:text-gray-400">Progress</span>
              <span className="font-semibold text-primary">30%</span>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[30%] transition-all duration-500" />
            </div>
            <p className="text-center text-text-muted dark:text-gray-400 mt-4 text-lg">
              🚶 Walking safely... Please follow me
            </p>
          </div>
        </div>
      )}

      {/* Destination Selection */}
      {!isNavigating && !followMode && (
        <>
          <h2 className="text-xl font-semibold text-text-primary dark:text-white">Select Destination</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setSelectedDest(dest)}
                className={cn(
                  "rover-card p-6 rounded-3xl flex flex-col items-center gap-4 transition-all",
                  selectedDest?.id === dest.id
                    ? "ring-4 ring-primary bg-primary-50 dark:bg-primary-900/30"
                    : "bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary"
                )}
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", dest.color)}>
                  <dest.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-white">{dest.name}</h3>
                  <p className="text-text-muted dark:text-gray-400">{dest.distance}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Custom Location */}
          <button className="w-full py-5 px-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-text-secondary dark:text-gray-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-3">
            <MapPin className="w-6 h-6" />
            <span className="text-lg font-medium">Enter Custom Location</span>
          </button>

          {/* Start Navigation Button */}
          {selectedDest && (
            <button
              onClick={startNavigation}
              className="w-full py-6 px-8 rounded-3xl bg-primary text-white flex items-center justify-center gap-4 text-2xl font-bold hover:bg-primary-600 transition-colors"
            >
              <Play className="w-8 h-8" />
              Go to {selectedDest.name}
            </button>
          )}
        </>
      )}

      {/* Safety Information */}
      <div className="bg-gray-50 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Navigation className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary mb-1">Safety First</h3>
          <p className="text-text-muted">
            I'll navigate at a safe pace and avoid obstacles. Please ensure the path is clear of any hazards.
            You can stop navigation at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
