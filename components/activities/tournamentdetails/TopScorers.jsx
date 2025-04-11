"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, User, Users, Loader2, AlertCircle, Award } from "lucide-react"
import api from "@/app/api/axios"

const TopScorers = ({ activityId }) => {
  const [topScorers, setTopScorers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopScorers = async () => {
      if (!activityId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await api.get(`/matches/activity/${activityId}/topscorers`)
        console.log("Top scorers data:", response.data) // Debug log
        setTopScorers(response.data)
      } catch (err) {
        console.error("Error fetching top scorers:", err)
        setError("Failed to load top scorers. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopScorers()
  }, [activityId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-teal-400 animate-spin mb-2" />
          <span className="text-gray-300">Loading top scorers...</span>
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

  if (!topScorers || topScorers.length === 0) {
    return (
      <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center">
        <Trophy className="h-12 w-12 text-yellow-400 mb-3" />
        <h3 className="text-lg font-bold text-white mb-2">No Goal Scorers Yet</h3>
        <p className="text-gray-300">Check back after matches have been played to see the top goal scorers.</p>
      </div>
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/80 overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-gray-700/80 bg-gradient-to-r from-purple-900/30 to-teal-900/30">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-amber-400" />
          Top Goal Scorers
        </h3>
      </div>

      <div className="flex-1 overflow-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="h-[calc(100%-1rem)] overflow-y-auto custom-scrollbar p-5"
          style={{
            maxHeight: "calc(100vh - 400px)",
            minHeight: "400px",
          }}
        >
          <div className="grid grid-cols-1 gap-3">
            {topScorers.map((scorer, index) => (
              <motion.div
                key={`${scorer.scorerId}-${index}`}
                variants={itemVariants}
                className={`relative rounded-lg overflow-hidden ${
                  index === 0
                    ? "bg-gradient-to-r from-amber-900/30 to-yellow-800/10 border border-amber-700/30"
                    : index === 1
                      ? "bg-gradient-to-r from-slate-800/50 to-slate-700/20 border border-slate-600/30"
                      : index === 2
                        ? "bg-gradient-to-r from-orange-900/30 to-orange-800/10 border border-orange-700/30"
                        : "bg-gradient-to-r from-gray-800/30 to-gray-700/10 border border-gray-700/30"
                }`}
              >
                {/* Glowing accent for top 3 */}
                {index < 3 && (
                  <div
                    className="absolute -top-10 -left-10 w-20 h-20 rounded-full opacity-30 filter blur-xl"
                    style={{
                      background:
                        index === 0
                          ? "radial-gradient(circle, rgba(245,158,11,0.8) 0%, rgba(245,158,11,0) 70%)"
                          : index === 1
                            ? "radial-gradient(circle, rgba(148,163,184,0.8) 0%, rgba(148,163,184,0) 70%)"
                            : "radial-gradient(circle, rgba(234,88,12,0.8) 0%, rgba(234,88,12,0) 70%)",
                    }}
                  ></div>
                )}

                {/* Position indicator */}
                <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-teal-400 via-teal-500 to-purple-500"></div>

                <div className="flex items-center p-4 pl-5">
                  {/* Rank */}
                  <div className="flex-shrink-0 mr-4">
                    {index === 0 ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/30 border border-amber-300/30">
                        <Award className="h-6 w-6 text-gray-900" />
                      </div>
                    ) : index === 1 ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-slate-400 flex items-center justify-center shadow-lg shadow-slate-900/30 border border-slate-300/30">
                        <Award className="h-6 w-6 text-gray-900" />
                      </div>
                    ) : index === 2 ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 border border-amber-500/30">
                        <Award className="h-6 w-6 text-gray-900" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold shadow-lg shadow-black/30 border border-gray-600/30">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Player info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <User className="h-4 w-4 text-teal-400 mr-2" />
                      <h4 className={`font-bold truncate ${index < 3 ? "text-white" : "text-gray-300"}`}>
                        {scorer.scorerName || "Unknown Player"}
                      </h4>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="h-4 w-4 text-teal-400 mr-2" />
                      <span className="truncate">{scorer.team ? scorer.team.name : "Unknown Team"}</span>
                    </div>
                  </div>

                  {/* Goals count */}
                  <div className="flex-shrink-0 ml-4">
                    <div className="px-4 py-2 bg-gradient-to-br from-gray-900/70 to-gray-800/70 rounded-full border border-gray-700/70 flex items-center shadow-inner">
                      <span
                        className={`text-2xl font-bold ${
                          index === 0
                            ? "text-amber-400"
                            : index === 1
                              ? "text-slate-300"
                              : index === 2
                                ? "text-orange-400"
                                : "text-teal-400"
                        }`}
                      >
                        {scorer.goals}
                      </span>
                      <span className="ml-1 text-xs text-gray-400">goals</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Add a subtle gradient at the bottom to indicate scrolling */}
      <div className="h-6 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none absolute bottom-0 left-0 right-0 opacity-70"></div>
    </div>
  )
}

export default TopScorers
