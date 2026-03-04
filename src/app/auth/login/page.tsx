"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Mail, Lock, Shield } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState<"guardian" | "medical">("guardian");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Redirect based on role
    if (role === "guardian") {
      router.push("/guardian");
    } else {
      router.push("/medical");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 gradient-bg">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-text-primary dark:text-white">NovaCare</h1>
              <p className="text-sm text-text-muted dark:text-gray-400">Empowering Independence</p>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-text-primary dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-text-secondary dark:text-gray-300">
              Sign in to continue caring for your loved ones
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
            <button
              onClick={() => setRole("guardian")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                role === "guardian"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-text-muted dark:text-gray-400 hover:text-text-secondary dark:hover:text-gray-300"
              }`}
            >
              Guardian
            </button>
            <button
              onClick={() => setRole("medical")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                role === "medical"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-text-muted dark:text-gray-400 hover:text-text-secondary dark:hover:text-gray-300"
              }`}
            >
              Medical Professional
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-secondary dark:text-gray-300">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary-800 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-text-secondary dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-primary font-semibold hover:text-primary-800">
              Sign Up
            </Link>
          </p>

          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 text-text-muted dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="text-xs">256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex w-1/2 bg-primary-700 items-center justify-center p-12">
        <div className="text-center text-white max-w-lg animate-slide-up">
          <div className="text-9xl mb-8">🤖</div>
          <h2 className="text-4xl font-display font-bold mb-4">
            Care With Confidence
          </h2>
          <p className="text-primary-100 text-lg">
            NovaCare provides 24/7 intelligent assistance, ensuring your loved ones 
            are safe, healthy, and connected.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-primary-200">Monitoring</div>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-sm text-primary-200">Uptime</div>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur">
              <div className="text-3xl font-bold">1M+</div>
              <div className="text-sm text-primary-200">Alerts Sent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
