import Link from "next/link";
import { Heart, Shield, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-text-primary dark:text-white">NovaCare</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-text-secondary dark:text-gray-300 hover:text-primary font-medium transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-text-primary dark:text-white mb-6">
            Empowering Independence,{" "}
            <span className="text-primary">Together</span>
          </h1>
          <p className="text-xl text-text-secondary dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            NovaCare is an AI-powered assistant rover designed to aid individuals with 
            physical or sensory disabilities through intelligent, multimodal interaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-2 text-lg px-8">
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/auth/login" className="btn-outline inline-flex items-center gap-2 text-lg px-8">
              Sign In to Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="card-elevated animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-display font-semibold text-text-primary dark:text-white mb-2">
              Compassionate Care
            </h3>
            <p className="text-text-secondary dark:text-gray-400">
              24/7 monitoring with real-time vital signs tracking and medication management 
              for complete peace of mind.
            </p>
          </div>

          <div className="card-elevated animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="w-14 h-14 rounded-2xl bg-secondary-100 dark:bg-secondary-900/50 flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-display font-semibold text-text-primary dark:text-white mb-2">
              Safety First
            </h3>
            <p className="text-text-secondary dark:text-gray-400">
              Advanced fall detection, hazard alerts, and emergency response systems 
              to keep your loved ones protected.
            </p>
          </div>

          <div className="card-elevated animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="w-14 h-14 rounded-2xl bg-success-100 dark:bg-success-900/50 flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-success" />
            </div>
            <h3 className="text-xl font-display font-semibold text-text-primary dark:text-white mb-2">
              Connected Care Team
            </h3>
            <p className="text-text-secondary dark:text-gray-400">
              Seamlessly connect guardians, medical professionals, and patients 
              for coordinated, effective care.
            </p>
          </div>
        </div>

        {/* Role Selection Preview */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-display font-bold text-text-primary dark:text-white mb-4">
            Choose Your Role
          </h2>
          <p className="text-text-secondary dark:text-gray-400 mb-10">
            Access the dashboard that&apos;s right for you
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/guardian" className="card hover:shadow-elevated transition-shadow group">
              <div className="text-6xl mb-4">👨‍👩‍👧</div>
              <h3 className="text-lg font-semibold text-text-primary dark:text-white group-hover:text-primary transition-colors">
                Guardian
              </h3>
              <p className="text-sm text-text-muted dark:text-gray-400 mt-2">
                Monitor and care for your loved ones
              </p>
            </Link>

            <Link href="/medical" className="card hover:shadow-elevated transition-shadow group">
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <h3 className="text-lg font-semibold text-text-primary dark:text-white group-hover:text-primary transition-colors">
                Medical Professional
              </h3>
              <p className="text-sm text-text-muted dark:text-gray-400 mt-2">
                Manage patients and medical records
              </p>
            </Link>

            <Link href="/rover" className="card hover:shadow-elevated transition-shadow group">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-text-primary dark:text-white group-hover:text-primary transition-colors">
                Rover Interface
              </h3>
              <p className="text-sm text-text-muted dark:text-gray-400 mt-2">
                Patient touchscreen experience
              </p>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-24 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-text-primary dark:text-white">NovaCare</span>
          </div>
          <p className="text-sm text-text-muted dark:text-gray-400">
            © 2026 NovaCare. All rights reserved. HIPAA Compliant.
          </p>
          <div className="flex items-center gap-4 text-sm text-text-muted dark:text-gray-400">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
