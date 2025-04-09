"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Loader2, Plus, Edit, Trash2 } from "lucide-react"
import api from "@/app/api/axios"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import MatchResultModal from "./MatchResultModal"

const MatchesList = ({ activityId }) => {
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeGameweek, setActiveGameweek] = useState("1")
  const [isGeneratingMatches, setIsGeneratingMatches] = useState(false)
  const [generationError, setGenerationError] = useState(null)
  const [showMatchResultModal, setShowMatchResultModal] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)

  // Fetch matches for the activity
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get(`/matches/activity/${activityId}`)
        setMatches(response.data)
      } catch (err) {
        console.error("Error fetching matches:", err)
        setError("Failed to load matches. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (activityId) {
      fetchMatches()
    }
  }, [activityId])

  // Generate matches for a gameweek
  const handleGenerateMatches = async (gameweek) => {
    setIsGeneratingMatches(true)
    setGenerationError(null)
    try {
      const response = await api.post(`/matches/generate?activityId=${activityId}&gameweek=${gameweek}`)
      // Add new matches to the state
      setMatches([...matches, ...response.data])
    } catch (err) {
      console.error("Error generating matches:", err)
      setGenerationError(err.response?.data || "Failed to generate matches. Please try again.")
    } finally {
      setIsGeneratingMatches(false)
    }
  }

  // Open match result modal
  const handleEditMatch = (match) => {
    setSelectedMatch(match)
    setShowMatchResultModal(true)
  }

  // Handle match update
  const handleMatchUpdate = (updatedMatch) => {
    // Update matches state
    setMatches(matches.map((match) => (match.id === updatedMatch.id ? updatedMatch : match)))
    setShowMatchResultModal(false)
  }

  // Delete match
  const handleDeleteMatch = async (matchId) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      try {
        await api.delete(`/matches/${matchId}`)
        // Remove match from state
        setMatches(matches.filter((match) => match.id !== matchId))
      } catch (err) {
        console.error("Error deleting match:", err)
        alert("Failed to delete match. Please try again.")
      }
    }
  }

  // Filter matches by gameweek
  const getMatchesByGameweek = (gameweek) => {
    return matches.filter((match) => match.gameweek === Number.parseInt(gameweek))
  }

  // Check if matches exist for a gameweek
  const hasMatchesForGameweek = (gameweek) => {
    return getMatchesByGameweek(gameweek).length > 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading matches...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-teal-500" />
          Tournament Matches
        </h3>
      </div>

      <Tabs defaultValue="1" value={activeGameweek} onValueChange={setActiveGameweek}>
        <div className="mb-8 flex justify-center">
          <TabsList className="inline-flex bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-full shadow-inner">
            <TabsTrigger
              value="1"
              className="px-5 py-2 rounded-full data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-medium"
            >
              Gameweek 1
            </TabsTrigger>
            <TabsTrigger
              value="2"
              className="px-5 py-2 rounded-full data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-medium"
            >
              Gameweek 2
            </TabsTrigger>
            <TabsTrigger
              value="3"
              className="px-5 py-2 rounded-full data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-medium"
            >
              Gameweek 3
            </TabsTrigger>
          </TabsList>
        </div>

        {[1, 2, 3].map((gameweek) => (
          <TabsContent key={gameweek} value={gameweek.toString()}>
            {hasMatchesForGameweek(gameweek.toString()) ? (
              <div className="space-y-4">
                {getMatchesByGameweek(gameweek.toString()).map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onEdit={() => handleEditMatch(match)}
                    onDelete={() => handleDeleteMatch(match.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-800 mb-2">No Matches Generated</h4>
                <p className="text-gray-600 mb-6">
                  There are no matches for Gameweek {gameweek} yet. Generate matches to get started.
                </p>
                <Button
                  onClick={() => handleGenerateMatches(gameweek)}
                  disabled={isGeneratingMatches}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  {isGeneratingMatches ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Matches
                    </>
                  )}
                </Button>
                {generationError && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-left">
                    <p className="text-red-700 text-sm">{generationError}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Match Result Modal */}
      {showMatchResultModal && (
        <MatchResultModal
          match={selectedMatch}
          isOpen={showMatchResultModal}
          onClose={() => setShowMatchResultModal(false)}
          onSave={handleMatchUpdate}
        />
      )}
    </div>
  )
}

// Match Card Component
const MatchCard = ({ match, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">{new Date(match.date).toLocaleDateString()}</span>
          <Clock className="h-4 w-4 text-gray-500 ml-4 mr-2" />
          <span className="text-sm text-gray-600">{match.time || "TBD"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              match.status === "played"
                ? "bg-green-100 text-green-800"
                : match.status === "canceled"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {match.status === "played" ? "Played" : match.status === "canceled" ? "Canceled" : "Scheduled"}
          </span>
          <button onClick={onEdit} className="p-1 text-gray-500 hover:text-teal-500 transition-colors">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-500 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
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

        {match.goalEvents && match.goalEvents.length > 0 && (
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="goals">
              <AccordionTrigger className="text-sm font-medium text-gray-700">Goal Scorers</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 text-sm">
                  {match.goalEvents.map((goal, index) => (
                    <li key={goal.id || index} className="flex items-center justify-between">
                      <span className="text-gray-700">{goal.scorerName}</span>
                      <div className="flex items-center">
                        <span className="text-gray-500">{goal.minute}'</span>
                        {goal.isOwnGoal && (
                          <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-xs">OG</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </motion.div>
  )
}

export default MatchesList
