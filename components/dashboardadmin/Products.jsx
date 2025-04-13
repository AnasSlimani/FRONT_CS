"use client"

import { useState, useEffect } from "react"
import api from "@/app/api/axios"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  Plus,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import CreateActivityModal from "@/components/dashboardadmin/modals/CreateActivityModal"
import EditActivityModal from "@/components/dashboardadmin/modals/EditActivityModal"
import ActivityDetails from "./ActivityDetails"

export default function Products() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [selectedProductId, setSelectedProductId] = useState(null)

  // Fetch activities data
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/products")
      setProducts(response.data)
      setFilteredProducts(response.data)
    } catch (error) {
      console.error("Error fetching activities:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter activities based on search term and active type
  useEffect(() => {
    let filtered = products

    // Filter by type
    if (activeCategory !== "all") {
      filtered = filtered.filter((product) => product.productCategory === activeCategory)
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (product) =>
          product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.productCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.color?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredActivities(filtered)
  }, [searchTerm, activeCategory, products])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Toggle dropdown menu for a specific activity
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  // Handle activity creation
  const handleProductCreated = (newProduct) => {
    setProducts([...products, newProduct])
    // Refresh activities from server to ensure we have the latest data
    fetchProducts()
  }

  // Handle activity update
  const handleProductUpdated = (updatedProduct) => {
    setProducts(products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))
    // Refresh activities from server to ensure we have the latest data
    fetchProducts()
  }

  // Handle view details button click
  const handleViewDetails = (activity) => {
    setSelectedActivityId(activity.id)
    setActiveDropdown(null) // Close dropdown
  }

  // Handle edit button click
  const handleEditClick = (activity) => {
    setCurrentActivity(activity)
    setShowEditModal(true)
    setActiveDropdown(null) // Close dropdown
  }

  // Handle delete button click
  const handleDeleteClick = (activity) => {
    setDeleteConfirmation(activity)
    setActiveDropdown(null) // Close dropdown
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation) return

    try {
      await api.delete(`/activities/${deleteConfirmation.id}`)
      setActivities(activities.filter((activity) => activity.id !== deleteConfirmation.id))
      setDeleteConfirmation(null)
    } catch (error) {
      console.error("Error deleting activity:", error)
    }
  }

  // Get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "tournament":
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case "deplacement":
        return <MapPin className="w-5 h-5 text-red-500" />
      case "matchAmical":
        return <Users className="w-5 h-5 text-blue-500" />
      default:
        return <Calendar className="w-5 h-5 text-teal-500" />
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

  // Activity card component
  const ActivityCard = ({ activity }) => (
    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Activity Image */}
      <div className="relative h-48 w-full">
        <Image
          src={activity.image ? `/images/${activity.image}` : "/placeholder.svg?height=400&width=600"}
          alt={activity.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Type Badge */}
        <div className="absolute top-4 left-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm flex items-center">
          {getActivityIcon(activity.type)}
          <span className="ml-1.5 capitalize">{activity.type}</span>
        </div>

        {/* Actions Dropdown */}
        <div className="absolute top-4 right-4">
          <button
            className="p-2 bg-white/90 rounded-full shadow-lg backdrop-blur-sm"
            onClick={() => toggleDropdown(activity.id)}
          >
            <MoreHorizontal className="h-5 w-5 text-gray-700" />
          </button>

          {/* Dropdown menu */}
          {activeDropdown === activity.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                {/* Only show View Details for tournament and matchAmical types */}
                {activity.type !== "deplacement" && (
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => handleViewDetails(activity)}
                  >
                    <Eye className="h-4 w-4 mr-2 text-gray-500" />
                    View Details
                  </button>
                )}
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleEditClick(activity)}
                >
                  <Edit className="h-4 w-4 mr-2 text-gray-500" />
                  Edit
                </button>
                <button
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleDeleteClick(activity)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{activity.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{activity.description}</p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{new Date(activity.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{activity.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>{activity.localisation}</span>
          </div>
          {activity.nbrParticipants && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span>{activity.nbrParticipants} participants</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                activity.isTournamentFull ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
              }`}
            >
              {activity.isTournamentFull ? "Full" : "Available Spots"}
            </span>
            <span className="text-sm font-medium text-gray-700">{activity.sport}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <AnimatePresence>
      {deleteConfirmation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteConfirmation(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold">Delete Activity</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-semibold">{deleteConfirmation.name}</span>? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setDeleteConfirmation(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (selectedActivityId) {
    return <ActivityDetails activityId={selectedActivityId} onBack={() => setSelectedActivityId(null)} />
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Activities</h1>
          <p className="text-gray-600 mt-1">Manage your sports club activities</p>
        </div>

        <button
          className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors shadow-md"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Activity
        </button>
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
              placeholder="Search for an activity..."
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
          </div>
        </div>

        {/* Type filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeType === "all" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveType("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              activeType === "tournament" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveType("tournament")}
          >
            <Trophy className="h-4 w-4 mr-1" />
            Tournaments
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              activeType === "deplacement" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveType("deplacement")}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Trips
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              activeType === "matchAmical" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveType("matchAmical")}
          >
            <Users className="h-4 w-4 mr-1" />
            Friendly Matches
          </button>
        </div>

        {/* Advanced filters - collapsible */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">All</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="billard">Billiards</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">All</option>
                  <option value="available">Available Spots</option>
                  <option value="full">Full</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">All</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Activities grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}

        {/* Empty state */}
        {filteredActivities.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl shadow-md">
            <Calendar className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
            <p className="mt-1 text-sm text-gray-500">Try modifying your search criteria or add a new activity.</p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Activity
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Create Activity Modal */}
      <CreateActivityModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onActivityCreated={handleActivityCreated}
      />

      {/* Edit Activity Modal */}
      <EditActivityModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        activity={currentActivity}
        onActivityUpdated={handleActivityUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />
    </div>
  )
}
