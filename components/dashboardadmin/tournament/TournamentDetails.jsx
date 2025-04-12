"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, Table, Award, Loader2, AlertCircle } from 'lucide-react'
import api from "@/app/api/axios"
import TeamsList from "./TeamsList"
import MatchesList from "./MatchesList"
import StandingsTable from "./StandingsTable"
import TopScorersList from "./TopScorersList"

const TournamentDetails = ({ activityId }) => {
  const [activity, setActivity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("teams")

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
      <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-3" />
          <p className="text-indigo-600 animate-pulse">Loading tournament details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start">
        <AlertCircle className="h-6 w-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-1">Error Loading Tournament</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start">
        <AlertCircle className="h-6 w-6 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-1">Tournament Not Found</h3>
          <p className="text-yellow-700">The requested tournament could not be found.</p>
        </div>
      </div>
    )
  }

  // Check if this is a football tournament
  const isFootballTournament = activity.type === "tournament" && activity.sport === "football"

  if (!isFootballTournament) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start">
        <AlertCircle className="h-6 w-6 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-1">Not a Football Tournament</h3>
          <p className="text-yellow-700">This activity is not a football tournament.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
      {/* Tournament Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold">{activity.name} Tournament</h2>
        <p className="text-indigo-100 mt-1">{activity.description}</p>
      </div>

      {/* Tournament Content */}
      <div className="p-6">
        <Tabs defaultValue="teams" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 w-full bg-indigo-50 p-1.5 rounded-xl shadow-inner">
            <TabsTrigger
              value="teams"
              className="flex text-indigo-700 items-center gap-2 px-4 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 transition-all duration-300"
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Teams</span>
            </TabsTrigger>
            <TabsTrigger
              value="matches"
              className="flex text-indigo-700 items-center gap-2 px-4 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 transition-all duration-300"
            >
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Matches</span>
            </TabsTrigger>
            <TabsTrigger
              value="standings"
              className="flex text-indigo-700 items-center gap-2 px-4 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 transition-all duration-300"
            >
              <Table className="h-5 w-5" />
              <span className="font-medium">Standings</span>
            </TabsTrigger>
            <TabsTrigger
              value="topscorers"
              className="flex text-indigo-700 items-center gap-2 px-4 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 transition-all duration-300"
            >
              <Award className="h-5 w-5" />
              <span className="font-medium">Top Scorers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            <TeamsList activity={activity} />
          </TabsContent>

          <TabsContent value="matches">
            <MatchesList activityId={activity.id} />
          </TabsContent>

          <TabsContent value="standings">
            <StandingsTable activityId={activity.id} />
          </TabsContent>

          <TabsContent value="topscorers">
            <TopScorersList activityId={activity.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default TournamentDetails
