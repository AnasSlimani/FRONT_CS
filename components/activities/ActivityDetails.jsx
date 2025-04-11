"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Trophy, Loader2, AlertCircle } from "lucide-react"
import api from "@/app/api/axios"
import { motion } from "framer-motion"
import TournamentDetails from "./tournamentdetails/TournamentDetails"
import { useRouter } from "next/navigation"

const ActivityDetails = ({ id }) => {
  const [activity, setActivity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchActivityDetails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get(`/activities/${id}`)
        setActivity(response.data)
      } catch (err) {
        console.error("Error fetching activity details:", err)
        setError("Failed to load activity details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchActivityDetails()
    }
  }, [id])

  const handleBack = () => {
    router.push("/activities")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-teal-400 animate-spin mb-4" />
            <span className="text-xl text-gray-300">Loading activity details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleBack}
            className="inline-flex items-center mb-8 text-gray-300 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Activities</span>
          </button>

          <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Error Loading Activity</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleBack}
            className="inline-flex items-center mb-8 text-gray-300 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Activities</span>
          </button>

          <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Activity Not Found</h3>
              <p className="text-yellow-300">The activity you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if this is a football tournament
  const isFootballTournament = activity.type === "tournament" && activity.sport === "football"

  // If it's a football tournament and it's full, show the tournament details
  if (isFootballTournament && activity.isTournamentFull) {
    return <TournamentDetails activityId={activity.id} />
  }

  // Otherwise, show the regular activity details
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back button */}
        <motion.button
          onClick={handleBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.03, backgroundColor: "#0d9488" }}
          className="mb-6 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Activities</span>
        </motion.button>

        {/* Activity header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-700"
        >
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
              <div className="bg-gray-800/30 p-4 rounded-lg flex items-center border border-gray-700">
                <div className="p-2 bg-teal-900/50 rounded-full mr-3 border border-teal-500/30">
                  <Calendar className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <p className="font-medium text-white capitalize">{activity.type}</p>
                </div>
              </div>

              {activity.sport && (
                <div className="bg-gray-800/30 p-4 rounded-lg flex items-center border border-gray-700">
                  <div className="p-2 bg-teal-900/50 rounded-full mr-3 border border-teal-500/30">
                    <Trophy className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Sport</p>
                    <p className="font-medium text-white capitalize">{activity.sport}</p>
                  </div>
                </div>
              )}

              <div className="bg-gray-800/30 p-4 rounded-lg flex items-center border border-gray-700">
                <div className="p-2 bg-teal-900/50 rounded-full mr-3 border border-teal-500/30">
                  <Users className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Participants</p>
                  <p className="font-medium text-white">
                    {activity.type === "tournament"
                      ? `${activity.teamParticipants?.length || 0} / ${activity.nbrTeams} Teams`
                      : `${activity.nbrCurrentParticipants || 0} / ${activity.nbrParticipants} Participants`}
                  </p>
                </div>
              </div>
            </div>

            {/* Message for tournament not full yet */}
            {isFootballTournament && !activity.isTournamentFull && (
              <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 flex items-center justify-center">
                <div className="text-center max-w-2xl">
                  <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Tournament Not Started Yet</h3>
                  <p className="text-yellow-300 mb-4">
                    This tournament is still in the registration phase. Once all teams have registered and the
                    tournament begins, you'll be able to see standings, matches, and top scorers here.
                  </p>
                  <div className="inline-block bg-yellow-500/20 px-4 py-2 rounded-lg text-yellow-300 border border-yellow-500/30">
                    <span className="font-medium">{activity.teamParticipants?.length || 0}</span> of{" "}
                    <span className="font-medium">{activity.nbrTeams}</span> teams registered
                  </div>
                </div>
              </div>
            )}

            {/* Message for non-tournament activities */}
            {!isFootballTournament && (
              <div className="bg-teal-900/20 backdrop-blur-sm border border-teal-500/20 rounded-xl p-6 flex items-center justify-center">
                <div className="text-center max-w-2xl">
                  <Calendar className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Activity Details</h3>
                  <p className="text-teal-300 mb-4">
                    This is a {activity.type} activity. Detailed information about this activity is available here.
                  </p>
                  <div className="inline-block bg-teal-500/20 px-4 py-2 rounded-lg text-teal-300 border border-teal-500/30">
                    <span className="font-medium">{activity.nbrCurrentParticipants || 0}</span> of{" "}
                    <span className="font-medium">{activity.nbrParticipants}</span> spots filled
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ActivityDetails
