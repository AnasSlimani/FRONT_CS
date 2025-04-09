import Image from "next/image"

export default function Logo() {
  return (
    <div className="relative w-32 h-10">
      <Image src="/placeholder.svg?height=40&width=128" alt="Club Logo" fill className="object-contain" />
    </div>
  )
}
