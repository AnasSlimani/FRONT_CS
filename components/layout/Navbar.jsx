"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  Menu,
  X,
  ChevronDown,
  User,
  Home,
  Info,
  Calendar,
  ShoppingBag,
  Trophy,
  Users,
  Phone,
  LogOut,
} from "lucide-react"
import api from "@/app/api/axios"
import LoginModal from "@/components/login/LoginModal"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClubDropdownOpen, setIsClubDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [token, setToken] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

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

  // Check for token on client-side
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleClubDropdown = () => {
    setIsClubDropdownOpen(!isClubDropdownOpen)
  }

  const openLoginModal = (e) => {
    e.preventDefault()
    setIsLoginModalOpen(true)
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const logout = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("/users/logout")
      if (response.status === 200) {
        localStorage.removeItem("token")
        setToken(null)
        window.location.href = "/"
      }
    } catch (error) {
      console.log(error.response?.data)

      if (error.response?.data === "Token expired - please login again") {
        alert(error.response.data)
        localStorage.removeItem("token")
        setToken(null)
        window.location.href = "/"
      }
    }
  }

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center relative z-10 group">
              <div className="overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Club Sportif Logo"
                  width={60}
                  height={45}
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
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center justify-center flex-1 mx-4">
              <div className="flex items-center space-x-1 lg:space-x-6">
                <Link
                  href="/"
                  className="text-black font-semibold text-sm lg:text-base hover:text-teal-500 transition-colors duration-200 flex items-center group relative px-2 py-2"
                >
                  <Home size={16} className="mr-1.5 group-hover:text-teal-500 transition-colors duration-200" />
                  <span>HOME</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <div className="relative group px-2 py-2">
                  <button
                    className="text-black font-semibold text-sm lg:text-base hover:text-teal-500 flex items-center transition-colors duration-200 group"
                    onClick={toggleClubDropdown}
                    aria-expanded={isClubDropdownOpen}
                    aria-haspopup="true"
                  >
                    <Info size={16} className="mr-1.5 group-hover:text-teal-500 transition-colors duration-200" />
                    <span>CLUB</span>
                    <ChevronDown
                      size={14}
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
                        href="#about"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                      >
                        <Info size={16} className="mr-2 text-teal-600" />
                        <span>About Us</span>
                      </Link>
                      <Link
                        href="#actualities"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                      >
                        <Calendar size={16} className="mr-2 text-teal-600" />
                        <span>Actualités</span>
                      </Link>
                      <Link
                        href="#team"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                      >
                        <Users size={16} className="mr-2 text-teal-600" />
                        <span>Team</span>
                      </Link>
                      <Link
                        href="#joinus"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                      >
                        <Trophy size={16} className="mr-2 text-teal-600" />
                        <span>Join Us</span>
                      </Link>
                      <Link
                        href="#contact"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                      >
                        <User size={16} className="mr-2 text-teal-600" />
                        <span>Contact</span>
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  href="/activities"
                  className="text-black font-semibold text-sm lg:text-base hover:text-teal-500 transition-colors duration-200 flex items-center group relative px-2 py-2"
                >
                  <Trophy size={16} className="mr-1.5 group-hover:text-teal-500 transition-colors duration-200" />
                  <span>ACTIVITES</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  href="/shop"
                  className="text-black font-semibold text-sm lg:text-base hover:text-teal-500 transition-colors duration-200 flex items-center group relative px-2 py-2"
                >
                  <ShoppingBag size={16} className="mr-1.5 group-hover:text-teal-500 transition-colors duration-200" />
                  <span>SHOP</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  href="#contact"
                  className="text-black font-semibold text-sm lg:text-base hover:text-teal-500 transition-colors duration-200 flex items-center group relative px-2 py-2"
                >
                  <Phone size={16} className="mr-1.5 group-hover:text-teal-500 transition-colors duration-200" />
                  <span>CONTACT</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {token ? (
                <>
                  <button
                    onClick={logout}
                    className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-1.5 px-3 md:py-1.5 md:px-3 lg:py-2 lg:px-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs md:text-xs lg:text-sm"
                  >
                    <span>Log Out</span>
                    <LogOut size={14} className="ml-1.5" />
                  </button>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-1.5 px-3 md:py-1.5 md:px-3 lg:py-2 lg:px-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs md:text-xs lg:text-sm"
                  >
                    <span>My profile</span>
                    <User size={14} className="ml-1.5" />
                  </Link>
                </>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-1.5 px-3 md:py-1.5 md:px-3 lg:py-2 lg:px-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs md:text-xs lg:text-sm"
                >
                  <span>LOGIN</span>
                  <User size={14} className="ml-1.5" />
                </button>
              )}
            </div>
          </div>
        </div>

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
              <span>HOME</span>
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

            {/* Mobile auth buttons - conditionally rendered based on token */}
            {token ? (
              <>
                <button
                  onClick={(e) => {
                    logout(e)
                    setIsMenuOpen(false)
                  }}
                  className="w-full max-w-xs bg-white text-teal-700 hover:bg-teal-50 font-bold py-3 px-6 rounded-full text-center mt-4 flex items-center justify-center text-xl transition-colors duration-200"
                >
                  <span>LOG OUT</span>
                  <LogOut size={20} className="ml-2" />
                </button>
                <Link
                  href="/dashboard/profile"
                  className="w-full max-w-xs bg-teal-600 text-white hover:bg-teal-700 font-bold py-3 px-6 rounded-full text-center mt-2 flex items-center justify-center text-xl transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>MY PROFILE</span>
                  <User size={20} className="ml-2" />
                </Link>
              </>
            ) : (
              <button
                onClick={(e) => {
                  openLoginModal(e)
                  setIsMenuOpen(false)
                }}
                className="w-full max-w-xs bg-white text-teal-700 hover:bg-teal-50 font-bold py-3 px-6 rounded-full text-center mt-4 flex items-center justify-center text-xl transition-colors duration-200"
              >
                <span>LOGIN</span>
                <User size={20} className="ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Colored bar under navbar */}
        <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-teal-600 to-teal-400"></div>
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  )
}

