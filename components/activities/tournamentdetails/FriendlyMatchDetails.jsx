"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Trophy,
  Calendar,
  Users,
  Loader2,
  AlertCircle,
  ArrowLeft,
  User,
  Shield,
  Clock,
  MapPin,
  Award,
} from "lucide-react"
import api from "@/app/api/axios"
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
    background: rgba(59, 130, 246, 0.5);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.7);
  }
`

const FriendlyMatchDetails = ({ activityId }) => {
  const [activity, setActivity] = useState(null)
  const [matchData, setMatchData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMatchDetails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch activity details
        const activityResponse = await api.get(`/activities/${activityId}`)
        setActivity(activityResponse.data)

        // Fetch match data
        try {
          const matchResponse = await api.get(`/friendly-matches/${activityId}`)
          setMatchData(matchResponse.data)
        } catch (matchErr) {
          console.log("No match data found or match not started yet")
        }
      } catch (err) {
        console.error("Error fetching match details:", err)
        setError("Failed to load match details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (activityId) {
      fetchMatchDetails()
    }
  }, [activityId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-blue-400 animate-spin mb-4" />
            <span className="text-xl text-gray-300">Loading match details...</span>
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
            className="inline-flex items-center mb-8 text-gray-300 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Activities</span>
          </Link>

          <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Error Loading Match</h3>
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
            className="inline-flex items-center mb-8 text-gray-300 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Activities</span>
          </Link>

          <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Match Not Found</h3>
              <p className="text-yellow-300">The match you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if this is a friendly match
  const isFriendlyMatch = activity.type === "matchAmical"

  if (!isFriendlyMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/activities"
            className="inline-flex items-center mb-8 text-gray-300 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Activities</span>
          </Link>

          <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Not a Friendly Match</h3>
              <p className="text-yellow-300">
                This activity is not a friendly match. Match details are only available for friendly matches.
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
        <div className="absolute top-0 left-[10%] w-80 h-80 bg-blue-600/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-0 right-[10%] w-80 h-80 bg-blue-600/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute top-[30%] right-[20%] w-60 h-60 bg-green-600/10 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Back button */}
        <Link
          href="/activities"
          className="inline-flex items-center mb-8 text-gray-300 hover:text-blue-400 transition-colors group"
        >
          <span className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-full mr-2 group-hover:bg-blue-900/50 transition-colors border border-gray-700/50 group-hover:border-blue-500/50">
            <ArrowLeft className="h-5 w-5" />
          </span>
          <span className="font-medium">Back to Activities</span>
        </Link>

        {/* Match Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-10 overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
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
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-3 rounded-xl shadow-lg mr-4 transform -rotate-3">
                    <Users className="h-8 w-8 text-gray-900" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{activity.name}</h1>
                </div>
                <p className="text-blue-100 text-lg max-w-2xl">{activity.description}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm flex items-center border border-white/10 shadow-lg">
                  <Calendar className="h-5 w-5 mr-2 text-blue-300" />
                  <div>
                    <div className="text-blue-100 font-medium">Match Date</div>
                    <div className="text-white">{new Date(activity.startingDate).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm flex items-center border border-white/10 shadow-lg">
                  <MapPin className="h-5 w-5 mr-2 text-blue-300" />
                  <div>
                    <div className="text-blue-100 font-medium">Location</div>
                    <div className="text-white">{activity.localisation}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Match Content */}
        {matchData ? (
          <div className="space-y-8">
            {/* Match Result Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-blue-400" />
                  Match Result
                </h3>
              </div>

              <div className="p-6">
                {matchData.status === "played" ? (
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-3xl mx-auto bg-gray-800/30 rounded-xl border border-gray-700 p-6">
                      {/* Team A */}
                      <div className="flex flex-col items-center mb-6 md:mb-0">
                        <div className="bg-blue-900/30 p-3 rounded-full mb-3 border border-blue-700/30">
                          <Shield className="h-10 w-10 text-blue-400" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1">Team A</h4>
                        <div className="text-5xl font-bold text-blue-400">{matchData.scoreTeamA}</div>
                      </div>

                      {/* VS */}
                      <div className="flex flex-col items-center mb-6 md:mb-0">
                        <div className="text-2xl font-bold text-gray-400 mb-2">VS</div>
                        <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-sm text-gray-400">
                          <Clock className="h-4 w-4 inline-block mr-1" />
                          {activity.time}
                        </div>
                      </div>

                      {/* Team B */}
                      <div className="flex flex-col items-center">
                        <div className="bg-green-900/30 p-3 rounded-full mb-3 border border-green-700/30">
                          <Shield className="h-10 w-10 text-green-400" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1">Team B</h4>
                        <div className="text-5xl font-bold text-green-400">{matchData.scoreTeamB}</div>
                      </div>
                    </div>

                    {/* Winner Banner */}
                    <div className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-lg border border-yellow-700/30 inline-block">
                      <div className="text-lg font-bold text-yellow-400 flex items-center">
                        <Trophy className="h-5 w-5 mr-2" />
                        {matchData.scoreTeamA > matchData.scoreTeamB
                          ? "Team A wins!"
                          : matchData.scoreTeamB > matchData.scoreTeamA
                            ? "Team B wins!"
                            : "It's a draw!"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-blue-900/20 p-4 rounded-full inline-block mb-4">
                      <Clock className="h-10 w-10 text-blue-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Match Not Played Yet</h4>
                    <p className="text-gray-400 max-w-lg mx-auto">
                      The match is scheduled but hasn't been played yet. Check back later for results.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Teams Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Team A */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-900/30 to-blue-800/30">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-400" />
                    Team A
                  </h3>
                </div>

                <div className="p-4">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {matchData.teamA && matchData.teamA.length > 0 ? (
                      matchData.teamA.map((player, index) => (
                        <div
                          key={player.id || index}
                          className="flex items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700"
                        >
                          <div className="w-10 h-10 bg-blue-900/30 rounded-full flex items-center justify-center mr-3 border border-blue-700/30">
                            <User className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{player.username}</div>
                            <div className="text-xs text-gray-400">Player</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-400">No players in Team A</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Team B */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-green-900/30 to-green-800/30">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-400" />
                    Team B
                  </h3>
                </div>

                <div className="p-4">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {matchData.teamB && matchData.teamB.length > 0 ? (
                      matchData.teamB.map((player, index) => (
                        <div
                          key={player.id || index}
                          className="flex items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700"
                        >
                          <div className="w-10 h-10 bg-green-900/30 rounded-full flex items-center justify-center mr-3 border border-green-700/30">
                            <User className="h-5 w-5 text-green-400" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{player.username}</div>
                            <div className="text-xs text-gray-400">Player</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-400">No players in Team B</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Goal Scorers Section */}
            {matchData.status === "played" && matchData.goalScorers && matchData.goalScorers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
              >
                <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Award className="h-6 w-6 mr-2 text-yellow-400" />
                    Goal Scorers
                  </h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team A Goal Scorers */}
                    <div>
                      <h4 className="text-lg font-bold text-blue-400 mb-3 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Team A Goals
                      </h4>
                      <div className="space-y-2">
                        {matchData.goalScorers
                          .filter((scorer) => scorer.team === "scoreTeamA")
                          .map((scorer, index) => (
                            <div
                              key={scorer.id || index}
                              className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-700/30"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center mr-3 text-xs font-bold text-blue-300 border border-blue-700/50">
                                  {index + 1}
                                </div>
                                <div className="font-medium text-white">{scorer.playerName}</div>
                              </div>
                              <div className="bg-blue-900/30 px-2 py-1 rounded text-sm text-blue-300 border border-blue-700/30">
                                {scorer.minute}'
                              </div>
                            </div>
                          ))}
                        {matchData.goalScorers.filter((scorer) => scorer.team === "scoreTeamA").length === 0 && (
                          <div className="text-center py-3 text-gray-400 bg-gray-800/30 rounded-lg border border-gray-700">
                            No goals for Team A
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Team B Goal Scorers */}
                    <div>
                      <h4 className="text-lg font-bold text-green-400 mb-3 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Team B Goals
                      </h4>
                      <div className="space-y-2">
                        {matchData.goalScorers
                          .filter((scorer) => scorer.team === "scoreTeamB")
                          .map((scorer, index) => (
                            <div
                              key={scorer.id || index}
                              className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-700/30"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-900/50 rounded-full flex items-center justify-center mr-3 text-xs font-bold text-green-300 border border-green-700/50">
                                  {index + 1}
                                </div>
                                <div className="font-medium text-white">{scorer.playerName}</div>
                              </div>
                              <div className="bg-green-900/30 px-2 py-1 rounded text-sm text-green-300 border border-green-700/30">
                                {scorer.minute}'
                              </div>
                            </div>
                          ))}
                        {matchData.goalScorers.filter((scorer) => scorer.team === "scoreTeamB").length === 0 && (
                          <div className="text-center py-3 text-gray-400 bg-gray-800/30 rounded-lg border border-gray-700">
                            No goals for Team B
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-900/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 flex flex-col items-center justify-center text-center"
          >
            <Users className="h-16 w-16 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Match Not Started Yet</h3>
            <p className="text-blue-200 max-w-2xl mb-6">
              The friendly match is still in preparation. Once the match begins, you'll be able to see the teams,
              results, and goal scorers here.
            </p>
            <div className="inline-block bg-blue-800/50 px-6 py-3 rounded-lg text-blue-300 border border-blue-600/30">
              <Users className="h-5 w-5 inline-block mr-2" />
              <span className="font-medium">{activity.individualParticipants?.length || 0}</span> of{" "}
              <span className="font-medium">{activity.nbrParticipants}</span> participants registered
            </div>
          </motion.div>
        )}

        {/* Footer with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>Match statistics are updated after the game</p>
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

export default FriendlyMatchDetails
