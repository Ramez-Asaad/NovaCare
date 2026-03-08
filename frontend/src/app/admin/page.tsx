"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Server,
    Users,
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    Cpu,
    HardDrive,
    Wifi,
    ArrowUpRight,
    RefreshCw,
    XCircle,
    Zap,
    Shield,
    Database,
    Bot,
    Hand,
    Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, Badge, ProgressBar } from "@/components/ui";

// Service health data
const services = [
    {
        name: "Frontend (Next.js)",
        port: 3000,
        status: "healthy" as const,
        uptime: "99.9%",
        latency: "12ms",
        icon: Zap,
        color: "text-primary",
        bgColor: "bg-primary-50 dark:bg-primary-900/30",
    },
    {
        name: "LLM Backend (Flask)",
        port: 5000,
        status: "healthy" as const,
        uptime: "98.7%",
        latency: "245ms",
        icon: Brain,
        color: "text-purple-500",
        bgColor: "bg-purple-50 dark:bg-purple-900/30",
    },
    {
        name: "ASL Model API (FastAPI)",
        port: 8000,
        status: "healthy" as const,
        uptime: "99.2%",
        latency: "38ms",
        icon: Hand,
        color: "text-secondary",
        bgColor: "bg-secondary-50 dark:bg-secondary-900/30",
    },
    {
        name: "Database (SQLite)",
        port: null,
        status: "healthy" as const,
        uptime: "100%",
        latency: "2ms",
        icon: Database,
        color: "text-success",
        bgColor: "bg-success-50 dark:bg-success-900/30",
    },
];

const recentAlerts = [
    {
        id: 1,
        type: "warning" as const,
        message: "LLM Backend response time exceeded 3s threshold",
        time: "12 min ago",
    },
    {
        id: 2,
        type: "info" as const,
        message: "System backup completed successfully",
        time: "1 hour ago",
    },
    {
        id: 3,
        type: "success" as const,
        message: "ASL Model checkpoint updated to v2.3",
        time: "3 hours ago",
    },
    {
        id: 4,
        type: "error" as const,
        message: "Failed login attempt from unknown IP",
        time: "5 hours ago",
    },
    {
        id: 5,
        type: "info" as const,
        message: "Scheduled maintenance window completed",
        time: "8 hours ago",
    },
];

const recentUsers = [
    { name: "Sarah Johnson", role: "Rover", lastActive: "2 min ago", status: "online" as const },
    { name: "John Doe", role: "Guardian", lastActive: "15 min ago", status: "online" as const },
    { name: "Dr. Smith", role: "Medical", lastActive: "1 hour ago", status: "offline" as const },
    { name: "Emily Davis", role: "Rover", lastActive: "3 hours ago", status: "resting" as const },
];

