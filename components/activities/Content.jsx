"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Activity from "./Activity"

// Sample activity data (this would come from your backend)
const sampleActivities = [
  {
    id: 1,
    title: "Football Tournament 2023",
    description: "Annual football tournament between local clubs. Join us for an exciting competition!",
    date: "15 Oct 2023",
    time: "14:00 - 18:00",
    location: "Main Stadium",
    image: "/images/volleyball.jpg",
    category: "Tournament",
    type: "tournament",
    subType: "football",
    participants: 120,
  },
  {
    id: 2,
    title: "Basketball Championship",
    description: "Regional basketball championship with teams from all over the region competing for the trophy.",
    date: "22 Oct 2023",
    time: "10:00 - 16:00",
    location: "Indoor Sports Hall",
    image: "/images/volleyball.jpg",
    category: "Tournament",
    type: "tournament",
    subType: "basketball",
    participants: 80,
  },
  {
    id: 3,
    title: "Billard Masters",
    description: "Professional billard competition with cash prizes and trophies for winners.",
    date: "5 Nov 2023",
    time: "18:00 - 22:00",
    location: "Club Lounge",
    image: "/images/volleyball.jpg",
    category: "Tournament",
    type: "tournament",
    subType: "billard",
    participants: 32,
  },
  {
    id: 4,
    title: "National Championship Trip",
    description: "Club trip to support our team at the National Championship finals in Paris.",
    date: "12 Nov 2023",
    time: "08:00 - 20:00",
    location: "Paris National Stadium",
    image: "/images/volleyball.jpg",
    category: "Deplacement",
    type: "deplacement",
    participants: 45,
  },
  {
    id: 5,
    title: "Regional Competition Travel",
    description: "Travel to the neighboring city for the regional competition. Transportation provided.",
    date: "19 Nov 2023",
    time: "09:00 - 18:00",
    location: "Regional Sports Center",
    image: "/images/volleyball.jpg",
    category: "Deplacement",
    type: "deplacement",
    participants: 30,
  },
  {
    id: 6,
    title: "Seniors vs Juniors Match",
    description: "Friendly match between our senior and junior teams. Come support both sides!",
    date: "26 Nov 2023",
    time: "16:00 - 18:00",
    location: "Club Field",
    image: "/images/volleyball.jpg",
    category: "Match Amical",
    type: "matchAmical",
    participants: 40,
  },
  {
    id: 7,
    title: "Inter-Department Tournament",
    description: "Friendly tournament between different departments of our club. Fun prizes for all participants!",
    date: "3 Dec 2023",
    time: "13:00 - 17:00",
    location: "Club Grounds",
    image: "/images/volleyball.jpg",
    category: "Match Amical",
    type: "matchAmical",
    participants: 60,
  },
  {
    id: 8,
    title: "Veterans Exhibition Match",
    description: "Special exhibition match featuring veteran players from our club's history.",
    date: "10 Dec 2023",
    time: "15:00 - 17:00",
    location: "Main Stadium",
    image: "/images/volleyball.jpg",
    category: "Match Amical",
    type: "matchAmical",
    participants: 25,
  },
]

const Content = ({ activeFilter }) => {
  const [filteredActivities, setFilteredActivities] = useState([])

  // Filter activities based on active filter only (no subfilter)
  useEffect(() => {
    let result = [...sampleActivities]

    if (activeFilter === "all") {
      // Show all activities
      setFilteredActivities(result)
    } else if (activeFilter === "tournaments") {
      // Filter by tournament type only
      result = result.filter((activity) => activity.type === "tournament")
      setFilteredActivities(result)
    } else if (activeFilter === "deplacements") {
      // Filter by deplacements
      result = result.filter((activity) => activity.type === "deplacement")
      setFilteredActivities(result)
    } else if (activeFilter === "matchAmicaux") {
      // Filter by match amicaux
      result = result.filter((activity) => activity.type === "matchAmical")
      setFilteredActivities(result)
    }
  }, [activeFilter])

  // No activities found message
  if (filteredActivities.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No activities found</h3>
        <p className="text-gray-500">Try changing your filter selection</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pb-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15"
        >
          {filteredActivities.map((activity) => (
            <Activity key={activity.id} activity={activity} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Content

