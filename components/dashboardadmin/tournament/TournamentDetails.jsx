"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, Calendar, Clock, MapPin, Table, Award, Loader2, AlertCircle } from "lucide-react"
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
      <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Trophy className="h-6 w-6 mr-2" />
              {activity.name}
            </h2>
            <p className="mt-1 text-teal-100">{activity.description}</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(activity.startingDate).toLocaleDateString()} -{" "}
              {new Date(activity.endingDate).toLocaleDateString()}
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {activity.time}
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {activity.localisation}
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Content */}
      <div className="p-6">
        <Tabs defaultValue="teams" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="teams" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Matches
            </TabsTrigger>
            <TabsTrigger value="standings" className="flex items-center">
              <Table className="h-4 w-4 mr-2" />
              Standings
            </TabsTrigger>
            <TabsTrigger value="topscorers" className="flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Top Scorers
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
