"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { jwtDecode } from "jwt-decode"
import api from "@/app/api/axios"
import { useRouter } from "next/navigation"
import { useMessageModal } from "@/components/ui/message-modal-provider"
import {
  CreditCard,
  Calendar,
  Lock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Shield,
  Sparkles,
  Clock,
  CreditCardIcon,
  BadgeCheck,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"

const PaymentForm = () => {
  const router = useRouter()
  const { showModal } = useMessageModal()

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  })

  // User state
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [trialStatus, setTrialStatus] = useState(null)
  const [activeSection, setActiveSection] = useState("personal") // 'personal' or 'payment'
  const [cardFlipped, setCardFlipped] = useState(false)

  // Get user info from token
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUserId(decoded.id)

        // Fetch user data
        const fetchUserData = async () => {
          try {
            const response = await api.get(`/users/${decoded.id}`)
            const userData = response.data

            // Pre-fill form with user data
            setFormData((prev) => ({
              ...prev,
              fullName: userData.username || "",
              email: userData.email || "",
              phoneNumber: userData.phoneNumber || "",
              address: userData.address || "",
              cardHolder: userData.username || "",
            }))

            // Check trial status
            const trialResponse = await api.get(`/users/trial-status/${decoded.id}`)
            setTrialStatus(trialResponse.data)

            // If user has already contributed, redirect to dashboard
            if (trialResponse.data.isContributed) {
              showModal({
                message: "Vous avez déjà payé votre adhésion",
                redirectUrl: "/dashboard/profile",
                type: "success",
              })
            }
          } catch (error) {
            console.error("Error fetching user data:", error)
          }
        }

        fetchUserData()
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    } else {
      // Redirect to login if no token
      router.push("/")
    }
  }, [router])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }))
      return
    }

    // Format expiry date with slash
    if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\//g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .slice(0, 5)

      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }))
      return
    }

    // Limit CVV to 3 or 4 digits
    if (name === "cvv") {
      const formattedValue = value.slice(0, 4).replace(/[^\d]/g, "")
      setCardFlipped(true)
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }))
      return
    }

    if (name === "cardNumber" || name === "expiryDate" || name === "cardHolder") {
      setCardFlipped(false)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate form
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phoneNumber ||
        !formData.cardNumber ||
        !formData.expiryDate ||
        !formData.cvv ||
        !formData.cardHolder
      ) {
        throw new Error("Please fill in all required fields")
      }

      // In a real app, you would process payment here
      // For this demo, we'll just update the user's contributed status

      // Update user's contributed status
      await api.patch(`/users/contribute/${userId}`)

      // Show success message
      setSuccess(true)

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard/profile")
      }, 3000)
    } catch (error) {
      console.error("Payment error:", error)
      setError(error.message || "Failed to process payment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  const cardVariants = {
    front: { rotateY: 0, transition: { duration: 0.6 } },
    back: { rotateY: 180, transition: { duration: 0.6 } },
  }

  // Function to get card type based on number
  const getCardType = () => {
    const number = formData.cardNumber.replace(/\s/g, "")
    let re = /^4/
    if (number.match(re)) return "visa"
    re = /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/
    if (number.match(re)) return "mastercard"
    re = /^3[47]/
    if (number.match(re)) return "amex"
    re = /^6(?:011|5)/
    if (number.match(re)) return "discover"
    return "generic"
  }

  // Get card logo based on type
  const getCardLogo = () => {
    const type = getCardType()
    switch (type) {
      case "visa":
        return "/images/adherationPayment/visa.svg"
      case "mastercard":
        return "/images/adherationPayment/mastercard.svg"
      case "amex":
        return "/images/adherationPayment/amex.svg"
      case "discover":
        return "/images/adherationPayment/discover.svg"
      default:
        return "/images/adherationPayment/generic-card.svg"
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-300/20 to-amber-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-tr from-amber-400/10 to-amber-600/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div variants={itemVariants} className="text-center mb-12 relative">
        <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full text-sm font-medium mb-4">
          <Sparkles className="inline-block w-4 h-4 mr-1 text-amber-600" /> Devenez membre officiel
        </span>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-800 mb-4">
          Paiement d'Adhésion
        </h1>
        <p className="mt-4 text-lg text-black dark:text-black max-w-3xl mx-auto">
          Complétez votre paiement pour devenir membre officiel du Club Sportif Jaguars et profitez d'un accès complet à
          toutes nos installations et activités.
        </p>
      </motion.div>

      {/* Trial status banner */}
      <AnimatePresence>
        {trialStatus && trialStatus.status === "trial" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-amber-100 p-2 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-amber-800">Votre période d'essai est active</h3>
                <p className="text-amber-700 mt-1">
                  Il vous reste{" "}
                  <span className="font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
                    {trialStatus.daysRemaining} jours
                  </span>{" "}
                  dans votre période d'essai. Complétez votre paiement d'adhésion pour continuer à accéder à toutes les
                  fonctionnalités après la fin de votre essai.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-emerald-500 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-emerald-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-emerald-800">Paiement réussi !</h3>
                <p className="text-emerald-700 mt-1">
                  Merci pour votre paiement. Vous êtes maintenant membre officiel du Club Sportif Jaguars. Redirection
                  vers votre tableau de bord...
                </p>
                <div className="w-full bg-emerald-200 h-1 mt-4 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-gradient-to-r from-rose-50 to-rose-100 border-l-4 border-rose-500 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-rose-100 p-2 rounded-full">
                <AlertCircle className="h-6 w-6 text-rose-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-rose-800">Échec du paiement</h3>
                <p className="text-rose-700 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Payment form - 3 columns */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Progress steps */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`flex items-center cursor-pointer ${
                    activeSection === "personal" ? "text-amber-600" : "text-gray-400"
                  }`}
                  onClick={() => setActiveSection("personal")}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                      activeSection === "personal" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Informations</span>
                </div>

                <div className="w-16 h-0.5 bg-gray-200 mx-2"></div>

                <div
                  className={`flex items-center cursor-pointer ${
                    activeSection === "payment" ? "text-amber-600" : "text-gray-400"
                  }`}
                  onClick={() => {
                    if (formData.fullName && formData.email && formData.phoneNumber && formData.address) {
                      setActiveSection("payment")
                    }
                  }}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                      activeSection === "payment" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Paiement</span>
                </div>
              </div>
            </div>

            {/* Credit card preview */}
            <div className="px-6">
              <div className="relative h-48 w-full mb-6 perspective-1000">
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  animate={cardFlipped ? "back" : "front"}
                  variants={cardVariants}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front of card */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-xl p-6 backface-hidden"
                    style={{
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-white text-xs uppercase tracking-wider mb-6 opacity-80">
                          Carte de membre
                        </div>
                        <div className="text-white font-mono text-xl tracking-wider mb-6">
                          {formData.cardNumber || "•••• •••• •••• ••••"}
                        </div>
                      </div>
                      {formData.cardNumber && (
                        <div className="w-12 h-12 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Image
                            src={getCardLogo() || "/placeholder.svg"}
                            alt="Card type"
                            width={30}
                            height={20}
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                      <div>
                        <div className="text-white/70 text-xs mb-1">Titulaire</div>
                        <div className="text-white font-medium tracking-wide">{formData.cardHolder || "Votre Nom"}</div>
                      </div>
                      <div>
                        <div className="text-white/70 text-xs mb-1">Expire</div>
                        <div className="text-white font-medium">{formData.expiryDate || "MM/YY"}</div>
                      </div>
                    </div>
                    {/* Card chip */}
                    <div
                      className="absolute top-6 right-6 w-10 h-8 rounded-md"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
                      }}
                    ></div>
                    {/* Card pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full border-8 border-white/20"></div>
                        <div className="absolute top-20 -right-20 w-60 h-60 rounded-full border-8 border-white/20"></div>
                      </div>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-xl p-6 backface-hidden"
                    style={{
                      background: "linear-gradient(135deg, #d97706 0%, #92400e 100%)",
                      transform: "rotateY(180deg)",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <div className="w-full h-10 bg-black/30 mt-4"></div>
                    <div className="mt-6 flex justify-end">
                      <div className="bg-white/80 h-10 w-3/4 rounded flex items-center justify-end pr-4">
                        <div className="font-mono text-gray-800 tracking-wider">{formData.cvv || "•••"}</div>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white/70 text-xs">
                      Cette carte est réservée aux membres du Club Sportif Jaguars
                    </div>
                    {/* Card pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full border-8 border-white/20"></div>
                        <div className="absolute bottom-20 -left-20 w-60 h-60 rounded-full border-8 border-white/20"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <AnimatePresence mode="wait">
                {activeSection === "personal" ? (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-amber-500" />
                        Informations Personnelles
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nom Complet <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                            <div className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none transition-all duration-200 group-focus-within:border-amber-500 opacity-0 group-focus-within:opacity-100"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Adresse Email <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                            <div className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none transition-all duration-200 group-focus-within:border-amber-500 opacity-0 group-focus-within:opacity-100"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Numéro de Téléphone <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                              placeholder="+212 xxxxxxxxx"
                              required
                            />
                            <div className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none transition-all duration-200 group-focus-within:border-amber-500 opacity-0 group-focus-within:opacity-100"></div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Adresse <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                            <div className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none transition-all duration-200 group-focus-within:border-amber-500 opacity-0 group-focus-within:opacity-100"></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="button"
                          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          onClick={() => {
                            if (formData.fullName && formData.email && formData.phoneNumber && formData.address) {
                              setActiveSection("payment")
                            } else {
                              setError("Veuillez remplir tous les champs obligatoires")
                            }
                          }}
                        >
                          Continuer vers le paiement <ChevronRight className="ml-2 h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Payment Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-amber-500" />
                        Informations de Paiement
                      </h3>

                      <div className="space-y-4">
                        <div className="group">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Numéro de Carte <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                            <div className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none transition-all duration-200 group-focus-within:border-amber-500 opacity-0 group-focus-within:opacity-100"></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Date d'Expiration <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                                placeholder="MM/YY"
                                required
                              />
                              <div className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none transition-all duration-200 group-focus-within:border-amber-500 opacity-0 group-focus-within:opacity-100"></div>
                            </div>
                          </div>

                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              CVV <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleChange}
                                onFocus={() => setCardFlipped(true)}
                                onBlur={() => setCardFlipped(false)}
                                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                                placeholder="123"
                                required
                              />
                              <div className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none transition-all duration-200 group-focus-within:border-amber-500 opacity-0 group-focus-within:opacity-100"></div>
                            </div>
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nom du Titulaire <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cardHolder"
                            value={formData.cardHolder}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                            required
                          />
                          <div className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none transition-all duration-200 group-focus-within:border-amber-500 opacity-0 group-focus-within:opacity-100"></div>
                        </div>
                      </div>

                      {/* Secure payment notice */}
                      <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg mt-6">
                        <div className="bg-white p-2 rounded-full mr-3">
                          <Lock className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Vos informations de paiement sont sécurisées. Nous utilisons le chiffrement pour protéger vos
                          données.
                        </p>
                      </div>

                      <div className="mt-6 flex space-x-4">
                        <button
                          type="button"
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                          onClick={() => setActiveSection("personal")}
                        >
                          Retour
                        </button>

                        <button
                          type="submit"
                          className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Traitement en cours...
                            </>
                          ) : (
                            <>
                              Finaliser le Paiement <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>

        {/* Membership benefits - 2 columns */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-24">
            <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <h2 className="text-xl font-bold flex items-center">
                <BadgeCheck className="w-5 h-5 mr-2 text-amber-400" />
                Avantages de l'Adhésion
              </h2>
              <p className="text-gray-300 mt-1">Ce que vous obtenez avec votre adhésion annuelle</p>
            </div>

            <div className="p-6">
              <div className="relative h-48 w-full mb-6 rounded-xl overflow-hidden group">
                <Image
                  src="/images/adherationPayment/logo.png"
                  alt="Club facilities"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-lg font-bold">Club Sportif Jaguars</h3>
                  <p className="text-sm text-gray-200">Des installations modernes pour tous les sports</p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <CreditCardIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-amber-800">Cotisation Annuelle</h3>
                    <p className="text-amber-700 text-2xl font-bold">€120.00</p>
                  </div>
                </div>
              </div>

              <ul className="space-y-4">
                {[
                  "Accès complet à toutes les installations et équipements du club",
                  "Participation gratuite aux séances d'entraînement hebdomadaires",
                  "Accès exclusif aux événements réservés aux membres",
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="bg-emerald-100 p-1 rounded-full mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                <div className="flex items-center">
                  <div className="bg-amber-200 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-amber-700" />
                  </div>
                  <h3 className="ml-3 text-lg font-bold text-amber-800">Garantie Satisfaction 100%</h3>
                </div>
                <p className="mt-2 text-amber-700 text-sm">
                  Si vous n'êtes pas entièrement satisfait de votre adhésion dans les 30 premiers jours, nous vous
                  rembourserons intégralement. Sans questions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </motion.div>
  )
}

export default PaymentForm

