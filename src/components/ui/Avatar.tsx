"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "resting";
  className?: string;
}

export function Avatar({ src, name, size = "md", status, className }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  const statusSizes = {
    sm: "w-2 h-2 border",
    md: "w-3 h-3 border-2",
    lg: "w-4 h-4 border-2",
    xl: "w-5 h-5 border-2",
  };

  const statusColors = {
    online: "bg-success",
    offline: "bg-gray-400",
    resting: "bg-secondary",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            "rounded-full object-cover bg-gray-200",
            sizes[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full bg-primary-100 text-primary font-semibold flex items-center justify-center",
            sizes[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-white",
            statusSizes[size],
            statusColors[status],
            status === "online" && "animate-pulse"
          )}
        />
      )}
    </div>
  );
}
