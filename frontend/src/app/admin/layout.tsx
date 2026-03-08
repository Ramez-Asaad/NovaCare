"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Activity,
    Users,
    Server,
    FileText,
    Settings,
    Bell,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Shield,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Badge, ThemeToggle } from "@/components/ui";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Services", href: "/admin/services", icon: Server },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "System Logs", href: "/admin/logs", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background-cream dark:bg-gray-900 transition-colors">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-soft transform transition-transform duration-300 lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                        <Link href="/admin" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-display font-bold text-text-primary dark:text-white">NovaCare</span>
                                <Badge variant="warning" className="ml-2 text-2xs">Admin</Badge>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X className="w-5 h-5 dark:text-gray-300" />
                        </button>
                    </div>

                    {/* System Status Card */}
                    <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 p-3 bg-success-50 dark:bg-success-900/30 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-success" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-primary dark:text-white">System Status</p>
                                <p className="text-xs text-success flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                                    All Services Operational
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-700">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-text-muted dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-accent transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between px-4 lg:px-8 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Menu className="w-5 h-5 dark:text-gray-300" />
                            </button>
                            <div className="flex items-center gap-3">
                                <Shield className="w-6 h-6 text-primary" />
                                <div>
                                    <h1 className="text-xl font-display font-bold text-text-primary dark:text-white">
                                        Admin Panel
                                    </h1>
                                    <p className="text-sm text-text-muted dark:text-gray-400">System administration & monitoring</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Theme Toggle */}
                            <ThemeToggle variant="icon" />

                            {/* Notifications */}
                            <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <Bell className="w-5 h-5 text-text-secondary dark:text-gray-400" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Avatar name="Admin User" size="sm" />
                                    <div className="hidden md:block text-left">
                                        <span className="text-sm font-medium text-text-primary dark:text-white block">Admin</span>
                                        <span className="text-xs text-text-muted dark:text-gray-400">System Admin</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-text-muted dark:text-gray-400" />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-elevated py-2 animate-fade-in">
                                        <Link
                                            href="/admin/settings"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <User className="w-4 h-4" />
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/admin/settings"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                        <Link
                                            href="/"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-accent hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
