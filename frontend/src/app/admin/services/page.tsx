"use client";

import { useState } from "react";
import {
    Server,
    CheckCircle,
    AlertTriangle,
    XCircle,
    RefreshCw,
    ExternalLink,
    Clock,
    Zap,
    Brain,
    Hand,
    Database,
    Play,
    Square,
    RotateCcw,
    ChevronDown,
    ChevronUp,
    Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, ProgressBar } from "@/components/ui";

interface ServiceDetail {
    name: string;
    description: string;
    port: number | null;
    status: "healthy" | "degraded" | "down";
    uptime: string;
    latency: string;
    version: string;
    lastRestart: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    endpoints: { method: string; path: string; status: string }[];
    metrics: { label: string; value: number; max: number; unit: string }[];
}

const servicesData: ServiceDetail[] = [
    {
        name: "Frontend (Next.js)",
        description: "Web application serving Rover, Guardian, Medical, and Admin dashboards",
        port: 3000,
        status: "healthy",
        uptime: "99.9%",
        latency: "12ms",
        version: "14.2.35",
        lastRestart: "2 days ago",
        icon: Zap,
        color: "text-primary",
        bgColor: "bg-primary-50 dark:bg-primary-900/30",
        endpoints: [
            { method: "GET", path: "/rover", status: "200 OK" },
            { method: "GET", path: "/guardian", status: "200 OK" },
            { method: "GET", path: "/medical", status: "200 OK" },
            { method: "GET", path: "/admin", status: "200 OK" },
        ],
        metrics: [
            { label: "Requests/min", value: 45, max: 100, unit: "req" },
            { label: "Avg Response", value: 12, max: 200, unit: "ms" },
        ],
    },
    {
        name: "LLM Backend (Flask)",
        description: "NovaBot conversational AI and emotion detection service",
        port: 5000,
        status: "healthy",
        uptime: "98.7%",
        latency: "245ms",
        version: "1.0.0",
        lastRestart: "5 hours ago",
        icon: Brain,
        color: "text-purple-500",
        bgColor: "bg-purple-50 dark:bg-purple-900/30",
        endpoints: [
            { method: "POST", path: "/api/chat", status: "200 OK" },
            { method: "POST", path: "/api/emotion/detect", status: "200 OK" },
            { method: "GET", path: "/api/emotion/health", status: "200 OK" },
            { method: "GET", path: "/health", status: "200 OK" },
        ],
        metrics: [
            { label: "Requests/min", value: 12, max: 50, unit: "req" },
            { label: "Avg Response", value: 245, max: 3000, unit: "ms" },
        ],
    },
    {
        name: "ASL Model API (FastAPI)",
        description: "American Sign Language fingerspelling recognition service",
        port: 8000,
        status: "healthy",
        uptime: "99.2%",
        latency: "38ms",
        version: "1.0.0",
        lastRestart: "1 day ago",
        icon: Hand,
        color: "text-secondary",
        bgColor: "bg-secondary-50 dark:bg-secondary-900/30",
        endpoints: [
            { method: "POST", path: "/predict", status: "200 OK" },
            { method: "POST", path: "/predict/landmarks", status: "200 OK" },
            { method: "POST", path: "/predict/confirm", status: "200 OK" },
            { method: "GET", path: "/health", status: "200 OK" },
        ],
        metrics: [
            { label: "Requests/min", value: 8, max: 60, unit: "req" },
            { label: "Avg Inference", value: 38, max: 200, unit: "ms" },
        ],
    },
    {
        name: "Database (SQLite)",
        description: "Local database for user data, vitals, medications, and logs",
        port: null,
        status: "healthy",
        uptime: "100%",
        latency: "2ms",
        version: "3.x",
        lastRestart: "N/A",
        icon: Database,
        color: "text-success",
        bgColor: "bg-success-50 dark:bg-success-900/30",
        endpoints: [],
        metrics: [
            { label: "DB Size", value: 24, max: 1000, unit: "MB" },
            { label: "Connections", value: 3, max: 10, unit: "" },
        ],
    },
];

