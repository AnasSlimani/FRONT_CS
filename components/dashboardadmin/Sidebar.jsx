"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, Users, Calendar, ShoppingBag, User, LogOut, Menu, X, ChevronRight } from "lucide-react"

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  // Update the menu items to English
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "adherents", label: "Members", icon: <Users className="w-5 h-5" /> },
    { id: "activities", label: "Activities", icon: <Calendar className="w-5 h-5" /> },
    { id: "commandes", label: "Orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
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
            className={`w-72 shadow-xl z-40 flex flex-col ${
              isMobileMenuOpen ? "fixed inset-y-0 left-0 md:relative" : "hidden md:flex"
            } bg-gradient-to-b from-teal-700 to-teal-900`}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* No decorative elements */}

            {/* Logo and brand */}
            <div className="p-6 border-b border-teal-600/50 relative z-10">
              <div className="flex items-center">
                <div className="relative w-10 h-10 mr-3 bg-white rounded-lg overflow-hidden">
                  <Image src="/images/logo.png" alt="Club Sportif Logo" fill className="object-contain" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Club Sportif</h1>
                  <p className="text-xs text-teal-200">Administration</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto relative z-10">
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.li key={item.id} custom={index} variants={itemVariants} initial="hidden" animate="visible">
                    <button
                      className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                        activeTab === item.id ? "bg-white text-teal-700 shadow-md" : "text-white hover:bg-teal-600/50"
                      }`}
                      onClick={() => {
                        setActiveTab(item.id)
                        if (isMobileMenuOpen) setIsMobileMenuOpen(false)
                      }}
                    >
                      {item.icon}
                      <span className="ml-3 font-medium">{item.label}</span>
                      {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Bottom actions */}
            <div className="p-4 relative z-10">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full p-3 mt-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

