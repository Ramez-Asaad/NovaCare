"use client";

import { useState } from "react";
import {
    Settings,
    Save,
    Database,
    Shield,
    Bell,
    Globe,
    Key,
    Server,
    HardDrive,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Trash2,
    Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Input, Badge, Alert } from "@/components/ui";
import { ThemeToggle } from "@/components/ui";

export default function AdminSettingsPage() {
    const [saved, setSaved] = useState(false);
    const [activeSection, setActiveSection] = useState("general");

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const sections = [
        { id: "general", label: "General", icon: Settings },
        { id: "services", label: "Services", icon: Server },
        { id: "database", label: "Database", icon: Database },
        { id: "security", label: "Security", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "maintenance", label: "Maintenance", icon: HardDrive },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-text-primary dark:text-white">
                        System Settings
                    </h1>
                    <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                        Configure system behavior and preferences
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    leftIcon={saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    onClick={handleSave}
                >
                    {saved ? "Saved!" : "Save Changes"}
                </Button>
            </div>

            {saved && (
                <Alert type="success" title="Settings saved successfully" onDismiss={() => setSaved(false)} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Section Nav */}
                <div className="lg:col-span-1">
                    <Card padding="sm">
                        <nav className="space-y-1">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                        activeSection === section.id
                                            ? "bg-primary text-white"
                                            : "text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    )}
                                >
                                    <section.icon className="w-5 h-5" />
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </Card>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* General */}
                    {activeSection === "general" && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>General Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Input label="System Name" defaultValue="NovaCare" />
                                    <Input label="System Version" defaultValue="1.0.0" helperText="Current deployment version" />
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">
                                            Theme Preference
                                        </label>
                                        <ThemeToggle variant="buttons" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">
                                            Default Language
                                        </label>
                                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                                            <option>English</option>
                                            <option>Arabic</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">
                                            Timezone
                                        </label>
                                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                                            <option>Africa/Cairo (UTC+2)</option>
                                            <option>UTC</option>
                                            <option>America/New_York (UTC-5)</option>
                                        </select>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Services */}
                    {activeSection === "services" && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Service Configuration</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
                                        <h4 className="font-medium text-primary mb-3 flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            API URLs
                                        </h4>
                                        <div className="space-y-4">
                                            <Input label="LLM Backend URL" defaultValue="http://localhost:5000" helperText="NEXT_PUBLIC_NOVABOT_API_URL" />
                                            <Input label="ASL Model API URL" defaultValue="http://localhost:8000" />
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                        <h4 className="font-medium text-text-primary dark:text-white mb-3 flex items-center gap-2">
                                            <Key className="w-4 h-4" />
                                            API Keys
                                        </h4>
                                        <div className="space-y-4">
                                            <Input label="HuggingFace API Key" type="password" defaultValue="hf_xxxxxxxxxxxxx" helperText="Used by LLM Backend for model inference" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">
                                            LLM Response Timeout
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <Input defaultValue="30" className="w-24" />
                                            <span className="text-sm text-text-muted">seconds</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">
                                            ASL Prediction Confidence Threshold
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <Input defaultValue="0.5" className="w-24" />
                                            <span className="text-sm text-text-muted">(0.0 – 1.0)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Database */}
                    {activeSection === "database" && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Database Configuration</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-text-muted dark:text-gray-400">Current Engine</p>
                                            <p className="text-lg font-bold text-text-primary dark:text-white mt-1">SQLite</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-text-muted dark:text-gray-400">Database File</p>
                                            <p className="text-lg font-bold text-text-primary dark:text-white mt-1">novacare.db</p>
                                        </div>
                                    </div>
                                    <Alert
                                        type="info"
                                        title="PostgreSQL migration planned"
                                        message="The database will be migrated to PostgreSQL for production. See roadmap for timeline."
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">
                                            Log Retention Period
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <Input defaultValue="30" className="w-24" />
                                            <span className="text-sm text-text-muted">days</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                                            Export Database
                                        </Button>
                                        <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />}>
                                            Backup Now
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Security */}
                    {activeSection === "security" && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        {[
                                            { label: "Require authentication for all dashboards", id: "auth-required", defaultChecked: true },
                                            { label: "Enable multi-factor authentication (MFA)", id: "mfa-enabled", defaultChecked: false },
                                            { label: "Lock account after 5 failed login attempts", id: "lockout", defaultChecked: true },
                                            { label: "Force HTTPS for all connections", id: "https", defaultChecked: false },
                                            { label: "Enable CORS restrictions", id: "cors", defaultChecked: true },
                                            { label: "Log all API access for audit", id: "audit-log", defaultChecked: true },
                                        ].map((setting) => (
                                            <label
                                                key={setting.id}
                                                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <span className="text-sm font-medium text-text-primary dark:text-white">{setting.label}</span>
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={setting.defaultChecked}
                                                        className="sr-only peer"
                                                        id={setting.id}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-checked:bg-primary rounded-full transition-colors" />
                                                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">
                                            Session Timeout
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <Input defaultValue="60" className="w-24" />
                                            <span className="text-sm text-text-muted">minutes</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Notifications */}
                    {activeSection === "notifications" && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Alert
                                        type="info"
                                        title="Notification service not yet integrated"
                                        message="Push notifications will be available once the notification service is deployed."
                                    />
                                    <div className="space-y-4">
                                        {[
                                            { label: "Enable guardian alert notifications", id: "guardian-alerts", defaultChecked: true },
                                            { label: "Enable fall detection alerts", id: "fall-alerts", defaultChecked: true },
                                            { label: "Enable service health alerts", id: "health-alerts", defaultChecked: true },
                                            { label: "Enable medication reminder notifications", id: "med-reminders", defaultChecked: true },
                                            { label: "Enable system error notifications", id: "error-notifs", defaultChecked: true },
                                            { label: "Enable email notifications", id: "email-notifs", defaultChecked: false },
                                        ].map((setting) => (
                                            <label
                                                key={setting.id}
                                                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <span className="text-sm font-medium text-text-primary dark:text-white">{setting.label}</span>
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={setting.defaultChecked}
                                                        className="sr-only peer"
                                                        id={setting.id}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-checked:bg-primary rounded-full transition-colors" />
                                                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Maintenance */}
                    {activeSection === "maintenance" && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>System Maintenance</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Alert
                                        type="warning"
                                        title="Danger zone"
                                        message="Actions in this section can affect system stability. Proceed with caution."
                                    />

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <div>
                                                <p className="font-medium text-text-primary dark:text-white">Restart All Services</p>
                                                <p className="text-sm text-text-muted dark:text-gray-400 mt-0.5">Stop and restart Frontend, LLM Backend, and ASL Model</p>
                                            </div>
                                            <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />}>
                                                Restart
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <div>
                                                <p className="font-medium text-text-primary dark:text-white">Clear Application Cache</p>
                                                <p className="text-sm text-text-muted dark:text-gray-400 mt-0.5">Remove cached responses and temporary files</p>
                                            </div>
                                            <Button variant="outline" size="sm" leftIcon={<Trash2 className="w-4 h-4" />}>
                                                Clear Cache
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <div>
                                                <p className="font-medium text-text-primary dark:text-white">Clear System Logs</p>
                                                <p className="text-sm text-text-muted dark:text-gray-400 mt-0.5">Delete all log entries (cannot be undone)</p>
                                            </div>
                                            <Button variant="danger" size="sm" leftIcon={<Trash2 className="w-4 h-4" />}>
                                                Clear Logs
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-xl border border-accent-200 dark:border-accent-800 bg-accent-50 dark:bg-accent-900/30">
                                            <div>
                                                <p className="font-medium text-accent">Factory Reset</p>
                                                <p className="text-sm text-accent-700 dark:text-accent-400 mt-0.5">Reset all settings and data to defaults (irreversible)</p>
                                            </div>
                                            <Button variant="danger" size="sm" leftIcon={<AlertTriangle className="w-4 h-4" />}>
                                                Reset
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
