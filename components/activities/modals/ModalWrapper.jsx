"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { createPortal } from "react-dom"

const ModalWrapper = ({ isOpen, onClose, children }) => {
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef(null)

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
  }

  // Use portal to render modal at the document body level
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-xl w-full max-w-2xl border border-gray-200 relative"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button in the top right */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100 z-10"
            >
              <X size={20} />
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Use createPortal to render the modal at the document body level
  if (mounted && typeof document !== "undefined") {
    return createPortal(modalContent, document.body)
  }

  return null
}

export default ModalWrapper

