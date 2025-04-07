"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit,
  Save,
  Upload,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"

export default function ProfilAdmin({ user }) {
  // State for form data
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // State for edit mode and form status
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSaveSuccess(false)
    setSaveError("")

    try {
      // In a real app, you would call your API to update the profile
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful update
      setSaveSuccess(true)
      setIsEditingProfile(false)

      // Show success message for 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setSaveError("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSaveSuccess(false)
    setSaveError("")

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setSaveError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    try {
      // In a real app, you would call your API to update the password
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful update
      setSaveSuccess(true)
      setIsEditingPassword(false)

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      // Show success message for 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error updating password:", error)
      setSaveError("Failed to update password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Administrator Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile sidebar */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile image and basic info */}
            <div className="p-6 text-center border-b border-gray-200">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 animate-pulse"></div>
                <Image
                  src="/images/admin-avatar.jpg"
                  alt="Admin Profile"
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-white object-cover relative z-10"
                />
                <button className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-200">
                  <Upload className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{formData.username}</h2>
              <p className="text-gray-500">Administrator</p>

              <div className="flex justify-center mt-4">
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                  Super Admin
                </span>
              </div>
            </div>

            {/* Contact info */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-teal-500" />
                Contact Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{formData.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{formData.phoneNumber || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-teal-500" />
                Administrator Information
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-gray-800">Main Administrator</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Permissions</p>
                  <p className="text-gray-800">Full Access</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="text-gray-800">Today at 10:30</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile form */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-2">
          {/* Profile information */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className={`flex items-center px-4 py-2 rounded-lg text-white ${
                  isEditingProfile ? "bg-green-500 hover:bg-green-600" : "bg-teal-500 hover:bg-teal-600"
                } transition-colors duration-200`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : isEditingProfile ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </button>
            </div>

            {/* Success and error messages */}
            {saveSuccess && (
              <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Profile updated successfully!
              </div>
            )}

            {saveError && (
              <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {saveError}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={!isEditingProfile}
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg ${
                        isEditingProfile
                          ? "bg-white border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          : "bg-gray-100 border-none"
                      } text-gray-800`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditingProfile}
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg ${
                        isEditingProfile
                          ? "bg-white border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          : "bg-gray-100 border-none"
                      } text-gray-800`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={!isEditingProfile}
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg ${
                        isEditingProfile
                          ? "bg-white border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          : "bg-gray-100 border-none"
                      } text-gray-800`}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>
              </div>

              {/* Submit button - only visible when editing */}
              {isEditingProfile && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </motion.div>

          {/* Password change */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
              <button
                onClick={() => setIsEditingPassword(!isEditingPassword)}
                className={`flex items-center px-4 py-2 rounded-lg text-white ${
                  isEditingPassword ? "bg-green-500 hover:bg-green-600" : "bg-teal-500 hover:bg-teal-600"
                } transition-colors duration-200`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : isEditingPassword ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handlePasswordUpdate} className="p-6">
              <div className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      disabled={!isEditingPassword}
                      className={`block w-full pl-10 pr-10 py-2 rounded-lg ${
                        isEditingPassword
                          ? "bg-white border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          : "bg-gray-100 border-none"
                      } text-gray-800`}
                    />
                    {isEditingPassword && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      disabled={!isEditingPassword}
                      className={`block w-full pl-10 pr-10 py-2 rounded-lg ${
                        isEditingPassword
                          ? "bg-white border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          : "bg-gray-100 border-none"
                      } text-gray-800`}
                    />
                    {isEditingPassword && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={!isEditingPassword}
                      className={`block w-full pl-10 pr-10 py-2 rounded-lg ${
                        isEditingPassword
                          ? "bg-white border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          : "bg-gray-100 border-none"
                      } text-gray-800`}
                    />
                    {isEditingPassword && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit button - only visible when editing */}
              {isEditingPassword && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingPassword(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Update Password"}
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

