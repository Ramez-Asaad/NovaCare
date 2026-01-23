"use client";

import { useState } from "react";
import { Target, Plus, ChevronRight, Check, Clock, AlertCircle, Edit2, Trash2, Calendar, TrendingUp, Award, CheckCircle2, Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Input, Modal, ModalHeader, ModalBody, ModalFooter, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/utils";

const carePlanGoals = [
  {
    id: 1,
    title: "Blood Sugar Control",
    description: "Maintain HbA1c below 7%",
    category: "Diabetes Management",
    status: "in-progress",
    progress: 75,
    dueDate: "2026-03-01",
    tasks: [
      { id: 1, text: "Monitor blood sugar daily", completed: true },
      { id: 2, text: "Follow prescribed diet plan", completed: true },
      { id: 3, text: "Take Metformin as prescribed", completed: true },
      { id: 4, text: "Exercise 30 minutes 5 days/week", completed: false },
    ],
  },
  {
    id: 2,
    title: "Blood Pressure Management",
    description: "Keep BP below 130/80 mmHg",
    category: "Cardiovascular",
    status: "in-progress",
    progress: 60,
    dueDate: "2026-02-15",
    tasks: [
      { id: 1, text: "Take Lisinopril daily", completed: true },
      { id: 2, text: "Reduce sodium intake", completed: false },
      { id: 3, text: "Weekly BP monitoring", completed: true },
    ],
  },
  {
    id: 3,
    title: "Weight Management",
    description: "Achieve 10lb weight loss",
    category: "Wellness",
    status: "at-risk",
    progress: 30,
    dueDate: "2026-04-01",
    tasks: [
      { id: 1, text: "1800 calorie daily limit", completed: false },
      { id: 2, text: "Log meals daily", completed: true },
      { id: 3, text: "Weekly weigh-ins", completed: true },
      { id: 4, text: "Nutrition counseling sessions", completed: false },
    ],
  },
  {
    id: 4,
    title: "Medication Adherence",
    description: "Maintain 95%+ compliance rate",
    category: "General",
    status: "completed",
    progress: 100,
    dueDate: "2026-01-15",
    tasks: [
      { id: 1, text: "Set medication reminders", completed: true },
      { id: 2, text: "Use pill organizer", completed: true },
      { id: 3, text: "Report any side effects", completed: true },
    ],
  },
];

const statusConfig = {
  "in-progress": { color: "primary", label: "In Progress", icon: Clock },
  "at-risk": { color: "danger", label: "At Risk", icon: AlertCircle },
  completed: { color: "success", label: "Completed", icon: CheckCircle2 },
  pending: { color: "warning", label: "Pending", icon: Circle },
};

export default function CarePlanPage() {
  const [selectedGoal, setSelectedGoal] = useState<(typeof carePlanGoals)[0] | null>(null);
  const [addGoalModalOpen, setAddGoalModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredGoals = carePlanGoals.filter(
    (goal) => filterStatus === "all" || goal.status === filterStatus
  );

  const totalProgress = Math.round(
    carePlanGoals.reduce((acc, goal) => acc + goal.progress, 0) / carePlanGoals.length
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">Care Plan</h2>
          <p className="text-text-muted dark:text-gray-400">Treatment goals and progress tracking for Sarah Johnson</p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setAddGoalModalOpen(true)}>
          Add Goal
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#0F766E"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={175}
                  strokeDashoffset={175 - (175 * totalProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-primary">
                {totalProgress}%
              </span>
            </div>
            <p className="text-sm font-medium text-text-primary dark:text-white">Overall Progress</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-success-100 dark:bg-success-900/50 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-success" />
            </div>
            <p className="text-2xl font-bold text-text-primary dark:text-white">1</p>
            <p className="text-sm text-text-muted dark:text-gray-400">Completed Goals</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-text-primary dark:text-white">2</p>
            <p className="text-sm text-text-muted dark:text-gray-400">In Progress</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-accent-100 dark:bg-accent-900/50 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-accent" />
            </div>
            <p className="text-2xl font-bold text-text-primary dark:text-white">1</p>
            <p className="text-sm text-text-muted dark:text-gray-400">At Risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "in-progress", "at-risk", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all",
              filterStatus === status
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
          >
            {status === "all" ? "All Goals" : status.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filteredGoals.map((goal) => {
          const config = statusConfig[goal.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          const completedTasks = goal.tasks.filter((t) => t.completed).length;

          return (
            <Card
              key={goal.id}
              variant="elevated"
              className={cn(
                "cursor-pointer transition-all",
                selectedGoal?.id === goal.id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedGoal(selectedGoal?.id === goal.id ? null : goal)}
            >
              <CardContent>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        goal.status === "completed"
                          ? "bg-success-100 dark:bg-success-900/50"
                          : goal.status === "at-risk"
                          ? "bg-accent-100 dark:bg-accent-900/50"
                          : "bg-primary-100 dark:bg-primary-900/50"
                      )}
                    >
                      <Target
                        className={cn(
                          "w-6 h-6",
                          goal.status === "completed"
                            ? "text-success"
                            : goal.status === "at-risk"
                            ? "text-accent"
                            : "text-primary"
                        )}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary dark:text-white">{goal.title}</h3>
                      <p className="text-sm text-text-muted dark:text-gray-400">{goal.category}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      config.color === "primary"
                        ? "primary"
                        : config.color === "success"
                        ? "success"
                        : config.color === "danger"
                        ? "danger"
                        : "warning"
                    }
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>

                <p className="text-sm text-text-secondary dark:text-gray-300 mb-4">{goal.description}</p>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-text-muted dark:text-gray-400">
                      {completedTasks} of {goal.tasks.length} tasks completed
                    </span>
                    <span className="font-semibold text-primary">{goal.progress}%</span>
                  </div>
                  <ProgressBar
                    value={goal.progress}
                    variant={
                      goal.status === "completed"
                        ? "success"
                        : goal.status === "at-risk"
                        ? "danger"
                        : "primary"
                    }
                  />
                </div>

                <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Calendar className="w-4 h-4" />
                    Due: {new Date(goal.dueDate).toLocaleDateString()}
                  </div>
                  <button className="text-primary font-medium flex items-center gap-1">
                    Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Expanded Tasks */}
                {selectedGoal?.id === goal.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 animate-fade-in">
                    {goal.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl",
                          task.completed ? "bg-success-50" : "bg-gray-50"
                        )}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Circle className="w-5 h-5 text-text-muted" />
                        )}
                        <span
                          className={cn(
                            "flex-1 text-sm",
                            task.completed ? "text-success line-through" : "text-text-primary"
                          )}
                        >
                          {task.text}
                        </span>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" leftIcon={<Edit2 className="w-4 h-4" />} className="flex-1">
                        Edit Goal
                      </Button>
                      <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} className="flex-1">
                        Add Task
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      <Modal isOpen={addGoalModalOpen} onClose={() => setAddGoalModalOpen(false)} size="lg">
        <ModalHeader>Add New Care Goal</ModalHeader>
        <ModalBody className="space-y-4">
          <Input label="Goal Title" placeholder="e.g., Blood Sugar Control" />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              rows={3}
              placeholder="Describe the goal and target metrics..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option>Diabetes Management</option>
                <option>Cardiovascular</option>
                <option>Wellness</option>
                <option>General</option>
              </select>
            </div>
            <Input label="Target Date" type="date" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Initial Tasks (one per line)</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              rows={4}
              placeholder="Task 1&#10;Task 2&#10;Task 3"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setAddGoalModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setAddGoalModalOpen(false)}>Create Goal</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
