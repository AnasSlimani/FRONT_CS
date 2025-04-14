"use client"

import { useState, useEffect } from "react"
import api from "@/app/api/axios"
import { motion } from "framer-motion"
import { Search, User, Mail, Phone, Calendar, Trash2, Download, ChevronRight, ChevronLeft, Filter } from "lucide-react"

export default function Adherents() {
  const [adherents, setAdherents] = useState([])
  const [filteredAdherents, setFilteredAdherents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [joinDateFilter, setJoinDateFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

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
        if (!adherent.joinDate) return true
        const joinDate = new Date(adherent.joinDate)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
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
        <h1 className="text-3xl font-bold text-gray-800">Members</h1>
        <p className="text-gray-600 mt-1">Manage your sports club members</p>
      </motion.div>

      {/* Search and filters */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for a member..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>

            <button
              className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              onClick={() => window.print()}
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Simplified filters - only join date */}
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={joinDateFilter}
                  onChange={handleJoinDateFilterChange}
                >
                  <option value="">All</option>
                  <option value="last-month">Last Month</option>
                  <option value="last-3-months">Last 3 Months</option>
                  <option value="last-year">Last Year</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Adherents list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                <motion.tr key={adherent.id} variants={itemVariants} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{adherent.username}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {adherent.birthDate ? new Date(adherent.birthDate).toLocaleDateString() : "Not provided"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-gray-500" />
                      {adherent.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {adherent.phoneNumber || "Not provided"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* <div className="text-sm text-gray-900">{adherent.membershipType || "Standard"}</div> */}
                    <div className="text-sm text-gray-500">
                      Since {adherent.registrationDate ? new Date(adherent.registrationDate).toLocaleDateString() : "Not provided"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        adherent.contributed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {adherent.contributed ? "Paid" : "Not Paid"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-red-600 hover:text-red-900 transition-colors"
                      onClick={() => handleDeleteUser(adherent.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredAdherents.length === 0 && (
          <div className="py-12 text-center">
            <User className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
            <p className="mt-1 text-sm text-gray-500">Try modifying your search criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {filteredAdherents.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
              <span className="font-medium">
                {indexOfLastUser > filteredAdherents.length ? filteredAdherents.length : indexOfLastUser}
              </span>{" "}
              of <span className="font-medium">{filteredAdherents.length}</span> members
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

