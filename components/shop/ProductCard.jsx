"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ShoppingCart } from "lucide-react"
import { useState, useContext } from "react"
import { CartContext } from "./ShoppingCart"

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useContext(CartContext)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      if (localStorage.getItem("token") == null) {
        alert("Please login to buy this product")
        window.location.href = "/login"
      } else {
        // Add to cart using context
        addToCart(product)
        // Show success message
        const toast = document.createElement("div")
        toast.className = "fixed bottom-4 right-4 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        toast.textContent = `${product.productName} added to cart!`
        document.body.appendChild(toast)

        // Remove toast after 3 seconds
        setTimeout(() => {
          toast.remove()
        }, 3000)
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-48 w-full">
        <Image
          src={`/images/productImages/${product.productImage}`}
          alt={product.productName || "Product"}
          fill
          className="object-cover"
        />

        {/* Quick Add to Cart Button (appears on hover) */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              className="absolute bottom-4 right-4 bg-teal-600 text-white p-2 rounded-full shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">{product.size}</div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-blue-950">{product.productName}</h3>
          <ArrowUpRight className="h-4 w-4 text-gray-500" />
        </div>

        <div className="flex items-center justify-between mb-1">
          <div className="text-xl font-bold text-blue-950">{product.productPrice}€</div>
          <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full">Lowest price</span>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          (Only <span className="font-semibold">{product.productQuantity}</span> left in stock!)
        </div>

        <button
          className="w-full bg-black hover:bg-teal-700 text-white py-2 rounded-lg transition-colors duration-200"
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
      </div>
    </motion.div>
  )
}

export default ProductCard

