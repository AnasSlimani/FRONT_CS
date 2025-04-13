"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Loader2, AlertCircle, Medal, ArrowUp, ArrowDown, Minus } from 'lucide-react'
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
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-3" />
          <p className="text-indigo-600 animate-pulse">Loading standings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start">
        <AlertCircle className="h-6 w-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-1">Error Loading Standings</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (standings.length === 0) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 flex flex-col items-center text-center">
        <Trophy className="h-12 w-12 text-amber-500 mb-3" />
        <h3 className="text-lg font-semibold text-amber-800 mb-2">No Standings Available</h3>
        <p className="text-amber-700 max-w-md">
          Standings will be generated once matches have been played. Check back after the first round of matches.
        </p>
      </div>
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full mr-3">
            <Trophy className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            League Standings
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-xl border border-indigo-100 shadow-sm">
            <motion.table 
              className="min-w-full divide-y divide-indigo-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Pos
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Team
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    P
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    W
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    D
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    L
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    GF
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    GA
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    GD
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Pts
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Form
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-indigo-100">
                {standings.map((standing, index) => (
                  <motion.tr
                    key={standing.team.id}
                    variants={itemVariants}
                    className={
                      index === 0
                        ? "bg-gradient-to-r from-yellow-50 to-yellow-100/50 font-medium"
                        : index === 1
                          ? "bg-gradient-to-r from-gray-50 to-gray-100/50"
                          : index === 2
                            ? "bg-gradient-to-r from-amber-50 to-amber-100/50"
                            : index % 2 === 0 ? "bg-white" : "bg-indigo-50/30"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full 
                            ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                              index === 1 ? 'bg-gray-100 text-gray-700' : 
                              'bg-amber-100 text-amber-700'}`}>
                            <Medal className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-gray-900 pl-2">{index + 1}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <span className="font-bold text-indigo-600">{standing.team.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-gray-900">{standing.team.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium">
                      {standing.matchesPlayed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-center font-medium">
                      {standing.wins}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 text-center font-medium">
                      {standing.draws}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center font-medium">
                      {standing.losses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 text-center font-medium">
                      {standing.goalsFor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center font-medium">
                      {standing.goalsAgainst}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      <span className={`px-2 py-1 rounded-full ${
                        standing.goalDifference > 0 
                          ? 'bg-green-100 text-green-700' 
                          : standing.goalDifference < 0 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-gray-100 text-gray-700'
                      }`}>
                        {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full font-bold">
                        {standing.points}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        {/* Mock form - would be replaced with actual form data */}
                        {Array.from({ length: 5 }).map((_, i) => {
                          const random = Math.floor(Math.random() * 3);
                          return (
                            <div key={i} className={`w-6 h-6 flex items-center justify-center rounded-full 
                              ${random === 0 
                                ? 'bg-green-100 text-green-700' 
                                : random === 1 
                                  ? 'bg-amber-100 text-amber-700' 
                                  : 'bg-red-100 text-red-700'}`}>
                              {random === 0 ? <ArrowUp className="h-3 w-3" /> : 
                               random === 1 ? <Minus className="h-3 w-3" /> : 
                               <ArrowDown className="h-3 w-3" />}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-sm text-indigo-700">
        <h4 className="font-medium mb-2">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center">
            <span className="w-4 h-4 bg-indigo-500 rounded-full mr-2"></span>
            <span>P = Played</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
            <span>W = Won</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-amber-500 rounded-full mr-2"></span>
            <span>D = Drawn</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
            <span>L = Lost</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
            <span>Pts = Points</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-indigo-500 rounded-full mr-2"></span>
            <span>GF = Goals For</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-gray-500 rounded-full mr-2"></span>
            <span>GA = Goals Against</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
            <span>GD = Goal Difference</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StandingsTable
