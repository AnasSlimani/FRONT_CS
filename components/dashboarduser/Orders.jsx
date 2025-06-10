"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import api from "@/app/api/axios"
import { jwtDecode } from "jwt-decode"
import { Search, ShoppingBag, Package, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

export default function Orders({ user }) {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeStatus, setActiveStatus] = useState("all")
  const [idUser, setIdUser] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 7

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const idUser = jwtDecode(localStorage.getItem("token")).id
        setIdUser(idUser)
        const response = await api.get(`/orders/user/${user.id}`)
        setOrders(response.data)
        setFilteredOrders(response.data)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders based on search term and active status
  useEffect(() => {
    let filtered = orders

    // Filter by status
    if (activeStatus !== "all") {
      filtered = filtered.filter((order) => order.status === activeStatus)
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (order) =>
          (order.product.productName && order.product.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.product.productCategory && order.product.productCategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.product.color && order.product.color.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredOrders(filtered)
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [searchTerm, activeStatus, orders])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "canceled":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Package className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "canceled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
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

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  // Page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
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
        <h1 className="text-3xl font-bold text-white">My Orders</h1>
        <p className="text-gray-400 mt-1">View your product orders</p>
      </motion.div>

      {/* Search and filters */}
      <div className="mb-6 bg-gray-800 rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for an order..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Status filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeStatus === "all" ? "bg-teal-500 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
            onClick={() => setActiveStatus("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              activeStatus === "pending" ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
            onClick={() => setActiveStatus("pending")}
          >
            <Package className="h-4 w-4 mr-1" />
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              activeStatus === "completed" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
            onClick={() => setActiveStatus("completed")}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              activeStatus === "canceled" ? "bg-red-500 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
            onClick={() => setActiveStatus("canceled")}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Cancelled
          </button>
        </div>
      </div>

      {/* Orders list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-800 rounded-xl shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Color
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Size
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {currentOrders.map((order, index) => (
                <motion.tr
                  key={order._id || index}
                  variants={itemVariants}
                  className="hover:bg-gray-750 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative rounded overflow-hidden">
                        <Image
                          src={`/images/productImages/${order.product.productImage || "blackPolo.jpeg"}`}
                          alt={order.productName || "Product Image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-200">
                          {order.product.productName || "Classic Polo Shirt"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200">{order.product.productCategory || "polos"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-200">
                      {order.product.productPrice}€
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200">{order.product.color || "black"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200">{order.product.size || "M"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusColor(order.status || "pending")}`}
                    >
                      {getStatusIcon(order.status || "pending")}
                      <span className="ml-1">
                        {order.status === "pending" && "Pending"}
                        {order.status === "completed" && "Completed"}
                        {order.status === "canceled" && "Canceled"}
                        {!order.status && "Pending"}
                      </span>
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredOrders.length === 0 && (
          <div className="py-12 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-300">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">Try modifying your search criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 flex justify-between items-center border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </div>
            <div className="flex space-x-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
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
