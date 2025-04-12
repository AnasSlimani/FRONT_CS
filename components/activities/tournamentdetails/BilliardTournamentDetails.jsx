"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Trophy,
  Calendar,
  Users,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Award,
  User,
  Check,
  Target,
  CogIcon as Cue,
} from "lucide-react"
import api from "@/app/api/axios"
import Link from "next/link"

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.5);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(245, 158, 11, 0.5);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(245, 158, 11, 0.7);
  }
`

const BilliardTournamentDetails = ({ activityId }) => {
  const [activity, setActivity] = useState(null)
  const [tournamentData, setTournamentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch activity details
        const activityResponse = await api.get(`/activities/${activityId}`)
        setActivity(activityResponse.data)

        // Fetch tournament data
        try {
          const tournamentResponse = await api.get(`/billiard-tournaments/${activityId}`)
          setTournamentData(tournamentResponse.data)
        } catch (tournamentErr) {
          console.log("No tournament data found or tournament not started yet")
        }
      } catch (err) {
        console.error("Error fetching tournament details:", err)
        setError("Failed to load tournament details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (activityId) {
      fetchTournamentDetails()
    }
  }, [activityId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-amber-400 animate-spin mb-4" />
            <span className="text-xl text-gray-300">Loading tournament details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/activities"
            className="inline-flex items-center mb-8 text-gray-300 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Activities</span>
          </Link>

          <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Error Loading Tournament</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/activities"
            className="inline-flex items-center mb-8 text-gray-300 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Activities</span>
          </Link>

          <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Tournament Not Found</h3>
              <p className="text-yellow-300">The tournament you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if this is a billiard tournament
  const isBilliardTournament = activity.type === "tournament" && activity.sport === "billard"

  if (!isBilliardTournament) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/activities"
            className="inline-flex items-center mb-8 text-gray-300 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Activities</span>
          </Link>

          <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Not a Billiard Tournament</h3>
              <p className="text-yellow-300">
                This activity is not a billiard tournament. Tournament details are only available for billiard
                tournaments.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-6 md:p-8 relative">
      {/* Add style tag for custom scrollbar */}
      <style jsx global>
        {scrollbarStyles}
      </style>

      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[10%] w-80 h-80 bg-amber-600/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-0 right-[10%] w-80 h-80 bg-amber-600/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute top-[30%] right-[20%] w-60 h-60 bg-amber-600/10 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Back button */}
        <Link
          href="/activities"
          className="inline-flex items-center mb-8 text-gray-300 hover:text-amber-400 transition-colors group"
        >
          <span className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-full mr-2 group-hover:bg-amber-900/50 transition-colors border border-gray-700/50 group-hover:border-amber-500/50">
            <ArrowLeft className="h-5 w-5" />
          </span>
          <span className="font-medium">Back to Activities</span>
        </Link>

        {/* Tournament Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-10 overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-amber-800 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] bg-cover bg-center mix-blend-overlay"></div>

          {/* Animated particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              />
            ))}
          </div>

          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center mb-3">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-600 p-3 rounded-xl shadow-lg mr-4 transform -rotate-3">
                    <Cue className="h-8 w-8 text-gray-900" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{activity.name}</h1>
                </div>
                <p className="text-amber-100 text-lg max-w-2xl">{activity.description}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm flex items-center border border-white/10 shadow-lg">
                  <Calendar className="h-5 w-5 mr-2 text-amber-300" />
                  <div>
                    <div className="text-amber-100 font-medium">Tournament Dates</div>
                    <div className="text-white">
                      {new Date(activity.startingDate).toLocaleDateString()} -{" "}
                      {new Date(activity.endingDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm flex items-center border border-white/10 shadow-lg">
                  <Users className="h-5 w-5 mr-2 text-amber-300" />
                  <div>
                    <div className="text-amber-100 font-medium">Participants</div>
                    <div className="text-white">
                      {activity.individualParticipants?.length || 0} / {activity.nbrParticipants}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tournament Content */}
        {tournamentData ? (
          <div className="space-y-8">
            {/* Champion Section (if exists) */}
            {tournamentData.champion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 backdrop-blur-sm rounded-xl border border-amber-700/30 p-8 text-center"
              >
                <div className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-full mb-4 shadow-lg">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Tournament Champion</h2>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-amber-800/50 rounded-full flex items-center justify-center mr-4 border-2 border-amber-500">
                    <User className="h-8 w-8 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-amber-400">{tournamentData.champion.username}</div>
                    <div className="text-amber-200">Tournament Winner</div>
                  </div>
                </div>
                <div className="inline-block bg-amber-800/50 px-4 py-2 rounded-lg text-amber-300 border border-amber-600/30">
                  <Award className="h-4 w-4 inline-block mr-2" />
                  Congratulations!
                </div>
              </motion.div>
            )}

            {/* Tournament Bracket */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-amber-400" />
                  Tournament Bracket
                </h3>
              </div>

              <div className="p-6">
                <div className="tournament-bracket">
                  {/* Row 1: Quarter Finals 1 & 3 + Semi Final 1 */}
                  <div className="bracket-row">
                    <div className="bracket-item">
                      <div className="bracket-header">Quarter-Final 1</div>
                      <div className="bracket-match">
                        <MatchCard match={tournamentData.quarterFinals[0]} />
                      </div>
                    </div>

                    <div className="bracket-item">
                      <div className="bracket-header">Semi-Final 1</div>
                      <div className="bracket-match">
                        <MatchCard match={tournamentData.semiFinals[0]} />
                      </div>
                    </div>

                    <div className="bracket-item">
                      <div className="bracket-header">Quarter-Final 3</div>
                      <div className="bracket-match">
                        <MatchCard match={tournamentData.quarterFinals[2]} />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Final */}
                  <div className="bracket-row">
                    <div className="bracket-item final-item">
                      <div className="bracket-header">Final</div>
                      <div className="bracket-match">
                        <MatchCard match={tournamentData.finalMatch} isFinal={true} />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Quarter Finals 2 & 4 + Semi Final 2 */}
                  <div className="bracket-row">
                    <div className="bracket-item">
                      <div className="bracket-header">Quarter-Final 2</div>
                      <div className="bracket-match">
                        <MatchCard match={tournamentData.quarterFinals[1]} />
                      </div>
                    </div>

                    <div className="bracket-item">
                      <div className="bracket-header">Semi-Final 2</div>
                      <div className="bracket-match">
                        <MatchCard match={tournamentData.semiFinals[1]} />
                      </div>
                    </div>

                    <div className="bracket-item">
                      <div className="bracket-header">Quarter-Final 4</div>
                      <div className="bracket-match">
                        <MatchCard match={tournamentData.quarterFinals[3]} />
                      </div>
                    </div>
                  </div>

                  {/* Connecting Lines */}
                  <svg className="bracket-lines" viewBox="0 0 1000 600" preserveAspectRatio="none">
                    {/* Left side lines */}
                    <path
                      d="M250,100 H350 V300 H450"
                      stroke="#78350f"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M250,500 H350 V300 H450"
                      stroke="#78350f"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />

                    {/* Right side lines */}
                    <path
                      d="M750,100 H650 V300 H550"
                      stroke="#78350f"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M750,500 H650 V300 H550"
                      stroke="#78350f"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Tournament Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Target className="h-6 w-6 mr-2 text-amber-400" />
                  Tournament Rules
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-amber-400 mb-3">Match Format</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <div className="bg-amber-900/50 p-1 rounded-full mr-2 mt-1">
                          <Check className="h-3 w-3 text-amber-400" />
                        </div>
                        <span>Single elimination tournament format</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-amber-900/50 p-1 rounded-full mr-2 mt-1">
                          <Check className="h-3 w-3 text-amber-400" />
                        </div>
                        <span>Matches are played to a predetermined number of points</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-amber-900/50 p-1 rounded-full mr-2 mt-1">
                          <Check className="h-3 w-3 text-amber-400" />
                        </div>
                        <span>Players alternate breaks</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-amber-400 mb-3">Scoring</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <div className="bg-amber-900/50 p-1 rounded-full mr-2 mt-1">
                          <Check className="h-3 w-3 text-amber-400" />
                        </div>
                        <span>One point per ball potted in correct sequence</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-amber-900/50 p-1 rounded-full mr-2 mt-1">
                          <Check className="h-3 w-3 text-amber-400" />
                        </div>
                        <span>Fouls result in penalty points for the opponent</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-amber-900/50 p-1 rounded-full mr-2 mt-1">
                          <Check className="h-3 w-3 text-amber-400" />
                        </div>
                        <span>First player to reach the target score wins the match</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-8 flex flex-col items-center justify-center text-center"
          >
            <Target className="h-16 w-16 text-amber-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Tournament Not Started Yet</h3>
            <p className="text-amber-200 max-w-2xl mb-6">
              The billiard tournament is still in preparation. Once the tournament begins, you'll be able to see the
              bracket, matches, and results here.
            </p>
            <div className="inline-block bg-amber-800/50 px-6 py-3 rounded-lg text-amber-300 border border-amber-600/30">
              <Users className="h-5 w-5 inline-block mr-2" />
              <span className="font-medium">{activity.individualParticipants?.length || 0}</span> of{" "}
              <span className="font-medium">{activity.nbrParticipants}</span> participants registered
            </div>
          </motion.div>
        )}

        {/* Footer with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>Tournament statistics are updated after each match</p>
        </motion.div>
      </div>

      {/* Add keyframes for floating animation */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(10px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        /* Tournament bracket styles */
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
        
        .bracket-item {
          width: 30%;
        }
        
        .final-item {
          margin: 0 auto;
        }
        
        .bracket-header {
          font-weight: 600;
          color: #fbbf24;
          margin-bottom: 10px;
          padding: 5px;
          background-color: rgba(120, 53, 15, 0.3);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 6px;
          text-align: center;
        }
        
        .bracket-match {
          margin-bottom: 20px;
        }
        
        .bracket-lines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

// Match Card Component
const MatchCard = ({ match, isFinal = false }) => {
  const hasPlayers = match.player1 !== null || match.player2 !== null
  const hasWinner = match.winner !== null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
        isFinal
          ? "bg-gradient-to-r from-amber-900/30 to-amber-800/20 border-amber-700/30"
          : "bg-gray-800/30 border-gray-700/50"
      }`}
    >
      <div className="p-4">
        {hasPlayers ? (
          <>
            <PlayerRow player={match.player1} score={match.player1Score} isWinner={match.winner === match.player1} />
            <div className="my-2 text-center text-xs text-amber-500">vs</div>
            <PlayerRow player={match.player2} score={match.player2Score} isWinner={match.winner === match.player2} />
          </>
        ) : (
          <div className="py-4 text-center text-sm text-amber-500/70 italic">Waiting for players</div>
        )}
      </div>
    </motion.div>
  )
}

// Player Row Component
const PlayerRow = ({ player, score, isWinner }) => {
  if (!player) {
    return (
      <div className="h-10 flex items-center justify-center bg-gray-800/50 rounded border border-dashed border-gray-700/50">
        <span className="text-xs text-gray-500">TBD</span>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-between p-2 rounded-lg ${
        isWinner ? "bg-green-900/20 border border-green-700/30" : "border border-transparent"
      }`}
    >
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center mr-2 border border-gray-600/50">
          <User className="h-4 w-4 text-gray-300" />
        </div>
        <span className={`font-medium ${isWinner ? "text-green-400" : "text-gray-300"}`}>{player.username}</span>
      </div>

      <div className="flex items-center">
        {typeof score === "number" && (
          <span className="bg-gray-800/70 px-2 py-1 rounded text-sm font-medium text-amber-400 mr-2 border border-gray-700/50">
            {score}
          </span>
        )}

        {isWinner && (
          <div className="bg-green-900/30 p-1 rounded-full border border-green-700/30">
            <Check className="h-4 w-4 text-green-400" />
          </div>
        )}
      </div>
    </div>
  )
}

export default BilliardTournamentDetails
