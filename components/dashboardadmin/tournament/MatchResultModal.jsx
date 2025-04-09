"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Plus, Trash2, Loader2, AlertCircle } from "lucide-react"
import api from "@/app/api/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/inpute"
import { Label } from "@/components/ui/labele"
import { Checkbox } from "@/components/ui/checkbox"

const MatchResultModal = ({ match, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    scoreTeamA: "",
    scoreTeamB: "",
    status: "scheduled",
    goalEvents: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize form data when match changes
  useEffect(() => {
    if (match) {
      setFormData({
        scoreTeamA: match.scoreTeamA !== null && match.scoreTeamA !== undefined ? match.scoreTeamA.toString() : "",
        scoreTeamB: match.scoreTeamB !== null && match.scoreTeamB !== undefined ? match.scoreTeamB.toString() : "",
        status: match.status || "scheduled",
        goalEvents: match.goalEvents || [],
      })
    }
  }, [match])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle status change
  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }))
  }

  // Add goal event
  const handleAddGoalEvent = () => {
    const newGoalEvent = {
      tempId: Date.now(), // Temporary ID for UI purposes
      scorerId: "",
      scorerName: "",
      teamId: match.teamA.id, // Default to team A
      minute: 1,
      isOwnGoal: false,
    }

    setFormData((prev) => ({
      ...prev,
      goalEvents: [...prev.goalEvents, newGoalEvent],
    }))
  }

  // Update goal event
  const handleGoalEventChange = (index, field, value) => {
    const updatedGoalEvents = [...formData.goalEvents]
    updatedGoalEvents[index] = {
      ...updatedGoalEvents[index],
      [field]: value,
    }

    setFormData((prev) => ({
      ...prev,
      goalEvents: updatedGoalEvents,
    }))
  }

  // Remove goal event
  const handleRemoveGoalEvent = (index) => {
    const updatedGoalEvents = formData.goalEvents.filter((_, i) => i !== index)

    setFormData((prev) => ({
      ...prev,
      goalEvents: updatedGoalEvents,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate scores if status is "played"
      if (formData.status === "played") {
        if (formData.scoreTeamA === "" || formData.scoreTeamB === "") {
          throw new Error("Please enter scores for both teams")
        }

        // Validate that the number of goal events matches the total score
        const totalGoals = Number.parseInt(formData.scoreTeamA) + Number.parseInt(formData.scoreTeamB)
        if (formData.goalEvents.length !== totalGoals) {
          throw new Error(
            `The number of goal events (${formData.goalEvents.length}) does not match the total score (${totalGoals})`,
          )
        }
      }

      // Prepare data for API
      const updatedMatch = {
        ...match,
        scoreTeamA: formData.status === "played" ? Number.parseInt(formData.scoreTeamA) : null,
        scoreTeamB: formData.status === "played" ? Number.parseInt(formData.scoreTeamB) : null,
        status: formData.status,
        goalEvents:
          formData.status === "played"
            ? formData.goalEvents.map((event) => ({
                ...event,
                matchId: match.id,
                // Remove tempId if it exists
                ...(event.tempId && { tempId: undefined }),
              }))
            : [],
      }

      // Send request to update match
      const response = await api.put(`/matches/${match.id}`, updatedMatch)

      // Call onSave with the updated match
      onSave(response.data)
    } catch (err) {
      console.error("Error updating match:", err)
      setError(err.message || "Failed to update match. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
          <h2 className="text-xl font-bold">Update Match Result</h2>
          <button className="text-white hover:text-gray-200 transition-colors" onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Match details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Match Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="font-medium text-gray-800">{match.teamA?.name || "Team A"}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">vs</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-800">{match.teamB?.name || "Team B"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Match status */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-700 mb-2">Match Status</Label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="scheduled"
                  checked={formData.status === "scheduled"}
                  onChange={handleStatusChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Scheduled</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="played"
                  checked={formData.status === "played"}
                  onChange={handleStatusChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Played</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="canceled"
                  checked={formData.status === "canceled"}
                  onChange={handleStatusChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Canceled</span>
              </label>
            </div>
          </div>

          {/* Match score - only shown if status is "played" */}
          {formData.status === "played" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Match Score</h3>
              <div className="flex items-center justify-between">
                <div className="w-1/3">
                  <Label htmlFor="scoreTeamA" className="block text-sm font-medium text-gray-700 mb-1">
                    {match.teamA?.name || "Team A"}
                  </Label>
                  <Input
                    type="number"
                    id="scoreTeamA"
                    name="scoreTeamA"
                    value={formData.scoreTeamA}
                    onChange={handleChange}
                    min="0"
                    className="block w-full"
                    required
                  />
                </div>
                <div className="text-center text-gray-500">vs</div>
                <div className="w-1/3">
                  <Label htmlFor="scoreTeamB" className="block text-sm font-medium text-gray-700 mb-1">
                    {match.teamB?.name || "Team B"}
                  </Label>
                  <Input
                    type="number"
                    id="scoreTeamB"
                    name="scoreTeamB"
                    value={formData.scoreTeamB}
                    onChange={handleChange}
                    min="0"
                    className="block w-full"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Goal events - only shown if status is "played" */}
          {formData.status === "played" && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Goal Scorers</h3>
                <Button
                  type="button"
                  onClick={handleAddGoalEvent}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Goal
                </Button>
              </div>

              {formData.goalEvents.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No goals recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {formData.goalEvents.map((goal, index) => (
                    <div key={goal.id || goal.tempId || index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-800">Goal {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveGoalEvent(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 mb-1">Scorer Name</Label>
                          <Input
                            type="text"
                            value={goal.scorerName}
                            onChange={(e) => handleGoalEventChange(index, "scorerName", e.target.value)}
                            className="block w-full"
                            required
                          />
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-gray-700 mb-1">Team</Label>
                          <select
                            value={goal.teamId}
                            onChange={(e) => handleGoalEventChange(index, "teamId", e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                            required
                          >
                            <option value={match.teamA.id}>{match.teamA.name}</option>
                            <option value={match.teamB.id}>{match.teamB.name}</option>
                          </select>
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-gray-700 mb-1">Minute</Label>
                          <Input
                            type="number"
                            value={goal.minute}
                            onChange={(e) => handleGoalEventChange(index, "minute", Number.parseInt(e.target.value))}
                            min="1"
                            max="90"
                            className="block w-full"
                            required
                          />
                        </div>

                        <div className="flex items-center">
                          <Checkbox
                            id={`own-goal-${index}`}
                            checked={goal.isOwnGoal}
                            onCheckedChange={(checked) => handleGoalEventChange(index, "isOwnGoal", checked)}
                          />
                          <Label htmlFor={`own-goal-${index}`} className="ml-2 text-sm font-medium text-gray-700">
                            Own Goal
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Form actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-teal-500 hover:bg-teal-600 text-white">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default MatchResultModal
