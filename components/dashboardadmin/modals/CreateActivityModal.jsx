"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Upload, Calendar, Clock, MapPin, Users, Info } from "lucide-react"
import api from "@/app/api/axios"

const CreateActivityModal = ({ isOpen, onClose, onActivityCreated }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    sport: "",
    date: "",
    startingDate: "",
    endingDate: "",
    time: "",
    localisation: "",
    nbrParticipants: "",
    nbrPerTeam: "",
    nbrTeams: "",
    description: "",
    image: "default-activity.jpg", // Default image
  })

  // Additional state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      // Set today's date as default for date fields
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        name: "",
        type: "",
        sport: "",
        date: today,
        startingDate: today,
        endingDate: today,
        time: "",
        localisation: "",
        nbrParticipants: "",
        nbrPerTeam: "",
        nbrTeams: "",
        description: "",
        image: "default-activity.jpg",
      })
      setError("")
      setImageFile(null)
      setImagePreview(null)
    }
  }, [isOpen])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Set image name in form data
      setFormData((prev) => ({
        ...prev,
        image: file.name,
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.name || !formData.type || !formData.date || !formData.localisation) {
        throw new Error("Please fill in all required fields")
      }

      // Prepare data for API
      const activityData = {
        name: formData.name,
        type: formData.type,
        date: formData.date,
        startingDate: formData.startingDate,
        endingDate: formData.endingDate,
        time: formData.time,
        localisation: formData.localisation,
        description: formData.description,
        image: formData.image,
        nbrParticipants: Number.parseInt(formData.nbrParticipants) || 0,
        nbrCurrentParticipants: 0,
        isTournamentFull: false,
        nbrCurrentTeam: 0,
      }

      // Add sport-specific fields for tournaments
      if (formData.type === "tournament") {
        activityData.sport = formData.sport
        activityData.nbrTeams = Number.parseInt(formData.nbrTeams) || 0

        // Add team-specific fields for team sports
        if (formData.sport === "football" || formData.sport === "basketball") {
          activityData.nbrPerTeam = Number.parseInt(formData.nbrPerTeam) || 0
        }
      }

      // Send request to create activity
      const response = await api.post("/activities", activityData)

      // Handle image upload if needed (in a real app, you'd upload to a server)
      // This is a placeholder for actual image upload logic
      if (imageFile) {
        console.log("Would upload image:", imageFile)
        // const formData = new FormData()
        // formData.append("image", imageFile)
        // await api.post("/upload-image", formData)
      }

      // Notify parent component
      if (onActivityCreated) {
        onActivityCreated(response.data)
      }

      // Close modal
      onClose()
    } catch (error) {
      console.error("Error creating activity:", error)
      setError(error.message || "Failed to create activity. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Determine if fields should be shown based on activity type and sport
  const showSportField = formData.type === "tournament"
  const showTeamFields =
    formData.type === "tournament" && (formData.sport === "football" || formData.sport === "basketball")

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-xl">
          <h2 className="text-xl font-bold">Create New Activity</h2>
          <button className="text-white hover:text-gray-200 transition-colors" onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center">
            <Info className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Activity Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter activity name"
                  required
                />
              </div>

              {/* Activity Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="tournament">Tournament</option>
                  <option value="deplacement">Trip</option>
                  <option value="matchAmical">Friendly Match</option>
                </select>
              </div>

              {/* Sport (conditional) */}
              {showSportField && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sport <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required={showSportField}
                  >
                    <option value="">Select a sport</option>
                    <option value="football">Football</option>
                    <option value="basketball">Basketball</option>
                    <option value="billard">Billiards</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              {/* Starting Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Starting Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="startingDate"
                    value={formData.startingDate}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Ending Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ending Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="endingDate"
                    value={formData.endingDate}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="localisation"
                    value={formData.localisation}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Activity location"
                    required
                  />
                </div>
              </div>

              {/* Number of participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of participants <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="nbrParticipants"
                    value={formData.nbrParticipants}
                    onChange={handleChange}
                    min="1"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Total number of participants"
                    required
                  />
                </div>
              </div>

              {/* Number of teams (conditional) */}
              {showSportField && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of teams <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="nbrTeams"
                    value={formData.nbrTeams}
                    onChange={handleChange}
                    min="2"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Number of teams"
                    required={showSportField}
                  />
                </div>
              )}

              {/* Participants per team (conditional) */}
              {showTeamFields && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Participants per team <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="nbrPerTeam"
                    value={formData.nbrPerTeam}
                    onChange={handleChange}
                    min="1"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Number of players per team"
                    required={showTeamFields}
                  />
                </div>
              )}

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="4"
                  placeholder="Activity description"
                  required
                ></textarea>
              </div>

              {/* Image upload */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-teal-500 transition-colors">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="mb-3">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="mx-auto h-32 w-auto object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}

                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-colors shadow-md flex items-center justify-center min-w-[120px]"
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
                    Creating...
                  </>
                ) : (
                  "Create Activity"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CreateActivityModal

