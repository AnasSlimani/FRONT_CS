"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, CheckCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import api from "@/app/api/axios"
import { createPortal } from "react-dom"

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1) // 1: Email validation, 2: Password reset
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [mounted, setMounted] = useState(false)

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setEmail("")
      setNewPassword("")
      setConfirmPassword("")
      setError("")
      setSuccess("")
    }
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleEmailValidation = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Check if email exists
      
      const response = await api.get(`/users/email/${email}`, { public: true })
      if (response.data) {
        setStep(2)
        setSuccess("Email verified! Please enter your new password.")
      }
    } catch (error) {
      setError("Email not found. Please check your email address.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate passwords
    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post(
        "/users/reset-password",
        {
          email: email,
          newPassword: newPassword,
        },
        { public: true },
      )

      setSuccess("Password reset successfully! You can now login with your new password.")

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div className="w-full max-w-md" variants={modalVariants} onClick={(e) => e.stopPropagation()}>
            <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-white p-8 dark:bg-black relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                {step === 1 ? <Mail className="w-6 h-6 text-blue-600" /> : <Lock className="w-6 h-6 text-green-600" />}
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                  {step === 1 ? "Reset Password" : "Set New Password"}
                </h2>
              </div>

              <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                {step === 1 ? "Enter your email address to verify your account" : "Enter your new password below"}
              </p>

              {/* Success message */}
              {success && (
                <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                  <CheckCircle size={16} />
                  {success}
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">{error}</div>
              )}

              {/* Step 1: Email Validation */}
              {step === 1 && (
                <form className="my-8" onSubmit={handleEmailValidation}>
                  <LabelInputContainer className="mb-6">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      placeholder="Enter your email address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </LabelInputContainer>

                  <Button type="submit" disabled={isLoading || !email} className="w-full">
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </Button>
                </form>
              )}

              {/* Step 2: Password Reset */}
              {step === 2 && (
                <form className="my-8" onSubmit={handlePasswordReset}>
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="verified-email">Email Address</Label>
                    <Input
                      id="verified-email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    />
                  </LabelInputContainer>

                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      placeholder="Enter new password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </LabelInputContainer>

                  <LabelInputContainer className="mb-6">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      placeholder="Confirm new password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </LabelInputContainer>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading || !newPassword || !confirmPassword} className="flex-1">
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Use createPortal to render the modal at the document body level
  if (mounted && typeof document !== "undefined") {
    return createPortal(modalContent, document.body)
  }

  return null
}

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
}

export default ForgotPasswordModal
