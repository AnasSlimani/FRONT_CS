"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Trophy, Loader2, AlertCircle } from "lucide-react"
import api from "@/app/api/axios"
import { Button } from "@/components/ui/button"
import TournamentDetails from "./tournament/TournamentDetails"

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
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading activity details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-yellow-700">Activity not found.</p>
      </div>
    )
  }

  // Check if this is a football tournament
  const isFootballTournament = activity.type === "tournament" && activity.sport === "football"

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button onClick={onBack} variant="outline" className="mb-4 flex items-center">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Activities
      </Button>

      {/* Activity header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">{activity.name}</h2>
              <p className="mt-1 text-teal-100">{activity.description}</p>
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
            <div className="bg-gray-50 p-4 rounded-lg flex items-center">
              <div className="p-2 bg-teal-100 rounded-full mr-3">
                <Calendar className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium text-gray-800 capitalize">{activity.type}</p>
              </div>
            </div>

            {activity.sport && (
              <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                <div className="p-2 bg-teal-100 rounded-full mr-3">
                  <Trophy className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sport</p>
                  <p className="font-medium text-gray-800 capitalize">{activity.sport}</p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg flex items-center">
              <div className="p-2 bg-teal-100 rounded-full mr-3">
                <Users className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="font-medium text-gray-800">
                  {activity.nbrCurrentParticipants || 0} / {activity.nbrParticipants}
                </p>
              </div>
            </div>
          </div>

          {/* Status indicator */}
          <div className="mb-6">
            <div
              className={`px-4 py-2 rounded-lg ${
                activity.isTournamentFull
                  ? "bg-green-100 border border-green-200"
                  : "bg-yellow-100 border border-yellow-200"
              }`}
            >
              <p className={`text-sm font-medium ${activity.isTournamentFull ? "text-green-800" : "text-yellow-800"}`}>
                {activity.isTournamentFull
                  ? "Tournament is full and ready to start"
                  : `Waiting for more teams (${activity.teamParticipants?.length || 0}/${activity.nbrTeams})`}
              </p>
            </div>
          </div>

          {/* Tournament management section - only shown for football tournaments */}
          {isFootballTournament && activity.isTournamentFull && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-teal-500" />
                Tournament Management
              </h3>
              <TournamentDetails activityId={activity.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityDetails
