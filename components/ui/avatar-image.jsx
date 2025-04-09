"use client"

import { useState } from "react"
import Image from "next/image"
import { User } from "lucide-react"

const AvatarImage = ({ src, alt, size = 32 }) => {
  const [error, setError] = useState(false)

  // If src is empty or there was an error loading the image, show the fallback
  if (!src || error) {
    return (
      <div className="flex items-center justify-center bg-gray-200 rounded-full" style={{ width: size, height: size }}>
        <User className={`text-gray-500 ${size <= 32 ? "h-4 w-4" : "h-6 w-6"}`} />
      </div>
    )
  }

  // For internal images (starting with /)
  if (src.startsWith("/")) {
    return (
      <Image
        src={src || "/placeholder.svg"}
        alt={alt || "User avatar"}
        width={size}
        height={size}
        className="object-cover rounded-full"
        onError={() => setError(true)}
      />
    )
  }

  // For external images, use an img tag instead of Next.js Image
  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt || "User avatar"}
      width={size}
      height={size}
      className="object-cover rounded-full"
      onError={() => setError(true)}
      style={{ width: size, height: size }}
    />
  )
}

export default AvatarImage
