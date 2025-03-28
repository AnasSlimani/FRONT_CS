"use client"

import { motion } from "framer-motion"
import ProductCard from "./ProductCard"
import { useEffect, useState } from "react"
import api from "@/app/api/axios"

const ShopContent = ({ filteredProducts, setFilteredProducts }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      if (filteredProducts && filteredProducts.length > 0) {
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        const response = await api.get("/products", { public: true })
        setFilteredProducts(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="flex-1 bg-gray-100 overflow-y-auto">
      <div className="px-8 pt-5 py-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Enhanced title with modern design */}
          <div className="relative mb-12 mt-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <motion.div
                className="px-8 py-3 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 rounded-lg shadow-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold text-center font-[family-name:var(--font-oswald)] tracking-wide text-white">
                  WELCOME TO THE SHOP MARKET
                </h1>
              </motion.div>
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            /* Product grid with proper spacing */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-15">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* No products found */
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700">No products found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ShopContent