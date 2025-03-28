"use client"

import { useState } from "react"
import Header from "./Header"
import Filter from "./Filter"
import Content from "./Content"

const Activites = () => {
  // State for active filter only
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <div className="min-h-screen  bg-white">
      {/* Hero section */}
      <Header />

      {/* Filter component - remove activeSubFilter props */}
      <Filter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      {/* Content section - remove activeSubFilter prop */}
      <Content activeFilter={activeFilter} />
    </div>
  )
}

export default Activites

