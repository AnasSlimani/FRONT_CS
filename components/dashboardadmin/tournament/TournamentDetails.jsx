"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, Table, Award, Loader2, AlertCircle } from "lucide-react"
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading tournament details...</span>
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

  if (!activity) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-yellow-700">Tournament not found.</p>
      </div>
    )
  }

  // Check if this is a football tournament
  const isFootballTournament = activity.type === "tournament" && activity.sport === "football"

  if (!isFootballTournament) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-yellow-700">This activity is not a football tournament.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Tournament Header */}

      {/* Tournament Content */}
      <div className="p-6">
        <Tabs defaultValue="teams" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 w-full bg-gray-100 p-1.5 rounded-xl shadow-inner">
            <TabsTrigger
              value="teams"
              className="flex text-black items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-amber-600 transition-all duration-300"
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Teams</span>
            </TabsTrigger>
            <TabsTrigger
              value="matches"
              className="flex text-black items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-amber-600 transition-all duration-300"
            >
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Matches</span>
            </TabsTrigger>
            <TabsTrigger
              value="standings"
              className="flex text-black items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-amber-600 transition-all duration-300"
            >
              <Table className="h-5 w-5" />
              <span className="font-medium">Standings</span>
            </TabsTrigger>
            <TabsTrigger
              value="topscorers"
              className="flex text-black items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-amber-600 transition-all duration-300"
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
