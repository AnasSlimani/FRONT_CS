"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import api from "@/app/api/axios"
import { createPortal } from "react-dom"

const LoginModal = ({ isOpen, onClose }) => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })
  const [mounted, setMounted] = useState(false)

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("/users/login", loginForm, { public: true })
      const token = response.data
      console.log(token)
      localStorage.setItem("token", token)
      onClose() // Close the modal after successful login
      window.location.href = "/"
    } catch (error) {
      alert("User not found: " + error)
      throw error
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginForm((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div className="w-full max-w-md" variants={modalVariants} onClick={(e) => e.stopPropagation()}>
            <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-white p-8 dark:bg-black relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Welcome to JAGUARS</h2>
              <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                Sign up to jaguars if you can because we don&apos;t have a login flow yet
              </p>
              <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="projectmayhem@fc.com"
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleChange}
                  />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleChange}
                  />
                </LabelInputContainer>

                <button
                  className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                  type="submit"
                >
                  Log in &rarr;
                  <BottomGradient />
                </button>

                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
              </form>
            </div>
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

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
}

export default LoginModal

