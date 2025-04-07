"use client"

import { createContext, useContext, useState } from "react"
import { MessageModal } from "./message-modal"

// Create context
const MessageModalContext = createContext(null)

// Provider component
export function MessageModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: "",
    redirectUrl: "",
    type: "success",
    title: "",
    autoCloseTime: 0,
  })

  // Function to show modal
  const showModal = ({ message, redirectUrl = "", type = "success", title = "", autoCloseTime = 0 }) => {
    setModalState({
      isOpen: true,
      message,
      redirectUrl,
      type,
      title,
      autoCloseTime,
    })
  }

  // Function to hide modal
  const hideModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <MessageModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <MessageModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        message={modalState.message}
        redirectUrl={modalState.redirectUrl}
        type={modalState.type}
        title={modalState.title}
        autoCloseTime={modalState.autoCloseTime}
      />
    </MessageModalContext.Provider>
  )
}

// Custom hook to use the modal
export function useMessageModal() {
  const context = useContext(MessageModalContext)
  if (!context) {
    throw new Error("useMessageModal must be used within a MessageModalProvider")
  }
  return context
}

