"use client";

import { useState } from "react";
import {
    FileText,
    Search,
    Filter,
    Download,
    AlertTriangle,
    AlertCircle,
    CheckCircle,
    Info,
    Clock,
    Server,
    Users,
    Shield,
    Bug,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, Badge, Button, Input } from "@/components/ui";

type LogLevel = "info" | "warning" | "error" | "success" | "debug";

interface LogEntry {
    id: number;
    timestamp: string;
    level: LogLevel;
    source: string;
    message: string;
    details?: string;
}

const logsData: LogEntry[] = [
    { id: 1, timestamp: "2026-03-08 14:42:31", level: "warning", source: "LLM Backend", message: "Response time exceeded 3s threshold", details: "Endpoint: /api/chat, Duration: 3.45s, Model: HuggingFace LLM" },
    { id: 2, timestamp: "2026-03-08 14:35:12", level: "info", source: "System", message: "Automated backup completed successfully" },
    { id: 3, timestamp: "2026-03-08 14:20:05", level: "success", source: "ASL Model", message: "Model checkpoint updated to v2.3", details: "Accuracy: 94.2%, Size: 128MB" },
    { id: 4, timestamp: "2026-03-08 13:55:18", level: "error", source: "Auth", message: "Failed login attempt from unknown IP", details: "IP: 192.168.1.105, User: admin, Attempts: 3" },
    { id: 5, timestamp: "2026-03-08 13:40:22", level: "info", source: "Frontend", message: "New user session started: Sarah Johnson (Rover)" },
    { id: 6, timestamp: "2026-03-08 13:15:44", level: "info", source: "System", message: "Scheduled maintenance completed" },
    { id: 7, timestamp: "2026-03-08 12:50:33", level: "warning", source: "Database", message: "Database size approaching 80% of allocated space", details: "Current: 812MB, Max: 1GB" },
    { id: 8, timestamp: "2026-03-08 12:30:11", level: "success", source: "LLM Backend", message: "Emotion detection model loaded successfully" },
    { id: 9, timestamp: "2026-03-08 12:15:28", level: "info", source: "Frontend", message: "Guardian dashboard accessed by John Doe" },
    { id: 10, timestamp: "2026-03-08 11:55:09", level: "error", source: "ASL Model", message: "Prediction failed: no hand landmarks detected", details: "Endpoint: /predict, Error: MediaPipe returned empty landmarks array" },
    { id: 11, timestamp: "2026-03-08 11:30:00", level: "info", source: "System", message: "All services started via start_all.ps1" },
    { id: 12, timestamp: "2026-03-08 11:20:41", level: "debug", source: "LLM Backend", message: "ConversationalAI initialized with model: mistralai/Mistral-7B" },
    { id: 13, timestamp: "2026-03-08 10:45:15", level: "warning", source: "Frontend", message: "Slow page load detected: /medical/vitals (2.8s)", details: "Bundle size: 1.2MB, Network: 3G" },
    { id: 14, timestamp: "2026-03-08 10:00:00", level: "success", source: "System", message: "System startup completed — all health checks passed" },
];

export default function AdminLogsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState<LogLevel | null>(null);
    const [sourceFilter, setSourceFilter] = useState<string | null>(null);
    const [expandedLog, setExpandedLog] = useState<number | null>(null);

    const levelConfig: Record<LogLevel, { icon: React.ElementType; color: string; bg: string; badge: "info" | "success" | "warning" | "danger" | "default" }> = {
        info: { icon: Info, color: "text-primary", bg: "bg-primary-50 dark:bg-primary-900/30", badge: "info" },
        warning: { icon: AlertTriangle, color: "text-secondary", bg: "bg-secondary-50 dark:bg-secondary-900/30", badge: "warning" },
        error: { icon: AlertCircle, color: "text-accent", bg: "bg-accent-50 dark:bg-accent-900/30", badge: "danger" },
        success: { icon: CheckCircle, color: "text-success", bg: "bg-success-50 dark:bg-success-900/30", badge: "success" },
        debug: { icon: Bug, color: "text-text-muted", bg: "bg-gray-50 dark:bg-gray-800", badge: "default" },
    };

    const sources = Array.from(new Set(logsData.map(l => l.source)));

    const filteredLogs = logsData.filter((log) => {
        const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.source.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = !levelFilter || log.level === levelFilter;
        const matchesSource = !sourceFilter || log.source === sourceFilter;
        return matchesSearch && matchesLevel && matchesSource;
    });

    const logCounts = {
        info: logsData.filter(l => l.level === "info").length,
        warning: logsData.filter(l => l.level === "warning").length,
        error: logsData.filter(l => l.level === "error").length,
        success: logsData.filter(l => l.level === "success").length,
        debug: logsData.filter(l => l.level === "debug").length,
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-text-primary dark:text-white">
                        System Logs
                    </h1>
                    <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                        {filteredLogs.length} log entries
                    </p>
                </div>
                <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                    Export Logs
                </Button>
            </div>

            {/* Level Filters */}
            <div className="flex flex-wrap gap-2">
                {(Object.keys(levelConfig) as LogLevel[]).map((level) => {
                    const config = levelConfig[level];
                    const LevelIcon = config.icon;
                    return (
                        <button
                            key={level}
                            onClick={() => setLevelFilter(levelFilter === level ? null : level)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                levelFilter === level
                                    ? "bg-primary text-white"
                                    : cn(config.bg, config.color, "hover:ring-2 hover:ring-primary/20")
                            )}
                        >
                            <LevelIcon className="w-4 h-4" />
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                            <span className={cn(
                                "px-1.5 py-0.5 rounded-full text-xs",
                                levelFilter === level ? "bg-white/20" : "bg-black/10 dark:bg-white/10"
                            )}>
                                {logCounts[level]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search & Source Filter */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search logs..."
                        leftIcon={<Search className="w-5 h-5" />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <select
                        value={sourceFilter || ""}
                        onChange={(e) => setSourceFilter(e.target.value || null)}
                        className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none pr-10"
                    >
                        <option value="">All Sources</option>
                        {sources.map((source) => (
                            <option key={source} value={source}>{source}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
            </div>

            {/* Log Entries */}
            <div className="space-y-2">
                {filteredLogs.map((log) => {
                    const config = levelConfig[log.level];
                    const LevelIcon = config.icon;
                    const isExpanded = expandedLog === log.id;

                    return (
                        <button
                            key={log.id}
                            onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                            className={cn(
                                "w-full text-left rounded-xl border transition-all",
                                isExpanded
                                    ? "border-primary/30 ring-1 ring-primary/10"
                                    : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                            )}
                        >
                            <div className="flex items-center gap-3 p-4">
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
                                    <LevelIcon className={cn("w-4 h-4", config.color)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant={config.badge} size="sm">{log.source}</Badge>
                                        <span className="text-sm text-text-primary dark:text-white truncate">{log.message}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Clock className="w-3.5 h-3.5 text-text-muted" />
                                    <span className="text-xs text-text-muted dark:text-gray-400 whitespace-nowrap">
                                        {log.timestamp.split(" ")[1]}
                                    </span>
                                </div>
                            </div>

                            {isExpanded && log.details && (
                                <div className="px-4 pb-4 pt-0">
                                    <div className={cn("p-3 rounded-lg text-sm font-mono", config.bg, config.color)}>
                                        {log.details}
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {filteredLogs.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-text-muted mx-auto mb-3" />
                    <p className="text-text-muted dark:text-gray-400">No logs found matching your filters</p>
                </div>
            )}
        </div>
    );
}
