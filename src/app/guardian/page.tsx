"use client";

import { useState } from "react";
import {
  Phone,
  MessageCircle,
  Video,
  Heart,
  Activity,
  Battery,
  Clock,
  Check,
  AlertTriangle,
  Pill,
  Navigation,
  MessageSquare,
  Bell,
  X,
  PhoneCall,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Avatar, Badge, ProgressBar, Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { cn } from "@/lib/utils";

// Mock data
const patientData = {
  name: "Sarah Johnson",
  status: "online" as const,
  mood: { emoji: "😊", label: "Content" },
  vitals: {
    heartRate: { value: 72, status: "normal" },
    activityLevel: { value: "Moderate", status: "normal" },
    battery: { value: 85, status: "normal" },
    lastCheckIn: "5m ago",
  },
};

const medications = [
  { id: 1, name: "Lisinopril", time: "8:00 AM", status: "taken", takenAt: "8:05 AM" },
  { id: 2, name: "Metformin", time: "12:00 PM", status: "taken", takenAt: "12:10 PM" },
  { id: 3, name: "Aspirin", time: "6:00 PM", status: "upcoming" },
];

const activities = [
  {
    id: 1,
    type: "medication",
    description: "Took Metformin (500mg)",
    time: "12:10 PM",
    timeAgo: "2h ago",
  },
  {
    id: 2,
    type: "navigation",
    description: "Navigated to Kitchen",
    time: "11:30 AM",
    timeAgo: "3h ago",
  },
  {
    id: 3,
    type: "conversation",
    description: "Had a 15-minute conversation with NovaCare",
    time: "10:45 AM",
    timeAgo: "4h ago",
  },
  {
    id: 4,
    type: "medication",
    description: "Took Lisinopril (10mg)",
    time: "8:05 AM",
    timeAgo: "6h ago",
  },
  {
    id: 5,
    type: "alert",
    description: "Low battery warning - now charging",
    time: "7:30 AM",
    timeAgo: "7h ago",
  },
];

const activityColors = {
  medication: "bg-success",
  navigation: "bg-primary",
  conversation: "bg-purple-500",
  alert: "bg-secondary",
};

const activityIcons = {
  medication: Pill,
  navigation: Navigation,
  conversation: MessageSquare,
  alert: Bell,
};

export default function GuardianDashboard() {
  const [alertOpen, setAlertOpen] = useState(false);
  const takenMeds = medications.filter((m) => m.status === "taken").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quick Actions */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
          <button className="flex items-center gap-4 p-6 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Phone className="w-7 h-7 text-primary group-hover:text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-text-primary dark:text-white">Call</p>
              <p className="text-sm text-text-muted dark:text-gray-400">Voice Call</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-6 hover:bg-secondary-50 dark:hover:bg-secondary-900/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-secondary-100 dark:bg-secondary-900/50 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
              <MessageCircle className="w-7 h-7 text-secondary group-hover:text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-text-primary dark:text-white">Message</p>
              <p className="text-sm text-text-muted dark:text-gray-400">Send Text</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-6 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Video className="w-7 h-7 text-purple-500 group-hover:text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-text-primary dark:text-white">Request Video</p>
              <p className="text-sm text-text-muted dark:text-gray-400">Privacy-First</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live Status Card */}
        <Card variant="elevated" className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Live Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar name={patientData.name} size="xl" status={patientData.status} />
              <h3 className="mt-3 font-semibold text-text-primary dark:text-white">{patientData.name}</h3>
              <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                <span className="text-xl">{patientData.mood.emoji}</span>
                <span className="text-sm text-text-secondary dark:text-gray-300">{patientData.mood.label}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-accent" />
                  <span className="text-sm text-text-secondary dark:text-gray-300">Heart Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-primary dark:text-white">
                    {patientData.vitals.heartRate.value} bpm
                  </span>
                  <Badge variant="success">Normal</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-primary" />
                  <span className="text-sm text-text-secondary dark:text-gray-300">Activity</span>
                </div>
                <span className="font-semibold text-text-primary dark:text-white">
                  {patientData.vitals.activityLevel.value}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Battery className="w-5 h-5 text-success" />
                  <span className="text-sm text-text-secondary dark:text-gray-300">Rover Battery</span>
                </div>
                <span className="font-semibold text-text-primary dark:text-white">
                  {patientData.vitals.battery.value}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-text-muted dark:text-gray-400" />
                  <span className="text-sm text-text-secondary dark:text-gray-300">Last Check-in</span>
                </div>
                <span className="font-semibold text-text-primary dark:text-white">
                  {patientData.vitals.lastCheckIn}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Medications & Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medications */}
          <Card variant="elevated">
            <CardHeader action={<Badge variant="info">{takenMeds} of {medications.length}</Badge>}>
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
                        : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          med.status === "taken" ? "bg-success" : "bg-gray-200 dark:bg-gray-600"
                        )}
                      >
                        {med.status === "taken" ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <Clock className="w-5 h-5 text-text-muted dark:text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary dark:text-white">{med.name}</p>
                        <p className="text-sm text-text-muted dark:text-gray-400">Scheduled: {med.time}</p>
                      </div>
                    </div>
                    {med.status === "taken" ? (
                      <span className="text-sm text-success-700 dark:text-success-400">Taken at {med.takenAt}</span>
                    ) : (
                      <Badge variant="warning">Upcoming</Badge>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted dark:text-gray-400">Compliance Today</span>
                  <span className="text-sm font-semibold text-text-primary dark:text-white">
                    {Math.round((takenMeds / medications.length) * 100)}%
                  </span>
                </div>
                <ProgressBar
                  value={takenMeds}
                  max={medications.length}
                  variant="success"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card variant="elevated">
            <CardHeader
              action={
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              }
            >
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {activities.map((activity, index) => {
                  const Icon = activityIcons[activity.type as keyof typeof activityIcons];
                  return (
                    <div key={activity.id} className="flex gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                      <div className="relative">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            activityColors[activity.type as keyof typeof activityColors]
                          )}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        {index < activities.length - 1 && (
                          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-200 dark:bg-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary dark:text-white">{activity.description}</p>
                        <p className="text-sm text-text-muted dark:text-gray-400">{activity.timeAgo}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Demo Alert Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          variant="danger"
          onClick={() => setAlertOpen(true)}
          leftIcon={<AlertTriangle className="w-5 h-5" />}
        >
          Demo Alert
        </Button>
      </div>

      {/* Emergency Alert Modal */}
      <Modal isOpen={alertOpen} onClose={() => setAlertOpen(false)} size="lg" closeOnOverlayClick={false}>
        <div className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-100 dark:bg-accent-900/50 flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-10 h-10 text-accent" />
          </div>
          <Badge variant="danger" size="md" className="mb-4">
            Critical Alert
          </Badge>
          <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white mb-2">
            Attention Needed
          </h2>
          <p className="text-text-secondary dark:text-gray-300 mb-2">
            Fall detected in the living room
          </p>
          <p className="text-sm text-text-muted dark:text-gray-400 mb-8">
            January 19, 2026 at 2:35 PM
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" leftIcon={<PhoneCall className="w-5 h-5" />}>
              Call Now
            </Button>
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Video className="w-5 h-5" />}
            >
              Request Video
            </Button>
            <Button className="dark:text-white dark:hover:text-text-primary" variant="outline" size="lg" onClick={() => setAlertOpen(false)}>
              Dismiss
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
