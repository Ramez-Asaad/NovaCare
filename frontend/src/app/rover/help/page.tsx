"use client";

import { useState } from "react";
import { HelpCircle, MessageCircle, Phone, Play, ChevronRight, ArrowLeft, Search, BookOpen, Video, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tutorials = [
  {
    id: 1,
    title: "Getting Started with NovaCare",
    description: "Learn the basics of your assistant rover",
    duration: "5 min",
    completed: true,
    icon: "🚀",
  },
  {
    id: 2,
    title: "Using Voice Commands",
    description: "Talk to Nova using your voice",
    duration: "3 min",
    completed: true,
    icon: "🎤",
  },
  {
    id: 3,
    title: "Managing Medications",
    description: "View and track your medication schedule",
    duration: "4 min",
    completed: false,
    icon: "💊",
  },
  {
    id: 4,
    title: "Navigation Features",
    description: "Let Nova guide you around your home",
    duration: "4 min",
    completed: false,
    icon: "🗺️",
  },
  {
    id: 5,
    title: "Emergency Help",
    description: "How to get help when you need it",
    duration: "2 min",
    completed: false,
    icon: "🆘",
  },
];

const faqs = [
  {
    question: "How do I call my guardian?",
    answer: "Say 'Hey Nova, call my guardian' or tap the Talk button and ask Nova to make a call.",
  },
  {
    question: "What if I miss a medication?",
    answer: "Nova will remind you with an alert. You can mark it as taken when you take it.",
  },
  {
    question: "How do I use the Emergency button?",
    answer: "Press and hold the red Emergency button for 3 seconds. Your guardian and medical team will be notified immediately.",
  },
  {
    question: "Can Nova understand sign language?",
    answer: "Yes! Enable Sign Language Input in Settings, and Nova will use the camera to understand your signs.",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/rover"
          className="rover-btn w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-text-secondary dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary dark:text-white">Help & Tutorials</h1>
          <p className="text-text-muted dark:text-gray-400">Learn how to use NovaCare</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted dark:text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search help topics..."
          className="w-full pl-16 pr-6 py-5 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      {/* Quick Help */}
      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/rover/talk"
          className="rover-card bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-100 dark:border-primary-800 rounded-2xl p-6 text-center hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
        >
          <MessageCircle className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-primary">Ask Nova</h3>
          <p className="text-sm text-primary/70">Get instant help</p>
        </Link>
        <Link
          href="/rover/emergency"
          className="rover-card bg-accent-50 dark:bg-accent-900/30 border-2 border-accent-100 dark:border-accent-800 rounded-2xl p-6 text-center hover:bg-accent-100 dark:hover:bg-accent-900/50 transition-colors"
        >
          <Phone className="w-10 h-10 text-accent mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-accent">Call Support</h3>
          <p className="text-sm text-accent/70">Talk to a person</p>
        </Link>
        <button className="rover-card bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-100 dark:border-purple-800 rounded-2xl p-6 text-center hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
          <Video className="w-10 h-10 text-purple-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-purple-600">Video Guide</h3>
          <p className="text-sm text-purple-600/70">Watch tutorials</p>
        </button>
      </div>

      {/* Tutorials */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-text-primary dark:text-white">Tutorials</h2>
          </div>
          <span className="text-sm text-text-muted dark:text-gray-400">2 of 5 completed</span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {tutorials.map((tutorial) => (
            <button
              key={tutorial.id}
              className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-4xl">{tutorial.icon}</div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-text-primary dark:text-white">{tutorial.title}</h3>
                  {tutorial.completed && (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  )}
                </div>
                <p className="text-text-muted dark:text-gray-400">{tutorial.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-muted dark:text-gray-400">{tutorial.duration}</span>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  tutorial.completed ? "bg-success-100 dark:bg-success-900/50" : "bg-primary"
                )}>
                  <Play className={cn("w-5 h-5", tutorial.completed ? "text-success" : "text-white")} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-secondary" />
            <h2 className="text-xl font-semibold text-text-primary dark:text-white">Common Questions</h2>
          </div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full p-6 flex items-center gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="flex-1 text-lg font-medium text-text-primary dark:text-white">{faq.question}</span>
                <ChevronRight
                  className={cn(
                    "w-6 h-6 text-text-muted dark:text-gray-400 transition-transform",
                    expandedFaq === index && "rotate-90"
                  )}
                />
              </button>
              {expandedFaq === index && (
                <div className="px-6 pb-6 animate-fade-in">
                  <p className="text-text-secondary dark:text-gray-300 text-lg bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Need More Help */}
      <div className="bg-gradient-to-br from-primary to-primary-600 rounded-3xl p-8 text-center text-white">
        <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-80" />
        <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
        <p className="opacity-80 mb-6">
          Our support team is available 24/7 to assist you
        </p>
        <Link
          href="/rover/emergency"
          className="inline-block px-8 py-4 bg-white text-primary text-lg font-bold rounded-2xl hover:bg-gray-100 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
