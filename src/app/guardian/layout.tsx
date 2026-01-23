"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Home,
  Pill,
  Activity,
  MessageCircle,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Badge, ThemeToggle } from "@/components/ui";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/guardian", icon: Home },
  { name: "Medications", href: "/guardian/medications", icon: Pill },
  { name: "Activity", href: "/guardian/activity", icon: Activity },
  { name: "Communication", href: "/guardian/communication", icon: MessageCircle },
  { name: "Settings", href: "/guardian/settings", icon: Settings },
];

interface GuardianLayoutProps {
  children: ReactNode;
}

export default function GuardianLayout({ children }: GuardianLayoutProps) {
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
            <Link href="/guardian" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-text-primary dark:text-white">NovaCare</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 dark:text-gray-300" />
            </button>
          </div>

          {/* Patient Info */}
          <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
              <Avatar name="Sarah Johnson" size="md" status="online" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary dark:text-white truncate">Sarah Johnson</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-success rounded-full" />
                  Online
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
              <div>
                <h1 className="text-xl font-display font-bold text-text-primary dark:text-white">
                  Caring for Sarah
                </h1>
                <p className="text-sm text-text-muted dark:text-gray-400">Last check-in: 5 minutes ago</p>
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
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Avatar name="John Doe" size="sm" />
                  <span className="hidden md:block text-sm font-medium text-text-primary dark:text-white">
                    John Doe
                  </span>
                  <ChevronDown className="w-4 h-4 text-text-muted dark:text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-elevated py-2 animate-fade-in">
                    <Link
                      href="/guardian/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      href="/guardian/settings"
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
