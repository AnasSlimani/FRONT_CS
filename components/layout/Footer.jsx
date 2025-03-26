"use client"
import Link from "next/link"
import { Facebook, Instagram, Github, Youtube } from "lucide-react"
import { motion } from "framer-motion"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "https://facebook.com", label: "Facebook" },
    { icon: <Instagram size={20} />, href: "https://instagram.com", label: "Instagram" },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      ),
      href: "https://x.com",
      label: "X",
    },
    { icon: <Github size={20} />, href: "https://github.com", label: "GitHub" },
    { icon: <Youtube size={20} />, href: "https://youtube.com", label: "YouTube" },
  ]

  return (
    <footer className="relative bg-black text-white py-8 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-gray-400 mb-4 md:mb-0"
          >
            © {currentYear} Club Sportif. All rights reserved.
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex space-x-6"
          >
            {socialLinks.map((link, index) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label={link.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