export default function AdminServicesPage() {
    const [expandedService, setExpandedService] = useState<string | null>(null);

    const statusConfig = {
        healthy: { icon: CheckCircle, color: "text-success", badge: "success" as const, label: "Healthy" },
        degraded: { icon: AlertTriangle, color: "text-secondary", badge: "warning" as const, label: "Degraded" },
        down: { icon: XCircle, color: "text-accent", badge: "danger" as const, label: "Down" },
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-text-primary dark:text-white">
                        Services Monitor
                    </h1>
                    <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                        Monitor and manage all NovaCare services
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />}>
                        Refresh All
                    </Button>
                </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="border border-success-200 dark:border-success-800">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-success" />
                        <div>
                            <p className="text-2xl font-bold text-success">4</p>
                            <p className="text-sm text-text-muted dark:text-gray-400">Healthy</p>
                        </div>
                    </div>
                </Card>
                <Card className="border border-secondary-200 dark:border-secondary-800">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-secondary" />
                        <div>
                            <p className="text-2xl font-bold text-secondary">0</p>
                            <p className="text-sm text-text-muted dark:text-gray-400">Degraded</p>
                        </div>
                    </div>
                </Card>
                <Card className="border border-accent-200 dark:border-accent-800">
                    <div className="flex items-center gap-3">
                        <XCircle className="w-8 h-8 text-accent" />
                        <div>
                            <p className="text-2xl font-bold text-accent">0</p>
                            <p className="text-sm text-text-muted dark:text-gray-400">Down</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Service Cards */}
            <div className="space-y-4">
                {servicesData.map((service) => {
                    const status = statusConfig[service.status];
                    const StatusIcon = status.icon;
                    const isExpanded = expandedService === service.name;

                    return (
                        <Card key={service.name} className="border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {/* Service Header */}
                            <button
                                onClick={() => setExpandedService(isExpanded ? null : service.name)}
                                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", service.bgColor)}>
                                        <service.icon className={cn("w-6 h-6", service.color)} />
                                    </div>
                                    <div className="text-left">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-display font-semibold text-text-primary dark:text-white">{service.name}</h3>
                                            <Badge variant={status.badge}>{status.label}</Badge>
                                        </div>
                                        <p className="text-sm text-text-muted dark:text-gray-400 mt-0.5">{service.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium text-text-secondary dark:text-gray-300">Uptime: {service.uptime}</p>
                                        <p className="text-xs text-text-muted dark:text-gray-400">Latency: {service.latency}</p>
                                    </div>
                                    <StatusIcon className={cn("w-6 h-6", status.color)} />
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-text-muted" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-text-muted" />
                                    )}
                                </div>
                            </button>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="border-t border-gray-100 dark:border-gray-700 p-6 bg-gray-50/50 dark:bg-gray-800/50 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Info */}
                                        <div className="space-y-4">
                                            <h4 className="font-medium text-text-primary dark:text-white flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-primary" />
                                                Service Info
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                                    <span className="text-text-muted dark:text-gray-400">Port</span>
                                                    <span className="font-medium text-text-primary dark:text-white">{service.port || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                                    <span className="text-text-muted dark:text-gray-400">Version</span>
                                                    <span className="font-medium text-text-primary dark:text-white">{service.version}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                                    <span className="text-text-muted dark:text-gray-400">Last Restart</span>
                                                    <span className="font-medium text-text-primary dark:text-white">{service.lastRestart}</span>
                                                </div>
                                            </div>

                                            {/* Metrics */}
                                            <div className="space-y-3 mt-4">
                                                {service.metrics.map((metric) => (
                                                    <div key={metric.label}>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-text-muted dark:text-gray-400">{metric.label}</span>
                                                            <span className="font-medium text-text-primary dark:text-white">
                                                                {metric.value}{metric.unit && ` ${metric.unit}`}
                                                            </span>
                                                        </div>
                                                        <ProgressBar value={metric.value} max={metric.max} variant="primary" size="sm" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Endpoints */}
                                        {service.endpoints.length > 0 && (
                                            <div className="space-y-4">
                                                <h4 className="font-medium text-text-primary dark:text-white flex items-center gap-2">
                                                    <ExternalLink className="w-4 h-4 text-primary" />
                                                    Endpoints
                                                </h4>
                                                <div className="space-y-2">
                                                    {service.endpoints.map((endpoint) => (
                                                        <div
                                                            key={`${endpoint.method}-${endpoint.path}`}
                                                            className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Badge
                                                                    variant={endpoint.method === "GET" ? "info" : "success"}
                                                                    size="sm"
                                                                >
                                                                    {endpoint.method}
                                                                </Badge>
                                                                <code className="text-sm font-mono text-text-primary dark:text-gray-300">{endpoint.path}</code>
                                                            </div>
                                                            <span className="text-xs text-success font-medium">{endpoint.status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <Button variant="outline" size="sm" leftIcon={<RotateCcw className="w-4 h-4" />}>
                                            Restart
                                        </Button>
                                        <Button variant="outline" size="sm" leftIcon={<Square className="w-4 h-4" />}>
                                            Stop
                                        </Button>
                                        <Button variant="outline" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
                                            Open Docs
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
