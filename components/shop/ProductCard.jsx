"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight } from 'lucide-react'

const ProductCard = ({product}) => {

  const handleBuy = async(e) => {
    e.preventDefault();
    try {
      if (localStorage.getItem("token") == null) {
        alert("Please login to buy this product");
        window.location.href = '/login';
      }else {
        alert("You are log in ");
      }
    } catch (error) {
      
    }
  }
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Product Image */}
      <div className="relative h-48 w-full">
        <Image
          src={`/images/productImages/${product.productImage}` }
          alt="Product"
          fill
          className="object-cover"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">{product.size}</div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-blue-950">{product.productName}</h3>
          <ArrowUpRight className="h-4 w-4 text-gray-500" />
        </div>
        
        <div className="flex items-center justify-between mb-1">
          <div className="text-xl font-bold text-blue-950">{product.productPrice}</div>
          <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full">Lowest price</span>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">(Only <span className="font-semibold">{product.productQuantity}</span> left in stock!)</div>
        
        <button className="w-full bg-black hover:bg-teal-700 text-white py-2 rounded-lg transition-colors duration-200"
        onClick={handleBuy}>
          Add to cart
        </button>
      </div>
    </motion.div>
  )
}

export default ProductCard