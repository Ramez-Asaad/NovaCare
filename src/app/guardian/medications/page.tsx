"use client";

import { useState } from "react";
import { Calendar, Check, Clock, AlertCircle, Filter, ChevronLeft, ChevronRight, Pill } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/utils";

// Mock medication data
const medications = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    time: "8:00 AM",
    doctor: "Dr. Smith",
    history: [
      { date: "2026-01-19", status: "taken", takenAt: "8:05 AM" },
      { date: "2026-01-18", status: "taken", takenAt: "8:10 AM" },
      { date: "2026-01-17", status: "taken", takenAt: "7:55 AM" },
      { date: "2026-01-16", status: "missed" },
      { date: "2026-01-15", status: "taken", takenAt: "8:00 AM" },
    ],
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    time: "12:00 PM, 8:00 PM",
    doctor: "Dr. Johnson",
    history: [
      { date: "2026-01-19", status: "taken", takenAt: "12:10 PM" },
      { date: "2026-01-18", status: "taken", takenAt: "12:05 PM" },
      { date: "2026-01-17", status: "taken", takenAt: "12:00 PM" },
      { date: "2026-01-16", status: "taken", takenAt: "12:15 PM" },
      { date: "2026-01-15", status: "taken", takenAt: "11:55 AM" },
    ],
  },
  {
    id: 3,
    name: "Aspirin",
    dosage: "81mg",
    frequency: "Once daily",
    time: "6:00 PM",
    doctor: "Dr. Smith",
    history: [
      { date: "2026-01-19", status: "upcoming" },
      { date: "2026-01-18", status: "taken", takenAt: "6:05 PM" },
      { date: "2026-01-17", status: "taken", takenAt: "6:10 PM" },
      { date: "2026-01-16", status: "taken", takenAt: "6:00 PM" },
      { date: "2026-01-15", status: "taken", takenAt: "6:20 PM" },
    ],
  },
];

const weeklyStats = {
  totalDoses: 21,
  takenDoses: 19,
  missedDoses: 1,
  upcomingDoses: 1,
};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MedicationsPage() {
  const [selectedMed, setSelectedMed] = useState<number | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const complianceRate = Math.round((weeklyStats.takenDoses / (weeklyStats.totalDoses - weeklyStats.upcomingDoses)) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800">
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success-700 dark:text-success-400">{weeklyStats.takenDoses}</p>
              <p className="text-sm text-success-600 dark:text-success-500">Doses Taken</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent-50 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-800">
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-700 dark:text-accent-400">{weeklyStats.missedDoses}</p>
              <p className="text-sm text-accent-600 dark:text-accent-500">Missed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800">
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-700 dark:text-secondary-400">{weeklyStats.upcomingDoses}</p>
              <p className="text-sm text-secondary-600 dark:text-secondary-500">Upcoming</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">{complianceRate}%</p>
              <p className="text-sm text-primary-600 dark:text-primary-500">Compliance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Medication List */}
        <div className="lg:col-span-1">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Medications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {medications.map((med) => {
                const todayStatus = med.history[0]?.status;
                return (
                  <button
                    key={med.id}
                    onClick={() => setSelectedMed(selectedMed === med.id ? null : med.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left transition-all",
                      selectedMed === med.id
                        ? "bg-primary-50 dark:bg-primary-900/30 border-primary"
                        : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-text-primary dark:text-white">{med.name}</p>
                        <p className="text-sm text-text-muted dark:text-gray-400">{med.dosage} • {med.frequency}</p>
                        <p className="text-xs text-text-muted dark:text-gray-500 mt-1">{med.time}</p>
                      </div>
                      <Badge
                        variant={
                          todayStatus === "taken"
                            ? "success"
                            : todayStatus === "missed"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {todayStatus === "taken" ? "Taken" : todayStatus === "missed" ? "Missed" : "Upcoming"}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card variant="elevated">
            <CardHeader
              action={
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setCurrentWeek(currentWeek - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium text-text-secondary">This Week</span>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentWeek(currentWeek + 1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              }
            >
              <CardTitle>Weekly Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {daysOfWeek.map((day, index) => (
                  <div key={day} className="text-center">
                    <p className="text-xs text-text-muted dark:text-gray-400 mb-2">{day}</p>
                    <div
                      className={cn(
                        "aspect-square rounded-xl flex flex-col items-center justify-center p-2",
                        index === 0 ? "bg-primary-100 dark:bg-primary-900/50 border-2 border-primary" : "bg-gray-50 dark:bg-gray-700/50"
                      )}
                    >
                      <span className="text-lg font-semibold text-text-primary dark:text-white">
                        {19 - index}
                      </span>
                      <div className="flex gap-1 mt-1">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <div className="w-2 h-2 rounded-full bg-success" />
                        {index === 0 && <div className="w-2 h-2 rounded-full bg-gray-300" />}
                        {index === 3 && <div className="w-2 h-2 rounded-full bg-accent" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance Chart */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-text-primary">Weekly Compliance</span>
                  <span className="text-lg font-bold text-primary">{complianceRate}%</span>
                </div>
                <ProgressBar value={complianceRate} variant="primary" size="lg" />
                <div className="flex items-center justify-between mt-3 text-sm text-text-muted">
                  <span>{weeklyStats.takenDoses} taken</span>
                  <span>{weeklyStats.missedDoses} missed</span>
                  <span>{weeklyStats.upcomingDoses} upcoming</span>
                </div>
              </div>

              {/* Selected Medication Details */}
              {selectedMed && (
                <div className="mt-6 p-4 bg-primary-50 rounded-xl animate-fade-in">
                  <h4 className="font-semibold text-text-primary mb-3">
                    {medications.find((m) => m.id === selectedMed)?.name} - Recent History
                  </h4>
                  <div className="space-y-2">
                    {medications
                      .find((m) => m.id === selectedMed)
                      ?.history.map((h, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-primary-100 last:border-0"
                        >
                          <span className="text-sm text-text-secondary">{h.date}</span>
                          <Badge
                            variant={
                              h.status === "taken"
                                ? "success"
                                : h.status === "missed"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {h.status === "taken"
                              ? `Taken at ${h.takenAt}`
                              : h.status === "missed"
                              ? "Missed"
                              : "Upcoming"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
