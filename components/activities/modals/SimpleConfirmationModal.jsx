"use client"

import { useState } from "react"
import { Check, AlertCircle } from "lucide-react"
import ModalWrapper from "./ModalWrapper"

const SimpleConfirmationModal = ({ isOpen, onClose, activityTitle, message }) => {
  // Add state to track whether the user has confirmed
  const [isConfirmed, setIsConfirmed] = useState(false)

  // Handle confirmation
  const handleConfirm = () => {
    setIsConfirmed(true)
  }

  // Handle close and reset state
  const handleClose = () => {
    onClose()
    // Reset the confirmation state after modal is closed
    setTimeout(() => {
      setIsConfirmed(false)
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

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors border border-gray-300 shadow-sm"
              >
                Close
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-sm rounded-lg transition-colors shadow-sm"
              >
                Confirm
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

