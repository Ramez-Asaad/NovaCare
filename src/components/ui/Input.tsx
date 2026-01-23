"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted dark:text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 outline-none transition-all duration-200",
              "text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-gray-500",
              leftIcon && "pl-12",
              (rightIcon || isPassword) && "pr-12",
              error
                ? "border-accent focus:border-accent focus:ring-2 focus:ring-accent/20"
                : success
                ? "border-success focus:border-success focus:ring-2 focus:ring-success/20"
                : "border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted dark:text-gray-400 hover:text-text-secondary dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          {!isPassword && rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted dark:text-gray-400">
              {rightIcon}
            </div>
          )}
          {success && !isPassword && !rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-success">
              <Check className="w-5 h-5" />
            </div>
          )}
          {error && !isPassword && !rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-accent">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn("mt-2 text-sm", error ? "text-accent" : "text-text-muted dark:text-gray-400")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
