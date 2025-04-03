"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Calendar, MapPin, Clock, Users, Trophy, Filter, ChevronDown, CheckCircle2, XCircle, Eye } from "lucide-react"

// Sample activities data
const activitiesData = [
  {
    id: 1,
    title: "Football Tournament 2023",
    description: "Annual football tournament between local clubs.",
    date: "Oct 15, 2023",
    time: "14:00 - 18:00",
    location: "Main Stadium",
    image: "/images/billard.jpg",
    category: "Tournament",
    type: "tournament",
    status: "upcoming",
    registered: true,
    participants: 120,
  },
  {
    id: 2,
    title: "Basketball Championship",
    description: "Regional basketball championship with teams from all over the region.",
    date: "Oct 22, 2023",
    time: "10:00 - 16:00",
    location: "Indoor Sports Hall",
    image: "/images/billard.jpg",
    category: "Tournament",
    type: "tournament",
    status: "upcoming",
    registered: true,
    participants: 80,
  },
  {
    id: 3,
    title: "Billard Masters",
    description: "Professional billard competition with cash prizes and trophies for winners.",
    date: "Nov 5, 2023",
    time: "18:00 - 22:00",
    location: "Club Lounge",
    image: "/images/billard.jpg",
    category: "Tournament",
    type: "tournament",
    status: "upcoming",
    registered: false,
    participants: 32,
  },
  {
    id: 4,
    title: "National Championship Trip",
    description: "Club trip to support our team at the National Championship finals in Paris.",
    date: "Nov 12, 2023",
    time: "08:00 - 20:00",
    location: "Paris National Stadium",
    image: "/images/billard.jpg",
    category: "Trip",
    type: "trip",
    status: "upcoming",
    registered: true,
    participants: 45,
  },
  {
    id: 5,
    title: "Regional Competition Travel",
    description: "Travel to the neighboring city for the regional competition.",
    date: "Nov 19, 2023",
    time: "09:00 - 18:00",
    location: "Regional Sports Center",
    image: "/images/billard.jpg",
    category: "Trip",
    type: "trip",
    status: "upcoming",
    registered: false,
    participants: 30,
  },
  {
    id: 6,
    title: "Seniors vs Juniors Match",
    description: "Friendly match between our senior and junior teams.",
    date: "Sep 26, 2023",
    time: "16:00 - 18:00",
    location: "Club Field",
    image: "/images/billard.jpg",
    category: "Match",
    type: "match",
    status: "completed",
    registered: true,
    result: "Win",
    participants: 40,
  },
  {
    id: 7,
    title: "Inter-Department Tournament",
    description: "Friendly tournament between different departments of our club.",
    date: "Aug 3, 2023",
    time: "13:00 - 17:00",
    location: "Club Grounds",
    image: "/images/billard.jpg",
    category: "Tournament",
    type: "tournament",
    status: "completed",
    registered: true,
    result: "2nd Place",
    participants: 60,
  },
  {
    id: 8,
    title: "Veterans Exhibition Match",
    description: "Special exhibition match featuring veteran players from our club's history.",
    date: "Jul 10, 2023",
    time: "15:00 - 17:00",
    location: "Main Stadium",
    image: "/images/billard.jpg",
    category: "Match",
    type: "match",
    status: "completed",
    registered: true,
    result: "Draw",
    participants: 25,
  },
]

const Activities = () => {
  // State for filters
  const [activeFilter, setActiveFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filter activities based on selected filters
  const filteredActivities = activitiesData.filter((activity) => {
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto">
      {/* Header section */}
      <motion.div variants={itemVariants} className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">My Activities</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your tournaments, trips, and matches</p>
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
                      { id: "trip", label: "Trips" },
                      { id: "match", label: "Matches" },
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
            { id: "trip", label: "Trips" },
            { id: "match", label: "Matches" },
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

      {/* Activities grid */}
      {filteredActivities.length > 0 ? (
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
                        : activity.type === "trip"
                          ? "bg-purple-500 text-white"
                          : "bg-green-500 text-white"
                    }`}
                  >
                    {activity.category}
                  </span>
                </div>

                {/* Registration status */}
                <div className="absolute bottom-4 left-4">
                  {activity.registered ? (
                    <span className="flex items-center px-3 py-1 bg-green-500/80 text-white text-xs font-medium rounded-full">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Registered
                    </span>
                  ) : activity.status === "upcoming" ? (
                    <span className="flex items-center px-3 py-1 bg-gray-500/80 text-white text-xs font-medium rounded-full">
                      <XCircle className="w-3 h-3 mr-1" />
                      Not Registered
                    </span>
                  ) : null}
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
                  className={`w-full py-2 rounded-lg font-medium flex items-center justify-center ${
                    activity.status === "upcoming" && !activity.registered
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {activity.status === "upcoming" && !activity.registered ? (
                    <>Register Now</>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <div className="flex flex-col items-center">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No activities found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try changing your filters or check back later for new activities.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Activities

