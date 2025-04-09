"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Loader2, AlertCircle } from "lucide-react"
import api from "@/app/api/axios"

const StandingsTable = ({ activityId }) => {
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading standings...</span>
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

  if (standings.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-yellow-700">
          No standings available yet. Standings will be generated once matches have been played.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-teal-500" />
          League Standings
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Pos
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Team
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                P
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                W
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                D
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                L
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                GF
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                GA
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                GD
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Pts
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {standings.map((standing, index) => (
              <motion.tr
                key={standing.team.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={
                  index === 0
                    ? "bg-gradient-to-r from-yellow-50 to-yellow-100/50 font-medium"
                    : index === 1
                      ? "bg-gradient-to-r from-gray-50 to-gray-100/50"
                      : index === 2
                        ? "bg-gradient-to-r from-amber-50 to-amber-100/50"
                        : ""
                }
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{standing.team.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {standing.matchesPlayed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{standing.wins}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{standing.draws}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{standing.losses}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{standing.goalsFor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {standing.goalsAgainst}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                  {standing.points}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          P = Played, W = Won, D = Drawn, L = Lost, GF = Goals For, GA = Goals Against, GD = Goal Difference, Pts =
          Points
        </p>
      </div>
    </div>
  )
}

export default StandingsTable
