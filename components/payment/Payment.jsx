"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  CreditCard,
  Calendar,
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Users,
  Clock,
  Zap,
  MapPin,
} from "lucide-react"

const Payment = () => {
  // State for form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    address: "",
    city: "",
    postalCode: "",
  })

  // State for active FAQ
  const [activeFaq, setActiveFaq] = useState(null)

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setFormData({ ...formData, [name]: formattedValue })
      return
    }

    // Format expiry date with slash
    if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\//g, "")
        .replace(/(\d{2})(\d{2})/, "$1/$2")
        .slice(0, 5)

      setFormData({ ...formData, [name]: formattedValue })
      return
    }

    setFormData({ ...formData, [name]: value })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    // Process payment (would connect to payment gateway in production)
    console.log("Processing payment:", formData)
    // Redirect to success page or show success message
  }

  // Toggle FAQ
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  // FAQ data
  const faqs = [
    {
      question: "What does the membership include?",
      answer:
        "Your annual membership includes access to all club facilities, participation in regular training sessions, discounts on club merchandise, and priority registration for tournaments and special events.",
    },
    {
      question: "Can I cancel my membership?",
      answer:
        "Yes, you can cancel your membership at any time. However, membership fees are non-refundable once processed. Please contact our administration office for any cancellation requests.",
    },
    {
      question: "Are there different membership types?",
      answer:
        "We offer several membership types including individual, family, student, and senior memberships. Each type has different benefits and pricing. This payment page is for standard individual membership.",
    },
    {
      question: "How can I get a receipt for my payment?",
      answer:
        "A receipt will be automatically sent to your email address after your payment is processed. You can also access your payment history and download receipts from your member profile once logged in.",
    },
  ]

  // Benefits data
  const benefits = [
    {
      icon: <Users className="w-6 h-6 text-teal-500" />,
      title: "Community Access",
      description: "Join our vibrant community of sports enthusiasts and make lasting connections.",
    },
    {
      icon: <Award className="w-6 h-6 text-teal-500" />,
      title: "Professional Training",
      description: "Get access to training sessions led by certified coaches and professionals.",
    },
    {
      icon: <Clock className="w-6 h-6 text-teal-500" />,
      title: "Extended Hours",
      description: "Enjoy extended access hours to all facilities and equipment.",
    },
    {
      icon: <Zap className="w-6 h-6 text-teal-500" />,
      title: "Special Events",
      description: "Priority access and discounts for tournaments and special club events.",
    },
  ]

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
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 to-teal-500 text-white py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 right-0 top-0 bg-black opacity-10 h-full"></div>
          {/* Abstract pattern overlay */}
          <svg
            className="absolute left-0 right-0 top-0 h-full w-full opacity-10"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Join Our Club Sportif Family
            </motion.h1>
            <motion.p
              className="text-xl opacity-90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Complete your membership registration and unlock a year of sports, community, and unforgettable
              experiences.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column - Information */}
            <motion.div className="lg:w-1/2" variants={containerVariants} initial="hidden" animate="visible">
              {/* Membership Details */}
              <motion.div className="bg-white rounded-2xl shadow-lg p-8 mb-8" variants={itemVariants}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Annual Membership</h2>
                </div>

                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-gray-900">€120</span>
                  <span className="text-gray-500 ml-2">/year</span>
                </div>

                <p className="text-gray-600 mb-6">
                  Your membership gives you full access to our facilities, training sessions, and exclusive events for a
                  full year from the date of registration.
                </p>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Membership Benefits</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <div className="mt-1 mr-3">{benefit.icon}</div>
                        <div>
                          <h4 className="font-medium text-gray-800">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* FAQs */}
              <motion.div className="bg-white rounded-2xl shadow-lg p-8" variants={itemVariants}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        className="flex justify-between items-center w-full p-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                        onClick={() => toggleFaq(index)}
                      >
                        <span>{faq.question}</span>
                        {activeFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>

                      {activeFaq === index && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Payment Form */}
            <motion.div className="lg:w-1/2" variants={containerVariants} initial="hidden" animate="visible">
              <motion.div className="bg-white rounded-2xl shadow-lg p-8" variants={itemVariants}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Registration</h2>

                <form onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-teal-600" />
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                            placeholder="John Doe"
                            required
                          />
                          <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                            placeholder="john@example.com"
                            required
                          />
                          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                            placeholder="+33 6 12 34 56 78"
                            required
                          />
                          <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-teal-600" />
                      Payment Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            required
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
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleChange}
                              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                              placeholder="MM/YY"
                              maxLength="5"
                              required
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
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleChange}
                              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                              placeholder="123"
                              maxLength="3"
                              required
                            />
                            <Shield className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-teal-600" />
                      Billing Address
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                          placeholder="123 Main St"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                            placeholder="Paris"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                            placeholder="75001"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 flex items-start">
                    <Shield className="w-5 h-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      Your payment information is secure. We use industry-standard encryption to protect your data and
                      never store your complete card details on our servers.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Complete Payment - €120.00
                  </button>

                  {/* Terms and Conditions */}
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By completing this payment, you agree to our{" "}
                    <a href="#" className="text-teal-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-teal-600 hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-teal-600 mr-2" />
                <span className="text-gray-700 font-medium">Secure Payment</span>
              </div>

              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-teal-600 mr-2" />
                <span className="text-gray-700 font-medium">Instant Confirmation</span>
              </div>

              <div className="flex items-center">
                <Users className="w-6 h-6 text-teal-600 mr-2" />
                <span className="text-gray-700 font-medium">500+ Active Members</span>
              </div>

              <div className="flex items-center">
                <Award className="w-6 h-6 text-teal-600 mr-2" />
                <span className="text-gray-700 font-medium">Certified Coaches</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment

