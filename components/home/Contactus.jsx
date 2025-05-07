"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Phone, Mail, MapPin, CheckCircle, User, MessageSquare, PenTool, AlertCircle } from "lucide-react"
import { Montserrat, Oswald } from "next/font/google"
import { sendEmail } from "@/app/actions/email"

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

const Contactus = () => {
  const formRef = useRef(null)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formState.name.trim()) newErrors.name = "Name is required"
    if (!formState.email.trim()) newErrors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(formState.email)) newErrors.email = "Email is invalid"
    if (!formState.message.trim()) newErrors.message = "Message is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const formData = new FormData(formRef.current)
      const result = await sendEmail(formData)

      if (result.success) {
        setIsSubmitted(true)
        // Reset form after submission
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        })

        // Reset submission status after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      } else {
        setSubmitError(result.message || "Failed to send email. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError("An unexpected error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5 text-teal-600" />,
      title: "Phone",
      details: "+212 70 62 39 01",
    },
    {
      icon: <Mail className="w-5 h-5 text-teal-600" />,
      title: "Email",
      details: "contact@clubsportif.com",
    },
    {
      icon: <MapPin className="w-5 h-5 text-teal-600" />,
      title: "Address",
      details: "ENSA KHOURIBGA",
    },
  ]

  return (
    <div id="contact" className={`relative bg-white min-h-screen w-full ${montserrat.variable} ${oswald.variable}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-white/30 pointer-events-none"></div>
      <div className="container mx-auto px-4 pt-15 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-7xl md:text-6xl lg:text-7xl font-bold mb-4 font-[family-name:var(--font-oswald)] tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500"
          >
            Contact Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl max-w-3xl mx-auto font-[family-name:var(--font-montserrat)] text-gray-600"
          >
            Have questions or want to join our club? Get in touch with us!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-10 h-full flex flex-col relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-teal-100 to-teal-200 rounded-full opacity-50 blur-2xl"></div>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex flex-col items-center justify-center py-10 flex-grow"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center mb-6 shadow-md"
                  >
                    <CheckCircle className="w-10 h-10 text-teal-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 text-center">
                    Thank you for contacting us. We'll get back to you as soon as possible.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-grow flex flex-col"
                >
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500 mb-6">
                    Send us a message
                  </h3>

                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{submitError}</p>
                    </motion.div>
                  )}

                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
                    <div>
                      <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <User className="w-4 h-4 mr-2 text-teal-600" />
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-blue-950`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-500 flex items-center"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Mail className="w-4 h-4 mr-2 text-teal-600" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-blue-950`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-500 flex items-center"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="subject" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <MessageSquare className="w-4 h-4 mr-2 text-teal-600" />
                        Subject (Optional)
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-blue-950"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div className="flex-grow flex flex-col">
                      <label htmlFor="message" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <PenTool className="w-4 h-4 mr-2 text-teal-600" />
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border flex-grow ${
                          errors.message ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none min-h-[120px] text-blue-950`}
                        placeholder="Write your message here..."
                      />
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-500 flex items-center"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.message}
                        </motion.p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-700 to-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg mt-auto ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Information */}
          <div className="flex flex-col gap-8 h-full">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h4>
                  <p className="text-gray-600">{item.details}</p>
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl flex-grow relative"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3371.9668901406166!2d-6.916338824515655!3d32.89718017695049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda69d51a4eccd09%3A0x2fe5964c283fb57a!2s%C3%89cole%20Nationale%20des%20Sciences%20Appliqu%C3%A9es%20de%20Khouribga!5e0!3m2!1sen!2sma!4v1711471462015!5m2!1sen!2sma"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ENSA Khouribga location"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contactus
