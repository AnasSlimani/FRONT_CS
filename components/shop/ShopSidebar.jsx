"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShirtIcon as Tshirt,
  Shirt,
  CircleDot,
  Ruler,
  ChevronDown,
  ChevronUp,
  Palette,
  ShoppingBag,
  Tag,
  GraduationCapIcon as Cap,
  ScissorsIcon as Scarf,
} from "lucide-react"

const ShopSidebar = ({ filters, onFilterChange ,handleApply }) => {
  // Available categories with their icons
  const categories = [
    { id: "polos", label: "Polos", icon: <Shirt className="w-5 h-5" />, filters: ["colors", "size"] },
    { id: "hoodies", label: "Hoodies", icon: <Tshirt className="w-5 h-5" />, filters: ["colors", "size"] },
    { id: "echarpes", label: "Écharpes", icon: <Scarf className="w-5 h-5" />, filters: ["colors"] },
    { id: "balls", label: "Balls", icon: <CircleDot className="w-5 h-5" />, filters: ["colors"] },
    { id: "caps", label: "Caps", icon: <Cap className="w-5 h-5" />, filters: ["colors", "size"] },
  ]

  // Available colors
  const colors = [
    { id: "black", label: "Black", hex: "#000000" },
    { id: "teal", label: "Teal", hex: "#008080" },
    { id: "white", label: "White", hex: "#ffffff" },
  ]

  // Available sizes
  const sizes = [
    { id: "s", label: "S" },
    { id: "m", label: "M" },
    { id: "l", label: "L" },
    { id: "xl", label: "XL" },
    { id: "xxl", label: "XXL" },
  ]

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    colors: true,
    size: true,
  })

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Determine which filters to show based on selected categories
  const shouldShowFilter = (filterType) => {
    if (filters.categories.length === 0) return true

    const requiredFilters = new Set()
    filters.categories.forEach((catId) => {
      const category = categories.find((c) => c.id === catId)
      if (category) {
        category.filters.forEach((filter) => requiredFilters.add(filter))
      }
    })

    return requiredFilters.has(filterType)
  }

  return (
    <div className="w-80 bg-gradient-to-b from-gray-900 to-black text-white shadow-xl h-full">
      <div className="p-6 h-full overflow-y-auto">
        {/* Shop Filters Header */}
        <div className="mb-8 flex items-center space-x-3">
          <ShoppingBag className="w-6 h-6 text-teal-400" />
          <h1 className="text-2xl font-bold">Shop Filters</h1>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <motion.button
            className="w-full flex justify-between items-center py-3 px-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            onClick={() => toggleSection("categories")}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <Tag className="w-5 h-5 text-teal-400" />
              <span className="font-semibold">Categories</span>
            </div>
            {expandedSections.categories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </motion.button>

          <AnimatePresence>
            {expandedSections.categories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 pl-4 space-y-3">
                  {categories.map((category) => (
                    <motion.label
                      key={category.id}
                      className="flex items-center space-x-3 cursor-pointer group"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={filters.categories.includes(category.id)}
                          onChange={() => onFilterChange("categories", category.id)}
                        />
                        <div className="w-5 h-5 border-2 border-gray-400 rounded-md peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-all duration-200"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
                          {category.icon}
                        </span>
                        <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
                          {category.label}
                        </span>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Colors Filter */}
        {shouldShowFilter("colors") && (
          <div className="mb-8">
            <motion.button
              className="w-full flex justify-between items-center py-3 px-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              onClick={() => toggleSection("colors")}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-teal-400" />
                <span className="font-semibold">Colors</span>
              </div>
              {expandedSections.colors ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </motion.button>

            <AnimatePresence>
              {expandedSections.colors && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pl-4 space-y-3">
                    {colors.map((color) => (
                      <motion.label
                        key={color.id}
                        className="flex items-center space-x-3 cursor-pointer group"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={filters.colors.includes(color.id)}
                            onChange={() => onFilterChange("colors", color.id)}
                          />
                          <div className="w-5 h-5 border-2 border-gray-400 rounded-md peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-all duration-200"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className="w-5 h-5 rounded-full border border-gray-500"
                            style={{
                              backgroundColor: color.hex,
                              boxShadow: color.id === "white" ? "inset 0 0 0 1px rgba(0,0,0,0.1)" : "none",
                            }}
                          ></span>
                          <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
                            {color.label}
                          </span>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Size Filter */}
        {shouldShowFilter("size") && (
          <div className="mb-8">
            <motion.button
              className="w-full flex justify-between items-center py-3 px-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              onClick={() => toggleSection("size")}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <Ruler className="w-5 h-5 text-teal-400" />
                <span className="font-semibold">Size</span>
              </div>
              {expandedSections.size ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </motion.button>

            <AnimatePresence>
              {expandedSections.size && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pl-4">
                    <div className="grid grid-cols-3 gap-3">
                      {sizes.map((size) => (
                        <motion.div key={size.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <input
                            type="checkbox"
                            id={`size-${size.id}`}
                            className="peer sr-only"
                            checked={filters.sizes.includes(size.id)}
                            onChange={() => onFilterChange("sizes", size.id)}
                          />
                          <label
                            htmlFor={`size-${size.id}`}
                            className="flex items-center justify-center h-10 rounded-lg bg-gray-800 cursor-pointer border-2 border-transparent peer-checked:border-teal-500 peer-checked:text-teal-500 hover:bg-gray-700 transition-all duration-200"
                          >
                            {size.label}
                          </label>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Apply Filters Button */}
        <motion.button
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Apply Filters
        </motion.button>
      </div>
    </div>
  )
}

export default ShopSidebar

