"use client"

import { useState, useEffect, useRef } from "react"
import api from "@/app/api/axios"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Search,
  User,
  UserCog,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Download,
  ChevronRight,
  ChevronLeft,
  Filter,
  RefreshCw,
  UserPlus,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowUpRight,
} from "lucide-react"

export default function Adherents() {
  const [adherents, setAdherents] = useState([])
  const [filteredAdherents, setFilteredAdherents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [joinDateFilter, setJoinDateFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const tableRef = useRef(null)

  // Number of users per page
  const usersPerPage = 8

  // Fetch adherents data
  useEffect(() => {
    const fetchAdherents = async () => {
      setIsLoading(true)
      try {
        const response = await api.get("users")
        setAdherents(response.data)
        setFilteredAdherents(response.data)
      } catch (error) {
        console.error("Error fetching adherents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdherents()
  }, [])

  // Filter adherents based on search term and join date
  useEffect(() => {
    let filtered = adherents

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (adherent) =>
          adherent.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          adherent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          adherent.phoneNumber?.includes(searchTerm),
      )
    }

    // Filter by join date
    if (joinDateFilter !== "") {
      const now = new Date()
      const dateThreshold = new Date()

      switch (joinDateFilter) {
        case "last-month":
          dateThreshold.setMonth(now.getMonth() - 1)
          break
        case "last-3-months":
          dateThreshold.setMonth(now.getMonth() - 3)
          break
        case "last-year":
          dateThreshold.setFullYear(now.getFullYear() - 1)
          break
      }

      filtered = filtered.filter((adherent) => {
        if (!adherent.registrationDate) return true
        const joinDate = new Date(adherent.registrationDate)
        return joinDate >= dateThreshold
      })
    }

    setFilteredAdherents(filtered)
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [searchTerm, joinDateFilter, adherents])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Handle join date filter change
  const handleJoinDateFilterChange = (e) => {
    setJoinDateFilter(e.target.value)
  }

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${userId}`)
        // Remove user from state
        setAdherents(adherents.filter((user) => user.id !== userId))
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("Failed to delete user. Please try again.")
      }
    }
  }

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const response = await api.get("users")
      setAdherents(response.data)
      setFilteredAdherents(response.data)

      // Scroll to top of table with smooth animation
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: "smooth" })
      }
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setTimeout(() => setRefreshing(false), 600) // Add slight delay for animation
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredAdherents.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredAdherents.length / usersPerPage)

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPageButtons = 3 // Maximum number of page buttons to show

    if (totalPages <= maxPageButtons) {
      // If total pages is less than or equal to max buttons, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(1)

      // Calculate start and end of middle section
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        endPage = 3
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2
      }

      // Add ellipsis if needed before middle section
      if (startPage > 2) {
        pageNumbers.push("...")
      }

      // Add middle section
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis if needed after middle section
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="h-8 w-8 text-teal-500" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Members
          </h1>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full opacity-20 blur-xl"></div>
        </div>
        <p className="text-gray-600 mt-1 flex items-center">
          Manage your sports club members
          <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white">
            {adherents.length} Total
          </span>
        </p>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl shadow-sm p-4 border border-teal-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Members</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{adherents.filter((a) => a.contributed).length}</h3>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-2 text-xs text-teal-600 font-medium flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            {Math.round((adherents.filter((a) => a.contributed).length / Math.max(1, adherents.length)) * 100)}% of
            total
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Payments</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {adherents.filter((a) => !a.contributed).length}
              </h3>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
              <XCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600 font-medium flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            {Math.round((adherents.filter((a) => !a.contributed).length / Math.max(1, adherents.length)) * 100)}% of
            total
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm p-4 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New This Month</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {
                  adherents.filter((a) => {
                    if (!a.registrationDate) return false
                    const date = new Date(a.registrationDate)
                    const now = new Date()
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                  }).length
                }
              </h3>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-2 text-xs text-purple-600 font-medium flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            New registrations
          </div>
        </div>
      </motion.div>

      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6 bg-white rounded-xl shadow-md p-4 border border-gray-100"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-200" />
            </div>
            <input
              type="text"
              placeholder="Search for a member..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all duration-200"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-colors shadow-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-colors shadow-sm"
              onClick={() => window.print()}
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={refreshing ? { duration: 0.6, ease: "linear", repeat: Number.POSITIVE_INFINITY } : {}}
              className="flex items-center p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors shadow-sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all duration-200"
                    value={joinDateFilter}
                    onChange={handleJoinDateFilterChange}
                  >
                    <option value="">All Time</option>
                    <option value="last-month">Last Month</option>
                    <option value="last-3-months">Last 3 Months</option>
                    <option value="last-year">Last Year</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Adherents list */}
      <motion.div
        ref={tableRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Member
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Membership
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contribution
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((adherent) => (
                <motion.tr
                  key={adherent.id}
                  variants={itemVariants}
                  className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-colors duration-300"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden border-2 border-teal-200 shadow-sm relative group">
                        {adherent.profilePicture ? (
                          <Image
                            src={adherent.profilePicture}
                            alt={adherent.username}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                            {adherent.role === "ADMIN" ? (
                              <UserCog className="h-5 w-5 text-white" />
                            ) : (
                              <User className="h-5 w-5 text-white" />
                            )}
                          </div>
                        )}
                        {adherent.role === "ADMIN" && (
                          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-0.5 border border-white">
                            <UserCog className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                          {adherent.username}
                          {adherent.role === "ADMIN" && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          {adherent.birthDate ? new Date(adherent.birthDate).toLocaleDateString() : "Not provided"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center group">
                      <Mail className="h-4 w-4 mr-1 text-gray-400 group-hover:text-teal-500 transition-colors" />
                      <span className="group-hover:text-teal-600 transition-colors">{adherent.email}</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center group">
                      <Phone className="h-4 w-4 mr-1 text-gray-400 group-hover:text-teal-500 transition-colors" />
                      <span className="group-hover:text-teal-600 transition-colors">
                        {adherent.phoneNumber || "Not provided"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      Since{" "}
                      <span className="font-medium text-gray-700">
                        {adherent.registrationDate
                          ? new Date(adherent.registrationDate).toLocaleDateString()
                          : "Not provided"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1.5 inline-flex items-center text-xs leading-5 font-medium rounded-full shadow-sm ${
                        adherent.contributed
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                          : "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                      }`}
                    >
                      {adherent.contributed ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Paid
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => handleDeleteUser(adherent.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredAdherents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="py-16 text-center"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-blue-300 rounded-full opacity-20 blur-xl transform scale-150"></div>
              <User className="h-16 w-16 mx-auto text-gray-400 relative z-10" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No members found</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
              Try modifying your search criteria or filters to find what you're looking for.
            </p>
            <div className="mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg shadow-sm"
                onClick={() => {
                  setSearchTerm("")
                  setJoinDateFilter("")
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filters
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {filteredAdherents.length > 0 && (
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="text-sm text-gray-500 mb-4 sm:mb-0">
              Showing <span className="font-medium text-gray-700">{indexOfFirstUser + 1}</span> to{" "}
              <span className="font-medium text-gray-700">
                {indexOfLastUser > filteredAdherents.length ? filteredAdherents.length : indexOfLastUser}
              </span>{" "}
              of <span className="font-medium text-gray-700">{filteredAdherents.length}</span> members
            </div>

            <div className="flex flex-wrap justify-center sm:justify-end gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md flex items-center justify-center ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 shadow-sm"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
                    ...
                  </span>
                ) : (
                  <motion.button
                    key={`page-${page}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md min-w-[2rem] ${
                      currentPage === page
                        ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {page}
                  </motion.button>
                ),
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md flex items-center justify-center ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 shadow-sm"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
