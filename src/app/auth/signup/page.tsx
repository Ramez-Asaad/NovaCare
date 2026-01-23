"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Mail, Lock, User, Phone, Check, QrCode, ArrowLeft, ArrowRight, Shield, Stethoscope, Users } from "lucide-react";
import { Button, Input, Card, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/utils";

type AccountType = "guardian" | "medical" | null;

interface FormData {
  accountType: AccountType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  patientCode: string;
  patientId: string;
  verificationCode: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    accountType: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    patientCode: "",
    patientId: "",
    verificationCode: "",
    agreeTerms: false,
    agreePrivacy: false,
  });

  const updateFormData = (field: keyof FormData, value: string | boolean | AccountType) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const strengthColors = ["danger", "danger", "warning", "success", "success"] as const;

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.accountType !== null;
      case 2:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.password &&
          formData.password === formData.confirmPassword &&
          passwordStrength >= 3
        );
      case 3:
        if (formData.accountType === "guardian") {
          return formData.patientCode && formData.agreeTerms && formData.agreePrivacy;
        }
        return (
          formData.patientId &&
          formData.verificationCode &&
          formData.agreeTerms &&
          formData.agreePrivacy
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push(formData.accountType === "guardian" ? "/guardian" : "/medical");
  };

  return (
    <div className="min-h-screen gradient-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-text-primary dark:text-white">NovaCare</span>
          </Link>
          <Link
            href="/auth/login"
            className="text-sm text-text-muted dark:text-gray-400 hover:text-primary transition-colors"
          >
            Already have an account? <span className="font-semibold text-primary">Sign In</span>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary dark:text-gray-300">Step {step} of 3</span>
            <span className="text-sm text-text-muted dark:text-gray-400">
              {step === 1 && "Choose Account Type"}
              {step === 2 && "Personal Information"}
              {step === 3 && "Connect Patient"}
            </span>
          </div>
          <ProgressBar value={step} max={3} variant="primary" size="md" />
        </div>

        {/* Form Card */}
        <Card variant="elevated" padding="lg" className="animate-fade-in">
          {/* Step 1: Account Type */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white mb-2">
                Choose Your Account Type
              </h2>
              <p className="text-text-muted dark:text-gray-400 mb-8">
                Select the role that best describes how you&apos;ll be using NovaCare
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => updateFormData("accountType", "guardian")}
                  className={cn(
                    "p-6 rounded-2xl border-2 text-left transition-all",
                    formData.accountType === "guardian"
                      ? "border-primary bg-primary-50 dark:bg-primary-900/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  <div className="w-14 h-14 rounded-xl bg-secondary-100 dark:bg-secondary-900/50 flex items-center justify-center mb-4">
                    <Users className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">Guardian</h3>
                  <p className="text-sm text-text-muted dark:text-gray-400">
                    Family member or caregiver monitoring and supporting a loved one
                  </p>
                  {formData.accountType === "guardian" && (
                    <div className="mt-4 flex items-center gap-2 text-primary font-medium">
                      <Check className="w-5 h-5" />
                      Selected
                    </div>
                  )}
                </button>

                <button
                  onClick={() => updateFormData("accountType", "medical")}
                  className={cn(
                    "p-6 rounded-2xl border-2 text-left transition-all",
                    formData.accountType === "medical"
                      ? "border-primary bg-primary-50 dark:bg-primary-900/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                    <Stethoscope className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">
                    Medical Professional
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400">
                    Doctor, nurse, or healthcare provider managing patient care
                  </p>
                  {formData.accountType === "medical" && (
                    <div className="mt-4 flex items-center gap-2 text-primary font-medium">
                      <Check className="w-5 h-5" />
                      Selected
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white mb-2">
                Personal Information
              </h2>
              <p className="text-text-muted dark:text-gray-400 mb-8">
                Tell us a bit about yourself to create your secure account
              </p>

              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    leftIcon={<User className="w-5 h-5" />}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  leftIcon={<Mail className="w-5 h-5" />}
                />

                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  leftIcon={<Phone className="w-5 h-5" />}
                  helperText="For emergency alerts and verification"
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  leftIcon={<Lock className="w-5 h-5" />}
                />
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-muted dark:text-gray-400">Password strength</span>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          passwordStrength <= 1
                            ? "text-accent"
                            : passwordStrength <= 2
                            ? "text-secondary"
                            : "text-success"
                        )}
                      >
                        {strengthLabels[passwordStrength - 1] || "Too Weak"}
                      </span>
                    </div>
                    <ProgressBar
                      value={passwordStrength}
                      max={5}
                      variant={strengthColors[passwordStrength - 1] || "danger"}
                      size="sm"
                    />
                  </div>
                )}

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  leftIcon={<Lock className="w-5 h-5" />}
                  error={
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "Passwords do not match"
                      : undefined
                  }
                  success={
                    formData.confirmPassword && formData.password === formData.confirmPassword
                  }
                />
              </div>
            </div>
          )}

          {/* Step 3: Connect Patient */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white mb-2">
                Connect to Patient
              </h2>
              <p className="text-text-muted dark:text-gray-400 mb-8">
                {formData.accountType === "guardian"
                  ? "Enter the patient code provided to you or scan the QR code on the NovaCare rover"
                  : "Enter the patient's ID and verification code provided by the patient or guardian"}
              </p>

              <div className="space-y-6">
                {formData.accountType === "guardian" ? (
                  <>
                    <Input
                      label="Patient Code"
                      placeholder="NOVA-XXXX-XXXX"
                      value={formData.patientCode}
                      onChange={(e) => updateFormData("patientCode", e.target.value.toUpperCase())}
                      helperText="This code is displayed on the NovaCare rover or provided by the medical team"
                    />
                    <div className="text-center">
                      <div className="text-text-muted dark:text-gray-400 text-sm mb-4">or</div>
                      <Button variant="outline" leftIcon={<QrCode className="w-5 h-5" />}>
                        Scan QR Code
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Input
                      label="Patient ID"
                      placeholder="Enter Patient ID"
                      value={formData.patientId}
                      onChange={(e) => updateFormData("patientId", e.target.value)}
                      helperText="The unique patient identifier in your medical system"
                    />
                    <Input
                      label="Verification Code"
                      placeholder="6-digit code"
                      value={formData.verificationCode}
                      onChange={(e) => updateFormData("verificationCode", e.target.value)}
                      helperText="Code provided by the patient or their guardian for authorization"
                    />
                  </>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => updateFormData("agreeTerms", e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text-secondary dark:text-gray-300">
                      I agree to NovaCare&apos;s{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreePrivacy}
                      onChange={(e) => updateFormData("agreePrivacy", e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text-secondary dark:text-gray-300">
                      I have read and accept the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>{" "}
                      and consent to data processing
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)} leftIcon={<ArrowLeft className="w-5 h-5" />}>
                Back
              </Button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed()} isLoading={isLoading}>
                Create Account
              </Button>
            )}
          </div>
        </Card>

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
  );
}
