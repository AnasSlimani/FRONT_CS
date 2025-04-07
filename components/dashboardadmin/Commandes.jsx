"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  ShoppingBag,
  Package,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Truck,
  MoreHorizontal,
  Eye,
  Trash2,
} from "lucide-react"
import Image from "next/image"

export default function Commandes() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeStatus, setActiveStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll simulate a delay and use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockOrders = [
          {
            id: 1,
            orderNumber: "ORD-2023-001",
            customer: {
              id: 101,
              name: "Jean Dupont",
              email: "jean.dupont@example.com",
              phone: "+33 6 12 34 56 78",
            },
            product: {
              id: 201,
              name: "Club Sportif Polo",
              size: "M",
              price: 30,
              image: "polo.jpg",
            },
            orderDate: "2023-06-15",
            status: "pending",
            paymentMethod: "card",
          },
          {
            id: 2,
            orderNumber: "ORD-2023-002",
            customer: {
              id: 102,
              name: "Marie Martin",
              email: "marie.martin@example.com",
              phone: "+33 6 23 45 67 89",
            },
            product: {
              id: 202,
              name: "Club Sportif Hoodie",
              size: "L",
              price: 45,
              image: "hoodie.jpg",
            },
            orderDate: "2023-06-18",
            status: "delivered",
            paymentMethod: "cash",
          },
          {
            id: 3,
            orderNumber: "ORD-2023-003",
            customer: {
              id: 103,
              name: "Pierre Durand",
              email: "pierre.durand@example.com",
              phone: "+33 6 34 56 78 90",
            },
            product: {
              id: 203,
              name: "Club Sportif Cap",
              size: "One Size",
              price: 20,
              image: "cap.jpg",
            },
            orderDate: "2023-06-20",
            status: "pending",
            paymentMethod: "card",
          },
          {
            id: 4,
            orderNumber: "ORD-2023-004",
            customer: {
              id: 104,
              name: "Sophie Lefebvre",
              email: "sophie.lefebvre@example.com",
              phone: "+33 6 45 67 89 01",
            },
            product: {
              id: 204,
              name: "Club Sportif T-Shirt",
              size: "S",
              price: 25,
              image: "tshirt.jpg",
            },
            orderDate: "2023-06-22",
            status: "cancelled",
            paymentMethod: "card",
          },
          {
            id: 5,
            orderNumber: "ORD-2023-005",
            customer: {
              id: 105,
              name: "Thomas Bernard",
              email: "thomas.bernard@example.com",
              phone: "+33 6 56 78 90 12",
            },
            product: {
              id: 205,
              name: "Club Sportif Shorts",
              size: "M",
              price: 28,
              image: "shorts.jpg",
            },
            orderDate: "2023-06-25",
            status: "delivered",
            paymentMethod: "cash",
          },
          {
            id: 6,
            orderNumber: "ORD-2023-006",
            customer: {
              id: 106,
              name: "Julie Petit",
              email: "julie.petit@example.com",
              phone: "+33 6 67 89 01 23",
            },
            product: {
              id: 206,
              name: "Club Sportif Bag",
              size: "One Size",
              price: 35,
              image: "bag.jpg",
            },
            orderDate: "2023-06-28",
            status: "pending",
            paymentMethod: "card",
          },
        ]

        setOrders(mockOrders)
        setFilteredOrders(mockOrders)
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
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredOrders(filtered)
  }, [searchTerm, activeStatus, orders])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Toggle dropdown menu for a specific order
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Package className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
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

  // Mark as delivered handler
  const handleMarkAsDelivered = (orderId) => {
    // In a real app, you would call your API to update the order status
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "delivered" } : order)))
    setActiveDropdown(null)
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
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-600 mt-1">Manage your club product orders</p>
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
              placeholder="Search for an order..."
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

        {/* Status filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeStatus === "all" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveStatus("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              activeStatus === "pending" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveStatus("pending")}
          >
            <Package className="h-4 w-4 mr-1" />
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              activeStatus === "delivered" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveStatus("delivered")}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Delivered
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              activeStatus === "cancelled" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveStatus("cancelled")}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Cancelled
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">All</option>
                  <option value="card">Credit Card</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">All</option>
                  <option value="last-week">Last Week</option>
                  <option value="last-month">Last Month</option>
                  <option value="last-3-months">Last 3 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">All</option>
                  <option value="polo">Polo</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="cap">Cap</option>
                  <option value="tshirt">T-Shirt</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Orders list */}
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
                  Order
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
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
              {filteredOrders.map((order) => (
                <motion.tr key={order.id} variants={itemVariants} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {order.customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative rounded overflow-hidden">
                        <Image
                          src={`/images/productImages/${order.product.image}`}
                          alt={order.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{order.product.name}</div>
                        <div className="text-sm text-gray-500">
                          Size: {order.product.size} | {order.product.price}€
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">
                        {order.status === "pending" && "Pending"}
                        {order.status === "delivered" && "Delivered"}
                        {order.status === "cancelled" && "Cancelled"}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                    <button className="text-gray-500 hover:text-gray-700" onClick={() => toggleDropdown(order.id)}>
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {/* Dropdown menu */}
                    {activeDropdown === order.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <Eye className="h-4 w-4 mr-2 text-gray-500" />
                            View Details
                          </button>
                          {order.status === "pending" && (
                            <button
                              className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-100 w-full text-left"
                              onClick={() => handleMarkAsDelivered(order.id)}
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Mark as Delivered
                            </button>
                          )}
                          <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredOrders.length === 0 && (
          <div className="py-12 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">Try modifying your search criteria.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

