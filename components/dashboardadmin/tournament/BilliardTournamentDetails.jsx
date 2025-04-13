"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy,
  Loader2,
  AlertCircle,
  Check,
  RefreshCw,
  X,
  Award,
  Sparkles,
  CogIcon as Cue,
  Target,
} from "lucide-react"
import api from "@/app/api/axios"
import { Button } from "@/components/ui/button"
import AvatarImage from "@/components/ui/avatar-image"
import confetti from "canvas-confetti"

const BilliardTournamentDetails = ({ activityId }) => {
  const [activity, setActivity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tournamentData, setTournamentData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [activeMatchDetails, setActiveMatchDetails] = useState(null)
  const confettiRef = useRef(null)

  // Run confetti animation
  const runConfetti = () => {
    if (confettiRef.current) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#d97706", "#92400e", "#78350f"],
      })
    }
  }

  useEffect(() => {
    const fetchActivityDetails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch activity details
        const activityResponse = await api.get(`/activities/${activityId}`)
        setActivity(activityResponse.data)

        // Fetch tournament data if it exists
        try {
          const tournamentResponse = await api.get(`/billiard-tournaments/${activityId}`)
          if (tournamentResponse.data) {
            setTournamentData(tournamentResponse.data)
          }
        } catch (tournamentErr) {
          // No existing tournament data, which is fine
          console.log("No existing tournament data found")
        }
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

  const generateTournament = async () => {
    if (!activity || !activity.individualParticipants || activity.individualParticipants.length < 8) {
      setError("Need at least 8 participants to generate the tournament bracket.")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Create tournament on backend
      const response = await api.post(`/billiard-tournaments`, {
        activityId,
        participants: activity.individualParticipants,
      })

      setTournamentData(response.data)
      showSuccess("Tournament bracket generated successfully!")
      setTimeout(() => runConfetti(), 300)
    } catch (err) {
      console.error("Error generating tournament:", err)
      setError("Failed to generate tournament. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const advancePlayer = async (round, matchIndex, winnerId, player1Score, player2Score) => {
    try {
      const response = await api.put(`/billiard-tournaments/${activityId}/matches`, {
        round,
        matchIndex,
        winnerId,
        player1Score,
        player2Score,
      })

      setTournamentData(response.data)
      setActiveMatchDetails(null)

      if (round === "final") {
        showSuccess("Tournament completed! We have a champion!")
        setTimeout(() => runConfetti(), 300)
      } else {
        showSuccess("Player advanced to the next round!")
      }
    } catch (err) {
      console.error("Error advancing player:", err)
      setError("Failed to update match result. Please try again.")
    }
  }

  const resetTournament = async () => {
    if (!window.confirm("Are you sure you want to reset the tournament? All progress will be lost.")) {
      return
    }

    try {
      await api.delete(`/billiard-tournaments/${activityId}`)
      setTournamentData(null)
      showSuccess("Tournament reset successfully!")
    } catch (err) {
      console.error("Error resetting tournament:", err)
      setError("Failed to reset tournament. Please try again.")
    }
  }

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const openMatchDetails = (round, matchIndex, match) => {
    if (!match.player1 || !match.player2) return

    setActiveMatchDetails({
      round,
      matchIndex,
      match,
      player1Score: match.player1Score || 0,
      player2Score: match.player2Score || 0,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-amber-500 animate-spin mb-3" />
          <p className="text-amber-600 animate-pulse">Loading tournament details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start mb-6">
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

  const hasGeneratedBracket = tournamentData !== null
  const champion = tournamentData?.champion

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200" ref={confettiRef}>
      {/* Success message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-center"
          >
            <Check className="h-5 w-5 mr-2 text-green-500" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match details modal */}
      <AnimatePresence>
        {activeMatchDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setActiveMatchDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-xl flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center">
                  <Cue className="h-5 w-5 mr-2" />
                  {activeMatchDetails.round === "quarterFinals" && "Quarter-Final"}
                  {activeMatchDetails.round === "semiFinals" && "Semi-Final"}
                  {activeMatchDetails.round === "final" && "Final"}
                  {" Match"}
                </h3>
                <button
                  onClick={() => setActiveMatchDetails(null)}
                  className="text-white hover:text-amber-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <AvatarImage
                          src={activeMatchDetails.match.player1?.profilePicture || "/placeholder.svg"}
                          alt={activeMatchDetails.match.player1?.username}
                          size={48}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{activeMatchDetails.match.player1?.username}</div>
                        <div className="text-sm text-gray-500">Player 1</div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        value={activeMatchDetails.player1Score}
                        onChange={(e) =>
                          setActiveMatchDetails({
                            ...activeMatchDetails,
                            player1Score: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-12 text-center text-lg font-bold text-amber-700 bg-transparent border-none focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <AvatarImage
                          src={activeMatchDetails.match.player2?.profilePicture || "/placeholder.svg"}
                          alt={activeMatchDetails.match.player2?.username}
                          size={48}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{activeMatchDetails.match.player2?.username}</div>
                        <div className="text-sm text-gray-500">Player 2</div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        value={activeMatchDetails.player2Score}
                        onChange={(e) =>
                          setActiveMatchDetails({
                            ...activeMatchDetails,
                            player2Score: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-12 text-center text-lg font-bold text-amber-700 bg-transparent border-none focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveMatchDetails(null)}
                    className="border-gray-300 text-gray-700"
                  >
                    Cancel
                  </Button>

                  <div className="space-x-2">
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      onClick={() =>
                        advancePlayer(
                          activeMatchDetails.round,
                          activeMatchDetails.matchIndex,
                          activeMatchDetails.match.player1.id,
                          activeMatchDetails.player1Score,
                          activeMatchDetails.player2Score,
                        )
                      }
                    >
                      Player 1 Wins
                    </Button>

                    <Button
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      onClick={() =>
                        advancePlayer(
                          activeMatchDetails.round,
                          activeMatchDetails.matchIndex,
                          activeMatchDetails.match.player2.id,
                          activeMatchDetails.player1Score,
                          activeMatchDetails.player2Score,
                        )
                      }
                    >
                      Player 2 Wins
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-3 rounded-full mr-3">
              <Trophy className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Billiard Tournament</h2>
          </div>

          {hasGeneratedBracket && (
            <Button
              onClick={resetTournament}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Tournament
            </Button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Tournament Champion (if exists) */}
        {champion && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-xl border border-amber-200 text-center"
          >
            <div className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-full mb-3 shadow-md">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-amber-800 mb-3">Tournament Champion</h3>
            <div className="flex items-center justify-center">
              <div className="mr-3">
                <AvatarImage src={champion.profilePicture || "/placeholder.svg"} alt={champion.username} size={64} />
              </div>
              <div className="text-left">
                <span className="text-xl font-bold text-gray-800 block">{champion.username}</span>
                <span className="text-amber-600 font-medium">Congratulations!</span>
              </div>
            </div>

            <motion.div
              className="mt-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <div className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                <Award className="h-4 w-4 inline-block mr-1" />
                Tournament Winner
              </div>
            </motion.div>
          </motion.div>
        )}

        {hasGeneratedBracket ? (
          <div className="relative mt-8">
            {/* Tournament Bracket */}
            <div className="tournament-bracket">
              {/* Row 1: Quarter Finals */}
              <div className="bracket-row">
                <div className="bracket-column left-column">
                  <div className="bracket-header">Quarter-Final 1</div>
                  <div className="bracket-match">
                    <MatchCard
                      match={tournamentData.quarterFinals[0]}
                      onSelect={() => openMatchDetails("quarterFinals", 0, tournamentData.quarterFinals[0])}
                    />
                  </div>
                </div>

                <div className="bracket-column center-column">
                  <div className="bracket-header">Semi-Final 1</div>
                  <div className="bracket-match">
                    <MatchCard
                      match={tournamentData.semiFinals[0]}
                      onSelect={() => openMatchDetails("semiFinals", 0, tournamentData.semiFinals[0])}
                    />
                  </div>
                </div>

                <div className="bracket-column right-column">
                  <div className="bracket-header">Quarter-Final 3</div>
                  <div className="bracket-match">
                    <MatchCard
                      match={tournamentData.quarterFinals[2]}
                      onSelect={() => openMatchDetails("quarterFinals", 2, tournamentData.quarterFinals[2])}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Final */}
              <div className="bracket-row">
                <div className="bracket-column center-column final-column">
                  <div className="bracket-header">Final</div>
                  <div className="bracket-match">
                    <MatchCard
                      match={tournamentData.finalMatch}
                      onSelect={() => openMatchDetails("final", 0, tournamentData.finalMatch)}
                      isFinal={true}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Quarter Finals */}
              <div className="bracket-row">
                <div className="bracket-column left-column">
                  <div className="bracket-header">Quarter-Final 2</div>
                  <div className="bracket-match">
                    <MatchCard
                      match={tournamentData.quarterFinals[1]}
                      onSelect={() => openMatchDetails("quarterFinals", 1, tournamentData.quarterFinals[1])}
                    />
                  </div>
                </div>

                <div className="bracket-column center-column">
                  <div className="bracket-header">Semi-Final 2</div>
                  <div className="bracket-match">
                    <MatchCard
                      match={tournamentData.semiFinals[1]}
                      onSelect={() => openMatchDetails("semiFinals", 1, tournamentData.semiFinals[1])}
                    />
                  </div>
                </div>

                <div className="bracket-column right-column">
                  <div className="bracket-header">Quarter-Final 4</div>
                  <div className="bracket-match">
                    <MatchCard
                      match={tournamentData.quarterFinals[3]}
                      onSelect={() => openMatchDetails("quarterFinals", 3, tournamentData.quarterFinals[3])}
                    />
                  </div>
                </div>
              </div>

              {/* Connecting Lines */}
              <div className="bracket-lines">
                {/* Left side vertical lines */}
                <div className="line vertical-line left-v-line-1"></div>
                <div className="line vertical-line left-v-line-2"></div>

                {/* Right side vertical lines */}
                <div className="line vertical-line right-v-line-1"></div>
                <div className="line vertical-line right-v-line-2"></div>

                {/* Horizontal lines */}
                <div className="line horizontal-line left-h-line-1"></div>
                <div className="line horizontal-line left-h-line-2"></div>
                <div className="line horizontal-line right-h-line-1"></div>
                <div className="line horizontal-line right-h-line-2"></div>

                {/* Semi to Final lines */}
                <div className="line horizontal-line semi-final-line-1"></div>
                <div className="line horizontal-line semi-final-line-2"></div>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-amber-50 to-white border border-amber-200 rounded-xl p-8 text-center shadow-lg"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: "easeInOut",
              }}
              className="mb-6"
            >
              <div className="bg-amber-100 p-4 rounded-full inline-block mx-auto">
                <Target className="h-16 w-16 text-amber-500" />
              </div>
            </motion.div>

            <h3 className="text-2xl font-bold text-amber-800 mb-3">Ready to Start the Tournament</h3>
            <p className="text-amber-700 mb-8 max-w-md mx-auto">
              Generate the tournament bracket to start the billiard competition.
              {activity.individualParticipants && (
                <span className="block mt-2 font-medium">
                  {activity.individualParticipants.length} participants ready to play
                  {activity.individualParticipants.length < 8 && (
                    <span className="block mt-1 text-red-500">
                      Need {8 - activity.individualParticipants.length} more participants (minimum 8 required).
                    </span>
                  )}
                </span>
              )}
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={generateTournament}
              disabled={isGenerating || !activity.individualParticipants || activity.individualParticipants.length < 8}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-full shadow-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 inline-block animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2 inline-block" />
                  Generate Tournament
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* CSS for tournament bracket */}
      <style jsx>{`
        .tournament-bracket {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        
        .bracket-row {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }
        
        .bracket-column {
          width: 30%;
        }
        
        .center-column {
          width: 30%;
        }
        
        .final-column {
          margin: 0 auto;
        }
        
        .bracket-header {
          font-weight: 600;
          color: #92400e;
          margin-bottom: 10px;
          padding: 5px;
          background-color: #fef3c7;
          border-radius: 6px;
          text-align: center;
        }
        
        .bracket-match {
          margin-bottom: 20px;
        }
        
        /* Connecting lines */
        .bracket-lines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }
        
        .line {
          position: absolute;
          background-color: #fef3c7;
          z-index: 0;
        }
        
        .vertical-line {
          width: 3px;
        }
        
        .horizontal-line {
          height: 3px;
        }
        
        /* Left side lines */
        .left-v-line-1 {
          left: 30%;
          top: 15%;
          height: 70%;
        }
        
        .left-h-line-1 {
          left: 30%;
          top: 15%;
          width: 5%;
        }
        
        .left-h-line-2 {
          left: 30%;
          top: 85%;
          width: 5%;
        }
        
        /* Right side lines */
        .right-v-line-1 {
          right: 30%;
          top: 15%;
          height: 70%;
        }
        
        .right-h-line-1 {
          right: 30%;
          top: 15%;
          width: 5%;
        }
        
        .right-h-line-2 {
          right: 30%;
          top: 85%;
          width: 5%;
        }
        
        /* Semi to Final lines */
        .semi-final-line-1 {
          left: 35%;
          top: 50%;
          width: 10%;
        }
        
        .semi-final-line-2 {
          right: 35%;
          top: 50%;
          width: 10%;
        }
      `}</style>
    </div>
  )
}

// Match Card Component
const MatchCard = ({ match, onSelect, isFinal = false }) => {
  const hasPlayers = match.player1 !== null || match.player2 !== null
  const hasWinner = match.winner !== null
  const canSelect = match.player1 && match.player2 && !hasWinner

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
        isFinal ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200" : "bg-white border-amber-100"
      } ${canSelect ? "cursor-pointer hover:border-amber-300" : ""}`}
      onClick={() => canSelect && onSelect()}
      whileHover={canSelect ? { y: -5 } : {}}
    >
      <div className="p-4">
        {hasPlayers ? (
          <>
            <PlayerRow player={match.player1} score={match.player1Score} isWinner={match.winner === match.player1} />
            <div className="my-2 text-center text-xs text-amber-500">vs</div>
            <PlayerRow player={match.player2} score={match.player2Score} isWinner={match.winner === match.player2} />

            {canSelect && (
              <div className="mt-2 text-center">
                <span className="text-xs text-amber-600 font-medium">Click to record result</span>
              </div>
            )}
          </>
        ) : (
          <div className="py-4 text-center text-sm text-amber-500 italic">Waiting for players</div>
        )}
      </div>
    </motion.div>
  )
}

// Player Row Component
const PlayerRow = ({ player, score, isWinner }) => {
  if (!player) {
    return (
      <div className="h-10 flex items-center justify-center bg-amber-50 rounded border border-dashed border-amber-300">
        <span className="text-xs text-amber-400">TBD</span>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-between p-2 rounded-lg ${
        isWinner ? "bg-green-50 border border-green-200" : "border border-transparent"
      }`}
    >
      <div className="flex items-center">
        <div className="mr-2">
          <AvatarImage src={player.profilePicture || "/placeholder.svg"} alt={player.username} size={32} />
        </div>
        <span className="font-medium text-gray-800">{player.username}</span>
      </div>

      <div className="flex items-center">
        {typeof score === "number" && (
          <span className="bg-amber-100 px-2 py-1 rounded text-sm font-medium text-amber-700 mr-2">{score}</span>
        )}

        {isWinner && (
          <div className="bg-green-100 p-1 rounded-full">
            <Check className="h-4 w-4 text-green-600" />
          </div>
        )}
      </div>
    </div>
  )
}

export default BilliardTournamentDetails
