"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, Users, Shield, Check, AlertCircle, User } from "lucide-react"
import Image from "next/image"
import ModalWrapper from "./ModalWrapper"
import { jwtDecode } from "jwt-decode"
import api from "@/app/api/axios"

const TeamCreationModal = ({ isOpen, onClose, activityTitle, nbrParticipant , activityID }) => {
  // Get current user ID from token
  const [userID, setUserID] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUserID(decoded.id)
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }
  }, [])

  const [teamName, setTeamName] = useState("")
  const [members, setMembers] = useState([{ name: "", email: "", id: "" }])
  const [logoPreview, setLogoPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState(false)

  // State for user suggestions
  const [allUsers, setAllUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeInputIndex, setActiveInputIndex] = useState(null)

  const fileInputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Fetch all users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const response = await api.get("/users")
      setAllUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

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
    if (members.length < nbrParticipant) {
      setMembers([...members, { name: "", email: "", id: "" }])
    }
  }

  // Handle removing a member field
  const handleRemoveMember = (index) => {
    const newMembers = [...members]
    newMembers.splice(index, 1)
    setMembers(newMembers)
  }

  // Handle member field changes and show suggestions
  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members]
    newMembers[index][field] = value
    setMembers(newMembers)

    // Only show suggestions for the name field
    if (field === "name") {
      setActiveInputIndex(index)

      if (value.trim().length > 0) {
        // Filter users based on input
        const filteredSuggestions = allUsers.filter((user) => user.username.toLowerCase().includes(value.toLowerCase()))
        setSuggestions(filteredSuggestions)
        setShowSuggestions(true)
        setActiveSuggestionIndex(-1)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }
  }

  // Handle selecting a suggestion
  const handleSelectSuggestion = (user, index) => {
    const newMembers = [...members]
    newMembers[index] = {
      name: user.username,
      email: user.email,
      id: user.id,
    }
    setMembers(newMembers)
    setShowSuggestions(false)
  }

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e, index) => {
    // Only process if suggestions are showing
    if (!showSuggestions || suggestions.length === 0) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0))
    }
    // Enter
    else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[activeSuggestionIndex], index)
    }
    // Escape
    else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  // Handle form submission
  const handleSubmit = async(e) => {
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

    if (members.length !== nbrParticipant) {
      setFormError(`Please enter ${nbrParticipant} members`)
      return
    }

    for (const member of members) {
      if (!member.name.trim()) {
        setFormError("All team members must have a name")
        return
      }
    }

    // Create team object
    const team = {
      name: teamName,
      logo: logoPreview,
      captain: { id: userID },
      members: members.map((member) => ({ id: member.id })),
    }

    console.log("Submitting team:", team)
    
    try {
      const response = await api.post(`/teams/${activityID}`,team);
      const data = response.status;
      if (data == 200) {
        setFormSuccess(true)      } 
    } catch (error) {
      console.log(error);
    }

    // Simulate form submission
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      

      // Close modal after success message
      setTimeout(() => {
        onClose()
        // Reset form
        setTeamName("")
        setMembers([{ name: "", email: "", id: "" }])
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
              <label className="block text-sm font-medium text-gray-700">Team Members: {nbrParticipant} required</label>
              {members.length < nbrParticipant && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="text-xs text-teal-600 hover:text-teal-700 transition-colors"
                >
                  + Add Member
                </button>
              )}
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
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={() => setActiveInputIndex(index)}
                      className="bg-white border border-gray-300 text-gray-800 placeholder-gray-400 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-2.5 shadow-sm"
                      placeholder="Member username"
                      autoComplete="off"
                    />

                    {/* Suggestions dropdown */}
                    {showSuggestions && activeInputIndex === index && (
                      <div
                        ref={suggestionsRef}
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200"
                      >
                        {isLoadingUsers ? (
                          <div className="px-4 py-2 text-sm text-gray-500">Loading users...</div>
                        ) : suggestions.length > 0 ? (
                          <ul className="divide-y divide-gray-100">
                            {suggestions.map((user, i) => (
                              <li
                                key={user.id}
                                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 ${
                                  i === activeSuggestionIndex ? "bg-teal-50" : ""
                                }`}
                                onClick={() => handleSelectSuggestion(user, index)}
                                onMouseEnter={() => setActiveSuggestionIndex(i)}
                              >
                                <div className="flex items-center">
                                  <div className="flex-shrink-0">
                                    <User className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">No users found</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                      className="bg-white border border-gray-300 text-gray-800 placeholder-gray-400 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 shadow-sm"
                      placeholder="Email (optional)"
                      readOnly={member.id !== ""}
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

