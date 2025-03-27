"use client"

import { motion } from "framer-motion"
import ProductCard from "./ProductCard"

const ShopContent = () => {
  return (
    <div className="flex-1 bg-gray-100 overflow-y-auto">
      <div className="py-8 lg:p-0 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl lg:pt-10 md:text-5xl lg:text-5xl font-bold mb-15 text-center font-[family-name:var(--font-oswald)] tracking-wide text-black">
            WELCOME TO THE SHOP MARKET
          </h1>
          
          {/* Product grid with proper spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15">
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