"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, MapPin, Clock, Users, Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import TeamCreationModal from "./modals/TeamCreationModal"
import SimpleConfirmationModal from "./modals/SimpleConfirmationModal"
import PaymentFormModal from "./modals/PaymentFormModal"
import LoginModal from "@/components/login/LoginModal"

const Activity = ({ activity }) => {
  // Determine icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "tournament":
        return <Trophy className="w-5 h-5 text-yellow-400" />
      case "deplacement":
        return <MapPin className="w-5 h-5 text-red-400" />
      case "matchAmical":
        return <Users className="w-5 h-5 text-blue-400" />
      default:
        return <Calendar className="w-5 h-5 text-teal-400" />
    }
  }

  // State for controlling registration status and modals
  const isfull = activity.isTournamentFull;
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleCheckLogin = () => {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please Log in to participate !")
      setIsLoginModalOpen(true)
      return
    }

    // If user is logged in, show the appropriate activity modal
    setIsModalOpen(true)
  }

  // Handle button click based on registration status
  const handleButtonClick = (e) => {
    if (!isfull) {
      e.preventDefault() // Prevent navigation
      e.stopPropagation() // Stop event propagation
      handleCheckLogin()
    }
    // If registration is closed, let the link navigate to details page
  }

  // Close login modal
  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  // Determine which modal to show based on activity type and subtype
  const renderModal = () => {
    if (!isModalOpen) return null

    if (activity.type === "tournament") {
      if (activity.sport === "football" || activity.sport === "basketball") {
        return (
          <TeamCreationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            activityTitle={activity.title}
            nbrParticipant={activity.nbrPerTeam}
            activityID={activity.id}
          />
        )
      } else if (activity.sport === "billard") {
        return (
          <SimpleConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            activityTitle={activity.title}
            message="Your place is reserved successfully! We will alert you when the tournament begins."
          />
        )
      }
    } else if (activity.type === "deplacement") {
      return (
        <PaymentFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} activityTitle={activity.title} />
      )
    } else if (activity.type === "matchAmical") {
      return (
        <SimpleConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activityTitle={activity.title}
          message="Your place is reserved successfully!"
        />
      )
    }

    // Default case
    return (
      <SimpleConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activityTitle={activity.title}
        message="Thank you for your interest in this activity!"
      />
    )
  }

  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 text-white border border-gray-700"
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Activity Image with Overlay */}
      <div className="relative h-56 w-full">
        <Image src={`/images/${activity.image}`} alt={activity.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-1 rounded-full font-medium text-sm shadow-lg backdrop-blur-sm bg-opacity-80 flex items-center">
          {getActivityIcon(activity.type)}
          <span className="ml-1.5">{activity.type}</span>
        </div>

        {/* Date Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          {activity.date}
        </div>
      </div>

      {/* Activity Content */}
      <div className="p-6 relative">
        {/* Glowing accent */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-teal-500 rounded-full filter blur-3xl opacity-10"></div>

        {/* Title with hover effect */}
        <h3 className="text-xl font-bold text-white mb-3 group">
          <Link
            href={`/activities/${activity.id}`}
            className="group-hover:text-teal-400 transition-colors duration-200"
          >
            {activity.name}
          </Link>
        </h3>

        <p className="text-gray-300 mb-5 line-clamp-2 text-sm">{activity.description}</p>

        {/* Details with glass effect */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 mb-5 border border-white/10">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center text-sm text-gray-300">
              <Clock className="w-4 h-4 mr-2 text-teal-400" />
              <span>{activity.time}</span>
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <MapPin className="w-4 h-4 mr-2 text-teal-400" />
              <span className="truncate">{activity.localisation}</span>
            </div>
            {activity.nbrParticipants && (
              <div className="flex items-center text-sm text-gray-300 col-span-2">
                <Users className="w-4 h-4 mr-2 text-teal-400" />
                <span>{activity.nbrParticipants} participants</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button - Changed to button element instead of Link */}
        <button onClick={handleButtonClick} className="w-full">
          <motion.div
            className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg font-medium hover:from-teal-500 hover:to-teal-400 transition-all duration-300 shadow-lg shadow-teal-900/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {!isfull ? <span>Participate</span> : <span>View Details</span>}
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.div>
        </button>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />

      {/* Render the appropriate activity modal based on activity type */}
      {renderModal()}
    </motion.div>
  )
}

export default Activity

