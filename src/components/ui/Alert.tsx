"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, CheckCircle, Info, X } from "lucide-react";

interface AlertProps {
  type: "success" | "warning" | "error" | "info";
  title: string;
  message?: string;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({ type, title, message, onDismiss, className }: AlertProps) {
  const styles = {
    success: {
      container: "bg-success-50 border-success-200",
      icon: "text-success",
      title: "text-success-800",
      message: "text-success-700",
    },
    warning: {
      container: "bg-secondary-50 border-secondary-200",
      icon: "text-secondary-600",
      title: "text-secondary-800",
      message: "text-secondary-700",
    },
    error: {
      container: "bg-accent-50 border-accent-200",
      icon: "text-accent",
      title: "text-accent-800",
      message: "text-accent-700",
    },
    info: {
      container: "bg-primary-50 border-primary-200",
      icon: "text-primary",
      title: "text-primary-800",
      message: "text-primary-700",
    },
  };

  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];
  const style = styles[type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border",
        style.container,
        className
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", style.icon)} />
      <div className="flex-1">
        <p className={cn("font-medium", style.title)}>{title}</p>
        {message && (
          <p className={cn("text-sm mt-1", style.message)}>{message}</p>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4 text-text-muted" />
        </button>
      )}
    </div>
  );
}
