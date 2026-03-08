"use client";

import { useState } from "react";
import { Pill, Clock, Check, X, Bell, ChevronLeft, ChevronRight, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  instructions: string;
  status: "taken" | "upcoming" | "missed" | "due";
  color: string;
}

const medications: Medication[] = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    time: "8:00 AM",
    instructions: "Take on empty stomach",
    status: "taken",
    color: "bg-primary",
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    time: "12:00 PM",
    instructions: "Take with lunch",
    status: "due",
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "Aspirin",
    dosage: "81mg",
    time: "6:00 PM",
    instructions: "Take with water",
    status: "upcoming",
    color: "bg-secondary",
  },
  {
    id: 4,
    name: "Metformin",
    dosage: "500mg",
    time: "8:00 PM",
    instructions: "Take with dinner",
    status: "upcoming",
    color: "bg-purple-500",
  },
];

const statusConfig = {
  taken: { icon: Check, bg: "bg-success-100 dark:bg-success-900/30", text: "text-success dark:text-success-400", label: "Taken" },
  due: { icon: AlertCircle, bg: "bg-accent-100 dark:bg-accent-900/30", text: "text-accent", label: "Due Now" },
  upcoming: { icon: Clock, bg: "bg-gray-100 dark:bg-gray-700", text: "text-text-muted dark:text-gray-400", label: "Upcoming" },
  missed: { icon: X, bg: "bg-accent-100 dark:bg-accent-900/30", text: "text-accent", label: "Missed" },
};

export default function RoverMedicationsPage() {
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTakeMedication = (med: Medication) => {
    setSelectedMed(med);
    setShowConfirm(true);
  };

  const confirmTaken = () => {
    // In real app, update medication status
    setShowConfirm(false);
    setSelectedMed(null);
  };

  const dueMedications = medications.filter((m) => m.status === "due");
  const upcomingMedications = medications.filter((m) => m.status === "upcoming");
  const takenMedications = medications.filter((m) => m.status === "taken");

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
        <div className="flex-1">
          <h1 className="text-3xl font-display font-bold text-text-primary dark:text-white">Medications</h1>
          <p className="text-text-muted dark:text-gray-400">Today's medication schedule</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-lg font-medium text-primary">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Due Now Alert */}
      {dueMedications.length > 0 && (
        <div className="bg-accent-50 dark:bg-accent-900/30 border-2 border-accent rounded-3xl p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-accent mb-1">Medication Due Now!</h2>
              <p className="text-lg text-text-secondary dark:text-gray-300">
                {dueMedications[0].name} {dueMedications[0].dosage}
              </p>
            </div>
            <button
              onClick={() => handleTakeMedication(dueMedications[0])}
              className="rover-btn px-8 py-4 bg-accent text-white text-xl font-bold rounded-2xl hover:bg-accent-600 transition-colors"
            >
              Mark as Taken
            </button>
          </div>
        </div>
      )}

      {/* Medications Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-text-primary dark:text-white">Today's Schedule</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {medications.map((med) => {
            const config = statusConfig[med.status];
            const StatusIcon = config.icon;

            return (
              <div
                key={med.id}
                className={cn(
                  "p-6 flex items-center gap-6 transition-all",
                  med.status === "due" && "bg-accent-50 dark:bg-accent-900/20",
                  med.status === "taken" && "opacity-60"
                )}
              >
                {/* Time */}
                <div className="w-24 text-center">
                  <p className="text-2xl font-bold text-text-primary dark:text-white">{med.time.split(" ")[0]}</p>
                  <p className="text-text-muted dark:text-gray-400">{med.time.split(" ")[1]}</p>
                </div>

                {/* Medication Icon */}
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", med.color)}>
                  <Pill className="w-8 h-8 text-white" />
                </div>

                {/* Medication Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-white">{med.name}</h3>
                  <p className="text-lg text-text-secondary dark:text-gray-300">{med.dosage} • {med.instructions}</p>
                </div>

                {/* Status / Action */}
                <div className="flex items-center gap-4">
                  <span className={cn("px-4 py-2 rounded-xl text-lg font-medium flex items-center gap-2", config.bg, config.text)}>
                    <StatusIcon className="w-5 h-5" />
                    {config.label}
                  </span>
                  {(med.status === "due" || med.status === "upcoming") && (
                    <button
                      onClick={() => handleTakeMedication(med)}
                      className={cn(
                        "rover-btn px-6 py-3 rounded-2xl text-lg font-semibold transition-colors",
                        med.status === "due"
                          ? "bg-accent text-white hover:bg-accent-600"
                          : "bg-success text-white hover:bg-success-600"
                      )}
                    >
                      <Check className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-success-50 dark:bg-success-900/30 rounded-2xl p-6 text-center border-2 border-success-100 dark:border-success-800">
          <div className="text-4xl font-bold text-success mb-2">{takenMedications.length}</div>
          <div className="text-text-secondary dark:text-gray-300">Taken</div>
        </div>
        <div className="bg-accent-50 dark:bg-accent-900/30 rounded-2xl p-6 text-center border-2 border-accent-100 dark:border-accent-800">
          <div className="text-4xl font-bold text-accent mb-2">{dueMedications.length}</div>
          <div className="text-text-secondary dark:text-gray-300">Due Now</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center border-2 border-gray-200 dark:border-gray-700">
          <div className="text-4xl font-bold text-text-primary dark:text-white mb-2">{upcomingMedications.length}</div>
          <div className="text-text-secondary dark:text-gray-300">Upcoming</div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedMed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full animate-scale-in">
            <div className="text-center mb-8">
              <div className={cn("w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4", selectedMed.color)}>
                <Pill className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-2">
                Confirm Taking Medication
              </h2>
              <p className="text-xl text-text-secondary dark:text-gray-300">
                {selectedMed.name} {selectedMed.dosage}
              </p>
              <p className="text-text-muted dark:text-gray-400 mt-2">{selectedMed.instructions}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="rover-btn flex-1 py-4 rounded-2xl bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmTaken}
                className="rover-btn flex-1 py-4 rounded-2xl bg-success text-white text-lg font-semibold hover:bg-success-600 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-6 h-6" />
                Yes, I Took It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
