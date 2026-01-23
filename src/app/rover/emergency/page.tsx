"use client";

import { useState } from "react";
import { AlertTriangle, Phone, Video, MessageCircle, X, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  available: boolean;
}

const emergencyContacts: Contact[] = [
  { id: "guardian", name: "Emma Johnson", role: "Guardian", phone: "+1 (555) 234-5678", available: true },
  { id: "doctor", name: "Dr. Michael Chen", role: "Primary Doctor", phone: "+1 (555) 345-6789", available: true },
  { id: "nurse", name: "Nurse Sarah", role: "Home Nurse", phone: "+1 (555) 456-7890", available: false },
  { id: "emergency", name: "Emergency Services", role: "911", phone: "911", available: true },
];

type EmergencyState = "idle" | "calling" | "connected" | "help-requested";

export default function EmergencyPage() {
  const [state, setState] = useState<EmergencyState>("idle");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [countDown, setCountDown] = useState(5);

  const handleEmergencyPress = () => {
    setState("calling");
    
    // Simulate countdown
    let count = 5;
    const interval = setInterval(() => {
      count--;
      setCountDown(count);
      if (count === 0) {
        clearInterval(interval);
        setState("help-requested");
      }
    }, 1000);
  };

  const cancelEmergency = () => {
    setState("idle");
    setCountDown(5);
  };

  const callContact = (contact: Contact) => {
    setSelectedContact(contact);
    setState("calling");
    
    // Simulate connection
    setTimeout(() => {
      setState("connected");
    }, 2000);
  };

  const endCall = () => {
    setState("idle");
    setSelectedContact(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Idle State */}
      {state === "idle" && (
        <>
          {/* Emergency Button */}
          <div className="bg-accent-50 dark:bg-accent-900/30 rounded-3xl p-8 border-2 border-accent">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-accent mb-2">Emergency Help</h1>
              <p className="text-lg text-text-secondary dark:text-gray-300">
                Press the button below or call a contact for immediate assistance
              </p>
            </div>

            <button
              onClick={handleEmergencyPress}
              className="w-full py-12 bg-gradient-to-br from-accent to-accent-600 rounded-3xl text-white flex flex-col items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
            >
              <AlertTriangle className="w-20 h-20" />
              <span className="text-3xl font-bold">EMERGENCY</span>
              <span className="text-xl opacity-80">Press & Hold for Help</span>
            </button>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-text-primary dark:text-white">Emergency Contacts</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="p-6 flex items-center gap-4">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold",
                    contact.id === "emergency" ? "bg-accent text-white" : "bg-primary-100 dark:bg-primary-900/50 text-primary"
                  )}>
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-text-primary dark:text-white">{contact.name}</h3>
                    <p className="text-text-muted dark:text-gray-400">{contact.role}</p>
                    {!contact.available && (
                      <span className="text-sm text-accent">Currently unavailable</span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => callContact(contact)}
                      disabled={!contact.available}
                      className={cn(
                        "rover-btn w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                        contact.available
                          ? "bg-success text-white hover:bg-success-600"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <Phone className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => callContact(contact)}
                      disabled={!contact.available || contact.id === "emergency"}
                      className={cn(
                        "rover-btn w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                        contact.available && contact.id !== "emergency"
                          ? "bg-primary text-white hover:bg-primary-600"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <Video className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back to Home */}
          <Link
            href="/rover"
            className="block w-full py-4 px-6 rounded-2xl bg-gray-100 dark:bg-gray-800 text-center text-text-secondary dark:text-gray-300 text-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </>
      )}

      {/* Calling State */}
      {state === "calling" && !selectedContact && (
        <div className="fixed inset-0 bg-accent flex flex-col items-center justify-center p-8 z-50">
          <div className="text-center text-white">
            <AlertTriangle className="w-24 h-24 mx-auto mb-6 animate-pulse" />
            <h1 className="text-4xl font-bold mb-4">Calling for Help</h1>
            <p className="text-2xl opacity-80 mb-8">
              Help will arrive in {countDown} seconds
            </p>
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.3)" strokeWidth="8" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={352}
                  strokeDashoffset={(352 * (5 - countDown)) / 5}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-5xl font-bold">
                {countDown}
              </span>
            </div>
            <button
              onClick={cancelEmergency}
              className="px-12 py-4 bg-white text-accent text-xl font-bold rounded-2xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Help Requested State */}
      {state === "help-requested" && (
        <div className="fixed inset-0 bg-success flex flex-col items-center justify-center p-8 z-50">
          <div className="text-center text-white">
            <CheckCircle className="w-24 h-24 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Help is on the Way!</h1>
            <p className="text-2xl opacity-80 mb-4">
              Your guardian and medical team have been notified
            </p>
            <p className="text-xl opacity-60 mb-8">
              Stay calm. Someone will be with you shortly.
            </p>
            <div className="space-y-4">
              <p className="text-lg">📞 Emma Johnson is calling back...</p>
              <button
                onClick={() => setState("idle")}
                className="px-12 py-4 bg-white text-success text-xl font-bold rounded-2xl hover:bg-gray-100 transition-colors"
              >
                I'm Okay Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Calling State */}
      {state === "calling" && selectedContact && (
        <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center p-8 z-50">
          <div className="text-center text-white">
            <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-16 h-16 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Calling...</h1>
            <p className="text-2xl">{selectedContact.name}</p>
            <p className="text-lg opacity-60 mb-8">{selectedContact.role}</p>
            <button
              onClick={endCall}
              className="w-20 h-20 bg-accent rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors"
            >
              <X className="w-10 h-10" />
            </button>
          </div>
        </div>
      )}

      {/* Connected State */}
      {state === "connected" && selectedContact && (
        <div className="fixed inset-0 bg-gradient-to-b from-primary to-primary-800 flex flex-col p-8 z-50">
          <div className="flex-1 flex flex-col items-center justify-center text-white">
            <div className="w-40 h-40 mb-6 bg-white/20 rounded-full flex items-center justify-center text-6xl font-bold">
              {selectedContact.name.charAt(0)}
            </div>
            <h1 className="text-3xl font-bold mb-2">{selectedContact.name}</h1>
            <p className="text-lg opacity-80 mb-2">{selectedContact.role}</p>
            <p className="text-success text-xl flex items-center gap-2">
              <span className="w-3 h-3 bg-success rounded-full animate-pulse" />
              Connected
            </p>
          </div>
          <div className="flex justify-center gap-6">
            <button className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={endCall}
              className="w-20 h-20 bg-accent rounded-full flex items-center justify-center"
            >
              <Phone className="w-10 h-10 text-white rotate-[135deg]" />
            </button>
            <button className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Video className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
