"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Upload, Info, Tag, Package, Palette, Ruler } from "lucide-react"
import api from "@/app/api/axios"

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    productCategory: "",
    productPrice: "",
    productQuantity: "",
    color: "",
    size: "",
    productImage: "",
  })

  // Additional state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [categories, setCategories] = useState([])

  // Initialize form data when product changes
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        productName: product.productName || "",
        productCategory: product.productCategory || "",
        productPrice: product.productPrice?.toString() || "",
        productQuantity: product.productQuantity?.toString() || "",
        color: product.color || "",
        size: product.size || "",
        productImage: product.productImage || "default-product.jpg",
      })

      console.log(formData);

      // Reset other state
      setError("")
      setImageFile(null)

      // Set image preview if available
      if (product.productImage) {
        setImagePreview(`/images/productImages/${product.productImage}`)
      } else {
        setImagePreview(null)
      }

      // Fetch categories and types from the database
      fetchCategories()
    }
  }, [product, isOpen])

  // Fetch categories and types from the database
  const fetchCategories = async () => {
    try {
      // These would be actual API calls in a real application
      const categoriesResponse = await api.get("/products/categories")
      setCategories(categoriesResponse.data)

  
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load categories . Please try again.")
    }
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Set image name in form data
      setFormData((prev) => ({
        ...prev,
        productImage: file.name,
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.productName || !formData.productCategory || !formData.productPrice) {
        throw new Error("Please fill in all required fields")
      }

      // Prepare data for API
      const productData = {
        id: product.id, // Keep the original ID
        productName: formData.productName,
        productCategory: formData.productCategory,
        productPrice: Number(formData.productPrice),
        productQuantity: Number(formData.productQuantity) || 0,
        color: formData.color,
        productImage: formData.productImage,
      }

      // Only add size if the product is not a ball
      if (formData.productCategory !== "ball") {
        productData.size = formData.size
      }

      // Send request to update product
      const response = await api.put(`/products`, productData)

      // Handle image upload if needed (in a real app, you'd upload to a server)
      if (imageFile) {
        console.log("Would upload image:", imageFile)
        // const formData = new FormData()
        // formData.append("image", imageFile)
        // await api.post("/upload-image", formData)
      }

      // Notify parent component
      if (onProductUpdated) {
        onProductUpdated(response.data)
      }

      // Close modal
      onClose()
    } catch (error) {
      console.error("Error updating product:", error)
      setError(error.message || "Failed to update product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Determine if size field should be shown based on product category
  const showSizeField = formData.productCategory !== "ball"

  if (!isOpen || !product) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-xl">
          <h2 className="text-xl font-bold">Edit Product</h2>
          <button className="text-white hover:text-gray-200 transition-colors" onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center">
            <Info className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter product name"
                    required
                  />
                </div>
              </div>

              {/* Product Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category.id} value={category}>
                          {category}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="shirt">Shirt</option>
                        <option value="pants">Pants</option>
                        <option value="shoes">Shoes</option>
                        <option value="ball">Ball</option>
                        <option value="accessory">Accessory</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Product Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    name="productPrice"
                    value={formData.productPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Product Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="productQuantity"
                  value={formData.productQuantity}
                  onChange={handleChange}
                  min="0"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="0"
                  required
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Palette className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., Red, Blue, Black"
                    required
                  />
                </div>
              </div>

              {/* Size (conditional) */}
              {showSizeField && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Ruler className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required={showSizeField}
                    >
                      <option value="">Select a size</option>
                      <option value="xs">XS</option>
                      <option value="s">S</option>
                      <option value="m">M</option>
                      <option value="l">L</option>
                      <option value="xl">XL</option>
                      <option value="xxl">XXL</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Image upload */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-amber-500 transition-colors">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="mb-3">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="mx-auto h-32 w-auto object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}

                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload-edit"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload-edit"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-colors shadow-md flex items-center justify-center min-w-[120px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default EditProductModal
