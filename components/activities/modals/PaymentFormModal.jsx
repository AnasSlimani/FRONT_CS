"use client"

import { useState, useEffect } from "react"
import { CreditCard, User, Check, AlertCircle } from "lucide-react"
import ModalWrapper from "./ModalWrapper"
import api from "@/app/api/axios"
import { jwtDecode } from "jwt-decode"

const PaymentFormModal = ({ isOpen, onClose, activityTitle , activityID }) => {
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState(false)
  let userID ;
  let roleToken; 
  const [formData, setFormData] = useState({
    type: "INDIVIDUAL",
    participant: {
      id: "",
      role : "",
      idCard: "",
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the field is in the participant object
    if (name in formData.participant) {
      setFormData(prev => ({
        ...prev,
        participant: {
          ...prev.participant,
          [name]: value
        }
      }));
    } else {
      // For top-level fields (though you don't have any in your current form)
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }

  useEffect(() => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const decoded = jwtDecode(token)
          // userID = decoded.id;
          // roleToken = decoded.role;
          setFormData({
            type: "INDIVIDUAL",
            participant: {
              id: decoded.id,
              role : decoded.role,
              idCard: "",
            }
          })
        } catch (error) {
          console.error("Error decoding token:", error)
        }
      }
    }, [])

   

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

   
    if (!formData.idCard.trim()) {
      setFormError("ID card number is required")
      return
    }

 

    // Simulate form submission
    setIsSubmitting(true)

    console.log(formData);

    try {
      
      const response = await api.post(`/activities/${activityID}/participants`, formData);      
      const status = response.status;
      if(status === 200){
        alert("Reservation completed");
      }
    } catch (error) {
      console.log(error );
      
    }


    setTimeout(() => {
      setIsSubmitting(false)
      setFormSuccess(true)

      // Close modal after success message
      setTimeout(() => {
        onClose()
        // Reset form
        setFormData({
          type: "INDIVIDUAL",
          participant: {
            id: "",
            role : "",
            idCard: "",
        }
      })
        setFormSuccess(false)
      }, 2000)
    }, 1500)

    
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="relative p-6 border-b border-gray-200">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500 rounded-full filter blur-3xl opacity-5"></div>

        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            Reserve Trip: <span className="text-teal-600">{activityTitle}</span>
          </h3>
        </div>
        <p className="text-gray-600 mt-1 text-sm">Please provide your information to secure your place</p>
      </div>

      {formSuccess ? (
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Confirmed!</h3>
          <p className="text-gray-600 text-center">
            Your place for this trip has been reserved. We'll send you the details shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6">
    

          {/* ID Card */}
          <div className="mb-4">
            <label htmlFor="idCard" className="block text-sm font-medium text-gray-700 mb-2">
              ID Card Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="idCard"
                name="idCard"
                value={formData.participant.idCard}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 placeholder-gray-400 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-3 shadow-sm"
                placeholder="Enter your ID card number"
              />
            </div>
          </div>

          

          

          {/* Payment information notice */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Payment will be collected at the club office before the trip. Please bring your ID card for verification.
            </p>
          </div>

          {/* Error message */}
          {formError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{formError}</p>
            </div>
          )}

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors mr-2 border border-gray-300 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-sm rounded-lg transition-colors flex items-center justify-center min-w-[120px] shadow-sm"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Reserve Place"
              )}
            </button>
          </div>
        </form>
      )}
    </ModalWrapper>
  )
}

export default PaymentFormModal

