"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function MessageModal({
  isOpen,
  onClose,
  message,
  redirectUrl,
  type = "success", // success, error, info
  autoCloseTime = 0, // 0 means no auto-close
  title,
}) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // Handle animation timing
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsClosing(false)
    } else {
      setIsClosing(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 500) // Match with animation duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle auto-close
  useEffect(() => {
    let timer
    if (isOpen && autoCloseTime > 0) {
      timer = setTimeout(() => {
        handleClose()
      }, autoCloseTime)
    }
    return () => clearTimeout(timer)
  }, [isOpen, autoCloseTime])

  // Handle close and redirect
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      if (redirectUrl) {
        setTimeout(() => {
          router.push(redirectUrl)
        }, 100)
      }
    }, 400) // Wait for close animation
  }

  // Don't render anything if not open and not visible
  if (!isOpen && !isVisible) return null

  // Determine colors and styles based on type
  const styles = {
    success: {
      gradient: "from-emerald-50 to-teal-50",
      border: "border-emerald-100",
      iconBg: "bg-emerald-100",
      icon: "text-emerald-600",
      title: "text-emerald-800",
      text: "text-emerald-700",
      button: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
      shadow: "shadow-emerald-100",
    },
    error: {
      gradient: "from-rose-50 to-red-50",
      border: "border-rose-100",
      iconBg: "bg-rose-100",
      icon: "text-rose-600",
      title: "text-rose-800",
      text: "text-rose-700",
      button: "bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600",
      shadow: "shadow-rose-100",
    },
    info: {
      gradient: "from-sky-50 to-blue-50",
      border: "border-sky-100",
      iconBg: "bg-sky-100",
      icon: "text-sky-600",
      title: "text-sky-800",
      text: "text-sky-700",
      button: "bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600",
      shadow: "shadow-sky-100",
    },
  }

  // Determine icon based on type
  const Icon =
    {
      success: CheckCircle,
      error: AlertCircle,
      info: Info,
    }[type] || CheckCircle

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-500",
        isOpen && !isClosing ? "bg-black/30" : "bg-black/0",
        isOpen || isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            "absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-1000",
            type === "success" ? "bg-emerald-300" : type === "error" ? "bg-rose-300" : "bg-sky-300",
            isOpen && !isClosing ? "scale-100" : "scale-50",
          )}
        ></div>
        <div
          className={cn(
            "absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-1000",
            type === "success" ? "bg-teal-300" : type === "error" ? "bg-red-300" : "bg-blue-300",
            isOpen && !isClosing ? "scale-100" : "scale-50",
          )}
        ></div>
      </div>

      <div
        className={cn(
          "w-full max-w-md rounded-2xl transform transition-all duration-500",
          "bg-gradient-to-br",
          styles[type].gradient,
          "border",
          styles[type].border,
          "shadow-2xl",
          styles[type].shadow,
          isOpen && !isClosing ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0",
        )}
      >
        {/* Top decorative bar */}
        <div
          className={cn(
            "h-1.5 w-full rounded-t-2xl bg-gradient-to-r",
            type === "success"
              ? "from-emerald-400 to-teal-400"
              : type === "error"
                ? "from-rose-400 to-red-400"
                : "from-sky-400 to-blue-400",
          )}
        ></div>

        <div className="relative p-8">
          {/* Close button */}
          <button
            onClick={handleClose}
            className={cn(
              "absolute top-4 right-4 rounded-full p-1.5 transition-all duration-300",
              "hover:bg-white/80 text-gray-400 hover:text-gray-600",
              "transform hover:rotate-90",
            )}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex items-start">
            {/* Icon */}
            <div className={cn("flex-shrink-0 mr-5 rounded-full p-3", styles[type].iconBg, styles[type].icon)}>
              <Icon size={28} strokeWidth={2} />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              {title && <h3 className={cn("text-lg font-bold mb-2", styles[type].title)}>{title}</h3>}
              <p className={cn("text-base leading-relaxed", styles[type].text)}>{message}</p>

              {/* Action button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleClose}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-white font-medium",
                    "transition-all duration-300 transform hover:translate-y-[-2px]",
                    "flex items-center gap-2 shadow-lg",
                    styles[type].button,
                  )}
                >
                  <span>Fermer</span>
                  {redirectUrl && <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar for auto-close */}
        {autoCloseTime > 0 && (
          <div className="relative w-full h-1 overflow-hidden rounded-b-2xl">
            <div
              className={cn(
                "absolute bottom-0 left-0 h-full transition-all ease-linear",
                type === "success" ? "bg-emerald-400" : type === "error" ? "bg-rose-400" : "bg-sky-400",
              )}
              style={{
                width: "100%",
                animation: `shrink ${autoCloseTime}ms linear forwards`,
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

