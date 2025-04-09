"use client"

import { motion } from "framer-motion"
import { Users, AlertCircle } from "lucide-react"
import AvatarImage from "@/components/ui/avatar-image"

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
          <Users className="h-5 w-5 mr-2 text-amber-500" />
          Registered Teams
        </h3>
        <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
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
            whileHover={{
              y: -8,
              boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.3 },
            }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300"
          >
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
              <h4 className="font-bold text-gray-800">{team.name}</h4>
              <div className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
                {team.members.length} Players
              </div>
            </div>

            <div className="p-4">
              <h5 className="text-sm font-medium text-gray-600 mb-3">Team Members:</h5>
              <ul className="space-y-3">
                {team.members.map((member) => (
                  <li key={member.id} className="flex items-center">
                    <div className="mr-3">
                      <AvatarImage src={member.profilePicture} alt={member.username} size={36} />
                    </div>
                    <span className="text-gray-700 font-medium">{member.username}</span>
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
