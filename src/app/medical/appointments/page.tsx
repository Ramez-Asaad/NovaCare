"use client";

import { useState } from "react";
import { Calendar, Clock, Plus, Video, Phone, MapPin, User, ChevronLeft, ChevronRight, MoreVertical, Edit2, Trash2, X, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Input, Modal, ModalHeader, ModalBody, ModalFooter, Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";

const appointments = [
  {
    id: 1,
    title: "Follow-up Consultation",
    patient: "Sarah Johnson",
    date: "2026-01-20",
    time: "10:00 AM",
    duration: 30,
    type: "in-person",
    status: "upcoming",
    location: "Room 204",
    notes: "Review blood work results",
  },
  {
    id: 2,
    title: "Telehealth Check-in",
    patient: "Michael Chen",
    date: "2026-01-20",
    time: "2:00 PM",
    duration: 15,
    type: "video",
    status: "upcoming",
    notes: "Medication adjustment discussion",
  },
  {
    id: 3,
    title: "Annual Physical",
    patient: "Emily Davis",
    date: "2026-01-21",
    time: "9:00 AM",
    duration: 45,
    type: "in-person",
    status: "upcoming",
    location: "Room 102",
    notes: "Full health assessment",
  },
  {
    id: 4,
    title: "Lab Review",
    patient: "Robert Wilson",
    date: "2026-01-21",
    time: "11:30 AM",
    duration: 20,
    type: "phone",
    status: "upcoming",
    notes: "Discuss HbA1c results",
  },
  {
    id: 5,
    title: "Routine Check-up",
    patient: "Sarah Johnson",
    date: "2026-01-15",
    time: "3:00 PM",
    duration: 30,
    type: "in-person",
    status: "completed",
    location: "Room 204",
  },
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const typeConfig = {
  "in-person": { icon: MapPin, color: "bg-primary-100 dark:bg-primary-900/50 text-primary", label: "In-Person" },
  video: { icon: Video, color: "bg-purple-100 dark:bg-purple-900/50 text-purple-600", label: "Video Call" },
  phone: { icon: Phone, color: "bg-secondary-100 dark:bg-secondary-900/50 text-secondary", label: "Phone Call" },
};

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 19));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 0, 20));
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof appointments)[0] | null>(null);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getAppointmentsForDate = (date: Date | null) => {
    if (!date) return [];
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">Appointments</h2>
          <p className="text-text-muted dark:text-gray-400">Schedule and manage patient appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                viewMode === "calendar" ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-text-muted dark:text-gray-400"
              )}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                viewMode === "list" ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-text-muted dark:text-gray-400"
              )}
            >
              List
            </button>
          </div>
          <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setScheduleModalOpen(true)}>
            Schedule
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader
            action={
              <div className="flex items-center gap-4">
                <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <ChevronLeft className="w-5 h-5 text-text-muted dark:text-gray-400" />
                </button>
                <span className="text-lg font-semibold text-text-primary dark:text-white min-w-[140px] text-center">
                  {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                </span>
                <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <ChevronRight className="w-5 h-5 text-text-muted dark:text-gray-400" />
                </button>
              </div>
            }
          >
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-text-muted dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth().map((day, index) => {
                const dayAppointments = day ? getAppointmentsForDate(day) : [];
                const isSelected = day && selectedDate?.toDateString() === day.toDateString();
                const isToday = day && day.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => day && setSelectedDate(day)}
                    disabled={!day}
                    className={cn(
                      "aspect-square p-2 rounded-xl text-sm transition-all relative",
                      day ? "hover:bg-gray-100 dark:hover:bg-gray-700" : "opacity-0 cursor-default",
                      isSelected && "bg-primary text-white hover:bg-primary-600",
                      isToday && !isSelected && "ring-2 ring-primary",
                      !isSelected && day && "text-text-primary dark:text-white"
                    )}
                  >
                    {day && (
                      <>
                        <span className="font-medium">{day.getDate()}</span>
                        {dayAppointments.length > 0 && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                            {dayAppointments.slice(0, 3).map((apt, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  isSelected ? "bg-white/70" : "bg-primary"
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Appointments */}
        <div className="space-y-4">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">
                {selectedDate?.toLocaleDateString("default", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDateAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-text-muted dark:text-gray-500 opacity-50" />
                  <p className="text-text-muted dark:text-gray-400">No appointments scheduled</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 dark:text-white dark:hover:text-text-primary"
                    onClick={() => setScheduleModalOpen(true)}
                  >
                    Schedule Appointment
                  </Button>
                </div>
              ) : (
                selectedDateAppointments.map((apt) => {
                  const config = typeConfig[apt.type as keyof typeof typeConfig];
                  const TypeIcon = config.icon;

                  return (
                    <div
                      key={apt.id}
                      className={cn(
                        "p-4 rounded-xl border-l-4 transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700",
                        apt.type === "in-person"
                          ? "border-l-primary bg-primary-50/50 dark:bg-primary-900/30"
                          : apt.type === "video"
                          ? "border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/30"
                          : "border-l-secondary bg-secondary-50/50 dark:bg-secondary-900/30"
                      )}
                      onClick={() => setSelectedAppointment(apt)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.color)}>
                            <TypeIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-text-primary dark:text-white text-sm">{apt.title}</h4>
                            <p className="text-xs text-text-muted dark:text-gray-400">{apt.patient}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-muted dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {apt.time} ({apt.duration}min)
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card variant="elevated">
            <CardContent>
              <h4 className="font-semibold text-text-primary dark:text-white mb-4">This Week</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-text-secondary dark:text-gray-300">In-Person</span>
                  </div>
                  <span className="font-semibold text-text-primary dark:text-white">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                      <Video className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-text-secondary dark:text-gray-300">Video Calls</span>
                  </div>
                  <span className="font-semibold text-text-primary dark:text-white">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/50 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="text-sm text-text-secondary dark:text-gray-300">Phone Calls</span>
                  </div>
                  <span className="font-semibold text-text-primary dark:text-white">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Appointment Modal */}
      <Modal isOpen={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} size="lg">
        <ModalHeader>Schedule Appointment</ModalHeader>
        <ModalBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">Patient</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option>Sarah Johnson</option>
              <option>Michael Chen</option>
              <option>Emily Davis</option>
              <option>Robert Wilson</option>
            </select>
          </div>
          <Input label="Appointment Title" placeholder="e.g., Follow-up Consultation" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" />
            <Input label="Time" type="time" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 dark:text-gray-300">Duration</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 dark:text-gray-300">Type</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <option value="in-person">In-Person</option>
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>
          </div>
          <Input label="Location (optional)" placeholder="e.g., Room 204" />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2 dark:text-gray-300">Notes</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              rows={3}
              placeholder="Add any notes for this appointment..."
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="dark:text-white dark:hover:text-text-primary" variant="outline" onClick={() => setScheduleModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setScheduleModalOpen(false)}>Schedule</Button>
        </ModalFooter>
      </Modal>

      {/* Appointment Detail Modal */}
      <Modal isOpen={!!selectedAppointment} onClose={() => setSelectedAppointment(null)}>
        <ModalHeader>{selectedAppointment?.title}</ModalHeader>
        <ModalBody className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <Avatar name={selectedAppointment?.patient || ""} size="lg" />
            <div>
              <h4 className="font-semibold text-text-primary">{selectedAppointment?.patient}</h4>
              <p className="text-sm text-text-muted">Patient</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-text-muted mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Date</span>
              </div>
              <p className="font-medium text-text-primary">
                {selectedAppointment && new Date(selectedAppointment.date).toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-text-muted mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Time</span>
              </div>
              <p className="font-medium text-text-primary">
                {selectedAppointment?.time} ({selectedAppointment?.duration}min)
              </p>
            </div>
          </div>
          {selectedAppointment?.notes && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-text-muted mb-1">Notes</p>
              <p className="text-text-primary">{selectedAppointment.notes}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" className="dark:text-white dark:hover:text-text-primary" leftIcon={<Edit2 className="w-4 h-4" />}>Edit</Button>
          <Button variant="outline" className="text-accent border-accent" leftIcon={<X className="w-4 h-4" />}>
            Cancel
          </Button>
          {selectedAppointment?.type === "video" && (
            <Button leftIcon={<Video className="w-4 h-4" />}>Start Call</Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
