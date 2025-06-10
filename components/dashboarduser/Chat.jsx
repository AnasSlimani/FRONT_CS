"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Search,
  Phone,
  Video,
  ChevronLeft,
  MessageSquare,
  X,
  Users,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Plus,
  Mic,
  AtSign,
} from "lucide-react"
import { io } from "socket.io-client"
import api from "@/app/api/axios"
import { jwtDecode } from "jwt-decode"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

// Initialize socket connection
const socket = io("http://localhost:3001")

// Custom fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
  
  .chat-font {
    font-family: 'Inter', sans-serif;
  }
  
  .chat-heading {
    font-family: 'Poppins', sans-serif;
  }
  
  .message-bubble {
    position: relative;
    transition: all 0.2s ease;
  }
  
  .message-bubble:hover {
    transform: translateY(-2px);
  }
  
  .message-bubble::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.5;
    filter: blur(10px);
    transform: translateY(10px) scale(0.9);
    transition: all 0.3s ease;
  }
  
  .message-bubble:hover::after {
    opacity: 0.7;
    transform: translateY(5px) scale(0.95);
  }
  
  .my-message::after {
    background: rgba(13, 148, 136, 0.3);
  }
  
  .other-message::after {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .glass-effect {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .team-card {
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .team-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(13, 148, 136, 0.5);
  }
  
  .typing-indicator span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #0d9488;
    margin: 0 2px;
  }
  
  .typing-indicator span:nth-child(1) {
    animation: bounce 1.2s infinite 0s;
  }
  
  .typing-indicator span:nth-child(2) {
    animation: bounce 1.2s infinite 0.2s;
  }
  
  .typing-indicator span:nth-child(3) {
    animation: bounce 1.2s infinite 0.4s;
  }
  
  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-8px); }
  }
  
  .emoji-picker-container {
    position: absolute;
    bottom: 70px;
    right: 70px;
    z-index: 50;
  }
  
  .message-input {
    transition: all 0.3s ease;
  }
  
  .message-input:focus {
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.3);
  }
  
  .team-list-item {
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
  }
  
  .team-list-item:hover {
    border-left-color: #0d9488;
  }
  
  .team-list-item.active {
    border-left-color: #0d9488;
    background: rgba(13, 148, 136, 0.1);
  }
  
  @media (max-width: 768px) {
    .emoji-picker-container {
      right: 10px;
      bottom: 80px;
    }
  }
