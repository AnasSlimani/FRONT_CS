"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Award, Loader2, AlertCircle, User } from "lucide-react"
import api from "@/app/api/axios"
import Image from "next/image"

const TopScorersList = ({ activityId }) => {
  const [topScorers, setTopScorers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopScorers = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get(`/matches/activity/${activityId}/topscorers`)
        setTopScorers(response.data)
      } catch (err) {
        console.error("Error fetching top scorers:", err)
        setError("Failed to load top scorers. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (activityId) {
      fetchTopScorers()
    }
  }, [activityId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading top scorers...</span>
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

  if (topScorers.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-yellow-700">
          No goal scorers available yet. Top scorers will be shown once goals have been recorded.
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
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Award className="h-5 w-5 mr-2 text-teal-500" />
          Top Scorers
        </h3>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {topScorers.map((scorer, index) => (
          <motion.div
            key={scorer.userId}
            variants={itemVariants}
            className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${
              index === 0 ? "border-yellow-300 shadow-yellow-100" : ""
            }`}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {scorer.profilePicture ? (
                        <Image
                          src={scorer.profilePicture || "/placeholder.svg"}
                          alt={scorer.username}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                        <Award className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800">{scorer.username}</h4>
                  <p className="text-sm text-gray-500">{scorer.team?.name || "Unknown Team"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-bold">
                  {scorer.goals} {scorer.goals === 1 ? "goal" : "goals"}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default TopScorersList
