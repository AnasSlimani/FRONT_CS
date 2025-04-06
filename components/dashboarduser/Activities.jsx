"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { jwtDecode } from "jwt-decode"
import api from "@/app/api/axios"
import { Calendar, MapPin, Clock, Users, Trophy, Filter, ChevronDown, CheckCircle2, XCircle, Eye } from "lucide-react"

const Activities = () => {
  // State for user and activities
  const [currentUserId, setCurrentUserId] = useState(null)
  const [activities, setActivities] = useState([])
  const [userTeams, setUserTeams] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for filters
  const [activeFilter, setActiveFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Get current user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setCurrentUserId(decoded.id)
      } catch (error) {
        console.error("Error decoding token:", error)
        setError("Failed to authenticate user")
      }
    } else {
      setError("You must be logged in to view your activities")
    }
  }, [])

  // Fetch user's teams when user ID is available
  useEffect(() => {
    const fetchUserTeams = async () => {
      if (!currentUserId) return

      try {
        const response = await api.get(`/teams/member/${currentUserId}`)
        setUserTeams(response.data)
      } catch (error) {
        console.error("Error fetching user teams:", error)
      }
    }

    fetchUserTeams()
  }, [currentUserId])

  // Fetch all activities and filter for user participation
  useEffect(() => {
    const fetchActivities = async () => {
      if (!currentUserId) return

      setIsLoading(true)
      try {
        // Fetch all activities
        const response = await api.get("/activities")
        const allActivities = response.data

        // Filter activities where user is participating
        const userActivities = allActivities.filter((activity) => {
          // Check if user is in individual participants
          const isIndividualParticipant =
            activity.individualParticipants &&
            activity.individualParticipants.some((participant) => participant.id === currentUserId)

          // Check if user is in a team that's participating
          const isTeamParticipant =
            activity.teamParticipants &&
            userTeams.length > 0 &&
            activity.teamParticipants.some((team) => userTeams.some((userTeam) => userTeam.id === team.id))

          return isIndividualParticipant || isTeamParticipant
        })

        // Format activities for display
        const formattedActivities = userActivities.map((activity) => ({
          id: activity.id,
          title: activity.name,
          description: activity.description,
          date: activity.date ? new Date(activity.date).toLocaleDateString() : "TBD",
          time: activity.time || "TBD",
          location: activity.localisation,
          image: activity.image ? `/images/${activity.image}` : "/images/billard.jpg",
          category: activity.type.charAt(0).toUpperCase() + activity.type.slice(1),
          type: activity.type,
          status: new Date(activity.date) > new Date() ? "upcoming" : "completed",
          registered: true, // User is always registered for these activities
          participants: activity.nbrParticipants || 0,
        }))

        setActivities(formattedActivities)
      } catch (error) {
        console.error("Error fetching activities:", error)
        setError("Failed to load activities")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [currentUserId, userTeams])

  // Filter activities based on selected filters
  const filteredActivities = activities.filter((activity) => {
    // Filter by type
    const typeMatch = activeFilter === "all" || activity.type === activeFilter

    // Filter by status
    const statusMatch = statusFilter === "all" || activity.status === statusFilter

    return typeMatch && statusMatch
  })

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

  // Handle view details click
  const handleViewDetails = (activityId) => {
    window.location.href = `/activities/${activityId}`
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto">
      {/* Header section */}
      <motion.div variants={itemVariants} className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">My Activities</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">View activities you're participating in</p>
        </div>

        {/* Filter button for mobile */}
        <div className="mt-4 md:mt-0 relative">
          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            whileTap={{ scale: 0.97 }}
          >
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Filters</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
            />
          </motion.button>

          {/* Filter dropdown */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-3">Activity Type</h3>
                  <div className="space-y-2">
                    {[
                      { id: "all", label: "All Activities" },
                      { id: "tournament", label: "Tournaments" },
                      { id: "deplacement", label: "Trips" },
                      { id: "matchAmical", label: "Matches" },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          activeFilter === filter.id
                            ? "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => {
                          setActiveFilter(filter.id)
                          setIsFilterOpen(false)
                        }}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  <h3 className="font-medium text-gray-800 dark:text-white mb-3 mt-4">Status</h3>
                  <div className="space-y-2">
                    {[
                      { id: "all", label: "All Status" },
                      { id: "upcoming", label: "Upcoming" },
                      { id: "completed", label: "Completed" },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          statusFilter === filter.id
                            ? "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => {
                          setStatusFilter(filter.id)
                          setIsFilterOpen(false)
                        }}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Filter tabs for desktop */}
      <motion.div variants={itemVariants} className="mb-6 hidden md:block">
        <div className="flex space-x-2 mb-4">
          {[
            { id: "all", label: "All Activities" },
            { id: "tournament", label: "Tournaments" },
            { id: "deplacement", label: "Trips" },
            { id: "matchAmical", label: "Matches" },
          ].map((filter) => (
            <button
              key={filter.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeFilter === filter.id
                  ? "bg-teal-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          {[
            { id: "all", label: "All Status" },
            { id: "upcoming", label: "Upcoming" },
            { id: "completed", label: "Completed" },
          ].map((filter) => (
            <button
              key={filter.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                statusFilter === filter.id
                  ? "bg-teal-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setStatusFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading state */}
      {isLoading && (
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Loading activities...</h3>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your activities.</p>
          </div>
        </motion.div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Error</h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Activities grid */}
      {!isLoading && !error && filteredActivities.length > 0 ? (
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              custom={index}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Activity image */}
              <div className="relative h-48">
                <Image
                  src={activity.image || "/placeholder.svg?height=192&width=384"}
                  alt={activity.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  {activity.status === "upcoming" ? (
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">Upcoming</span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">Completed</span>
                  )}
                </div>

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      activity.type === "tournament"
                        ? "bg-yellow-500 text-white"
                        : activity.type === "deplacement"
                          ? "bg-purple-500 text-white"
                          : "bg-green-500 text-white"
                    }`}
                  >
                    {activity.category}
                  </span>
                </div>

                {/* Registration status */}
                <div className="absolute bottom-4 left-4">
                  <span className="flex items-center px-3 py-1 bg-green-500/80 text-white text-xs font-medium rounded-full">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Registered
                  </span>
                </div>
              </div>

              {/* Activity content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{activity.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{activity.description}</p>

                {/* Activity details */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                    <span>{activity.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2 text-teal-500" />
                    <span>{activity.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                    <span className="truncate">{activity.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-2 text-teal-500" />
                    <span>{activity.participants} participants</span>
                  </div>

                  {/* Show result for completed activities */}
                  {activity.status === "completed" && activity.result && (
                    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200">
                      <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                      <span>Result: {activity.result}</span>
                    </div>
                  )}
                </div>

                {/* Action button */}
                <button
                  className="w-full py-2 rounded-lg font-medium flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => handleViewDetails(activity.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : !isLoading && !error ? (
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <div className="flex flex-col items-center">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No activities found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              You are not participating in any activities that match your current filters.
            </p>
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  )
}

export default Activities

