"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, Calendar, MessageSquare, User, ChevronDown, LogOut, Settings, Menu, X } from "lucide-react"

// Sample team data for the chat dropdown
const teams = [
  { id: 1, name: "Football Team Alpha", image: "/images/logo.png" },
  { id: 2, name: "Basketball Squad", image: "/images/logo.png" },
  { id: 3, name: "Billard Masters", image: "/images/logo.png" },
]

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Animation variants
  const sidebarVariants = {
    hidden: { x: -300 },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const dropdownVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  }

  // Handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab)
    setIsMobileMenuOpen(false)
  }

  // Toggle chat dropdown
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden mt-20">
        <motion.button
          className="p-2 rounded-full bg-teal-600 text-white shadow-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || true) && (
          <motion.aside
            className={`w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl z-40 ${
              isMobileMenuOpen ? "fixed inset-y-0 left-0 md:relative" : "hidden md:block"
            }`}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* User profile section */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 animate-pulse"></div>
                  <Image
                    src="/images/anas.jpg"
                    alt="User Profile"
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-white object-cover relative z-10"
                  />
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white z-20"></div>
                </div>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-gray-400 text-sm">Premium Member</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              <ul className="space-y-2">
                {/* Dashboard */}
                <motion.li custom={0} variants={itemVariants} initial="hidden" animate="visible">
                  <button
                    className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                      activeTab === "dashboard" ? "bg-teal-600 text-white" : "text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabClick("dashboard")}
                  >
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    <span>Dashboard</span>
                  </button>
                </motion.li>

                {/* Activities */}
                <motion.li custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <button
                    className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                      activeTab === "activities" ? "bg-teal-600 text-white" : "text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabClick("activities")}
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Activities</span>
                  </button>
                </motion.li>

                {/* Chat with dropdown */}
                <motion.li custom={2} variants={itemVariants} initial="hidden" animate="visible" className="space-y-1">
                  <button
                    className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors duration-200 ${
                      activeTab === "chat" ? "bg-teal-600 text-white" : "text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={toggleChat}
                  >
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-3" />
                      <span>Chat</span>
                    </div>
                    <motion.div animate={{ rotate: isChatOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  {/* Teams dropdown */}
                  <AnimatePresence>
                    {isChatOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="overflow-hidden ml-4"
                      >
                        <ul className="pl-2 border-l border-gray-700 space-y-1">
                          {teams.map((team) => (
                            <motion.li
                              key={team.id}
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <button
                                className="flex items-center w-full p-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                                onClick={() => handleTabClick("chat")}
                              >
                                <Image
                                  src={team.image || "/placeholder.svg"}
                                  alt={team.name}
                                  width={20}
                                  height={20}
                                  className="rounded-full mr-2"
                                />
                                <span className="text-sm truncate">{team.name}</span>
                              </button>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>

                {/* Profile */}
                <motion.li custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <button
                    className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                      activeTab === "profile" ? "bg-teal-600 text-white" : "text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabClick("profile")}
                  >
                    <User className="w-5 h-5 mr-3" />
                    <span>Profile</span>
                  </button>
                </motion.li>
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar

