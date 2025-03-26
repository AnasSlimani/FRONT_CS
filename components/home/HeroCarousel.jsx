"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Users,
  Star,
  BarChart2,
  LineChart,
  PieChart,
  TrendingUp,
} from "lucide-react"
import { Montserrat, Oswald, Raleway, Poppins, Roboto_Condensed } from "next/font/google"

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

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
})

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
})

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  display: "swap",
})

const slides = [
  {
    id: 1,
    title: "BIENVENUE AU",
    subtitle: "CLUB SPORTIF",
    buttonText: "JOIN US",
    buttonLink: "/join-us",
    image: "/images/terrain1.jpg",
  },
  {
    id: 2,
    title: "NOTRE CLUB EN",
    subtitle: "CHIFFRES",
    mainTitle: "CLUB JAGUARS",
    stats: [
      { icon: <Trophy className="text-teal-400" size={32} />, text: "12 Sections sportives" },
      { icon: <Users className="text-teal-400" size={32} />, text: "850+ Adhérents actifs" },
      { icon: <Star className="text-teal-400" size={32} />, text: "40 Ans d'excellence sportive" },
    ],
    buttonText: "DÉCOUVRIR",
    buttonLink: "/about-us",
    image: "/images/terrain2.jpg",
    layout: "stats-right",
  },
  {
    id: 3,
    title: "SUIVEZ VOS",
    subtitle: "PERFORMANCES",
    description: "Graphiques, Statistiques et Évolution Personnelle",
    buttonText: "EXPLORER",
    buttonLink: "/performances",
    image: "/images/terrain3.jpg",
    layout: "centered",
    icons: [
      <BarChart2 key="bar" className="text-blue-300" size={36} />,
      <LineChart key="line" className="text-yellow-300" size={36} />,
      <PieChart key="pie" className="text-red-300" size={36} />,
      <TrendingUp key="trend" className="text-green-300" size={36} />,
    ],
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  return (
    <div id="home "
      className={`relative w-full h-[600px] overflow-hidden ${montserrat.variable} ${oswald.variable} ${raleway.variable} ${poppins.variable} ${robotoCondensed.variable}`}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                priority={slide.id === 1}
                className="object-cover"
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content - Different layouts based on slide type */}
            {slide.id === 1 && (
              <div className="relative z-10 flex flex-col justify-center h-full">
                <div className="w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
                  <div className="max-w-xl mx-auto md:mx-0 text-center md:text-left">
                    <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-light mb-2 tracking-wider font-[family-name:var(--font-montserrat)]">
                      {slide.title}
                    </h2>
                    <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold mb-10 tracking-wide font-[family-name:var(--font-oswald)]">
                      {slide.subtitle}
                    </h1>

                    <Link
                      href={slide.buttonLink}
                      className="inline-block bg-white/90 hover:bg-white text-teal-700 font-semibold py-3 px-12 rounded-full transition-colors duration-300 text-lg"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Stats slide with right-aligned title */}
            {slide.id === 2 && (
              <div className="relative z-10 flex flex-col justify-center h-full">
                <div className="w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
                  <div className="flex flex-col md:flex-row md:justify-between items-center">
                    {/* Stats on the left */}
                    <div className="md:w-1/2 mt-0 md:-mt-16">
                      <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-wide font-[family-name:var(--font-oswald)] text-center md:text-left">
                        {slide.mainTitle}
                      </h1>

                      <div className="space-y-5 text-white">
                        {slide.stats.map((stat, index) => (
                          <div key={index} className="flex items-center">
                            <div className="mr-4">{stat.icon}</div>
                            <p className="text-xl md:text-2xl font-[family-name:var(--font-roboto-condensed)] tracking-wide">
                              {stat.text}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-10">
                        <Link
                          href={slide.buttonLink}
                          className="inline-block bg-white/90 hover:bg-white text-amber-800 font-semibold py-3 px-12 rounded-full transition-colors duration-300 text-lg"
                        >
                          {slide.buttonText}
                        </Link>
                      </div>
                    </div>

                    {/* Title on the right */}
                    <div className="md:w-1/2 mb-8 md:mb-0 order-first md:order-last text-center md:text-right">
                      <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-light tracking-wider font-[family-name:var(--font-raleway)]">
                        {slide.title}
                      </h2>
                      <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold tracking-wide font-[family-name:var(--font-oswald)]">
                        {slide.subtitle}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance slide with centered content and icons */}
            {slide.id === 3 && (
              <div className="relative z-10 flex flex-col justify-center h-full">
                <div className="w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
                  <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-medium mb-2 tracking-wider font-[family-name:var(--font-poppins)]">
                      {slide.title}
                    </h2>
                    <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-wide font-[family-name:var(--font-poppins)]">
                      {slide.subtitle}
                    </h1>

                    {/* Icons row */}
                    <div className="flex justify-center space-x-6 mb-6">
                      {slide.icons.map((icon, index) => (
                        <div key={index} className="transform transition-transform duration-300 hover:scale-110">
                          {icon}
                        </div>
                      ))}
                    </div>

                    <p className="text-white text-xl md:text-2xl mb-10 font-[family-name:var(--font-raleway)]">
                      {slide.description}
                    </p>

                    <Link
                      href={slide.buttonLink}
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-12 rounded-full transition-colors duration-300 text-lg shadow-lg hover:shadow-xl transform transition-transform hover:-translate-y-1"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors duration-300 hover:scale-110 transform"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors duration-300 hover:scale-110 transform"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

