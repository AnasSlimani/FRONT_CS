"use client"

import { useState, useEffect } from "react"
import { Trophy, Loader2, User, Users, Star, Medal } from 'lucide-react'
import api from "@/app/api/axios"
import { motion } from "framer-motion"

const TopScorersList = ({ activityId }) => {
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
        console.log("Top scorers data:", response.data) // Add this line to debug
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
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-3" />
          <p className="text-indigo-600 animate-pulse">Loading top scorers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 h-full">
        <div className="text-red-500 text-center bg-red-50 p-4 rounded-lg border border-red-200">{error}</div>
      </div>
    )
  }

  if (!topScorers || topScorers.length === 0) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md p-6 h-full">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-indigo-100 p-3 rounded-full mr-3">
            <Trophy className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Top Scorers
          </h2>
        </div>
        <div className="text-gray-500 text-center italic bg-white p-8 rounded-lg border border-indigo-100 shadow-sm">
          <Star className="h-12 w-12 text-indigo-200 mx-auto mb-3" />
          <p>No goal scorers yet. Check back after matches have been played.</p>
        </div>
      </div>
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md p-6 h-full">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-indigo-100 p-3 rounded-full mr-3">
          <Trophy className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Top Scorers
        </h2>
      </div>

      <motion.div 
        className="overflow-hidden rounded-xl border border-indigo-100 shadow-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
              <th className="px-4 py-3 rounded-tl-lg">#</th>
              <th className="px-4 py-3">PLAYER</th>
              <th className="px-4 py-3">TEAM</th>
              <th className="px-4 py-3 rounded-tr-lg text-center">GOALS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-100">
            {topScorers.map((scorer, index) => {
              console.log("Rendering scorer:", scorer) // Add this line to debug
              return (
                <motion.tr 
                  key={`${scorer.scorerId}-${index}`} 
                  className={index % 2 === 0 ? "bg-white" : "bg-indigo-50"}
                  variants={itemVariants}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    {index < 3 ? (
                      <div className={`flex items-center justify-center w-7 h-7 rounded-full 
                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                          index === 1 ? 'bg-gray-100 text-gray-700' : 
                          'bg-amber-100 text-amber-700'}`}>
                        <Medal className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-gray-900 pl-2">{index + 1}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-1.5 rounded-full mr-3">
                        <User className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="font-medium text-gray-800">{scorer.scorerName || "Unknown Player"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-1.5 rounded-full mr-3">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-gray-700">{scorer.team ? scorer.team.name : "Unknown Team"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full font-medium">
                      {scorer.goals}
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}

export default TopScorersList
