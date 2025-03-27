"use client"

import { useState } from "react"
import ShopSidebar from "./ShopSidebar"
import ShopContent from "./ShopContent"
import { Montserrat, Oswald } from 'next/font/google'

// Load fonts
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
})

const Shop = () => {
  // State for filters
  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    sizes: []
  })

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType]
      
      // If value is already selected, remove it, otherwise add it
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
        
      return {
        ...prev,
        [filterType]: newValues
      }
    })
  }

  return (
    <div className={`pt-5 flex h-[calc(100vh-4rem)] ${montserrat.variable} ${oswald.variable}`}>
      <ShopSidebar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      <ShopContent />
    </div>
  )
}

export default Shop