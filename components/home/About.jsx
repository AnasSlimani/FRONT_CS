"use client"
import { useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"

const text =
  "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui numquam soluta eaque porro ipsum, nemo dolore omnis minus . ."
const words = text.split(" ")

export default function About() {
  const scrollTarget = useRef(null)
  const sectionRef = useRef(null)

  // This is the key change - we're using a different offset configuration
  // to make the animation complete before reaching the end of the section
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start end", "end start"], // Changed from 'end end' to 'end start'
  })

  const [currentWord, setCurrentWord] = useState(0)
  // Adjust the range to complete the animation earlier
  const wordIndex = useTransform(scrollYProgress, [0, 0.7], [0, words.length])

  useEffect(() => {
    wordIndex.on("change", (latest) => {
      setCurrentWord(latest)
    })
  }, [wordIndex])

  return (
    <section className="py-20 lg:py-20 relative bg-black" ref={sectionRef}>
      <div className="container mx-auto">
        <div className="sticky top-0 md:top-28 lg:top-40">
          <div className="flex justify-center">
            <div className="inline-flex border border-lime-400 gap-2 text-lime-400 px-3 py-1 rounded-full uppercase items-center">
              <span>&#10038;</span>About Us
            </div>
          </div>
          <div className="text-4xl md:text-6xl lg:text-7xl text-center font-medium mt-10">
            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, libero!</span>{" "}
            <span>
              {words.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className={twMerge("transition duration-500 text-white/15", wordIndex < currentWord && "text-white")}
                >
                  {`${word} `}
                </span>
              ))}
            </span>
            <span className="text-lime-400 block">Lorem ipsum dolor sit amet.</span>
          </div>
        </div>
        {/* Reduced height to make the next section appear earlier */}
        <div className="h-[80vh]" ref={scrollTarget}>
          {/* This empty div creates the scrollable area */}
        </div>
      </div>
    </section>
  )
}

