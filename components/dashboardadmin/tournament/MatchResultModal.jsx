"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Trash2, Loader2, AlertCircle, Clock, User, Users, Check, Shield, Calendar } from "lucide-react"
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
  const [dropdownOpen, setDropdownOpen] = useState(null)

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

  // Update the handleAddGoalEvent function to intelligently select the default team
  // based on the current score and remaining goals to be assigned
  const handleAddGoalEvent = () => {
    // Count how many goals are already assigned to each team
    const teamAGoals = formData.goalEvents.filter((g) => g.teamId === match.teamA.id).length
    const teamBGoals = formData.goalEvents.filter((g) => g.teamId === match.teamB.id).length

    // Get the total goals for each team from the score inputs
    const totalTeamAGoals = formData.scoreTeamA ? Number.parseInt(formData.scoreTeamA, 10) : 0
    const totalTeamBGoals = formData.scoreTeamB ? Number.parseInt(formData.scoreTeamB, 10) : 0

    // Determine which team should get the next goal based on remaining goals to be assigned
    let defaultTeamId = match.teamA.id // Default to team A

    // If team B has more remaining goals to assign, default to team B
    if (totalTeamBGoals - teamBGoals > totalTeamAGoals - teamAGoals) {
      defaultTeamId = match.teamB.id
    }
    // If team A has all goals assigned but team B doesn't, default to team B
    else if (teamAGoals >= totalTeamAGoals && teamBGoals < totalTeamBGoals) {
      defaultTeamId = match.teamB.id
    }

    const newGoalEvent = {
      tempId: Date.now(), // Temporary ID for UI purposes
      scorerId: "", // Initialize with empty string
      scorerName: "",
      teamId: defaultTeamId,
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

  // Toggle player dropdown
  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index)
  }

  // Select player from dropdown
  const selectPlayer = (index, player) => {
    // Make sure we're setting both the ID and name correctly
    handleGoalEventChange(index, "scorerId", player.id || "")
    handleGoalEventChange(index, "scorerName", player.username)
    setDropdownOpen(null)
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
        <div className="p-6 border-b border-indigo-100 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl">
          <h2 className="text-xl font-bold flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Update Match Result
          </h2>
          <button
            className="text-white hover:text-indigo-100 transition-colors bg-white/20 rounded-full p-1.5 hover:bg-white/30"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Match details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-500" />
              Match Details
            </h3>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="bg-indigo-100 p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-indigo-600" />
                  </div>
                  <p className="font-bold text-indigo-700 text-lg">{match.teamA?.name || "Team A"}</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-medium text-indigo-600 bg-white/50 px-3 py-1 rounded-full">vs</p>
                </div>
                <div className="text-center flex-1">
                  <div className="bg-purple-100 p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="font-bold text-purple-700 text-lg">{match.teamB?.name || "Team B"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Match status */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-indigo-500" />
              Match Status
            </Label>
            <div className="flex space-x-4 bg-indigo-50 p-4 rounded-lg">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="scheduled"
                  checked={formData.status === "scheduled"}
                  onChange={handleStatusChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-full"
                />
                <span className="ml-2 text-gray-700 font-medium">Scheduled</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="played"
                  checked={formData.status === "played"}
                  onChange={handleStatusChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-full"
                />
                <span className="ml-2 text-gray-700 font-medium">Played</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="canceled"
                  checked={formData.status === "canceled"}
                  onChange={handleStatusChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-full"
                />
                <span className="ml-2 text-gray-700 font-medium">Canceled</span>
              </label>
            </div>
          </div>

          {/* Match score - only shown if status is "played" */}
          {formData.status === "played" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-500" />
                Match Score
              </h3>
              <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
                <div className="w-1/3">
                  <Label htmlFor="scoreTeamA" className="block text-sm font-medium text-indigo-700 mb-1">
                    {match.teamA?.name || "Team A"}
                  </Label>
                  <Input
                    type="number"
                    id="scoreTeamA"
                    name="scoreTeamA"
                    value={formData.scoreTeamA}
                    onChange={handleChange}
                    min="0"
                    className="block w-full border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white/70 text-lg font-bold text-center text-indigo-700"
                    required
                  />
                </div>
                <div className="text-center text-indigo-600 font-bold text-xl">vs</div>
                <div className="w-1/3">
                  <Label htmlFor="scoreTeamB" className="block text-sm font-medium text-purple-700 mb-1">
                    {match.teamB?.name || "Team B"}
                  </Label>
                  <Input
                    type="number"
                    id="scoreTeamB"
                    name="scoreTeamB"
                    value={formData.scoreTeamB}
                    onChange={handleChange}
                    min="0"
                    className="block w-full border-purple-300 focus:border-purple-500 focus:ring-purple-500 bg-white/70 text-lg font-bold text-center text-purple-700"
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Goal events - only shown if status is "played" */}
          {formData.status === "played" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <User className="h-5 w-5 mr-2 text-indigo-500" />
                  Goal Scorers
                </h3>
                <Button
                  type="button"
                  onClick={handleAddGoalEvent}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Goal
                </Button>
              </div>

              {formData.goalEvents.length === 0 ? (
                <div className="text-sm text-gray-500 italic bg-indigo-50 p-6 rounded-lg text-center">
                  <User className="h-10 w-10 text-indigo-300 mx-auto mb-2" />
                  <p>No goals recorded yet. Add goals to match the final score.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.goalEvents.map((goal, index) => (
                    <motion.div
                      key={goal.id || goal.tempId || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-indigo-700 flex items-center">
                          <div className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 font-bold">
                            {index + 1}
                          </div>
                          Goal Details
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveGoalEvent(index)}
                          className="text-red-500 hover:text-red-700 bg-white/50 hover:bg-white/80 p-1.5 rounded-full transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <Label className="block text-sm font-medium text-indigo-700 mb-1 flex items-center">
                            <User className="h-3.5 w-3.5 mr-1.5" />
                            Scorer Name
                          </Label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={goal.scorerName}
                              readOnly
                              placeholder="Select a player"
                              onClick={() => toggleDropdown(index)}
                              className="block w-full border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white/70 pr-8 cursor-pointer"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Player dropdown */}
                          <AnimatePresence>
                            {dropdownOpen === index && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-indigo-100 max-h-48 overflow-y-auto"
                              >
                                <div className="p-2 text-sm font-medium text-indigo-700 bg-indigo-50 border-b border-indigo-100">
                                  Select a player
                                </div>
                                <ul>
                                  {goal.teamId === match.teamA.id
                                    ? match.teamA.members.map((player) => (
                                        <li
                                          key={player.id}
                                          onClick={() => selectPlayer(index, player)}
                                          className="px-3 py-2 hover:bg-indigo-50 cursor-pointer flex items-center justify-between text-gray-700 hover:text-indigo-700 transition-colors"
                                        >
                                          <span>{player.username}</span>
                                          {goal.scorerId === player.id && <Check className="h-4 w-4 text-indigo-500" />}
                                        </li>
                                      ))
                                    : match.teamB.members.map((player) => (
                                        <li
                                          key={player.id}
                                          onClick={() => selectPlayer(index, player)}
                                          className="px-3 py-2 hover:bg-indigo-50 cursor-pointer flex items-center justify-between text-gray-700 hover:text-indigo-700 transition-colors"
                                        >
                                          <span>{player.username}</span>
                                          {goal.scorerId === player.id && <Check className="h-4 w-4 text-indigo-500" />}
                                        </li>
                                      ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-indigo-700 mb-1 flex items-center">
                            <Users className="h-3.5 w-3.5 mr-1.5" />
                            Team
                          </Label>
                          <select
                            value={goal.teamId}
                            onChange={(e) => {
                              handleGoalEventChange(index, "teamId", e.target.value)
                              // Reset scorer when team changes
                              handleGoalEventChange(index, "scorerId", "")
                              handleGoalEventChange(index, "scorerName", "")
                            }}
                            className="block w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 text-gray-700"
                            required
                          >
                            <option value={match.teamA.id}>{match.teamA.name}</option>
                            <option value={match.teamB.id}>{match.teamB.name}</option>
                          </select>
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-indigo-700 mb-1 flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            Minute
                          </Label>
                          <Input
                            type="number"
                            value={goal.minute.toString()}
                            onChange={(e) =>
                              handleGoalEventChange(index, "minute", Number.parseInt(e.target.value) || 1)
                            }
                            min="1"
                            max="90"
                            className="block w-full border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white/70"
                            required
                          />
                        </div>

                        <div className="flex items-center">
                          <div className="flex h-10 items-center space-x-2 bg-white/70 px-3 rounded-md border border-indigo-300">
                            <Checkbox
                              id={`own-goal-${index}`}
                              checked={goal.isOwnGoal}
                              onCheckedChange={(checked) => handleGoalEventChange(index, "isOwnGoal", checked)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <Label
                              htmlFor={`own-goal-${index}`}
                              className="text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              Own Goal
                            </Label>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Form actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-colors shadow-md flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default MatchResultModal
