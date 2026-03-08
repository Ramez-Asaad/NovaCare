"use client";

import { useState } from "react";
import { User, Bell, Lock, HelpCircle, Shield, Moon, Sun, Monitor, Mail, Phone, Building, FileText, ExternalLink, ChevronRight, Check, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Avatar, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "preferences", label: "Preferences", icon: Monitor },
  { id: "help", label: "Help & Support", icon: HelpCircle },
];

export default function MedicalSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState("system");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">Settings</h2>
        <p className="text-text-muted dark:text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card variant="elevated" className="lg:col-span-1 h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar name="Dr. Michael Chen" size="xl" />
                    <div>
                      <h3 className="font-semibold text-text-primary dark:text-white">Dr. Michael Chen</h3>
                      <p className="text-sm text-text-muted dark:text-gray-400">Internal Medicine</p>
                      <Button className="dark:text-white dark:hover:text-text-primary mt-2" variant="outline" size="sm" >
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="First Name" defaultValue="Michael" />
                    <Input label="Last Name" defaultValue="Chen" />
                    <Input label="Email" type="email" defaultValue="m.chen@hospital.org" leftIcon={<Mail className="w-5 h-5" />} />
                    <Input label="Phone" type="tel" defaultValue="+1 (555) 123-4567" leftIcon={<Phone className="w-5 h-5" />} />
                    <Input label="Medical License #" defaultValue="MD-12345-NY" />
                    <Input label="Specialty" defaultValue="Internal Medicine" />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Button className="dark:text-white dark:hover:text-text-primary" variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Hospital/Clinic" defaultValue="City General Hospital" leftIcon={<Building className="w-5 h-5" />} />
                    <Input label="Department" defaultValue="Internal Medicine" />
                    <Input label="NPI Number" defaultValue="1234567890" />
                    <Input label="DEA Number" defaultValue="AB1234567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">Bio</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                      rows={4}
                      defaultValue="Board-certified internist with over 15 years of experience in primary care and chronic disease management."
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: "Critical Alerts",
                    description: "Emergency notifications for assigned patients",
                    enabled: true,
                    required: true,
                  },
                  {
                    title: "Vital Sign Alerts",
                    description: "Notifications when patient vitals are abnormal",
                    enabled: true,
                  },
                  {
                    title: "Medication Reminders",
                    description: "Alerts for missed medications by patients",
                    enabled: true,
                  },
                  {
                    title: "Appointment Reminders",
                    description: "Reminders for upcoming appointments",
                    enabled: true,
                  },
                  {
                    title: "Lab Results",
                    description: "Notifications when new lab results are available",
                    enabled: false,
                  },
                  {
                    title: "Patient Messages",
                    description: "Alerts for new messages from patients/guardians",
                    enabled: true,
                  },
                  {
                    title: "System Updates",
                    description: "Updates about platform features and changes",
                    enabled: false,
                  },
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-text-primary dark:text-white">{setting.title}</h4>
                        {setting.required && (
                          <Badge variant="info" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-text-muted dark:text-gray-400 mt-1">{setting.description}</p>
                    </div>
                    <button
                      disabled={setting.required}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        setting.enabled ? "bg-primary" : "bg-gray-200 dark:bg-gray-700",
                        setting.required && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all",
                          setting.enabled ? "right-1" : "left-1"
                        )}
                      />
                    </button>
                  </div>
                ))}

                <div className="pt-4">
                  <h4 className="font-medium text-text-primary dark:text-white mb-4">Delivery Methods</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { method: "Push Notifications", enabled: true },
                      { method: "Email", enabled: true },
                      { method: "SMS", enabled: false },
                    ].map((item) => (
                      <div key={item.method} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-between">
                        <span className="text-sm text-text-secondary dark:text-gray-300">{item.method}</span>
                        {item.enabled ? (
                          <Check className="w-5 h-5 text-success" />
                        ) : (
                          <X className="w-5 h-5 text-text-muted dark:text-gray-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Current Password" type="password" placeholder="Enter current password" />
                  <Input label="New Password" type="password" placeholder="Enter new password" />
                  <Input label="Confirm New Password" type="password" placeholder="Confirm new password" />
                  <div className="flex justify-end">
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-success-50 dark:bg-success-900/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success-100 dark:bg-success-900/50 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary dark:text-white">2FA is enabled</h4>
                        <p className="text-sm text-text-muted dark:text-gray-400">Your account is protected with authenticator app</p>
                      </div>
                    </div>
                    <Button className="dark:text-white dark:hover:text-text-primary" variant="outline">Manage</Button>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { device: "MacBook Pro", location: "New York, US", current: true, lastActive: "Now" },
                    { device: "iPhone 14", location: "New York, US", current: false, lastActive: "2 hours ago" },
                    { device: "Windows Desktop", location: "Office", current: false, lastActive: "Yesterday" },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                          <Monitor className="w-5 h-5 text-text-muted dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-text-primary dark:text-white">{session.device}</h4>
                            {session.current && <Badge variant="success">Current</Badge>}
                          </div>
                          <p className="text-sm text-text-muted dark:text-gray-400">{session.location} • {session.lastActive}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button variant="outline" size="sm" className="text-accent border-accent">
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-text-primary mb-4">Appearance</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "light", icon: Sun, label: "Light" },
                      { id: "dark", icon: Moon, label: "Dark" },
                      { id: "system", icon: Monitor, label: "System" },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                          theme === option.id
                            ? "border-primary bg-primary-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <option.icon className={cn("w-6 h-6", theme === option.id ? "text-primary" : "text-text-muted")} />
                        <span className={cn("text-sm font-medium", theme === option.id ? "text-primary" : "text-text-secondary")}>
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-text-primary mb-4">Regional</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Timezone</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none dark:bg-gray-800 dark:text-white">
                        <option>America/New_York (EST)</option>
                        <option>America/Chicago (CST)</option>
                        <option>America/Los_Angeles (PST)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Date Format</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none dark:bg-gray-800 dark:text-white">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-text-primary mb-4">Dashboard</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Show critical alerts first", enabled: true },
                      { label: "Auto-refresh dashboard every 5 minutes", enabled: true },
                      { label: "Compact view for patient list", enabled: false },
                    ].map((pref, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-text-secondary">{pref.label}</span>
                        <button
                          className={cn(
                            "w-12 h-6 rounded-full transition-all relative",
                            pref.enabled ? "bg-primary" : "bg-gray-200"
                          )}
                        >
                          <span
                            className={cn(
                              "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all",
                              pref.enabled ? "right-1" : "left-1"
                            )}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Tab */}
          {activeTab === "help" && (
            <>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "User Guide", description: "Learn how to use the platform", icon: FileText },
                    { title: "FAQ", description: "Frequently asked questions", icon: HelpCircle },
                    { title: "Contact Support", description: "Get help from our team", icon: Mail },
                    { title: "Report an Issue", description: "Submit a bug report or feedback", icon: Shield },
                  ].map((item, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50  transition-all "
                    >
                      <div className="flex items-center gap-3 ">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-medium text-text-primary dark:text-white dark:border-gray-700 dark:hover:text-text-primary">{item.title}</h4>
                          <p className="text-sm text-text-muted">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-muted" />
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Need immediate help?</h3>
                  <p className="text-text-muted mb-4">Our support team is available 24/7</p>
                  <Button leftIcon={<Phone className="w-4 h-4" />}>Call Support</Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
