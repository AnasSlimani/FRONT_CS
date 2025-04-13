"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, MapPin, Loader2, Plus, Edit, Trash2, AlertCircle, Shield } from 'lucide-react'
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
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-3" />
          <p className="text-indigo-600 animate-pulse">Loading matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full mr-3">
            <Calendar className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Tournament Matches
          </h3>
        </div>
      </div>

      <Tabs defaultValue="1" value={activeGameweek} onValueChange={setActiveGameweek}>
        <div className="mb-8 flex justify-center">
          <TabsList className="inline-flex bg-indigo-50 p-1.5 rounded-full shadow-inner">
            <TabsTrigger
              value="1"
              className="px-5 py-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-medium"
            >
              Gameweek 1
            </TabsTrigger>
            <TabsTrigger
              value="2"
              className="px-5 py-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-medium"
            >
              Gameweek 2
            </TabsTrigger>
            <TabsTrigger
              value="3"
              className="px-5 py-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-medium"
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
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-8 text-center">
                <Calendar className="h-16 w-16 mx-auto text-indigo-300 mb-4" />
                <h4 className="text-xl font-medium text-indigo-800 mb-3">No Matches Generated</h4>
                <p className="text-indigo-600 mb-6 max-w-md mx-auto">
                  There are no matches for Gameweek {gameweek} yet. Generate matches to get started.
                </p>
                <Button
                  onClick={() => handleGenerateMatches(gameweek)}
                  disabled={isGeneratingMatches}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md"
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
                    <p className="text-red-700 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      {generationError}
                    </p>
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
  const getStatusBadge = (status) => {
    switch (status) {
      case "played":
        return "bg-green-100 text-green-800 border border-green-200";
      case "canceled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border border-amber-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "played":
        return "Played";
      case "canceled":
        return "Canceled";
      default:
        return "Scheduled";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(79, 70, 229, 0.2)" }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-indigo-100 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-indigo-100/30 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm border border-indigo-100">
            <Calendar className="h-4 w-4 text-indigo-500 mr-2" />
            <span className="text-sm font-medium text-indigo-700">{new Date(match.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm border border-indigo-100">
            <Clock className="h-4 w-4 text-indigo-500 mr-2" />
            <span className="text-sm font-medium text-indigo-700">{match.time || "TBD"}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusBadge(match.status)}`}
          >
            {getStatusText(match.status)}
          </span>
          <button 
            onClick={onEdit} 
            className="p-2 text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={onDelete} 
            className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 text-right pr-4 flex flex-col items-end">
            <div className="flex items-center mb-1">
              <h4 className="font-bold text-gray-800 mr-2">{match.teamA?.name || "Team A"}</h4>
              <div className="bg-indigo-100 p-1.5 rounded-full">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <span className="text-sm text-gray-500">Home</span>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg px-6 py-3 flex items-center justify-center min-w-[120px] shadow-md">
              <span className="text-3xl font-bold text-white">
                {match.scoreTeamA !== null && match.scoreTeamA !== undefined ? match.scoreTeamA : "-"}
              </span>
              <span className="mx-2 text-indigo-200 font-light">vs</span>
              <span className="text-3xl font-bold text-white">
                {match.scoreTeamB !== null && match.scoreTeamB !== undefined ? match.scoreTeamB : "-"}
              </span>
            </div>
          </div>
          <div className="flex-1 pl-4 flex flex-col items-start">
            <div className="flex items-center mb-1">
              <div className="bg-purple-100 p-1.5 rounded-full mr-2">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-800">{match.teamB?.name || "Team B"}</h4>
            </div>
            <span className="text-sm text-gray-500">Away</span>
          </div>
        </div>

        <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 py-2 px-4 rounded-full">
          <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
          <span>{match.location || "TBD"}</span>
        </div>

        {match.goalEvents && match.goalEvents.length > 0 && (
          <Accordion type="single" collapsible className="mt-4 border border-indigo-100 rounded-lg overflow-hidden">
            <AccordionItem value="goals" className="border-0">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                Goal Scorers
              </AccordionTrigger>
              <AccordionContent className="bg-white px-4 py-3">
                <ul className="space-y-2 divide-y divide-indigo-100">
                  {match.goalEvents.map((goal, index) => (
                    <li key={goal.id || index} className="flex items-center justify-between pt-2 first:pt-0">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-medium text-indigo-700">
                          {goal.minute}'
                        </div>
                        <span className="font-medium text-gray-800">{goal.scorerName}</span>
                      </div>
                      {goal.isOwnGoal && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium border border-red-200">
                          OG
                        </span>
                      )}
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
