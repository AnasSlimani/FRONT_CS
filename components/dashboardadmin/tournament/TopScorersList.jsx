"use client"

import { useState, useEffect } from "react"
import { Trophy, Loader2, User, Users } from "lucide-react"
import api from "@/app/api/axios"

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
      <div className="bg-white rounded-xl shadow-md p-6 h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 h-full">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    )
  }

  if (!topScorers || topScorers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 h-full">
        <div className="flex items-center justify-center mb-4">
          <Trophy className="h-6 w-6 text-teal-500 mr-2" />
          <h2 className="text-lg font-bold text-gray-800">Top Scorers</h2>
        </div>
        <div className="text-gray-500 text-center italic">
          No goal scorers yet. Check back after matches have been played.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full">
      <div className="flex items-center justify-center mb-4">
        <Trophy className="h-6 w-6 text-teal-500 mr-2" />
        <h2 className="text-lg font-bold text-gray-800">Top Scorers</h2>
      </div>

      <div className="overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-teal-50 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider">
              <th className="px-4 py-2 rounded-tl-lg">#</th>
              <th className="px-4 py-2">PLAYER</th>
              <th className="px-4 py-2">TEAM</th>
              <th className="px-4 py-2 rounded-tr-lg text-center">GOALS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topScorers.map((scorer, index) => {
              console.log("Rendering scorer:", scorer) // Add this line to debug
              return (
                <tr key={`${scorer.scorerId}-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-teal-500 mr-2" />
                      <span>{scorer.scorerName || "Unknown Player"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-teal-500 mr-2" />
                      <span>{scorer.team ? scorer.team.name : "Unknown Team"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-teal-600 text-center">
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full">{scorer.goals}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TopScorersList
