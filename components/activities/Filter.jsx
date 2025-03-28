"use client"

import { motion } from "framer-motion"
import { Trophy, MapPin, Users } from "lucide-react"

const Filter = ({ activeFilter, setActiveFilter }) => {
  // Handle filter click - simplify to just set the active filter
  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 -mt-8 mb-12 relative z-20">
      <motion.div
        className="bg-[#0e0b30] rounded-full shadow-xl overflow-hidden border border-indigo-900/50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <div className="flex flex-wrap">
          {/* All filter */}
          <button
            className={`flex-1 py-4 px-6 text-center text-white font-semibold transition-all duration-300 relative ${
              activeFilter === "all" ? "bg-teal-600" : "hover:bg-[#1a1650]"
            }`}
            onClick={() => handleFilterClick("all")}
          >
            <span className="relative z-10">All</span>
            {activeFilter === "all" && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-500"
                layoutId="activeFilterBackground"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>

          {/* Tournaments filter - simplified without dropdown */}
          <button
            className={`flex-1 py-4 px-6 text-center text-white font-semibold transition-all duration-300 relative flex items-center justify-center ${
              activeFilter === "tournaments" ? "bg-teal-600" : "hover:bg-[#1a1650]"
            }`}
            onClick={() => handleFilterClick("tournaments")}
          >
            <Trophy className="w-4 h-4 mr-2" />
            <span className="relative z-10">Tournois</span>
            {activeFilter === "tournaments" && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-500"
                layoutId="activeFilterBackground"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>

          {/* Deplacements filter */}
          <button
            className={`flex-1 py-4 px-6 text-center text-white font-semibold transition-all duration-300 relative flex items-center justify-center ${
              activeFilter === "deplacements" ? "bg-teal-600" : "hover:bg-[#1a1650]"
            }`}
            onClick={() => handleFilterClick("deplacements")}
          >
            <MapPin className="w-4 h-4 mr-2" />
            <span className="relative z-10">Trips</span>
            {activeFilter === "deplacements" && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-500"
                layoutId="activeFilterBackground"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>

          {/* Match Amicaux filter */}
          <button
            className={`flex-1 py-4 px-6 text-center text-white font-semibold transition-all duration-300 relative flex items-center justify-center ${
              activeFilter === "matchAmicaux" ? "bg-teal-600" : "hover:bg-[#1a1650]"
            }`}
            onClick={() => handleFilterClick("matchAmicaux")}
          >
            <Users className="w-4 h-4 mr-2" />
            <span className="relative z-10">Friendly Matches</span>
            {activeFilter === "matchAmicaux" && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-500"
                layoutId="activeFilterBackground"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Filter

