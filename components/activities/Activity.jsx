"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, MapPin, Clock, Users, Trophy, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import TeamCreationModal from "./modals/TeamCreationModal"
import SimpleConfirmationModal from "./modals/SimpleConfirmationModal"
import PaymentFormModal from "./modals/PaymentFormModal"
import LoginModal from "@/components/login/LoginModal"
import { jwtDecode } from "jwt-decode"
import api from "@/app/api/axios"
import ModalWrapper from "./modals/ModalWrapper"
import { useRouter } from "next/navigation"

const Activity = ({ activity }) => {
  // State for user and participation
  const [currentUserId, setCurrentUserId] = useState(null)
  const [isCheckingParticipation, setIsCheckingParticipation] = useState(false)
  const [isAlreadyParticipating, setIsAlreadyParticipating] = useState(false)
  const [participationTeam, setParticipationTeam] = useState(null)

  // State for controlling registration status and modals
  const isfull = activity.isTournamentFull
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isParticipationModalOpen, setIsParticipationModalOpen] = useState(false)

  const router = useRouter()

  // Get current user ID from token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setCurrentUserId(decoded.id)
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }
  }, [])

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

  // Check if user is already participating in this activity
  const checkUserParticipation = async (userId, activity, api, setIsCheckingParticipation, setParticipationTeam) => {
    if (!userId) return false

    setIsCheckingParticipation(true)
    try {
      // Get the activity to check its participants
      const activityResponse = await api.get(`/activities/${activity.id}`)
      const activityData = activityResponse.data

      if (activity.type === "tournament") {
        // For billard tournaments, check individual participation
        if (activity.sport === "billard") {
          if (
            activityData.individualParticipants &&
            activityData.individualParticipants.some((participant) => participant.id === userId)
          ) {
            console.log("User is already participating in this billard tournament as individual")
            return true
          }
        } else {
          // For other tournaments (football, basketball), check team participation
          // Get teams where this user is a member
          const teamsResponse = await api.get(`/teams/member/${userId}`)
          const userTeams = teamsResponse.data

          // Check if any of the user's teams are already participating in this activity
          const participatingTeam = userTeams.find(
            (team) =>
              activityData.teamParticipants &&
              activityData.teamParticipants.some((participantTeam) => participantTeam.id === team.id),
          )

          if (participatingTeam) {
            setParticipationTeam(participatingTeam)
            return true
          }
        }
      } else {
        // For non-tournament activities (deplacement, matchAmical, etc.), check individual participation
        if (
          activityData.individualParticipants &&
          activityData.individualParticipants.some((participant) => participant.id === userId)
        ) {
          console.log("User is already participating in this activity as individual")
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error checking user participation:", error)
      return false
    } finally {
      setIsCheckingParticipation(false)
    }
  }

  const handleCheckLogin = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      setIsLoginModalOpen(true)
      return
    }

    // If user is logged in, check if they're already participating
    if (currentUserId) {
      const isParticipating = await checkUserParticipation(
        currentUserId,
        activity,
        api,
        setIsCheckingParticipation,
        setParticipationTeam,
      )

      if (isParticipating) {
        setIsAlreadyParticipating(true)
        setIsParticipationModalOpen(true)
      } else {
        // If not participating, show the appropriate activity modal
        setIsModalOpen(true)
      }
    }
  }

  // Handle button click based on registration status
  const handleButtonClick = (e) => {
    if (!isfull) {
      e.preventDefault() // Prevent navigation
      e.stopPropagation() // Stop event propagation
      handleCheckLogin()
    } else {
      // If tournament is full, navigate to details page
      e.preventDefault()
      e.stopPropagation()
      router.push(`/activities/${activity.id}`)
    }
  }

  // Close login modal
  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  // Close participation modal
  const closeParticipationModal = () => {
    setIsParticipationModalOpen(false)
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
            activityTitle={activity.name}
            nbrParticipant={activity.nbrPerTeam}
            activityID={activity.id}
          />
        )
      } else if (activity.sport === "billard") {
        return (
          <SimpleConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            activityTitle={activity.name}
            activityId={activity.id}
            message="Your place is reserved successfully! We will alert you when the tournament begins."
          />
        )
      }
    } else if (activity.type === "deplacement") {
      return (

        <PaymentFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activityTitle={activity.name}
          activityID={activity.id}
        />
      )
    } else if (activity.type === "matchAmical") {
      return (
        <SimpleConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activityTitle={activity.name}
          activityId={activity.id}
          message="Your place is reserved successfully!"
        />
      );
    } 


    // Default case
    return (
      <SimpleConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activityTitle={activity.name}
        activityId={activity.id}
        message="Thank you for your interest in this activity!"
      />
    )
  }

  // Render the participation modal
  const renderParticipationModal = () => {
    return (
      <ModalWrapper isOpen={isParticipationModalOpen} onClose={closeParticipationModal}>
        <div className="relative p-6 border-b border-gray-200">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500 rounded-full filter blur-3xl opacity-5"></div>
          <h3 className="text-xl font-bold text-gray-800">Already Participating</h3>
        </div>

        <div className="p-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            You're already participating in this activity
          </h3>
          <p className="text-gray-600 text-center mb-4">
            You are already registered for this activity with team:
            <span className="font-semibold text-teal-600 block mt-2">{participationTeam?.name || "Your team"}</span>
          </p>
          <p className="text-sm text-gray-500 text-center mb-6">Welcome to the activity in {activity.startingDate}</p>
          <button
            onClick={closeParticipationModal}
            className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-lg transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </ModalWrapper>
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
        <Image
          src={activity.image ? `/images/${activity.image}` : "/placeholder.svg?height=400&width=600"}
          alt={activity.name}
          fill
          className="object-cover"
        />
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
            {activity.type == "tournament" ? (
              <>
                <div className="flex items-center text-sm text-gray-300 col-span-2">
                  <Users className="w-4 h-4 mr-2 text-teal-400" />
                  <span>{activity.nbrTeams} teams required</span>
                </div>
                <div className="flex items-center text-sm text-gray-300 col-span-2">
                  <Users className="w-4 h-4 mr-2 text-teal-400" />
                  <span>{activity.nbrCurrentTeam} current teams</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center text-sm text-gray-300 col-span-2">
                  <Users className="w-4 h-4 mr-2 text-teal-400" />
                  <span>{activity.nbrParticipants} total places</span>
                </div>
                <div className="flex items-center text-sm text-gray-300 col-span-2">
                  <Users className="w-4 h-4 mr-2 text-teal-400" />
                  <span>{activity.nbrCurrentParticipants} reserved places</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Button - Changed to button element instead of Link */}
        <button onClick={handleButtonClick} className="w-full" disabled={isCheckingParticipation}>
          <motion.div
            className={`flex items-center justify-center w-full py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg font-medium hover:from-teal-500 hover:to-teal-400 transition-all duration-300 shadow-lg shadow-teal-900/20 ${
              isCheckingParticipation ? "opacity-70 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: isCheckingParticipation ? 1 : 1.02 }}
            whileTap={{ scale: isCheckingParticipation ? 1 : 0.98 }}
          >
            {isCheckingParticipation ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Checking...</span>
              </>
            ) : !isfull ? (
              <>
                <span>Participate</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                <span>View Details</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </motion.div>
        </button>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />

      {/* Already Participating Modal */}
      {renderParticipationModal()}

      {/* Render the appropriate activity modal based on activity type */}
      {renderModal()}
    </motion.div>
  )
}

export default Activity;