export default function AdminDashboardPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const statusIcons = {
        healthy: CheckCircle,
        degraded: AlertTriangle,
        down: XCircle,
    };

    const statusColors = {
        healthy: "text-success",
        degraded: "text-secondary",
        down: "text-accent",
    };

    const alertStyles = {
        warning: { bg: "bg-secondary-50 dark:bg-secondary-900/30", text: "text-secondary-700 dark:text-secondary-400", icon: AlertTriangle },
        info: { bg: "bg-primary-50 dark:bg-primary-900/30", text: "text-primary-700 dark:text-primary-400", icon: Activity },
        success: { bg: "bg-success-50 dark:bg-success-900/30", text: "text-success-700 dark:text-success-400", icon: CheckCircle },
        error: { bg: "bg-accent-50 dark:bg-accent-900/30", text: "text-accent-700 dark:text-accent-400", icon: XCircle },
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Row */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-text-primary dark:text-white">
                        System Overview
                    </h1>
                    <p className="text-sm text-text-muted dark:text-gray-400 flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        Last updated: {currentTime.toLocaleTimeString()}
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all",
                        isRefreshing && "opacity-70 cursor-not-allowed"
                    )}
                    disabled={isRefreshing}
                >
                    <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                            <Server className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary dark:text-white">4</p>
                            <p className="text-sm text-text-muted dark:text-gray-400">Active Services</p>
                        </div>
                    </div>
                </Card>

                <Card className="border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-success-50 dark:bg-success-900/30 flex items-center justify-center">
                            <Users className="w-6 h-6 text-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary dark:text-white">12</p>
                            <p className="text-sm text-text-muted dark:text-gray-400">Total Users</p>
                        </div>
                    </div>
                </Card>

                <Card className="border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary dark:text-white">99.5%</p>
                            <p className="text-sm text-text-muted dark:text-gray-400">Avg. Uptime</p>
                        </div>
                    </div>
                </Card>

                <Card className="border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary dark:text-white">2</p>
                            <p className="text-sm text-text-muted dark:text-gray-400">Active Alerts</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Service Health + System Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Service Health */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <CardTitle>Service Health</CardTitle>
                                <Link
                                    href="/admin/services"
                                    className="text-sm text-primary font-medium hover:text-primary-800 flex items-center gap-1 transition-colors"
                                >
                                    View Details
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {services.map((service) => {
                                    const StatusIcon = statusIcons[service.status];
                                    return (
                                        <div
                                            key={service.name}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-xl transition-colors",
                                                service.bgColor
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                                                    <service.icon className={cn("w-5 h-5", service.color)} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-text-primary dark:text-white">{service.name}</p>
                                                    <p className="text-xs text-text-muted dark:text-gray-400">
                                                        {service.port ? `Port ${service.port}` : "Embedded"} · Latency: {service.latency}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-text-secondary dark:text-gray-300">
                                                    {service.uptime}
                                                </span>
                                                <StatusIcon className={cn("w-5 h-5", statusColors[service.status])} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Resources */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-text-secondary dark:text-gray-300">CPU Usage</span>
                                </div>
                                <span className="text-sm font-bold text-text-primary dark:text-white">34%</span>
                            </div>
                            <ProgressBar value={34} variant="primary" size="md" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <HardDrive className="w-4 h-4 text-secondary" />
                                    <span className="text-sm font-medium text-text-secondary dark:text-gray-300">Memory</span>
                                </div>
                                <span className="text-sm font-bold text-text-primary dark:text-white">62%</span>
                            </div>
                            <ProgressBar value={62} variant="warning" size="md" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-success" />
                                    <span className="text-sm font-medium text-text-secondary dark:text-gray-300">Disk</span>
                                </div>
                                <span className="text-sm font-bold text-text-primary dark:text-white">21%</span>
                            </div>
                            <ProgressBar value={21} variant="success" size="md" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Wifi className="w-4 h-4 text-accent" />
                                    <span className="text-sm font-medium text-text-secondary dark:text-gray-300">Network</span>
                                </div>
                                <span className="text-sm font-bold text-text-primary dark:text-white">8 Mbps</span>
                            </div>
                            <ProgressBar value={16} variant="danger" size="md" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Alerts + Active Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Alerts */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <CardTitle>Recent Alerts</CardTitle>
                            <Link
                                href="/admin/logs"
                                className="text-sm text-primary font-medium hover:text-primary-800 flex items-center gap-1 transition-colors"
                            >
                                View All
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentAlerts.map((alert) => {
                                const style = alertStyles[alert.type];
                                const AlertIcon = style.icon;
                                return (
                                    <div
                                        key={alert.id}
                                        className={cn("flex items-start gap-3 p-3 rounded-xl", style.bg)}
                                    >
                                        <AlertIcon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", style.text)} />
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("text-sm font-medium", style.text)}>{alert.message}</p>
                                            <p className="text-xs text-text-muted dark:text-gray-500 mt-1">{alert.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Active Users */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <CardTitle>Active Users</CardTitle>
                            <Link
                                href="/admin/users"
                                className="text-sm text-primary font-medium hover:text-primary-800 flex items-center gap-1 transition-colors"
                            >
                                Manage Users
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentUsers.map((user) => (
                                <div
                                    key={user.name}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary font-semibold flex items-center justify-center text-sm">
                                                {user.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <span
                                                className={cn(
                                                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-700",
                                                    user.status === "online" && "bg-success animate-pulse",
                                                    user.status === "offline" && "bg-gray-400",
                                                    user.status === "resting" && "bg-secondary"
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-primary dark:text-white">{user.name}</p>
                                            <p className="text-xs text-text-muted dark:text-gray-400">{user.lastActive}</p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            user.role === "Rover" ? "info" :
                                                user.role === "Guardian" ? "success" :
                                                    "warning"
                                        }
                                    >
                                        {user.role}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