`

const Chat = () => {
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)
  const [typing, setTyping] = useState([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)
  const [joinedTeams, setJoinedTeams] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTeams, setFilteredTeams] = useState([])
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  const [quickEmojis] = useState(["👍", "❤️", "😂", "🎉", "🙏", "👏"])

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

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const teamItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  }

  const floatVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 3,
        ease: "easeInOut",
      },
    },
  }

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobileView(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial check

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Fetch user data and teams on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get JWT token
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No token found")
          setIsLoading(false)
          return
        }

        // Extract user ID from token
        const userId = jwtDecode(token).id

        if (!userId) {
          console.error("Could not extract user ID from token")
          setIsLoading(false)
          return
        }

        // Get current user using the ID from token
        const response = await api.get(`/users/${userId}`)
        const userData = response.data
        setUser({
          id: userData.id,
          name: userData.username || "Me",
          avatar: userData.profilePicture || "/placeholder.svg?height=40&width=40",
        })

        // Fetch teams the user belongs to
        const teamsData = await api.get(`/teams/member/${userId}`)

        // Format teams data
        const formattedTeams = teamsData.data.map((team) => ({
          id: team.id,
          name: team.name,
          image: team.logo || "/images/logo.png",
          lastMessage: "",
          time: "",
          unread: 0,
          members: team.members || [],
        }))

        setTeams(formattedTeams)
        setFilteredTeams(formattedTeams) // Initialize filtered teams with all teams
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Filter teams when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTeams(teams)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = teams.filter((team) => team.name.toLowerCase().includes(query))
      setFilteredTeams(filtered)
    }
  }, [searchQuery, teams])

  // Set up socket event listeners
  useEffect(() => {
    if (!user) return

    // Listen for message history when joining a team
    socket.on("message_history", (historyMessages) => {
      // Format messages from the server
      const formattedMessages = historyMessages.map((msg) => ({
        id: msg.id,
        sender: msg.senderName,
        content: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: msg.senderId === user.id,
        avatar: msg.senderAvatar || "/placeholder.svg?height=40&width=40",
      }))

      setMessages(formattedMessages)

      // Update last message for the team if there are messages
      if (formattedMessages.length > 0 && selectedTeam) {
        const lastMsg = formattedMessages[formattedMessages.length - 1]
        updateTeamLastMessage(selectedTeam.id, `${lastMsg.content}`, lastMsg.time)
      }
    })

    // Listen for incoming messages
    socket.on("recieve_message", (msg) => {
      const formattedMsg = {
        id: Date.now(),
        sender: msg.user.name,
        content: msg.content,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: false,
        avatar: msg.user.avatar || "/placeholder.svg?height=40&width=40",
      }

      // Only add message if it's for the selected team
      if (selectedTeam && msg.teamId === selectedTeam.id) {
        setMessages((prev) => [...prev, formattedMsg])
      }

      // Update team's last message
      updateTeamLastMessage(msg.teamId, `${msg.content}`, formattedMsg.time)
    })

    // Listen for typing indicators
    socket.on("user_typing", (data) => {
      if (!selectedTeam || data.teamId !== selectedTeam.id) return

      setTyping((prev) => {
        if (prev.includes(data.user) && data.typing === true) return prev
        if (data.typing === false) {
          return prev.filter((u) => u !== data.user)
        } else {
          return [...prev, data.user]
        }
      })
    })

    // Listen for new users joining
    socket.on("new_user", (data) => {
      if (!selectedTeam || data.teamId !== selectedTeam.id) return

      const serverMsg = {
        id: Date.now(),
        sender: "System",
        content: `${data.user} joined the chat`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: false,
        isServer: true,
        avatar: "/placeholder.svg?height=40&width=40",
      }

      setMessages((prev) => [...prev, serverMsg])
    })

    // Listen for errors
    socket.on("error", (error) => {
      console.error("Socket error:", error.message)
    })

    // Cleanup listeners on unmount
    return () => {
      socket.off("message_history")
      socket.off("recieve_message")
      socket.off("user_typing")
      socket.off("new_user")
      socket.off("error")
    }
  }, [user, selectedTeam])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update team's last message
  const updateTeamLastMessage = (teamId, lastMessage, time) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              lastMessage,
              time: time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : team,
      ),
    )
  }

  // Handle sending a message
  const handleSendMessage = (e) => {
    e?.preventDefault()
    if (message.trim() && selectedTeam && user) {
      const now = new Date()
      const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      const newMessage = {
        id: Date.now(),
        sender: user.name,
        content: message,
        time: timeString,
        isMe: true,
        avatar: user.avatar,
      }

      // Add message to local state
      setMessages((prev) => [...prev, newMessage])

      // Get JWT token
      const token = localStorage.getItem("token")

      // Send message to server with token
      socket.emit("send_message", {
        content: message,
        type: "text",
        user: user,
        teamId: selectedTeam.id,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        timestamp: now.toISOString(),
        token, // Include JWT token for authentication
      })

      // Reset typing indicator
      socket.emit("user_typing", {
        user: user.name,
        typing: false,
        teamId: selectedTeam.id,
      })

      // Update team's last message
      updateTeamLastMessage(selectedTeam.id, `${message}`, timeString)

      // Clear input
      setMessage("")
      setShowEmojiPicker(false)
    }
  }

  // Handle typing indicator
  const handleTyping = (e) => {
    setMessage(e.target.value)

    if (selectedTeam && user) {
      socket.emit("user_typing", {
        user: user.name,
        typing: e.target.value ? true : false,
        teamId: selectedTeam.id,
      })
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
  }

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native)
    // Keep focus on the input
    document.getElementById("message-input")?.focus()
  }

  // Handle quick emoji selection
  const handleQuickEmoji = (emoji) => {
    setMessage((prev) => prev + emoji)
    // Keep focus on the input
    document.getElementById("message-input")?.focus()
  }

  // Update the handleSelectTeam function to track joined teams
  const handleSelectTeam = (team) => {
    setSelectedTeam(team)
    setIsMobileView(true)
    setShowWelcomeScreen(false)
    setMessages([]) // Clear messages while loading
    setShowEmojiPicker(false)

    // Get JWT token
    const token = localStorage.getItem("token")

    // Check if this is the first time joining this team
    const isFirstJoin = !joinedTeams.has(team.id)

    // Join team chat room and get message history
    if (user) {
      socket.emit("join_team", {
        teamId: team.id,
        user: user.name,
        token, // Include JWT token for authentication
        isFirstJoin, // Tell the server if this is the first time joining
      })

      // Add this team to the set of joined teams if it's the first time
      if (isFirstJoin) {
        setJoinedTeams((prev) => {
          const newSet = new Set(prev)
          newSet.add(team.id)
          return newSet
        })
      }
    }
  }

  // Go back to team list on mobile
  const handleBackToList = () => {
    setIsMobileView(false)
  }

  // Go back to welcome screen
  const handleBackToWelcome = () => {
    setShowWelcomeScreen(true)
    setSelectedTeam(null)
    setShowEmojiPicker(false)
  }

  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <motion.div
            className="w-16 h-16 border-4 border-t-teal-500 border-r-transparent border-b-teal-500 border-l-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <motion.p
            className="mt-4 text-teal-500 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading your chats...
          </motion.p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{fontStyles}</style>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto chat-font"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white chat-heading">Team Chats</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Stay connected with your teams</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-[#1a2236] rounded-xl shadow-2xl overflow-hidden border border-[#2a3349]"
          style={{ height: "calc(100vh - 240px)", minHeight: "500px" }}
        >
          <div className="flex h-full">
            {/* Team list - hidden on mobile when a chat is selected */}
            <div className={`w-full md:w-1/3 border-r border-[#2a3349] ${isMobileView ? "hidden md:block" : "block"}`}>
              <div className="p-4 border-b border-[#2a3349]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full py-2 pl-10 pr-10 rounded-lg bg-[#2a3349] text-white border-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-y-auto" style={{ height: "calc(100% - 73px)" }}>
                <AnimatePresence>
                  {filteredTeams.length > 0 ? (
                    filteredTeams.map((team, index) => (
                      <motion.div
                        key={team.id}
                        custom={index}
                        variants={teamItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -20 }}
                        className={`team-list-item p-4 border-b border-[#2a3349] hover:bg-[#2a3349] cursor-pointer transition-colors duration-200 ${
                          selectedTeam && selectedTeam.id === team.id ? "active" : ""
                        }`}
                        onClick={() => handleSelectTeam(team)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 opacity-20 blur-sm"></div>
                            <Image
                              src={team.image || "/placeholder.svg?height=50&width=50"}
                              alt={team.name}
                              width={50}
                              height={50}
                              className="rounded-full relative z-10 border-2 border-[#2a3349]"
                            />
                            {team.unread > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-xs">{team.unread}</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold text-white chat-heading">{team.name}</h3>
                            </div>
                            {team.lastMessage && (
                              <p className="text-sm text-gray-400 mt-1 truncate">{team.lastMessage}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : searchQuery ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 text-center text-gray-400"
                    >
                      <Search className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-50" />
                      <p>No teams found matching "{searchQuery}"</p>
                      <button onClick={clearSearch} className="mt-2 text-teal-500 hover:text-teal-400 font-medium">
                        Clear search
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 text-center text-gray-400"
                    >
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-50" />
                      <p>No teams found. Join a team to start chatting.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Chat area - shown when a team is selected or on desktop */}
            <div className={`w-full md:w-2/3 flex flex-col ${isMobileView ? "block md:block" : "hidden md:flex"}`}>
              <AnimatePresence mode="wait">
                {showWelcomeScreen ? (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                    style={{
                      background: "radial-gradient(circle at center, #2a3349 0%, #1a2236 100%)",
                    }}
                  >
                    <motion.div
                      className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center mb-6 shadow-lg"
                      variants={floatVariants}
                      animate="float"
                    >
                      <MessageCircle className="w-12 h-12 text-white" />
                    </motion.div>

                    <motion.h2
                      className="text-2xl font-bold text-white mb-3 chat-heading"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Welcome to Team Chat
                    </motion.h2>

                    <motion.p
                      className="text-gray-300 mb-8 max-w-md"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Connect with your teams in real-time. Select a team from the list to start chatting.
                    </motion.p>

                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {filteredTeams.slice(0, 3).map((team, index) => (
                        <motion.div
                          key={team.id}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          className="team-card bg-[#2a3349] p-4 rounded-xl shadow-md cursor-pointer hover:shadow-teal-900/20"
                          onClick={() => handleSelectTeam(team)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="relative mb-3">
                              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 opacity-20 blur-sm"></div>
                              <Image
                                src={team.image || "/placeholder.svg?height=60&width=60"}
                                alt={team.name}
                                width={60}
                                height={60}
                                className="rounded-full relative z-10 border-2 border-[#1a2236]"
                              />
                            </div>
                            <h3 className="font-medium text-white text-center chat-heading">{team.name}</h3>
                            <div className="mt-3 flex items-center text-teal-400">
                              <span className="text-sm">Open chat</span>
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {filteredTeams.length > 3 && (
                      <motion.p
                        className="mt-4 text-gray-400 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        + {filteredTeams.length - 3} more teams available in the sidebar
                      </motion.p>
                    )}
                  </motion.div>
                ) : selectedTeam ? (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col h-full"
                  >
                    {/* Chat header */}
                    <div className="p-4 border-b border-[#2a3349] flex items-center justify-between bg-[#1e2740] shadow-md">
                      <div className="flex items-center">
                        {windowWidth < 768 && (
                          <button
                            className="mr-2 p-2 rounded-full hover:bg-[#2a3349] transition-colors duration-200"
                            onClick={handleBackToWelcome}
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-400" />
                          </button>
                        )}
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 opacity-20 blur-sm"></div>
                          <Image
                            src={selectedTeam.image || "/placeholder.svg?height=40&width=40"}
                            alt={selectedTeam.name}
                            width={40}
                            height={40}
                            className="rounded-full relative z-10 border-2 border-[#2a3349]"
                          />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-white flex items-center chat-heading">
                            {selectedTeam.name}
                            <Sparkles className="w-4 h-4 ml-2 text-teal-400" />
                          </h3>
                          <p className="text-xs text-gray-400 flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {selectedTeam.members?.length || 0} members
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-full hover:bg-[#2a3349] text-gray-400 hover:text-white transition-colors duration-200">
                          <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-[#2a3349] text-gray-400 hover:text-white transition-colors duration-200">
                          <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-[#2a3349] text-gray-400 hover:text-white transition-colors duration-200">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Messages area */}
                    <div
                      className="flex-1 overflow-y-auto p-4 space-y-4"
                      style={{
                        height: "calc(100% - 140px)",
                        background: "linear-gradient(to bottom, #1e2740, #1a2236)",
                        backgroundImage:
                          "radial-gradient(circle at 25px 25px, rgba(42, 51, 73, 0.3) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(42, 51, 73, 0.3) 2%, transparent 0%)",
                        backgroundSize: "100px 100px",
                      }}
                    >
                      {messages.length > 0 ? (
                        <>
                          <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                              <motion.div
                                key={msg.id}
                                className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                                variants={messageVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0 }}
                              >
                                {msg.isServer ? (
                                  <div className="flex items-center justify-center w-full my-2">
                                    <div className="glass-effect rounded-full px-4 py-1 shadow-sm">
                                      <p className="text-xs text-gray-300">{msg.content}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className={`flex max-w-xs md:max-w-md ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}
                                  >
                                    {!msg.isMe && (
                                      <div className="relative self-end mx-2">
                                        <Image
                                          src={msg.avatar || "/placeholder.svg?height=40&width=40"}
                                          alt={msg.sender}
                                          width={40}
                                          height={40}
                                          className="rounded-full border-2 border-[#2a3349]"
                                        />
                                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-[#2a3349]"></div>
                                      </div>
                                    )}
                                    <div>
                                      {!msg.isMe && (
                                        <p className="text-xs text-gray-400 ml-2 mb-1 font-medium">{msg.sender}</p>
                                      )}
                                      <div
                                        className={`message-bubble rounded-2xl px-4 py-2 shadow-md ${
                                          msg.isMe
                                            ? "my-message bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-tr-none"
                                            : "other-message bg-[#2a3349] text-white rounded-tl-none"
                                        }`}
                                      >
                                        <p className="text-sm">{msg.content}</p>
                                      </div>
                                      <p
                                        className={`text-xs text-gray-500 mt-1 ${
                                          msg.isMe ? "text-right mr-2" : "ml-2"
                                        }`}
                                      >
                                        {msg.time}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </AnimatePresence>

                          {/* Typing indicator */}
                          <AnimatePresence>
                            {typing.length > 0 && (
                              <motion.div
                                className="flex justify-start"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                              >
                                <div className="flex max-w-xs md:max-w-md">
                                  <Image
                                    src="/placeholder.svg?height=40&width=40"
                                    alt={typing[0]}
                                    width={40}
                                    height={40}
                                    className="rounded-full self-end mx-2 border-2 border-[#2a3349]"
                                  />
                                  <div>
                                    <p className="text-xs text-gray-400 ml-2 mb-1 font-medium">{typing[0]}</p>
                                    <div className="rounded-2xl px-4 py-2 bg-[#2a3349] text-white rounded-tl-none shadow-md">
                                      <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <motion.div
                          className="flex items-center justify-center h-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="text-center max-w-md">
                            <motion.div
                              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center shadow-lg"
                              animate={{
                                boxShadow: [
                                  "0px 0px 0px rgba(0, 128, 128, 0.3)",
                                  "0px 0px 20px rgba(0, 128, 128, 0.5)",
                                  "0px 0px 0px rgba(0, 128, 128, 0.3)",
                                ],
                              }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <MessageSquare className="w-10 h-10 text-white" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-white mb-3 chat-heading">Start the conversation</h3>
                            <p className="text-gray-300 mb-4">
                              Be the first to send a message in this team chat. Share updates, ask questions, or just
                              say hello!
                            </p>
                            <motion.div
                              className="inline-block"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <button
                                onClick={() => document.getElementById("message-input").focus()}
                                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-full font-medium flex items-center mx-auto transition-colors duration-200"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Start chatting
                              </button>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message input area */}
                    <div className="p-4 border-t border-[#2a3349] bg-[#1e2740] relative">
                      {/* Quick emoji reactions */}
                      <div className="flex justify-center mb-2 space-x-2">
                        {quickEmojis.map((emoji, index) => (
                          <motion.button
                            key={index}
                            className="w-8 h-8 rounded-full bg-[#2a3349] hover:bg-[#3a4359] flex items-center justify-center text-lg transition-colors duration-200"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuickEmoji(emoji)}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>

                      <form onSubmit={handleSendMessage} className="flex items-center">
                        <div className="flex-1 relative">
                          <div className="absolute left-0 top-0 h-full flex items-center pl-3 space-x-2">
                            <motion.button
                              type="button"
                              className="p-1.5 rounded-full hover:bg-[#2a3349] text-gray-400 hover:text-white transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              type="button"
                              className="p-1.5 rounded-full hover:bg-[#2a3349] text-gray-400 hover:text-white transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <AtSign className="w-4 h-4" />
                            </motion.button>
                          </div>
                          <input
                            id="message-input"
                            type="text"
                            value={message}
                            onChange={handleTyping}
                            placeholder="Type a message..."
                            className="message-input w-full py-3 pl-20 pr-10 rounded-full bg-[#2a3349] text-white border-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                            disabled={!selectedTeam}
                          />
                        </div>

                        <div className="flex ml-2">
                          <motion.button
                            type="button"
                            className="p-2 rounded-full hover:bg-[#2a3349] text-gray-400 hover:text-white transition-colors duration-200 relative"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleEmojiPicker}
                          >
                            <Smile className="w-5 h-5" />
                          </motion.button>

                          <motion.button
                            type="button"
                            className="p-2 rounded-full hover:bg-[#2a3349] text-gray-400 hover:text-white transition-colors duration-200 mx-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Paperclip className="w-5 h-5" />
                          </motion.button>

                          <motion.button
                            type="button"
                            className="p-2 rounded-full hover:bg-[#2a3349] text-gray-400 hover:text-white transition-colors duration-200 mr-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Mic className="w-5 h-5" />
                          </motion.button>

                          <motion.button
                            type="submit"
                            className="p-3 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            disabled={!message.trim() || !selectedTeam}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Send className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </form>

                      {/* Emoji picker */}
                      <AnimatePresence>
                        {showEmojiPicker && (
                          <motion.div
                            className="emoji-picker-container"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                          >
                            <Picker
                              data={data}
                              onEmojiSelect={handleEmojiSelect}
                              theme="dark"
                              previewPosition="none"
                              skinTonePosition="none"
                              set="native"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center p-6"
                    style={{
                      background: "radial-gradient(circle at center, #2a3349 0%, #1a2236 100%)",
                    }}
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center mb-6 shadow-lg"
                      variants={floatVariants}
                      animate="float"
                    >
                      <MessageSquare className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2 chat-heading">Select a team to start chatting</h3>
                    <p className="text-gray-300">
                      Choose a team from the list to view messages and start communicating with your teammates.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default Chat
