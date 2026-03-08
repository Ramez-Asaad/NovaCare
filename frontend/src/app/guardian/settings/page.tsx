"use client";

import { useState } from "react";
import { User, Bell, Shield, HelpCircle, ChevronRight, Mail, Phone, Lock, Eye, Volume2, Smartphone, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "help", label: "Help & Support", icon: HelpCircle },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    emergencyOnly: false,
  });

  return (
    <div className="animate-fade-in">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card variant="elevated" className="lg:col-span-1 h-fit">
          <CardContent className="p-2">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                  activeSection === section.id
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary dark:text-gray-400"
                )}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === "profile" && (
            <>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 mb-8">
                    <Avatar name="John Doe" size="xl" />
                    <div>
                      <Button className="dark:text-white dark:hover:text-text-primary" variant="outline" size="sm">
                        Change Photo
                      </Button>
                      <p className="text-sm text-text-muted mt-2">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      defaultValue="John"
                      leftIcon={<User className="w-5 h-5" />}
                    />
                    <Input
                      label="Last Name"
                      defaultValue="Doe"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      defaultValue="john.doe@email.com"
                      leftIcon={<Mail className="w-5 h-5" />}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      leftIcon={<Phone className="w-5 h-5" />}
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-w-md">
                    <Input
                      label="Current Password"
                      type="password"
                      leftIcon={<Lock className="w-5 h-5" />}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      leftIcon={<Lock className="w-5 h-5" />}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      leftIcon={<Lock className="w-5 h-5" />}
                    />
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "notifications" && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary dark:text-white">Email Notifications</p>
                      <p className="text-sm text-text-muted dark:text-gray-400">
                        Receive alerts and updates via email
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) =>
                        setNotifications({ ...notifications, email: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/50 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary dark:text-white">SMS Notifications</p>
                      <p className="text-sm text-text-muted dark:text-gray-400">
                        Receive urgent alerts via text message
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={(e) =>
                        setNotifications({ ...notifications, sms: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary dark:text-white">Push Notifications</p>
                      <p className="text-sm text-text-muted dark:text-gray-400">
                        Receive real-time alerts on your device
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) =>
                        setNotifications({ ...notifications, push: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-accent-50 dark:bg-accent-900/30 rounded-xl border border-accent-200 dark:border-accent-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/50 flex items-center justify-center">
                      <Volume2 className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary dark:text-white">Emergency Only Mode</p>
                      <p className="text-sm text-text-muted dark:text-gray-400">
                        Only receive critical emergency alerts
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emergencyOnly}
                      onChange={(e) =>
                        setNotifications({ ...notifications, emergencyOnly: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "privacy" && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-xl border border-primary-200 dark:border-primary-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <p className="font-medium text-text-primary dark:text-white">HIPAA Compliant</p>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-300">
                    All data is encrypted and stored in compliance with healthcare privacy regulations.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-text-primary dark:text-white">Data Sharing Preferences</h4>
                  
                  <label className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="font-medium text-text-primary dark:text-white">Share with Medical Team</p>
                      <p className="text-sm text-text-muted dark:text-gray-400">
                        Allow medical professionals to access patient data
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="font-medium text-text-primary dark:text-white">Anonymous Analytics</p>
                      <p className="text-sm text-text-muted dark:text-gray-400">
                        Help improve NovaCare by sharing anonymized usage data
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" className="text-accent border-accent hover:bg-accent-50 dark:hover:bg-accent-900/30">
                    Download My Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "help" && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a href="#" className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary dark:text-white">Help Center</p>
                    <p className="text-sm text-text-muted dark:text-gray-400">Browse FAQs and guides</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted dark:text-gray-400" />
                </a>

                <a href="#" className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/50 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary dark:text-white">Contact Support</p>
                    <p className="text-sm text-text-muted dark:text-gray-400">Get help from our team</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted dark:text-gray-400" />
                </a>

                <a href="#" className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary dark:text-white">Community</p>
                    <p className="text-sm text-text-muted dark:text-gray-400">Join other caregivers</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted dark:text-gray-400" />
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
