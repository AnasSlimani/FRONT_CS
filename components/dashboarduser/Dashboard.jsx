"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { jwtDecode } from "jwt-decode"
import api from "@/app/api/axios"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  ShoppingBag,
  Target,
  Users,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  Trophy,
  Award,
} from "lucide-react"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [trialStatus, setTrialStatus] = useState(null)
  const [stats, setStats] = useState({
    activitiesParticipated: 0,
    ordersCount: 0,
    goalsScored: 0,
    teamsJoined: 0,
  })
  const [recentMatches, setRecentMatches] = useState([])
  const [teams, setTeams] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get current user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUserId(decoded.id)
      } catch (error) {
        console.error("Error decoding token:", error)
        setError("Authentication error. Please login again.")
      }
    } else {
      setError("You are not logged in. Please login to view your dashboard.")
    }
  }, [])

  // Fetch user data
  useEffect(() => {
    if (!userId) return

    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${userId}`)
        setUser(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load user data")
      }
    }

    fetchUserData()
  }, [userId])

  // Fetch trial status
  useEffect(() => {
    if (!userId) return

    const fetchTrialStatus = async () => {
      try {
        const response = await api.get(`/users/trial-status/${userId}`)
        setTrialStatus(response.data)
      } catch (error) {
        console.error("Error fetching trial status:", error)
      }
    }

    fetchTrialStatus()
  }, [userId])

  // Fetch teams
  useEffect(() => {
    if (!userId) return

    const fetchTeams = async () => {
      try {
        const response = await api.get(`/teams/member/${userId}`)
        setTeams(response.data)
        setStats((prev) => ({ ...prev, teamsJoined: response.data.length }))
      } catch (error) {
        console.error("Error fetching teams:", error)
      }
    }

    fetchTeams()
  }, [userId])

  // Fetch orders
  useEffect(() => {
    if (!userId) return

    const fetchOrders = async () => {
      try {
        const response = await api.get(`/orders/user/${userId}`)
        setOrders(response.data)
        setStats((prev) => ({ ...prev, ordersCount: response.data.length }))
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }

    fetchOrders()
  }, [userId])

  // Fetch activities, matches, and goals data
  useEffect(() => {
    if (!userId) return

    const fetchActivitiesData = async () => {
      try {
        // Get all activities
        const activitiesResponse = await api.get("/activities")
        const activities = activitiesResponse.data

        // Filter activities where user is a participant
        const userActivities = activities.filter((activity) => {
          // Check if user is in individual participants
          const isIndividualParticipant = activity.individualParticipants?.some(
            (participant) => participant.id === userId,
          )

          // Check if user is in team participants
          const isTeamParticipant = activity.teamParticipants?.some((team) =>
            team.members?.some((member) => member.id === userId),
          )

          return isIndividualParticipant || isTeamParticipant
        })

        setStats((prev) => ({ ...prev, activitiesParticipated: userActivities.length }))

        // Get matches for activities user participated in
        let allMatches = []
        let allGoals = 0

        for (const activity of userActivities) {
          try {
            // Get matches for this activity
            const matchesResponse = await api.get(`/matches/activity/${activity.id}`)
            const activityMatches = matchesResponse.data

            // Add activity info to matches
            const matchesWithActivity = activityMatches.map((match) => ({
              ...match,
              activityName: activity.name,
              activityType: activity.type,
            }))

            allMatches = [...allMatches, ...matchesWithActivity]

            // Count goals scored by user in this activity's matches
            for (const match of activityMatches) {
              try {
                const goalEventsResponse = await api.get(`/goalevents/match/${match.id}`)
                const goalEvents = goalEventsResponse.data

                const userGoals = goalEvents.filter((goal) => goal.scorer?.id === userId)
                allGoals += userGoals.length
              } catch (error) {
                console.error(`Error fetching goal events for match ${match.id}:`, error)
              }
            }
          } catch (error) {
            console.error(`Error fetching matches for activity ${activity.id}:`, error)
          }
        }

        // Sort matches by date (most recent first) and take the 5 most recent
        allMatches.sort((a, b) => new Date(b.date) - new Date(a.date))
        setRecentMatches(allMatches.slice(0, 3))

        // Update goals scored stat
        setStats((prev) => ({
          ...prev,
          goalsScored: allGoals,
        }))
      } catch (error) {
        console.error("Error fetching activities data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivitiesData()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto" />
          <p className="mt-4 text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center max-w-md p-6 bg-gray-800 rounded-xl shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-white">Error</h2>
          <p className="mt-2 text-gray-400">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            onClick={() => (window.location.href = "/login")}
          >
            Go to Login
          </button>
        </div>
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
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 py-8 bg-gray-900 text-white font-sans"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Welcome back, {user?.username || "Player"}!
        </h1>

        {trialStatus && (
          <div className="mt-4">
            {trialStatus.status === "trial" && (
              <div className="bg-yellow-500/20 text-yellow-400 px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Trial Period Active</p>
                  <p className="text-sm mt-1">
                    You have {trialStatus.daysRemaining} days remaining in your trial.
                    <Link href="/payment" className="ml-1 underline hover:text-yellow-300">
                      Upgrade now
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {trialStatus.status === "expired" && (
              <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Trial Period Expired</p>
                  <p className="text-sm mt-1">
                    Your trial has ended.
                    <Link href="/payment" className="ml-1 underline hover:text-red-300">
                      Upgrade to continue enjoying all features
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {trialStatus.status === "active" && (
              <div className="bg-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Full Membership Active</p>
                  <p className="text-sm mt-1">Thank you for being a valued member of our club!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Award className="mr-2 h-5 w-5 text-emerald-500" />
          <span>Your Stats</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-xl shadow-xl border border-indigo-700/30 group hover:shadow-indigo-900/20 hover:scale-[1.02] transition-all duration-300">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-indigo-600/20 blur-xl"></div>
            <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-purple-600/20 blur-xl"></div>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-4 shadow-lg shadow-indigo-900/30 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-indigo-300 text-sm font-medium uppercase tracking-wider">Activities</p>
            <p className="text-4xl font-bold text-white mt-1 font-display">{stats.activitiesParticipated}</p>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-cyan-900 p-6 rounded-xl shadow-xl border border-blue-700/30 group hover:shadow-blue-900/20 hover:scale-[1.02] transition-all duration-300">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-600/20 blur-xl"></div>
            <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-cyan-600/20 blur-xl"></div>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white mb-4 shadow-lg shadow-blue-900/30 group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <p className="text-blue-300 text-sm font-medium uppercase tracking-wider">Orders</p>
            <p className="text-4xl font-bold text-white mt-1 font-display">{stats.ordersCount}</p>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-green-900 p-6 rounded-xl shadow-xl border border-emerald-700/30 group hover:shadow-emerald-900/20 hover:scale-[1.02] transition-all duration-300">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-emerald-600/20 blur-xl"></div>
            <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-green-600/20 blur-xl"></div>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white mb-4 shadow-lg shadow-emerald-900/30 group-hover:scale-110 transition-transform duration-300">
              <Target className="h-6 w-6" />
            </div>
            <p className="text-emerald-300 text-sm font-medium uppercase tracking-wider">Goals</p>
            <p className="text-4xl font-bold text-white mt-1 font-display">{stats.goalsScored}</p>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-amber-900 to-orange-900 p-6 rounded-xl shadow-xl border border-amber-700/30 group hover:shadow-amber-900/20 hover:scale-[1.02] transition-all duration-300">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-amber-600/20 blur-xl"></div>
            <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-orange-600/20 blur-xl"></div>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4 shadow-lg shadow-amber-900/30 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-amber-300 text-sm font-medium uppercase tracking-wider">Teams</p>
            <p className="text-4xl font-bold text-white mt-1 font-display">{stats.teamsJoined}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Matches */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700/50">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-emerald-500" />
                Recent Matches Played
              </h2>
            </div>

            <div className="p-4">
              {recentMatches.length > 0 ? (
                <div className="space-y-4">
                  {recentMatches.map((match, index) => (
                    <div
                      key={match.id || index}
                      className="bg-gray-750 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400">
                          {new Date(match.date).toLocaleDateString()} • {match.activityType}
                        </span>
                        <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                          {match.status || "Completed"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-md">
                            <span className="font-bold text-sm text-white">
                              {match.teamA?.name?.substring(0, 2) || "T1"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{match.teamA?.name || "Team A"}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-center">
                            <div className="text-xl font-bold bg-gray-700 px-4 py-1 rounded-lg">
                              {match.scoreTeamA || 0} - {match.scoreTeamB || 0}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium text-right">{match.teamB?.name || "Team B"}</p>
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-md">
                            <span className="font-bold text-sm text-white">
                              {match.teamB?.name?.substring(0, 2) || "T2"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {match.activityName && (
                        <div className="mt-3 text-xs text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {match.activityName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">No recent matches found</p>
                  <p className="text-sm text-gray-500 mt-1">Join an activity to start playing</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Your Teams */}
        <motion.div variants={itemVariants}>
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700/50">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center">
                <Users className="mr-2 h-5 w-5 text-emerald-500" />
                Your Teams
              </h2>
            </div>

            <div className="p-4">
              {teams.length > 0 ? (
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div key={team.id} className="bg-gray-750 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                          <span className="font-bold text-white">{team.name?.substring(0, 2) || "T"}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{team.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {team.captain?.id === userId ? (
                              <span className="text-yellow-400 font-medium">Captain</span>
                            ) : (
                              <span>Member</span>
                            )}
                            {team.members && ` • ${team.members.length} members`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">You haven't joined any teams yet</p>
                  <p className="text-sm text-gray-500 mt-1">Join a team to play matches</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700/50 mt-8">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5 text-emerald-500" />
                Recent Orders
              </h2>
            </div>

            <div className="p-4">
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="bg-gray-750 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden mr-4 border border-gray-600">
                          <Image
                            src={`/images/productImages/${order.productImage || "blackPolo.jpeg"}`}
                            alt={order.productName || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{order.productName || "Product"}</p>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-gray-400">
                              {order.size || "M"} • {order.color || "Black"}
                            </p>
                            <p className="font-medium text-emerald-400">
                              {order.productPrice ? (order.productPrice / 100).toFixed(2) : "29.99"}€
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center text-xs">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            order.status === "completed"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : order.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {order.status || "Pending"}
                        </span>
                        <span className="text-gray-400">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">No orders yet</p>
                  <Link
                    href="/shop"
                    className="text-sm text-emerald-400 hover:text-emerald-300 mt-2 inline-flex items-center"
                  >
                    Visit shop <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
