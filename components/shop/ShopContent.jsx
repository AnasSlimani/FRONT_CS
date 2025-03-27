"use client"

import { motion } from "framer-motion"
import ProductCard from "./ProductCard"

const ShopContent = () => {
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

          {/* Product grid with proper spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-15">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ShopContent

