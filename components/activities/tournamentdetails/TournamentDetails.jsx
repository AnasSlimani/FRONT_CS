"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Calendar, Users, Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import api from "@/app/api/axios"
import Standing from "./Standing"
import Matches from "./Matches"
import TopScorers from "./TopScorers"
import Link from "next/link"

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.5);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(45, 212, 191, 0.5);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(45, 212, 191, 0.7);
  }
`

const TournamentDetails = ({ activityId }) => {
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
        setError("Failed to load tournament details. Please try again.")
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-teal-400 animate-spin mb-4" />
            <span className="text-xl text-gray-300">Loading tournament details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/activities"
            className="inline-flex items-center mb-8 text-gray-300 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Activities</span>
          </Link>

          <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Error Loading Tournament</h3>
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
          <Link
            href="/activities"
            className="inline-flex items-center mb-8 text-gray-300 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Activities</span>
          </Link>

          <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Tournament Not Found</h3>
              <p className="text-yellow-300">The tournament you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if this is a football tournament
  const isFootballTournament = activity.type === "tournament" && activity.sport === "football"

  if (!isFootballTournament) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/activities"
            className="inline-flex items-center mb-8 text-gray-300 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Activities</span>
          </Link>

          <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Not a Football Tournament</h3>
              <p className="text-yellow-300">
                This activity is not a football tournament. Tournament details are only available for football
                tournaments.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-6 md:p-8 relative">
      {/* Add style tag for custom scrollbar */}
      <style jsx global>
        {scrollbarStyles}
      </style>

      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[10%] w-80 h-80 bg-purple-600/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-0 right-[10%] w-80 h-80 bg-teal-600/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute top-[30%] right-[20%] w-60 h-60 bg-amber-600/10 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Back button */}
        <Link
          href="/activities"
          className="inline-flex items-center mb-8 text-gray-300 hover:text-teal-400 transition-colors group"
        >
          <span className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-full mr-2 group-hover:bg-teal-900/50 transition-colors border border-gray-700/50 group-hover:border-teal-500/50">
            <ArrowLeft className="h-5 w-5" />
          </span>
          <span className="font-medium">Back to Activities</span>
        </Link>

        {/* Tournament Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-10 overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-purple-900 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] bg-cover bg-center mix-blend-overlay"></div>

          {/* Animated particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              />
            ))}
          </div>

          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center mb-3">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-600 p-3 rounded-xl shadow-lg mr-4 transform -rotate-3">
                    <Trophy className="h-8 w-8 text-gray-900" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{activity.name}</h1>
                </div>
                <p className="text-teal-100 text-lg max-w-2xl">{activity.description}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm flex items-center border border-white/10 shadow-lg">
                  <Calendar className="h-5 w-5 mr-2 text-teal-300" />
                  <div>
                    <div className="text-teal-100 font-medium">Tournament Dates</div>
                    <div className="text-white">
                      {new Date(activity.startingDate).toLocaleDateString()} -{" "}
                      {new Date(activity.endingDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm flex items-center border border-white/10 shadow-lg">
                  <Users className="h-5 w-5 mr-2 text-teal-300" />
                  <div>
                    <div className="text-teal-100 font-medium">Teams</div>
                    <div className="text-white">
                      {activity.teamParticipants?.length || 0} / {activity.nbrTeams}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tournament Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Standings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Standing activityId={activity.id} />
          </motion.div>

          {/* Top Scorers Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full"
          >
            <TopScorers activityId={activity.id} />
          </motion.div>

          {/* Matches Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <Matches activityId={activity.id} />
          </motion.div>
        </div>

        {/* Footer with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>Tournament statistics are updated after each match</p>
        </motion.div>
      </div>

      {/* Add keyframes for floating animation */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(10px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

export default TournamentDetails
