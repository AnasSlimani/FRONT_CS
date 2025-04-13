"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Loader2, AlertCircle, Shield } from "lucide-react"
import api from "@/app/api/axios"

const Standing = ({ activityId }) => {
  const [standings, setStandings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStandings = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get(`/matches/activity/${activityId}/standings`)
        setStandings(response.data)
      } catch (err) {
        console.error("Error fetching standings:", err)
        setError("Failed to load standings. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (activityId) {
      fetchStandings()
    }
  }, [activityId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-teal-400 animate-spin mb-2" />
          <span className="text-gray-300">Loading standings...</span>
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

  if (standings.length === 0) {
    return (
      <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center">
        <Trophy className="h-12 w-12 text-yellow-400 mb-3" />
        <h3 className="text-lg font-bold text-white mb-2">No Standings Available Yet</h3>
        <p className="text-gray-300">Standings will be generated once matches have been played. Check back later!</p>
      </div>
    )
  }

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/80 overflow-hidden h-full">
      <div className="p-5 border-b border-gray-700/80 bg-gradient-to-r from-teal-900/30 to-purple-900/30">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-amber-400" />
          League Standings
        </h3>
      </div>

      <div className="overflow-x-auto">
        <motion.table className="min-w-full" variants={tableVariants} initial="hidden" animate="visible">
          <thead className="bg-gradient-to-r from-gray-800/70 to-gray-700/70">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Pos
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Team
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                P
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                W
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                D
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                L
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                GF
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                GA
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                GD
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Pts
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {standings.map((standing, index) => (
              <motion.tr
                key={standing.team.id}
                variants={rowVariants}
                className={
                  index === 0
                    ? "bg-gradient-to-r from-amber-900/20 to-amber-800/5 hover:from-amber-900/30 hover:to-amber-800/10"
                    : index === 1
                      ? "bg-gradient-to-r from-slate-800/20 to-slate-700/5 hover:from-slate-800/30 hover:to-slate-700/10"
                      : index === 2
                        ? "bg-gradient-to-r from-orange-900/20 to-orange-800/5 hover:from-orange-900/30 hover:to-orange-800/10"
                        : "bg-gradient-to-r from-gray-800/10 to-transparent hover:from-gray-800/20"
                }
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index === 0 ? (
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full text-black font-bold shadow-lg shadow-amber-900/30 border border-amber-300/30">
                        <Medal className="h-4 w-4" />
                      </div>
                    ) : index === 1 ? (
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gradient-to-br from-gray-300 to-slate-400 rounded-full text-black font-bold shadow-lg shadow-slate-900/30 border border-slate-300/30">
                        <Medal className="h-4 w-4" />
                      </div>
                    ) : index === 2 ? (
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gradient-to-br from-orange-400 to-amber-700 rounded-full text-black font-bold shadow-lg shadow-amber-900/30 border border-amber-500/30">
                        <Medal className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-full text-white font-bold shadow-lg shadow-black/30 border border-gray-600/30">
                        {index + 1}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Shield
                      className={`h-5 w-5 mr-2 ${
                        index === 0
                          ? "text-amber-400"
                          : index === 1
                            ? "text-slate-300"
                            : index === 2
                              ? "text-orange-400"
                              : "text-teal-400"
                      }`}
                    />
                    <span className={`font-medium ${index < 3 ? "text-white" : "text-gray-300"}`}>
                      {standing.team.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                  {standing.matchesPlayed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 text-center font-medium">
                  {standing.wins}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-400 text-center font-medium">
                  {standing.draws}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-rose-400 text-center font-medium">
                  {standing.losses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-400 text-center font-medium">
                  {standing.goalsFor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                  {standing.goalsAgainst}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                  <span
                    className={
                      standing.goalDifference > 0
                        ? "text-emerald-400"
                        : standing.goalDifference < 0
                          ? "text-rose-400"
                          : "text-gray-300"
                    }
                  >
                    {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="px-3 py-1 inline-flex text-lg leading-5 font-bold rounded-full bg-gradient-to-r from-teal-900/30 to-purple-900/30 text-teal-300 shadow-inner border border-teal-700/30">
                    {standing.points}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      <div className="p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/30 to-gray-700/30">
        <div className="grid grid-cols-5 gap-2 text-xs text-gray-400">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-emerald-400 rounded-full mr-1"></span>
            <span>W: Win</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-amber-400 rounded-full mr-1"></span>
            <span>D: Draw</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-rose-400 rounded-full mr-1"></span>
            <span>L: Loss</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-teal-400 rounded-full mr-1"></span>
            <span>GF: Goals For</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-gray-400 rounded-full mr-1"></span>
            <span>GA: Goals Against</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Standing
