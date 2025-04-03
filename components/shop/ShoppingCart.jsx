"use client"

import { useState, useEffect, useRef, useContext, createContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCartIcon as CartIcon, Check, X, CreditCard, Calendar, Shield } from "lucide-react"
import Image from "next/image"

// Create a context for the shopping cart
export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  // State for cart items
  const [cartItems, setCartItems] = useState([
  ])

  // Add item to cart
  const addToCart = (product) => {
    // Check if product already exists in cart
    const existingItem = cartItems.find(
      (item) => item.id === product.id || (item.name === product.productName && item.price === product.productPrice),
    )

    if (existingItem) {
      // Product already in cart, you could increment quantity here if needed
      return
    }

    // Add new product to cart
    const newItem = {
      id: product.id || Date.now(), // Use product ID or generate one
      name: product.productName || product.name,
      price: Number.parseFloat(product.productPrice) || product.price,
      image: product.productImage ? `/images/productImages/${product.productImage}` : product.image,
      selected: true,
    }

    setCartItems((prev) => [...prev, newItem])
  }

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Toggle item selection
  const toggleItemSelection = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)),
    )
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, toggleItemSelection }}>
      {children}
    </CartContext.Provider>
  )
}

const ShoppingCart = () => {
  // Use cart context
  const { cartItems, removeFromCart, toggleItemSelection } = useContext(CartContext)

  // State for dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // State for payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  // Ref for dropdown
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  // Calculate total price of selected items
  const totalPrice = cartItems.filter((item) => item.selected).reduce((total, item) => total + item.price, 0)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle payment
  const handlePayment = () => {
    setIsDropdownOpen(false)
    setIsPaymentModalOpen(true)
  }

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  }

  // Payment method logos
  const paymentMethods = [
    { name: "Visa", logo: "/images/payment/visa.jpg" },
    { name: "Mastercard", logo: "/images/payment/mastercard.jpg" },
    { name: "American Express", logo: "/images/payment/paypal.png" },
  ]

  return (
    <div className="relative z-50">
      {/* Cart Icon with Badge */}
      <button
        ref={buttonRef}
        className="relative p-2 text-white bg-teal-600 rounded-full hover:bg-teal-700 transition-colors"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="Shopping Cart"
      >
        <CartIcon className="w-6 h-6" />

        {/* Item Count Badge */}
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {cartItems.length}
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
              <h3 className="font-bold text-lg">Your Cart</h3>
              <p className="text-sm text-teal-100">{cartItems.length} items</p>
            </div>

            {/* Cart Items */}
            <div className="max-h-80 overflow-y-auto">
              {cartItems.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        {/* Selection Circle */}
                        <button
                          className="relative w-5 h-5 rounded-full border-2 border-teal-500 flex-shrink-0"
                          onClick={() => toggleItemSelection(item.id)}
                        >
                          {item.selected && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-3 h-3 text-teal-500" />
                            </span>
                          )}
                        </button>

                        {/* Product Image */}
                        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg?height=100&width=100"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.price}€</p>
                        </div>

                        {/* Remove Button */}
                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">Your cart is empty</div>
              )}
            </div>

            {/* Footer with Total and Pay Button */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-700">Total:</span>
                <span className="text-lg font-bold text-teal-600">{totalPrice.toFixed(2)}€</span>
              </div>

              <button
                className={`w-full font-medium py-2 px-4 rounded-lg transition-colors ${
                  totalPrice === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 text-white"
                }`}
                onClick={handlePayment}
                disabled={totalPrice === 0}
              >
                Pay {totalPrice.toFixed(2)}€
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative p-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
                <button
                  className="absolute top-4 right-4 text-white hover:text-teal-200 transition-colors"
                  onClick={() => setIsPaymentModalOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold">Complete Your Purchase</h3>
                <p className="text-teal-100">Total: {totalPrice.toFixed(2)}€</p>
              </div>

              {/* Payment Form */}
              <div className="p-6">
                <form>
                  {/* Card Information */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-teal-600" />
                      Payment Information
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                          <CreditCard className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="expiryDate"
                              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                            <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="cvv"
                              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                              placeholder="123"
                              maxLength="3"
                            />
                            <Shield className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 flex items-start">
                    <Shield className="w-5 h-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      Your payment information is secure. We use industry-standard encryption to protect your data.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Pay {totalPrice.toFixed(2)}€
                  </button>

                  {/* Payment Method Logos */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-3 text-center">We accept</p>
                    <div className="flex justify-center space-x-4">
                      {paymentMethods.map((method) => (
                        <div key={method.name} className="h-8 relative w-12">
                          <Image
                            src={method.logo || `/placeholder.svg?height=32&width=48`}
                            alt={method.name}
                            width={48}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShoppingCart

