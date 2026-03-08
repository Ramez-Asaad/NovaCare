"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Battery, Wifi, Clock, Bell, Settings, Home, MessageCircle, Pill, Navigation, AlertTriangle, Heart, Music, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui";

const navItems = [
  { href: "/rover", label: "Home", icon: Home },
  { href: "/rover/talk", label: "Talk", icon: MessageCircle },
  { href: "/rover/medications", label: "Medications", icon: Pill },
  { href: "/rover/navigate", label: "Navigate", icon: Navigation },
  { href: "/rover/emergency", label: "Emergency", icon: AlertTriangle },
  { href: "/rover/health", label: "Health", icon: Heart },
  { href: "/rover/entertainment", label: "Entertainment", icon: Music },
  { href: "/rover/settings", label: "Settings", icon: Settings },
  { href: "/rover/help", label: "Help", icon: HelpCircle },
];

export default function RoverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 flex flex-col transition-colors">
      {/* Status Bar - Rover specific */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left - Time */}
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-text-primary dark:text-white">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-lg text-text-muted dark:text-gray-400">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Center - NovaCare Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-2xl font-display font-bold text-primary">NovaCare</span>
          </div>

          {/* Right - Status Icons */}
          <div className="flex items-center gap-4">
            <ThemeToggle variant="icon" />
            <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Bell className="w-6 h-6 text-text-secondary dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-accent rounded-full" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-success-50 dark:bg-success-900/30 rounded-xl">
              <Wifi className="w-5 h-5 text-success" />
              <span className="text-sm font-medium text-success">Connected</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
              <Battery className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">85%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation - Large Touch Targets */}
      <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex justify-center gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isEmergency = item.href === "/rover/emergency";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rover-btn flex flex-col items-center justify-center gap-2 min-w-[80px] px-4 py-3 rounded-2xl transition-all",
                  isActive && !isEmergency && "bg-primary text-white",
                  !isActive && !isEmergency && "bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600",
                  isEmergency && "bg-accent text-white hover:bg-accent-600"
                )}
              >
                <item.icon className="w-7 h-7" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
