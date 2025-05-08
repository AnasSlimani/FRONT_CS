"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
import Activities from "./Activities"
import Orders from "./Orders"
import Chat from "./Chat"
import Profile from "./Profile"
import { jwtDecode } from "jwt-decode"
import api from "@/app/api/axios"

const DashboardUser = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMounted, setIsMounted] = useState(false)
  const [user, setUser] = useState({})
  const [currentUserId, setCurrentUserId] = useState(null)

  // Add this useEffect to handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Create a function to refresh user data that can be passed to child components
  const refreshUserData = useCallback(async () => {
    if (!currentUserId) return

    try {
      const response = await api.get(`/users/${currentUserId}`)
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }, [currentUserId])

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const decoded = jwtDecode(token)
          setCurrentUserId(decoded.id)
        } catch (error) {
          console.error("Error decoding token:", error)
        }
      }
    }

    fetchUser()
  }, [])

  // Fetch user data when currentUserId changes
  useEffect(() => {
    refreshUserData()
  }, [currentUserId, refreshUserData])

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
        return <Dashboard user={user} />
      case "activities":
        return <Activities />
      case "chat":
        return <Chat />
      case "profile":
        return <Profile refreshUserData={refreshUserData} />
      case "orders":
        return <Orders user={user} />
      default:
        return <Dashboard />
    }
  }

  // Don't render until client-side
  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans mt-18">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

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
