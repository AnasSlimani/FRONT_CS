"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Calendar, Clock, MapPin, Table, Award, Loader2, AlertCircle, User } from "lucide-react"
import api from "@/app/api/axios"
import Image from "next/image"

const TournamentView = ({ activityId }) => {
  const [activity, setActivity] = useState(null)
  const [matches, setMatches] = useState([])
  const [standings, setStandings] = useState([])
  const [topScorers, setTopScorers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("matches")

  useEffect(() => {
    const fetchTournamentData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch activity details
        const activityResponse = await api.get(`/activities/${activityId}`)
        setActivity(activityResponse.data)

        // Fetch matches
        const matchesResponse = await api.get(`/matches/activity/${activityId}`)
        setMatches(matchesResponse.data)

        // Fetch standings
        const standingsResponse = await api.get(`/matches/activity/${activityId}/standings`)
        setStandings(standingsResponse.data)

        // Fetch top scorers
        const scorersResponse = await api.get(`/matches/activity/${activityId}/topscorers`)
        setTopScorers(scorersResponse.data)
      } catch (err) {
        console.error("Error fetching tournament data:", err)
        setError("Failed to load tournament data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (activityId) {
      fetchTournamentData()
    }
  }, [activityId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading tournament data...</span>
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

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Tournament Header */}
      <div className="p-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Trophy className="h-6 w-6 mr-2" />
              {activity.name}
            </h2>
            <p className="mt-1 text-amber-100">{activity.description}</p>
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
        <Tabs defaultValue="matches" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
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

          <TabsContent value="matches">
            <MatchesView matches={matches} />
          </TabsContent>

          <TabsContent value="standings">
            <StandingsView standings={standings} />
          </TabsContent>

          <TabsContent value="topscorers">
            <TopScorersView topScorers={topScorers} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Matches View Component
const MatchesView = ({ matches }) => {
  const [activeGameweek, setActiveGameweek] = useState("1")

  // Group matches by gameweek
  const matchesByGameweek = matches.reduce((acc, match) => {
    const gameweek = match.gameweek.toString()
    if (!acc[gameweek]) {
      acc[gameweek] = []
    }
    acc[gameweek].push(match)
    return acc
  }, {})

  if (matches.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-yellow-700">No matches have been scheduled yet.</p>
      </div>
    )
  }

  return (
    <div>
      <Tabs defaultValue="1" value={activeGameweek} onValueChange={setActiveGameweek}>
        <TabsList className="mb-6">
          <TabsTrigger value="1" className="flex items-center">
            Gameweek 1
          </TabsTrigger>
          <TabsTrigger value="2" className="flex items-center">
            Gameweek 2
          </TabsTrigger>
          <TabsTrigger value="3" className="flex items-center">
            Gameweek 3
          </TabsTrigger>
        </TabsList>

        {[1, 2, 3].map((gameweek) => (
          <TabsContent key={gameweek} value={gameweek.toString()}>
            {matchesByGameweek[gameweek] && matchesByGameweek[gameweek].length > 0 ? (
              <div className="space-y-4">
                {matchesByGameweek[gameweek].map((match) => (
                  <div key={match.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">{new Date(match.date).toLocaleDateString()}</span>
                        <Clock className="h-4 w-4 text-gray-500 ml-4 mr-2" />
                        <span className="text-sm text-gray-600">{match.time || "TBD"}</span>
                      </div>
                      <div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            match.status === "played"
                              ? "bg-green-100 text-green-800"
                              : match.status === "canceled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {match.status === "played"
                            ? "Played"
                            : match.status === "canceled"
                              ? "Canceled"
                              : "Scheduled"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1 text-right pr-4">
                          <h4 className="font-bold text-gray-800">{match.teamA?.name || "Team A"}</h4>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center justify-center min-w-[100px]">
                            <span className="text-2xl font-bold text-gray-800">
                              {match.scoreTeamA !== null && match.scoreTeamA !== undefined ? match.scoreTeamA : "-"}
                            </span>
                            <span className="mx-2 text-gray-400">vs</span>
                            <span className="text-2xl font-bold text-gray-800">
                              {match.scoreTeamB !== null && match.scoreTeamB !== undefined ? match.scoreTeamB : "-"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 pl-4">
                          <h4 className="font-bold text-gray-800">{match.teamB?.name || "Team B"}</h4>
                        </div>
                      </div>

                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{match.location || "TBD"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-800 mb-2">No Matches Available</h4>
                <p className="text-gray-600">There are no matches scheduled for Gameweek {gameweek} yet.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// Standings View Component
const StandingsView = ({ standings }) => {
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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
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
                className={index < 3 ? "bg-green-50" : ""}
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

// Top Scorers View Component
const TopScorersView = ({ topScorers }) => {
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

  return (
    <div>
      <div className="space-y-4">
        {topScorers.map((scorer, index) => (
          <motion.div
            key={scorer.userId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
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
                <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">
                  {scorer.goals} {scorer.goals === 1 ? "goal" : "goals"}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default TournamentView
