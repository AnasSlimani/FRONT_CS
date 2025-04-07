"use client"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"

export function FileUpload({ onFileSelect, buttonText = "Upload File", accept = "image/*" }) {
  const [fileName, setFileName] = useState("")
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      onFileSelect(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="flex flex-col items-center w-full">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept={accept} />
      <button
        type="button"
        onClick={handleButtonClick}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 shadow-sm transition-colors"
      >
        <Upload size={16} />
        {buttonText}
      </button>
      {fileName && <p className="mt-2 text-sm text-gray-500 truncate max-w-full">{fileName}</p>}
    </div>
  )
}

