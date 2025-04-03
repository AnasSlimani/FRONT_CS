"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Send, Paperclip, Smile, MoreVertical, Search, Phone, Video, ChevronLeft, MessageSquare } from "lucide-react"

// Sample team data
const teams = [
  {
    id: 1,
    name: "Football Team Alpha",
    image: "/images/logo.png",
    lastMessage: "Coach: Don't forget practice tomorrow at 5PM!",
    time: "10:30 AM",
    unread: 2,
  },
  {
    id: 2,
    name: "Basketball Squad",
    image: "/images/logo.png",
    lastMessage: "Mike: Is everyone ready for the tournament?",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 3,
    name: "Billard Masters",
    image: "/images/logo.png",
    lastMessage: "Sarah: I'll bring the equipment for practice",
    time: "2 days ago",
    unread: 0,
  },
]

// Sample messages for the selected chat
const sampleMessages = [
  {
    id: 1,
    sender: "Coach Smith",
    content: "Hello team! Just a reminder about our practice tomorrow at 5PM.",
    time: "10:15 AM",
    isMe: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    sender: "Me",
    content: "Thanks coach, I'll be there!",
    time: "10:20 AM",
    isMe: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    sender: "Mike Johnson",
    content: "I might be 10 minutes late, is that okay?",
    time: "10:22 AM",
    isMe: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    sender: "Coach Smith",
    content: "That's fine Mike, just get there when you can.",
    time: "10:25 AM",
    isMe: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    sender: "Sarah Williams",
    content: "Should I bring the extra equipment again?",
    time: "10:27 AM",
    isMe: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    sender: "Coach Smith",
    content:
      "Yes please, and don't forget we have a strategy meeting after practice to prepare for the tournament this weekend.",
    time: "10:30 AM",
    isMe: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const Chat = () => {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [message, setMessage] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)

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

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      // In a real app, you would send this message to your backend
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  // Handle selecting a team chat
  const handleSelectTeam = (team) => {
    setSelectedTeam(team)
    setIsMobileView(true)
  }

  // Go back to team list on mobile
  const handleBackToList = () => {
    setIsMobileView(false)
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto">
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Team Chats</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Stay connected with your teams</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        style={{ height: "calc(100vh - 240px)", minHeight: "500px" }}
      >
        <div className="flex h-full">
          {/* Team list - hidden on mobile when a chat is selected */}
          <div
            className={`w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 ${
              isMobileView ? "hidden md:block" : "block"
            }`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search teams..."
                  className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="overflow-y-auto" style={{ height: "calc(100% - 73px)" }}>
              {teams.map((team) => (
                <motion.div
                  key={team.id}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSelectTeam(team)}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <Image
                        src={team.image || "/placeholder.svg"}
                        alt={team.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      {team.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">{team.unread}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 dark:text-white">{team.name}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{team.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">{team.lastMessage}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat area - shown when a team is selected or on desktop */}
          {(selectedTeam || !isMobileView) && (
            <div className={`w-full md:w-2/3 flex flex-col ${isMobileView ? "block md:block" : "hidden md:flex"}`}>
              {/* Chat header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                  {isMobileView && (
                    <button className="mr-2 md:hidden" onClick={handleBackToList}>
                      <ChevronLeft className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                  {selectedTeam ? (
                    <>
                      <Image
                        src={selectedTeam.image || "/placeholder.svg"}
                        alt={selectedTeam.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-800 dark:text-white">{selectedTeam.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">6 members</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="ml-3">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Video className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: "calc(100% - 140px)" }}>
                {selectedTeam ? (
                  sampleMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex max-w-xs md:max-w-md ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}>
                        {!msg.isMe && (
                          <Image
                            src={msg.avatar || "/placeholder.svg"}
                            alt={msg.sender}
                            width={40}
                            height={40}
                            className="rounded-full self-end mx-2"
                          />
                        )}
                        <div>
                          {!msg.isMe && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 ml-2 mb-1">{msg.sender}</p>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              msg.isMe
                                ? "bg-teal-500 text-white rounded-tr-none"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <p
                            className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                              msg.isMe ? "text-right mr-2" : "ml-2"
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                      <MessageSquare className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      Select a team to start chatting
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Choose a team from the list to view messages and start communicating with your teammates.
                    </p>
                  </div>
                )}
              </div>

              {/* Message input area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <button type="button" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 mr-2">
                    <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 py-2 px-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button type="button" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 mx-2">
                    <Smile className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white"
                    disabled={!message.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Chat

