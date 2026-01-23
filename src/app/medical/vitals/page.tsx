"use client";

import { useState } from "react";
import { Heart, Activity, Thermometer, Moon, Footprints, Brain, TrendingUp, TrendingDown, Minus, Calendar, Download, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

const timeRanges = ["24h", "7d", "30d", "3m"];

const vitalsData = [
  {
    id: "heartRate",
    label: "Heart Rate",
    currentValue: 72,
    unit: "bpm",
    status: "normal",
    trend: "stable",
    icon: Heart,
    color: "accent",
    normalRange: { min: 60, max: 100 },
    history: [68, 72, 75, 71, 69, 73, 72, 74, 70, 72],
    lastUpdated: "2 min ago",
  },
  {
    id: "bloodOxygen",
    label: "Blood Oxygen (SpO2)",
    currentValue: 98,
    unit: "%",
    status: "normal",
    trend: "up",
    icon: Activity,
    color: "primary",
    normalRange: { min: 95, max: 100 },
    history: [97, 98, 97, 98, 99, 98, 98, 97, 98, 98],
    lastUpdated: "5 min ago",
  },
  {
    id: "temperature",
    label: "Temperature",
    currentValue: 98.6,
    unit: "°F",
    status: "normal",
    trend: "stable",
    icon: Thermometer,
    color: "secondary",
    normalRange: { min: 97.0, max: 99.0 },
    history: [98.4, 98.6, 98.5, 98.7, 98.6, 98.5, 98.6, 98.4, 98.6, 98.6],
    lastUpdated: "10 min ago",
  },
  {
    id: "sleepQuality",
    label: "Sleep Duration",
    currentValue: 7.5,
    unit: "hrs",
    status: "normal",
    trend: "up",
    icon: Moon,
    color: "purple",
    normalRange: { min: 7, max: 9 },
    history: [6.5, 7.0, 7.5, 6.0, 8.0, 7.5, 7.0, 7.5, 8.0, 7.5],
    lastUpdated: "Today",
  },
  {
    id: "activityLevel",
    label: "Daily Steps",
    currentValue: 4250,
    unit: "steps",
    status: "low",
    trend: "down",
    icon: Footprints,
    color: "success",
    normalRange: { min: 5000, max: 10000 },
    history: [3200, 4500, 5100, 3800, 4200, 5500, 4000, 3900, 4100, 4250],
    lastUpdated: "1h ago",
  },
  {
    id: "stressLevel",
    label: "Stress Level",
    currentValue: 3,
    unit: "/10",
    status: "normal",
    trend: "stable",
    icon: Brain,
    color: "info",
    normalRange: { min: 0, max: 5 },
    history: [4, 3, 5, 4, 3, 2, 3, 4, 3, 3],
    lastUpdated: "30 min ago",
  },
];

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  accent: { bg: "bg-accent-100 dark:bg-accent-900/50", text: "text-accent", border: "border-accent" },
  primary: { bg: "bg-primary-100 dark:bg-primary-900/50", text: "text-primary", border: "border-primary" },
  secondary: { bg: "bg-secondary-100 dark:bg-secondary-900/50", text: "text-secondary", border: "border-secondary" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/50", text: "text-purple-500", border: "border-purple-500" },
  success: { bg: "bg-success-100 dark:bg-success-900/50", text: "text-success", border: "border-success" },
  info: { bg: "bg-primary-100 dark:bg-primary-900/50", text: "text-primary", border: "border-primary" },
};

export default function VitalsPage() {
  const [selectedRange, setSelectedRange] = useState("24h");
  const [selectedVital, setSelectedVital] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">Vital Signs</h2>
          <p className="text-text-muted dark:text-gray-400">Real-time health monitoring for Sarah Johnson</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedRange === range
                    ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                    : "text-text-muted dark:text-gray-400 hover:text-text-secondary dark:hover:text-gray-300"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <Button className="dark:text-white dark:hover:text-text-primary" variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
          <Button className="dark:text-white dark:hover:text-text-primary" variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vitalsData.map((vital) => {
          const TrendIcon = trendIcons[vital.trend as keyof typeof trendIcons];
          const colors = colorClasses[vital.color];
          
          return (
            <Card
              key={vital.id}
              variant="elevated"
              className={cn(
                "cursor-pointer transition-all",
                selectedVital === vital.id && `ring-2 ${colors.border}`
              )}
              onClick={() => setSelectedVital(selectedVital === vital.id ? null : vital.id)}
            >
              <CardContent>
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.bg)}>
                    <vital.icon className={cn("w-6 h-6", colors.text)} />
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        vital.status === "normal" ? "success" : vital.status === "low" ? "warning" : "danger"
                      }
                    >
                      {vital.status === "normal" ? "Normal" : vital.status === "low" ? "Below Target" : "Attention"}
                    </Badge>
                    <p className="text-xs text-text-muted mt-1">{vital.lastUpdated}</p>
                  </div>
                </div>

                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-text-primary dark:text-white">
                      {vital.currentValue}
                      <span className="text-base font-normal text-text-muted dark:text-gray-400 ml-1">{vital.unit}</span>
                    </p>
                    <p className="text-sm text-text-muted dark:text-gray-400 mt-1">{vital.label}</p>
                  </div>
                  <div className={cn("flex items-center gap-1", colors.text)}>
                    <TrendIcon className="w-5 h-5" />
                    <span className="text-sm font-medium capitalize">{vital.trend}</span>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="h-12 flex items-end gap-1">
                  {vital.history.map((value, index) => {
                    const max = Math.max(...vital.history);
                    const min = Math.min(...vital.history);
                    const range = max - min || 1;
                    const height = ((value - min) / range) * 100;
                    
                    return (
                      <div
                        key={index}
                        className={cn("flex-1 rounded-t transition-all", colors.bg)}
                        style={{ height: `${Math.max(height, 20)}%` }}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-text-muted dark:text-gray-400">
                    Normal: {vital.normalRange.min}-{vital.normalRange.max} {vital.unit}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed View */}
      {selectedVital && (
        <Card variant="elevated" className="animate-slide-up">
          <CardHeader>
            <CardTitle>
              {vitalsData.find((v) => v.id === selectedVital)?.label} - Detailed View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <p className="text-text-muted dark:text-gray-400">
                Interactive chart would be displayed here using a library like Recharts
              </p>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                <p className="text-2xl font-bold text-text-primary dark:text-white">
                  {Math.min(...(vitalsData.find((v) => v.id === selectedVital)?.history || [0]))}
                </p>
                <p className="text-sm text-text-muted dark:text-gray-400">Minimum</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                <p className="text-2xl font-bold text-text-primary dark:text-white">
                  {Math.max(...(vitalsData.find((v) => v.id === selectedVital)?.history || [0]))}
                </p>
                <p className="text-sm text-text-muted dark:text-gray-400">Maximum</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                <p className="text-2xl font-bold text-text-primary dark:text-white">
                  {Math.round(
                    (vitalsData.find((v) => v.id === selectedVital)?.history || [0]).reduce((a, b) => a + b, 0) /
                      (vitalsData.find((v) => v.id === selectedVital)?.history || [1]).length
                  )}
                </p>
                <p className="text-sm text-text-muted dark:text-gray-400">Average</p>
              </div>
              <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-xl text-center">
                <p className="text-2xl font-bold text-primary">
                  {vitalsData.find((v) => v.id === selectedVital)?.currentValue}
                </p>
                <p className="text-sm text-text-muted dark:text-gray-400">Current</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
