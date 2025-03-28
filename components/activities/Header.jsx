"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Calendar, Trophy, Users, Sparkles } from "lucide-react"

const Header = () => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Animate elements when they come into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  // Floating animation for elements
  const floatingAnimation = {
    y: ["-5px", "5px"],
    transition: {
      y: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="relative overflow-hidden bg-[#0a0a1a] text-white min-h-[60vh] flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#131342] to-[#0a0a1a] opacity-80"></div>

        {/* Animated grid lines */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2Utb3BhY2l0eT0iLjEiIHN0cm9rZT0iI2ZmZiIvPjxwYXRoIGQ9Ik0zMCAwaDMwdjMwSDMweiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2U9IiNmZmYiLz48cGF0aCBkPSJNMCAzMGgzMHYzMEgweiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2U9IiNmZmYiLz48cGF0aCBkPSJNMCAwaDMwdjMwSDB6IiBzdHJva2Utb3BhY2l0eT0iLjEiIHN0cm9rZT0iI2ZmZiIvPjwvZz48L3N2Zz4=')]"></div>

        {/* Animated particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-teal-500/20 blur-xl"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}

        {/* Animated glowing lines */}
        <div className="absolute inset-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent w-full"
              style={{ top: `${20 * i + 10}%` }}
              animate={{
                opacity: [0.1, 0.5, 0.1],
                scaleX: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 5 + i,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-24">
        <motion.div
          ref={ref}
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-white/20"
            variants={itemVariants}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <Sparkles className="w-4 h-4 mr-2 text-teal-400" />
            <span className="text-sm font-medium">Discover Our Events</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-200 to-white"
            variants={itemVariants}
          >
            Club Activities & Events
          </motion.h1>

          <motion.p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto" variants={itemVariants}>
            Join us for exciting tournaments, friendly matches, and club trips. Be part of our vibrant community and
            create unforgettable memories.
          </motion.p>

          <motion.div className="flex flex-wrap justify-center gap-6 mb-8" variants={itemVariants}>
            {/* Feature cards with hover effects */}
            <motion.div
              className="flex items-center bg-black/30 backdrop-blur-md px-5 py-3 rounded-lg border border-white/10 relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -5 }}
              animate={floatingAnimation}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Trophy className="w-5 h-5 text-yellow-400 mr-3 relative z-10" />
              <div className="text-left relative z-10">
                <div className="text-sm text-white/70">Annual</div>
                <div className="font-semibold">Tournaments</div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center bg-black/30 backdrop-blur-md px-5 py-3 rounded-lg border border-white/10 relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -5 }}
              animate={{
                ...floatingAnimation,
                transition: { ...floatingAnimation.transition, delay: 0.2 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Users className="w-5 h-5 text-blue-400 mr-3 relative z-10" />
              <div className="text-left relative z-10">
                <div className="text-sm text-white/70">Friendly</div>
                <div className="font-semibold">Matches</div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center bg-black/30 backdrop-blur-md px-5 py-3 rounded-lg border border-white/10 relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -5 }}
              animate={{
                ...floatingAnimation,
                transition: { ...floatingAnimation.transition, delay: 0.4 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Calendar className="w-5 h-5 text-teal-400 mr-3 relative z-10" />
              <div className="text-left relative z-10">
                <div className="text-sm text-white/70">Club</div>
                <div className="font-semibold">Trips</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Animated call to action button */}
          <motion.button
            className="mt-6 px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-500 rounded-full text-white font-medium shadow-lg shadow-teal-900/30 relative overflow-hidden group"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Explore All Activities</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-400"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Animated accent at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  )
}

export default Header

