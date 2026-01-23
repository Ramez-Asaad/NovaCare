"use client";

import { useState } from "react";
import { Search, Filter, Download, Pill, Navigation, MessageSquare, Bell, AlertTriangle, Calendar, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

const activityTypes = ["All", "Medication", "Navigation", "Conversation", "Alert"];

const activities = [
  {
    id: 1,
    type: "medication",
    title: "Medication Taken",
    description: "Took Metformin (500mg)",
    time: "12:10 PM",
    date: "January 19, 2026",
    icon: Pill,
  },
  {
    id: 2,
    type: "navigation",
    title: "Navigation Complete",
    description: "Navigated from Living Room to Kitchen",
    time: "11:30 AM",
    date: "January 19, 2026",
    icon: Navigation,
  },
  {
    id: 3,
    type: "conversation",
    title: "Conversation",
    description: "Had a 15-minute chat with NovaCare about the weather",
    time: "10:45 AM",
    date: "January 19, 2026",
    icon: MessageSquare,
  },
  {
    id: 4,
    type: "medication",
    title: "Medication Taken",
    description: "Took Lisinopril (10mg)",
    time: "8:05 AM",
    date: "January 19, 2026",
    icon: Pill,
  },
  {
    id: 5,
    type: "alert",
    title: "Low Battery Warning",
    description: "Rover battery at 15% - Now charging",
    time: "7:30 AM",
    date: "January 19, 2026",
    icon: Bell,
  },
  {
    id: 6,
    type: "navigation",
    title: "Navigation Complete",
    description: "Navigated from Bedroom to Bathroom",
    time: "7:15 AM",
    date: "January 19, 2026",
    icon: Navigation,
  },
  {
    id: 7,
    type: "alert",
    title: "Fall Detection",
    description: "Possible fall detected in hallway - Patient confirmed OK",
    time: "6:45 PM",
    date: "January 18, 2026",
    icon: AlertTriangle,
  },
  {
    id: 8,
    type: "medication",
    title: "Medication Taken",
    description: "Took Aspirin (81mg)",
    time: "6:05 PM",
    date: "January 18, 2026",
    icon: Pill,
  },
];

const typeColors = {
  medication: { bg: "bg-success-100 dark:bg-success-900/30", text: "text-success-700 dark:text-success-400", icon: "bg-success" },
  navigation: { bg: "bg-primary-100 dark:bg-primary-900/30", text: "text-primary-700 dark:text-primary-400", icon: "bg-primary" },
  conversation: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", icon: "bg-purple-500" },
  alert: { bg: "bg-secondary-100 dark:bg-secondary-900/30", text: "text-secondary-700 dark:text-secondary-400", icon: "bg-secondary" },
};

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [dateRange, setDateRange] = useState("today");

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "All" || activity.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <Card variant="elevated">
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {activityTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  selectedType === type
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                )}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button className="dark:text-white dark:hover:text-text-primary" variant="outline" leftIcon={<Calendar className="w-4 h-4 " />}>
              Date Range
            </Button>
            <Button className="dark:text-white dark:hover:text-text-primary" variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => {
                const colors = typeColors[activity.type as keyof typeof typeColors];
                const Icon = activity.icon;
                const showDateHeader =
                  index === 0 ||
                  activities[index - 1].date !== activity.date;

                return (
                  <div key={activity.id}>
                    {showDateHeader && (
                      <div className="flex items-center gap-3 py-4">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                        <span className="text-sm font-medium text-text-muted dark:text-gray-400 px-3">
                          {activity.date}
                        </span>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                      </div>
                    )}
                    <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="relative">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            colors.icon
                          )}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-text-primary dark:text-white">{activity.title}</p>
                            <p className="text-text-secondary dark:text-gray-300 mt-1">{activity.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-text-muted dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              {activity.time}
                            </div>
                            <Badge className={cn("mt-2", colors.bg, colors.text)}>
                              {activity.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Search className="w-8 h-8 text-text-muted dark:text-gray-400" />
                </div>
                <p className="text-text-muted dark:text-gray-400">No activities found matching your filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
