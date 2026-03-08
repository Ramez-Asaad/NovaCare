"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Check, Clock, AlertCircle, ChevronLeft, ChevronRight, Calendar, Pill, Search, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Input, Modal, ModalHeader, ModalBody, ModalFooter, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/utils";

const medications = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    time: "8:00 AM",
    instructions: "Take on empty stomach",
    status: "active",
    prescribedBy: "Dr. Smith",
    startDate: "2025-12-01",
    compliance: 95,
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    time: "12:00 PM, 8:00 PM",
    instructions: "Take with meals",
    status: "active",
    prescribedBy: "Dr. Johnson",
    startDate: "2025-11-15",
    compliance: 88,
  },
  {
    id: 3,
    name: "Aspirin",
    dosage: "81mg",
    frequency: "Once daily",
    time: "6:00 PM",
    instructions: "Take with water",
    status: "active",
    prescribedBy: "Dr. Smith",
    startDate: "2025-10-01",
    compliance: 92,
  },
  {
    id: 4,
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    time: "9:00 PM",
    instructions: "Take at bedtime",
    status: "discontinued",
    prescribedBy: "Dr. Smith",
    startDate: "2025-06-01",
    endDate: "2025-12-15",
    compliance: 78,
  },
];

const weeklySchedule = [
  { day: "Sun", date: 13, meds: [{ taken: true }, { taken: true }, { taken: true }] },
  { day: "Mon", date: 14, meds: [{ taken: true }, { taken: true }, { taken: false }] },
  { day: "Tue", date: 15, meds: [{ taken: true }, { taken: true }, { taken: true }] },
  { day: "Wed", date: 16, meds: [{ taken: true }, { taken: true }, { taken: true }] },
  { day: "Thu", date: 17, meds: [{ taken: true }, { taken: false }, { taken: true }] },
  { day: "Fri", date: 18, meds: [{ taken: true }, { taken: true }, { taken: true }] },
  { day: "Sat", date: 19, meds: [{ taken: true }, { taken: true }, { upcoming: true }] },
];

export default function MedicalMedicationsPage() {
  const [selectedMed, setSelectedMed] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "discontinued">("all");

  const filteredMeds = medications.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || med.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">Medication Management</h2>
          <p className="text-text-muted dark:text-gray-400">Manage and track patient medications</p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setEditModalOpen(true)}>
          Add Medication
        </Button>
      </div>

      {/* Weekly Calendar */}
      <Card variant="elevated">
        <CardHeader
          action={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-text-secondary">Jan 13 - 19, 2026</span>
              <Button variant="ghost" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          }
        >
          <CardTitle>Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklySchedule.map((day, index) => (
              <div
                key={day.day}
                className={cn(
                  "p-4 rounded-xl text-center transition-all",
                  index === 6 ? "bg-primary-50 dark:bg-primary-900/30 border-2 border-primary" : "bg-gray-50 dark:bg-gray-700"
                )}
              >
                <p className="text-xs text-text-muted dark:text-gray-400 mb-1">{day.day}</p>
                <p className={cn("text-lg font-bold", index === 6 ? "text-primary" : "text-text-primary dark:text-white")}>
                  {day.date}
                </p>
                <div className="flex justify-center gap-1 mt-3">
                  {day.meds.map((med, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-3 h-3 rounded-full",
                        med.taken ? "bg-success" : med.upcoming ? "bg-gray-300" : "bg-accent"
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-sm text-text-muted dark:text-gray-400">Taken</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-text-muted dark:text-gray-400">Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="text-sm text-text-muted dark:text-gray-400">Upcoming</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "discontinued"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all",
                filterStatus === status
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Medications List */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filteredMeds.map((med) => (
          <Card
            key={med.id}
            variant="elevated"
            className={cn(
              "cursor-pointer transition-all",
              selectedMed === med.id && "ring-2 ring-primary",
              med.status === "discontinued" && "opacity-60"
            )}
            onClick={() => setSelectedMed(selectedMed === med.id ? null : med.id)}
          >
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    med.status === "active" ? "bg-primary-100 dark:bg-primary-900/50" : "bg-gray-200 dark:bg-gray-700"
                  )}>
                    <Pill className={cn("w-6 h-6", med.status === "active" ? "text-primary" : "text-text-muted dark:text-gray-400")} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary dark:text-white">{med.name}</h3>
                    <p className="text-sm text-text-muted dark:text-gray-400">{med.dosage} • {med.frequency}</p>
                  </div>
                </div>
                <Badge variant={med.status === "active" ? "success" : "default"}>
                  {med.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-gray-400">Time</span>
                  <span className="text-text-primary dark:text-gray-200">{med.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-gray-400">Instructions</span>
                  <span className="text-text-primary dark:text-gray-200">{med.instructions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted dark:text-gray-400">Prescribed by</span>
                  <span className="text-text-primary dark:text-gray-200">{med.prescribedBy}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted dark:text-gray-400">Compliance Rate</span>
                  <span className={cn(
                    "text-sm font-semibold",
                    med.compliance >= 90 ? "text-success" : med.compliance >= 70 ? "text-secondary" : "text-accent"
                  )}>
                    {med.compliance}%
                  </span>
                </div>
                <ProgressBar
                  value={med.compliance}
                  variant={med.compliance >= 90 ? "success" : med.compliance >= 70 ? "warning" : "danger"}
                />
              </div>

              {selectedMed === med.id && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
                  <Button variant="outline" size="sm" leftIcon={<Edit2 className="w-4 h-4" />} className="flex-1">
                    Edit
                  </Button>
                  {med.status === "active" ? (
                    <Button variant="outline" size="sm" leftIcon={<Clock className="w-4 h-4" />} className="flex-1">
                      Hold
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" leftIcon={<Check className="w-4 h-4" />} className="flex-1">
                      Reactivate
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-accent border-accent hover:bg-accent-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Medication Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} size="lg">
        <ModalHeader>Add New Medication</ModalHeader>
        <ModalBody className="space-y-4">
          <Input label="Medication Name" placeholder="Enter medication name" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Dosage" placeholder="e.g., 10mg" />
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">Frequency</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Three times daily</option>
                <option>As needed</option>
              </select>
            </div>
          </div>
          <Input label="Time(s)" placeholder="e.g., 8:00 AM, 8:00 PM" />
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">Special Instructions</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              rows={3}
              placeholder="Take with food, avoid alcohol, etc..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" />
            <Input label="End Date (Optional)" type="date" />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setEditModalOpen(false)}>Save Medication</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
