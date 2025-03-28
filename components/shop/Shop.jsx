"use client"

import { useState, useEffect } from "react"
import ShopSidebar from "./ShopSidebar"
import ShopContent from "./ShopContent"
import { Montserrat, Oswald } from "next/font/google"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Load fonts
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
})

const Shop = () => {
  // State for filters
  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    sizes: [],
  })

  // State for mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // State to track if we're on mobile
  const [isMobile, setIsMobile] = useState(false)

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // If we're on desktop, always show sidebar
      if (!mobile) {
        setSidebarOpen(true)
      }
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const currentValues = prev[filterType]

      // If value is already selected, remove it, otherwise add it
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]

      return {
        ...prev,
        [filterType]: newValues,
      }
    })
  }

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  return (
    <div className={`pt-5 ${montserrat.variable} ${oswald.variable}`}>
      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <div className="fixed bottom-6 left-6 z-50">
          <motion.button
            onClick={toggleSidebar}
            className="bg-teal-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      )}

      {/* Main content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && isMobile && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>

        {/* Sidebar - conditionally shown based on sidebarOpen state */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed md:relative z-40 h-[calc(100vh-4rem)]"
              initial={{ x: isMobile ? -320 : 0, opacity: isMobile ? 0.5 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ShopSidebar filters={filters} onFilterChange={handleFilterChange}  />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content area - always visible */}
        <ShopContent  />
      </div>
    </div>
  )
}

export default Shop

