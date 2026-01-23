"use client";

import { useState } from "react";
import {
  Heart,
  Activity,
  Thermometer,
  Moon,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Phone,
  Video,
  Plus,
  Check,
  Clock,
  AlertTriangle,
  Pill,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Avatar, ProgressBar, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

// Mock data
const vitals = [
  {
    id: "heartRate",
    label: "Heart Rate",
    value: 72,
    unit: "bpm",
    status: "normal",
    trend: "stable",
    icon: Heart,
    color: "accent",
    range: "60-100 bpm",
  },
  {
    id: "bloodOxygen",
    label: "Blood Oxygen",
    value: 98,
    unit: "%",
    status: "normal",
    trend: "up",
    icon: Activity,
    color: "primary",
    range: "95-100%",
  },
  {
    id: "temperature",
    label: "Temperature",
    value: 98.6,
    unit: "°F",
    status: "normal",
    trend: "stable",
    icon: Thermometer,
    color: "secondary",
    range: "97-99°F",
  },
  {
    id: "sleepQuality",
    label: "Sleep Quality",
    value: 7.5,
    unit: "hrs",
    status: "normal",
    trend: "up",
    icon: Moon,
    color: "purple",
    range: "7-9 hours",
  },
];

const medications = [
  { id: 1, name: "Lisinopril", dosage: "10mg", time: "8:00 AM", status: "taken", takenAt: "8:05 AM" },
  { id: 2, name: "Metformin", dosage: "500mg", time: "12:00 PM", status: "taken", takenAt: "12:10 PM" },
  { id: 3, name: "Aspirin", dosage: "81mg", time: "6:00 PM", status: "upcoming" },
  { id: 4, name: "Metformin", dosage: "500mg", time: "8:00 PM", status: "upcoming" },
];

const recentActivities = [
  { id: 1, type: "vital", description: "Blood pressure slightly elevated", time: "1h ago", priority: "medium" },
  { id: 2, type: "medication", description: "Metformin taken on time", time: "2h ago", priority: "low" },
  { id: 3, type: "alert", description: "Missed medication reminder sent", time: "Yesterday", priority: "high" },
];

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const colorClasses = {
  accent: { bg: "bg-accent-100 dark:bg-accent-900/30", text: "text-accent", icon: "bg-accent" },
  primary: { bg: "bg-primary-100 dark:bg-primary-900/30", text: "text-primary", icon: "bg-primary" },
  secondary: { bg: "bg-secondary-100 dark:bg-secondary-900/30", text: "text-secondary", icon: "bg-secondary" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-500", icon: "bg-purple-500" },
};

export default function MedicalDashboard() {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [addMedModalOpen, setAddMedModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Vital Signs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((vital) => {
          const TrendIcon = trendIcons[vital.trend as keyof typeof trendIcons];
          const colors = colorClasses[vital.color as keyof typeof colorClasses];
          
          return (
            <Card key={vital.id} variant="elevated" className="hover:shadow-soft transition-shadow cursor-pointer">
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.icon)}>
                    <vital.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={cn("flex items-center gap-1 text-sm", colors.text)}>
                    <TrendIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-text-primary dark:text-white">
                  {vital.value}
                  <span className="text-sm font-normal text-text-muted dark:text-gray-400 ml-1">{vital.unit}</span>
                </p>
                <p className="text-sm text-text-muted dark:text-gray-400 mt-1">{vital.label}</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="success">Normal</Badge>
                  <span className="text-xs text-text-muted dark:text-gray-400">{vital.range}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Medications */}
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader
            action={
              <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setAddMedModalOpen(true)}>
                Add Medication
              </Button>
            }
          >
            <CardTitle>Today&apos;s Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border",
                    med.status === "taken"
                      ? "bg-success-50 dark:bg-success-900/30 border-success-200 dark:border-success-800"
                      : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        med.status === "taken" ? "bg-success" : "bg-gray-300 dark:bg-gray-600"
                      )}
                    >
                      {med.status === "taken" ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Clock className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary dark:text-white">
                        {med.name} <span className="font-normal text-text-muted dark:text-gray-400">({med.dosage})</span>
                      </p>
                      <p className="text-sm text-text-muted dark:text-gray-400">Scheduled: {med.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {med.status === "taken" ? (
                      <span className="text-sm text-success-700 dark:text-success-400">Taken at {med.takenAt}</span>
                    ) : (
                      <Badge variant="warning">Upcoming</Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted dark:text-gray-400">Today&apos;s Compliance</span>
                <span className="text-sm font-semibold text-text-primary dark:text-white">50%</span>
              </div>
              <ProgressBar value={50} variant="primary" />
            </div>
          </CardContent>
        </Card>

        {/* Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start text-text-primary dark:text-white dark:hover:text-text-primary" variant="outline" leftIcon={<Calendar className="w-5 h-5" />} onClick={() => setScheduleModalOpen(true)}>
                Schedule Appointment
              </Button>
              <Button className="w-full justify-start text-text-primary dark:text-white dark:hover:text-text-primary" variant="outline" leftIcon={<Phone className="w-5 h-5" />}>
                Call Caregiver
              </Button>
              <Button className="w-full justify-start text-text-primary dark:text-white dark:hover:text-text-primary" variant="outline" leftIcon={<Video className="w-5 h-5" />}>
                Video Consultation
              </Button>
              <Button className="w-full justify-start text-text-primary dark:text-white dark:hover:text-text-primary" variant="outline" leftIcon={<FileText className="w-5 h-5" />}>
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={cn(
                    "p-3 rounded-xl border",
                    activity.priority === "high"
                      ? "bg-accent-50 dark:bg-accent-900/30 border-accent-200 dark:border-accent-800"
                      : activity.priority === "medium"
                      ? "bg-secondary-50 dark:bg-secondary-900/30 border-secondary-200 dark:border-secondary-800"
                      : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {activity.priority === "high" && (
                      <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary dark:text-white">{activity.description}</p>
                      <p className="text-xs text-text-muted dark:text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Appointment Modal */}
      <Modal isOpen={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} size="lg">
        <ModalHeader>Schedule Appointment</ModalHeader>
        <ModalBody className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <button className="p-4 rounded-xl border-2 border-primary bg-primary-50 dark:bg-primary-900/30 text-center">
              <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
              <span className="text-sm font-medium text-primary">Phone Call</span>
            </button>
            <button className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 text-center transition-colors">
              <Video className="w-6 h-6 text-text-muted dark:text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-text-secondary dark:text-gray-300">Video Call</span>
            </button>
            <button className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 text-center transition-colors">
              <Calendar className="w-6 h-6 text-text-muted dark:text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-text-secondary dark:text-gray-300">In-Person</span>
            </button>
          </div>
          <Input label="Date" type="date" />
          <Input label="Time" type="time" />
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">Notes</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none placeholder:text-text-muted dark:placeholder:text-gray-400"
              rows={3}
              placeholder="Reason for appointment..."
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="text-text-primary dark:text-white dark:hover:text-text-primary" variant="outline" onClick={() => setScheduleModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setScheduleModalOpen(false)}>Schedule</Button>
        </ModalFooter>
      </Modal>

      {/* Add Medication Modal */}
      <Modal isOpen={addMedModalOpen} onClose={() => setAddMedModalOpen(false)} size="lg">
        <ModalHeader>Add Medication</ModalHeader>
        <ModalBody className="space-y-4">
          <Input label="Medication Name" placeholder="e.g., Lisinopril" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Dosage" placeholder="e.g., 10mg" />
            <Input label="Frequency" placeholder="e.g., Once daily" />
          </div>
          <Input label="Time" type="time" />
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">Special Instructions</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none placeholder:text-text-muted dark:placeholder:text-gray-400"
              rows={3}
              placeholder="Take with food, avoid grapefruit, etc..."
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setAddMedModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setAddMedModalOpen(false)}>Add Medication</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
