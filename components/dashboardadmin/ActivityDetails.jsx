"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Trophy, Loader2, AlertCircle } from "lucide-react"
import api from "@/app/api/axios"
import { motion } from "framer-motion"
import TournamentDetails from "./tournament/TournamentDetails"
import BilliardTournamentDetails from "./tournament/BilliardTournamentDetails"
import FriendlyMatchDetails from "./tournament/FriendlyMatchDetails"

const ActivityDetails = ({ activityId, onBack }) => {
  const [activity, setActivity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchActivityDetails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get(`/activities/${activityId}`)
        setActivity(response.data)
      } catch (err) {
        console.error("Error fetching activity details:", err)
        setError("Failed to load activity details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (activityId) {
      fetchActivityDetails()
    }
  }, [activityId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-3" />
          <p className="text-indigo-600 animate-pulse">Loading activity details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start">
        <AlertCircle className="h-6 w-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-1">Error Loading Activity</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start">
        <AlertCircle className="h-6 w-6 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-1">Activity Not Found</h3>
          <p className="text-yellow-700">The requested activity could not be found.</p>
        </div>
      </div>
    )
  }

  // Check activity type and sport
  const isFootballTournament =
    activity.type === "tournament" && (activity.sport === "football" || activity.sport === "basketball")
  const isBilliardTournament = activity.type === "tournament" && activity.sport === "billard"
  const isFriendlyMatch = activity.type === "matchAmical"

  return (
    <div className="space-y-6">
      {/* Back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.03, backgroundColor: "#4f46e5" }}
        className="mb-6 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg shadow-md transition-all duration-300"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back to Activities</span>
      </motion.button>

      {/* Activity header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">{activity.name}</h2>
              <p className="mt-1 text-indigo-100">{activity.description}</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(activity.startingDate).toLocaleDateString()} -{" "}
                {new Date(activity.endingDate).toLocaleDateString()}
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {activity.time}
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {activity.localisation}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
              <div className="p-2 bg-indigo-100 rounded-full mr-3">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium text-gray-800 capitalize">{activity.type}</p>
              </div>
            </div>

            {activity.sport && (
              <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                <div className="p-2 bg-indigo-100 rounded-full mr-3">
                  <Trophy className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sport</p>
                  <p className="font-medium text-gray-800 capitalize">{activity.sport}</p>
                </div>
              </div>
            )}

            <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
              <div className="p-2 bg-indigo-100 rounded-full mr-3">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="font-medium text-gray-800">
                  {activity.nbrCurrentParticipants || 0} / {activity.nbrParticipants}
                </p>
              </div>
            </div>
          </div>

          {/* Conditional rendering based on activity type and sport */}
          {isFootballTournament && activity.isTournamentFull && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-indigo-500" />
                Tournament Management
              </h3>
              <TournamentDetails activityId={activity.id} />
            </div>
          )}

          {isBilliardTournament && activity.isTournamentFull && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                Billiard Tournament Management
              </h3>
              <BilliardTournamentDetails activityId={activity.id} />
            </div>
          )}

          {isFriendlyMatch && activity.isTournamentFull && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Friendly Match Management
              </h3>
              <FriendlyMatchDetails activityId={activity.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityDetails
