"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { jwtDecode } from "jwt-decode"
import api from "@/app/api/axios"
import Image from "next/image"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Upload,
  Shield,
  Award,
  Clock,
  CheckCircle,
  Trophy,
  Users,
  AlertCircle,
} from "lucide-react"

const Profile = () => {
  // State for user data
  const [user, setUser] = useState({})
  const [currentUserId, setCurrentUserId] = useState(null)

  // State for form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    birthDate: "",
  })

  // State for edit mode and form status
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState("")

  // Get current user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setCurrentUserId(decoded.id)
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }
  }, [])

  // Fetch user data when ID is available
  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUserId) return

      try {
        const response = await api.get(`/users/${currentUserId}`)
        setUser(response.data)

        // Format date for the input field if it exists
        let formattedDate = ""
        if (response.data.birthDate) {
          const date = new Date(response.data.birthDate)
          formattedDate = date.toISOString().split("T")[0]
        }

        setFormData({
          username: response.data.username || "",
          email: response.data.email || "",
          phoneNumber: response.data.phoneNumber || "",
          address: response.data.address || "",
          birthDate: formattedDate,
        })
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [currentUserId])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Update the handleSubmit function to properly handle both form submission and button click
  const handleSubmit = async (e) => {
    // Check if e exists (it will when called from form submission, but not from button click)
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    setIsLoading(true)
    setSaveSuccess(false)
    setSaveError("")

    try {
      // Create user object with only the fields we want to update
      const updatedUser = {
        username: formData.username,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
      }

      // Send PATCH request to update profile
      const response = await api.patch(`/users/profile/${currentUserId}`, updatedUser)

      // Update local user state with response data
      setUser(response.data)
      setSaveSuccess(true)
      setIsEditing(false)

      // Show success message for 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setSaveError(error.response?.data || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the button onClick handler to use a separate function
  // This way we avoid the preventDefault issue when clicking the button
  const handleButtonClick = () => {
    if (isEditing) {
      handleSubmit()
    } else {
      setIsEditing(true)
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto">
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your personal information and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Profile image and basic info */}
            <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 animate-pulse"></div>
                <Image
                  src="/images/badr.jpg"
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-white dark:border-gray-800 object-cover relative z-10"
                />
                <button className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-200">
                  <Upload className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.username || "User"}</h2>
              <p className="text-gray-500 dark:text-gray-400">Premium Member</p>

              <div className="flex justify-center mt-4 space-x-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 rounded-full text-xs font-medium">
                  Gold Tier
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full text-xs font-medium">
                  Team Captain
                </span>
              </div>
            </div>

            {/* Membership info */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-teal-500" />
                Membership Info
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Status</span>
                  <span className="text-green-500 font-medium flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Member Since</span>
                  <span className="text-gray-800 dark:text-gray-200">Jan 2022</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Renewal Date</span>
                  <span className="text-gray-800 dark:text-gray-200">Jan 2024</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Loyalty Points</span>
                  <span className="text-teal-500 font-bold">1,250</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">250 points until next tier upgrade</p>
              </div>
            </div>

            {/* Recent achievements */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-teal-500" />
                Recent Achievements
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg mr-3">
                    <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Tournament MVP</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Oct 15, 2023</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Team Captain</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sep 28, 2023</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Perfect Attendance</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aug 10, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile form */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Personal Information</h2>
              <button
                onClick={handleButtonClick}
                className={`flex items-center px-4 py-2 rounded-lg text-white ${
                  isEditing ? "bg-green-500 hover:bg-green-600" : "bg-teal-500 hover:bg-teal-600"
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
                ) : isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
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

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg ${
                        isEditing
                          ? "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          : "bg-gray-100 dark:bg-gray-800 border-none"
                      } text-gray-800 dark:text-white`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled={true} // Email should not be editable
                      className="block w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none text-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg ${
                        isEditing
                          ? "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          : "bg-gray-100 dark:bg-gray-800 border-none"
                      } text-gray-800 dark:text-white`}
                      placeholder="+212 xxxxxxxxx"
                    />
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Birth Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg ${
                        isEditing
                          ? "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          : "bg-gray-100 dark:bg-gray-800 border-none"
                      } text-gray-800 dark:text-white`}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg ${
                        isEditing
                          ? "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          : "bg-gray-100 dark:bg-gray-800 border-none"
                      } text-gray-800 dark:text-white`}
                      placeholder="Your full address"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Preferences</h3>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="emailNotifications"
                      type="checkbox"
                      disabled={!isEditing}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Email notifications for upcoming events
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="smsNotifications"
                      type="checkbox"
                      disabled={!isEditing}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      SMS notifications for important updates
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="publicProfile"
                      type="checkbox"
                      disabled={!isEditing}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor="publicProfile" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Make my profile public to other club members
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit button - only visible when editing */}
              {isEditing && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Profile

