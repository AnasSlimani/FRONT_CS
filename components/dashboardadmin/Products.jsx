"use client"

import { useState, useEffect } from "react"
import api from "@/app/api/axios"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Plus, Tag, Package, DollarSign, Users, Layers, MoreHorizontal, Edit, Trash2, Eye, AlertCircle } from 'lucide-react'
import Image from "next/image"
import CreateProductModal from "@/components/dashboardadmin/modals/CreateProductModal"
import EditProductModal from "@/components/dashboardadmin/modals/EditProductModal"

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

  // Fetch product data
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
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter products based on search term and active category
  useEffect(() => {
    let filtered = products

    // Filter by category
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

    setFilteredProducts(filtered)
  }, [searchTerm, activeCategory, products])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Toggle dropdown menu for a specific product
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  // Handle product creation
  const handleProductCreated = (newProduct) => {
    setProducts([...products, newProduct])
    // Refresh products from server to ensure we have the latest data
    fetchProducts()
  }

  // Handle product update
  const handleProductUpdated = (updatedProduct) => {
    setProducts(products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))
    // Refresh products from server to ensure we have the latest data
    fetchProducts()
  }

  // Handle view details button click
  const handleViewDetails = (product) => {
    setSelectedProductId(product.id)
    setActiveDropdown(null) // Close dropdown
  }

  // Handle edit button click
  const handleEditClick = (product) => {
    setCurrentProduct(product)
    setShowEditModal(true)
    setActiveDropdown(null) // Close dropdown
  }

  // Handle delete button click
  const handleDeleteClick = (product) => {
    setDeleteConfirmation(product)
    setActiveDropdown(null) // Close dropdown
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation) return

    try {
      await api.delete(`/products/${deleteConfirmation.id}`)
      setProducts(products.filter((product) => product.id !== deleteConfirmation.id))
      setDeleteConfirmation(null)
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  // Get icon based on product category
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "clothing":
        return <Tag className="w-5 h-5 text-blue-500" />
      case "equipment":
        return <Package className="w-5 h-5 text-green-500" />
      case "accessories":
        return <Layers className="w-5 h-5 text-purple-500" />
      default:
        return <Package className="w-5 h-5 text-teal-500" />
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

  // Product card component
  const ProductCard = ({ product }) => (
    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 w-full">
        <Image
          src={product.productImage ? `/images/productImages/${product.productImage}` : "/placeholder.svg?height=400&width=600"}
          alt={product.productName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm flex items-center">
          {getCategoryIcon(product.productCategory)}
          <span className="ml-1.5 capitalize">{product.productCategory}</span>
        </div>

        {/* Actions Dropdown */}
        <div className="absolute top-4 right-4">
          <button
            className="p-2 bg-white/90 rounded-full shadow-lg backdrop-blur-sm"
            onClick={() => toggleDropdown(product.id)}
          >
            <MoreHorizontal className="h-5 w-5 text-gray-700" />
          </button>

          {/* Dropdown menu */}
          {activeDropdown === product.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleEditClick(product)}
                >
                  <Edit className="h-4 w-4 mr-2 text-gray-500" />
                  Edit
                </button>
                <button
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleDeleteClick(product)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.productName}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
            <span>${product.productPrice?.toFixed(2)}</span>
          </div>
          {product.color && (
            <div className="flex items-center text-sm text-gray-600">
              <div 
                className="h-4 w-4 mr-2 rounded-full" 
                style={{ backgroundColor: product.color }}
              ></div>
              <span>{product.color}</span>
            </div>
          )}
          {product.size && (
            <div className="flex items-center text-sm text-gray-600">
              <Tag className="h-4 w-4 mr-2 text-gray-500" />
              <span>Size: {product.size}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {product.productQuantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {product.productQuantity} {product.productQuantity === 1 ? "item" : "items"}
            </span>
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
              <h2 className="text-xl font-bold">Delete Product</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-semibold">{deleteConfirmation.productName}</span>? This
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

  // if (selectedProductId) {
  //   return <ProductDetails productId={selectedProductId} onBack={() => setSelectedProductId(null)} />
  // }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600 mt-1">Manage your sports club merchandise</p>
        </div>

        <button
          className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors shadow-md"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
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
              placeholder="Search for a product..."
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

        {/* Category filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === "all" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCategory("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              activeCategory === "echarpes" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCategory("echarpes")}
          >
            <Tag className="h-4 w-4 mr-1" />
            Echarpes
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              activeCategory === "polos" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCategory("polos")}
          >
            <Package className="h-4 w-4 mr-1" />
            Polos
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              activeCategory === "caps" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCategory("caps")}
          >
            <Layers className="h-4 w-4 mr-1" />
            Caps
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">All</option>
                  <option value="0-25">$0 - $25</option>
                  <option value="25-50">$25 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100+">$100+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">All</option>
                  <option value="inStock">In Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="newest">Newest</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="nameAsc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Products grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl shadow-md">
            <Package className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Try modifying your search criteria or add a new product.</p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Product
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProductCreated={handleProductCreated}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={currentProduct}
        onProductUpdated={handleProductUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />
    </div>
  )
}