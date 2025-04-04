"use client"

import { useState, useRef } from "react"
import { Upload, Users, Shield, Check, AlertCircle } from "lucide-react"
import Image from "next/image"
import ModalWrapper from "./ModalWrapper"

const TeamCreationModal = ({ isOpen, onClose, activityTitle }) => {
  const [teamName, setTeamName] = useState("")
  const [members, setMembers] = useState([{ name: "", email: "" }])
  const [logoPreview, setLogoPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState(false)

  const fileInputRef = useRef(null)

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle adding a new member field
  const handleAddMember = () => {
    setMembers([...members, { name: "", email: "" }])
  }

  // Handle removing a member field
  const handleRemoveMember = (index) => {
    const newMembers = [...members]
    newMembers.splice(index, 1)
    setMembers(newMembers)
  }

  // Handle member field changes
  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members]
    newMembers[index][field] = value
    setMembers(newMembers)
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError("")

    // Validate form
    if (!teamName.trim()) {
      setFormError("Team name is required")
      return
    }

    if (!logoPreview) {
      setFormError("Team logo is required")
      return
    }

    if (members.length < 1) {
      setFormError("At least one team member is required")
      return
    }

    for (const member of members) {
      if (!member.name.trim()) {
        setFormError("All team members must have a name")
        return
      }
    }

    // Simulate form submission
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setFormSuccess(true)

      // Close modal after success message
      setTimeout(() => {
        onClose()
        // Reset form
        setTeamName("")
        setMembers([{ name: "", email: "" }])
        setLogoPreview(null)
        setFormSuccess(false)
      }, 2000)
    }, 1500)
  }

  const modalContent = (
    <>
      {/* Modal header */}
      <div className="relative p-6 border-b border-gray-200">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500 rounded-full filter blur-3xl opacity-5"></div>

        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            Join Tournament: <span className="text-teal-600">{activityTitle}</span>
          </h3>
        </div>
        <p className="text-gray-600 mt-1 text-sm">Create your team to participate in this tournament</p>
      </div>

      {/* Form content */}
      {formSuccess ? (
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Team Created Successfully!</h3>
          <p className="text-gray-600 text-center">Your team has been registered for the tournament. Good luck!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6">
          {/* Team name input */}
          <div className="mb-6">
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
              Team Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="bg-white border border-gray-300 text-gray-800 placeholder-gray-400 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-3 shadow-sm"
                placeholder="Enter your team name"
              />
            </div>
          </div>

          {/* Logo upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Logo</label>
            <div className="flex items-center space-x-4">
              <div
                className={`w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                  logoPreview ? "border-teal-500/50" : "border-gray-300 hover:border-gray-400"
                } bg-gray-50`}
                onClick={() => fileInputRef.current.click()}
              >
                {logoPreview ? (
                  <div className="relative w-full h-full overflow-hidden rounded-lg">
                    <Image
                      src={logoPreview || "/placeholder.svg"}
                      alt="Team logo preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors w-full flex items-center justify-center border border-gray-300 shadow-sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {logoPreview ? "Change Logo" : "Upload Logo"}
                </button>
                <p className="text-xs text-gray-500 mt-2">Recommended: Square image, at least 200x200px</p>
              </div>
            </div>
          </div>

          {/* Team members */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Team Members</label>
              <button
                type="button"
                onClick={handleAddMember}
                className="text-xs text-teal-600 hover:text-teal-700 transition-colors"
              >
                + Add Member
              </button>
            </div>

            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                      className="bg-white border border-gray-300 text-gray-800 placeholder-gray-400 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-2.5 shadow-sm"
                      placeholder="Member name"
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                      className="bg-white border border-gray-300 text-gray-800 placeholder-gray-400 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 shadow-sm"
                      placeholder="Email (optional)"
                    />
                  </div>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="p-2.5 text-gray-500 hover:text-gray-700 transition-colors hover:bg-gray-100 rounded-lg border border-gray-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Add all team members who will participate in the tournament</p>
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
                "Create Team"
              )}
            </button>
          </div>
        </form>
      )}
    </>
  )

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      {modalContent}
    </ModalWrapper>
  )
}

export default TeamCreationModal

