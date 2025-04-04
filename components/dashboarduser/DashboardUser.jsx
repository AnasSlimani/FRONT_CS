"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
import Activities from "./Activities"
import Chat from "./Chat"
import Profile from "./Profile"

const DashboardUser = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMounted, setIsMounted] = useState(false)

  // Add this useEffect to handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Animation variants for page transitions
  const pageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
  }

  // Render the active component based on the selected tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "activities":
        return <Activities />
      case "chat":
        return <Chat />
      case "profile":
        return <Profile />
      default:
        return <Dashboard />
    }
  }

  // Don't render until client-side
  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans mt-2">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <motion.main
        className="flex-1 overflow-y-auto p-6 md:p-8"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
        key={activeTab}
      >
        {renderContent()}
      </motion.main>
    </div>
  )
}

export default DashboardUser

