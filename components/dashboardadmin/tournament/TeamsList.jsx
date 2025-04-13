"use client"

import { motion } from "framer-motion"
import { Users, AlertCircle, Shield, UserPlus } from 'lucide-react'
import AvatarImage from "@/components/ui/avatar-image"

const TeamsList = ({ activity }) => {
  if (!activity || !activity.teamParticipants || activity.teamParticipants.length === 0) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 flex flex-col items-center text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mb-3" />
        <h3 className="text-lg font-semibold text-amber-800 mb-2">No Teams Registered</h3>
        <p className="text-amber-700 max-w-md">
          No teams have registered for this tournament yet. Teams will appear here once they join.
        </p>
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-amber-100 p-3 rounded-full mr-3">
            <Users className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
            Registered Teams
          </h3>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
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
              boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.3 },
            }}
            className="bg-white border border-amber-100 rounded-xl shadow-sm overflow-hidden transition-all duration-300"
          >
            <div className="p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-amber-100/50 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                  <Shield className="h-5 w-5 text-amber-500" />
                </div>
                <h4 className="font-bold text-amber-800">{team.name}</h4>
              </div>
              <div className="bg-white text-amber-600 px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-amber-100">
                {team.members.length} Players
              </div>
            </div>

            <div className="p-5">
              <h5 className="text-sm font-medium text-gray-600 mb-4 flex items-center">
                <UserPlus className="h-4 w-4 mr-2 text-amber-500" />
                Team Members
              </h5>
              <ul className="space-y-3">
                {team.members.map((member) => (
                  <li key={member.id} className="flex items-center p-2 hover:bg-amber-50 rounded-lg transition-colors">
                    <div className="mr-3 relative">
                      <AvatarImage src={member.profilePicture || "/placeholder.svg"} alt={member.username} size={40} />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
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
