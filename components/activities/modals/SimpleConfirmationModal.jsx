"use client"

import { useState, useEffect } from "react"
import { Check, AlertCircle, Loader } from "lucide-react"
import ModalWrapper from "./ModalWrapper"
import { jwtDecode } from "jwt-decode"
import api from "@/app/api/axios"

const SimpleConfirmationModal = ({ isOpen, onClose, activityTitle, message, activityId }) => {
  // Add state to track whether the user has confirmed
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState(null)
  const [userRole, setUserRole] = useState(null)

  // Get user ID from token when modal opens
  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const decoded = jwtDecode(token)
          setUserId(decoded.id)
          setUserRole(decoded.role)
        } catch (error) {
          console.error("Error decoding token:", error)
          setError("Authentication error. Please try logging in again.")
        }
      }
    }
  }, [isOpen])

  // Handle confirmation and API call
  const handleConfirm = async () => {
    if (!userId) {
      setError("You must be logged in to participate")
      return
    }

    if (!activityId) {
      setError("Activity ID is missing. Please try again.")
      console.error("Activity ID is undefined:", activityId)
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      console.log("Submitting participation for activity:", activityId)

      // Create user object to send to backend
      const userData = {
        id: userId,
        role: userRole,
        idCard: "", // Not required for billard tournaments and friendly matches
      }

      // Make API call to add user as individual participant
      const response = await api.post(`/activities/${activityId}/individual`, userData)

      if (response.status === 200) {
        setIsConfirmed(true)
      } else {
        throw new Error("Failed to register participation")
      }
    } catch (error) {
      console.error("Error registering participation:", error)
      setError(error.response?.data || "Failed to register participation. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle close and reset state
  const handleClose = () => {
    onClose()
    // Reset the confirmation state after modal is closed
    setTimeout(() => {
      setIsConfirmed(false)
      setError("")
    }, 300)
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose}>
      {!isConfirmed ? (
        // Confirmation step
        <>
          <div className="relative p-6 border-b border-gray-200">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500 rounded-full filter blur-3xl opacity-5"></div>

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Confirmation</h3>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6 flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <p className="text-gray-700 text-center mb-8">
              Are you sure you want to participate in the{" "}
              <span className="font-semibold text-teal-600">{activityTitle}</span>?
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors border border-gray-300 shadow-sm"
                disabled={isSubmitting}
              >
                Close
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center min-w-[100px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Processing...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </>
      ) : (
        // Success step - matches the provided image
        <>
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirmation</h3>
            <p className="text-gray-600 text-center mb-6">{message || "Your place is reserved successfully!"}</p>

            <button
              onClick={handleClose}
              className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-lg transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </>
      )}
    </ModalWrapper>
  )
}

export default SimpleConfirmationModal
