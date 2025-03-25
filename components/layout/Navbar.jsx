"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, User, Home, Info, Calendar, ShoppingBag, Trophy, Users, Phone } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClubDropdownOpen, setIsClubDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleClubDropdown = () => {
    setIsClubDropdownOpen(!isClubDropdownOpen)
  }

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center relative z-10 group">
          <div className="overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="Club Sportif Logo"
              width={80}
              height={60}
              className="h-auto transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-teal-700 hover:text-teal-500 focus:outline-none transition-colors duration-200 relative z-10"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
          <Link
            href="/"
            className="text-teal-700 font-semibold text-sm lg:text-base hover:text-teal-500 transition-colors duration-200 flex items-center group"
          >
            <Home size={18} className="mr-1.5 group-hover:text-teal-500 transition-colors duration-200" />
            <span>ACCUEIL</span>
          </Link>

          <div className="relative group">
            <button
              className="text-teal-700 font-semibold text-sm lg:text-base hover:text-teal-500 flex items-center transition-colors duration-200 group"
              onClick={toggleClubDropdown}
              aria-expanded={isClubDropdownOpen}
              aria-haspopup="true"
            >
              <Info size={18} className="mr-1.5 group-hover:text-teal-500 transition-colors duration-200" />
              <span>CLUB</span>
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform duration-200 ${isClubDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown menu with animation */}
            <div
              className={`absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform origin-top ${
                isClubDropdownOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"
              }`}
            >
              <div>
                <Link
                  href="/about-us"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                >
                  <Info size={16} className="mr-2 text-teal-600" />
                  <span>About Us</span>
                </Link>
                <Link
                  href="/actualites"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                >
                  <Calendar size={16} className="mr-2 text-teal-600" />
                  <span>Actualités</span>
                </Link>
                <Link
                  href="/bureau"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                >
                  <Users size={16} className="mr-2 text-teal-600" />
                  <span>Notre Bureau</span>
                </Link>
                <Link
                  href="/sports"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                >
                  <Trophy size={16} className="mr-2 text-teal-600" />
                  <span>Nos Sports</span>
                </Link>
                <Link
                  href="/join-us"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                >
                  <User size={16} className="mr-2 text-teal-600" />
                  <span>Join Us</span>
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/activities"
            className="text-teal-700 font-semibold text-sm lg:text-base hover:text-teal-500 transition-colors duration-200 flex items-center group relative"
          >
            <Trophy size={18} className="mr-1.5 group-hover:text-teal-500 transition-colors duration-200" />
            <span>ACTIVITES</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            href="/shop"
            className="text-teal-700 font-semibold text-sm lg:text-base hover:text-teal-500 transition-colors duration-200 flex items-center group relative"
          >
            <ShoppingBag size={18} className="mr-1.5 group-hover:text-teal-500 transition-colors duration-200" />
            <span>SHOP</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            href="/contact"
            className="text-teal-700 font-semibold text-sm lg:text-base hover:text-teal-500 transition-colors duration-200 flex items-center group relative"
          >
            <Phone size={18} className="mr-1.5 group-hover:text-teal-500 transition-colors duration-200" />
            <span>CONTACT</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Login Button */}
        <Link
          href="/auth"
          className="hidden md:flex items-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm lg:text-base"
        >
          <span>LOGIN</span>
          <User size={16} className="ml-2" />
        </Link>

        {/* Mobile Navigation - Fullscreen overlay */}
        <div
          className={`fixed inset-0 bg-teal-700/95 backdrop-blur-sm z-50 md:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <div className="flex justify-end p-4">
            <button
              className="text-white hover:text-teal-200 focus:outline-none transition-colors duration-200"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center h-[80vh] space-y-6 p-4">
            <Link href="/" className="mb-6" onClick={() => setIsMenuOpen(false)}>
              <Image src="/images/logo.jpg" alt="Club Sportif Logo" width={100} height={75} className="h-auto" />
            </Link>

            <Link
              href="/"
              className="w-full max-w-xs text-center text-white font-bold text-xl py-2 flex items-center justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={20} className="mr-2" />
              <span>ACCUEIL</span>
            </Link>

            <div className="w-full max-w-xs">
              <button
                className="w-full text-center text-white font-bold text-xl py-2 flex justify-center items-center"
                onClick={toggleClubDropdown}
                aria-expanded={isClubDropdownOpen}
                aria-haspopup="true"
              >
                <Info size={20} className="mr-2" />
                <span>CLUB</span>
                <ChevronDown
                  size={20}
                  className={`ml-2 transition-transform duration-200 ${isClubDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`space-y-3 mt-3 overflow-hidden transition-all duration-300 ${
                  isClubDropdownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <Link
                  href="/about-us"
                  className="block py-2 text-center text-teal-100 hover:text-white text-lg flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Info size={18} className="mr-2" />
                  <span>About Us</span>
                </Link>
                <Link
                  href="/actualites"
                  className="block py-2 text-center text-teal-100 hover:text-white text-lg flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calendar size={18} className="mr-2" />
                  <span>Actualités</span>
                </Link>
                <Link
                  href="/bureau"
                  className="block py-2 text-center text-teal-100 hover:text-white text-lg flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users size={18} className="mr-2" />
                  <span>Notre Bureau</span>
                </Link>
                <Link
                  href="/sports"
                  className="block py-2 text-center text-teal-100 hover:text-white text-lg flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Trophy size={18} className="mr-2" />
                  <span>Nos Sports</span>
                </Link>
                <Link
                  href="/join-us"
                  className="block py-2 text-center text-teal-100 hover:text-white text-lg flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="mr-2" />
                  <span>Join Us</span>
                </Link>
              </div>
            </div>

            <Link
              href="/activities"
              className="w-full max-w-xs text-center text-white font-bold text-xl py-2 flex items-center justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Trophy size={20} className="mr-2" />
              <span>ACTIVITES</span>
            </Link>

            <Link
              href="/shop"
              className="w-full max-w-xs text-center text-white font-bold text-xl py-2 flex items-center justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag size={20} className="mr-2" />
              <span>SHOP</span>
            </Link>

            <Link
              href="/contact"
              className="w-full max-w-xs text-center text-white font-bold text-xl py-2 flex items-center justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone size={20} className="mr-2" />
              <span>CONTACT</span>
            </Link>

            <Link
              href="/auth"
              className="w-full max-w-xs bg-white text-teal-700 hover:bg-teal-50 font-bold py-3 px-6 rounded-full text-center mt-4 flex items-center justify-center text-xl transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>LOGIN</span>
              <User size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Colored bar under navbar */}
      <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-teal-600 to-teal-400"></div>
    </nav>
  )
}

