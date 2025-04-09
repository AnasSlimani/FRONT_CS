"use client"

import { motion } from "framer-motion"
import { Users, User, AlertCircle } from "lucide-react"
import Image from "next/image"

const TeamsList = ({ activity }) => {
  if (!activity || !activity.teamParticipants || activity.teamParticipants.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-yellow-700">No teams have registered for this tournament yet.</p>
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
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Users className="h-5 w-5 mr-2 text-teal-500" />
          Registered Teams
        </h3>
        <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
          {activity.teamParticipants.length} / {activity.nbrTeams} Teams
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {activity.teamParticipants.map((team) => (
          <motion.div
            key={team.id}
            variants={itemVariants}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h4 className="font-bold text-gray-800">{team.name}</h4>
              <div className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-xs font-medium">
                {team.members.length} Players
              </div>
            </div>

            <div className="p-4">
              <h5 className="text-sm font-medium text-gray-600 mb-2">Team Members:</h5>
              <ul className="space-y-2">
                {team.members.map((member) => (
                  <li key={member.id} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                      {member.profilePicture ? (
                        <Image
                          src={member.profilePicture || "/placeholder.svg"}
                          alt={member.username}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <span className="text-gray-700">{member.username}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default TeamsList
