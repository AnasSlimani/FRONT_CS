"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, MapPin, Loader2, AlertCircle, Trophy, Shield } from "lucide-react"
import api from "@/app/api/axios"

const Matches = ({ activityId }) => {
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeGameweek, setActiveGameweek] = useState("1")

  // Fetch matches for the activity
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get(`/matches/activity/${activityId}`)
        setMatches(response.data)
      } catch (err) {
        console.error("Error fetching matches:", err)
        setError("Failed to load matches. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (activityId) {
      fetchMatches()
    }
  }, [activityId])

  // Filter matches by gameweek
  const getMatchesByGameweek = (gameweek) => {
    return matches.filter((match) => match.gameweek === Number.parseInt(gameweek))
  }

  // Check if matches exist for a gameweek
  const hasMatchesForGameweek = (gameweek) => {
    return getMatchesByGameweek(gameweek).length > 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-teal-400 animate-spin mb-2" />
          <span className="text-gray-300">Loading matches...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-red-300">{error}</p>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center">
        <Calendar className="h-12 w-12 text-yellow-400 mb-3" />
        <h3 className="text-lg font-bold text-white mb-2">No Matches Available Yet</h3>
        <p className="text-gray-300">The tournament schedule is being prepared. Check back soon!</p>
      </div>
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-teal-400" />
          Tournament Matches
        </h3>
      </div>

      <div className="p-5">
        {/* Gameweek Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-full shadow-inner">
              {[1, 2, 3].map((gameweek) => (
                <button
                  key={gameweek}
                  onClick={() => setActiveGameweek(gameweek.toString())}
                  className={`px-5 py-2 rounded-full transition-all duration-300 font-medium ${
                    activeGameweek === gameweek.toString()
                      ? "bg-teal-500 text-white shadow-md"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Gameweek {gameweek}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matches for selected gameweek */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGameweek}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {hasMatchesForGameweek(activeGameweek) ? (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                {getMatchesByGameweek(activeGameweek).map((match) => (
                  <MatchCard key={match.id} match={match} variants={itemVariants} />
                ))}
              </motion.div>
            ) : (
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <Calendar className="h-10 w-10 text-gray-500 mb-3" />
                <h4 className="text-lg font-medium text-white mb-2">No Matches for Gameweek {activeGameweek}</h4>
                <p className="text-gray-400">Matches for this gameweek haven't been scheduled yet.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Match Card Component
const MatchCard = ({ match, variants }) => {
  const [showGoals, setShowGoals] = useState(false)

  const getStatusBadge = (status) => {
    switch (status) {
      case "played":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-400 border border-green-500/20">
            Played
          </span>
        )
      case "canceled":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-400 border border-red-500/20">
            Canceled
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-400 border border-yellow-500/20">
            Scheduled
          </span>
        )
    }
  }

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
      className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden transition-all duration-300"
    >
      <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-teal-400 mr-2" />
          <span className="text-sm text-gray-300">{new Date(match.date).toLocaleDateString()}</span>
          <Clock className="h-4 w-4 text-teal-400 ml-4 mr-2" />
          <span className="text-sm text-gray-300">{match.time || "TBD"}</span>
        </div>
        <div className="flex items-center space-x-2">{getStatusBadge(match.status)}</div>
      </div>

      <div className="p-5 bg-gradient-to-b from-gray-800/10 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 text-right pr-4">
            <div className="flex items-center justify-end">
              <h4 className="font-bold text-white text-lg mr-2">{match.teamA?.name || "Team A"}</h4>
              <Shield className="h-6 w-6 text-teal-400" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-gray-900/70 rounded-lg px-6 py-3 flex items-center justify-center min-w-[120px] border border-gray-700">
              <span className="text-3xl font-bold text-white">
                {match.scoreTeamA !== null && match.scoreTeamA !== undefined ? match.scoreTeamA : "-"}
              </span>
              <span className="mx-3 text-gray-500">vs</span>
              <span className="text-3xl font-bold text-white">
                {match.scoreTeamB !== null && match.scoreTeamB !== undefined ? match.scoreTeamB : "-"}
              </span>
            </div>
          </div>
          <div className="flex-1 pl-4">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-teal-400 mr-2" />
              <h4 className="font-bold text-white text-lg">{match.teamB?.name || "Team B"}</h4>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center text-sm text-gray-400 mb-3">
          <MapPin className="h-4 w-4 mr-1 text-teal-400" />
          <span>{match.location || "TBD"}</span>
        </div>

        {match.status === "played" && match.goalEvents && match.goalEvents.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowGoals(!showGoals)}
              className="w-full flex items-center justify-center py-2 px-4 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-lg transition-colors text-sm font-medium border border-gray-700"
            >
              <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
              {showGoals ? "Hide Goal Scorers" : "Show Goal Scorers"}
            </button>

            {showGoals && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 bg-gray-900/50 rounded-lg p-3 border border-gray-700"
              >
                <h5 className="text-sm font-medium text-teal-400 mb-2">Goal Scorers</h5>
                <ul className="space-y-2 text-sm">
                  {match.goalEvents.map((goal, index) => (
                    <li key={goal.id || index} className="flex items-center justify-between text-gray-300">
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-xs mr-2">
                          {index + 1}
                        </div>
                        <span>{goal.scorerName}</span>
                        {goal.isOwnGoal && (
                          <span className="ml-2 px-1.5 py-0.5 bg-red-900/30 text-red-400 rounded text-xs border border-red-500/20">
                            OG
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-teal-400 font-medium">{goal.minute}'</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Matches
