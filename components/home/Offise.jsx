"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Montserrat, Oswald } from "next/font/google"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'

// Import fonts
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

const Office = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Sophie Martin",
      image: "/images/anas.jpg",
      role: "Présidente",
    },
    {
      id: 2,
      name: "Thomas Dubois",
      image: "/images/anas.jpg",
      role: "Vice-Président",
    },
    {
      id: 3,
      name: "Emma Lefebvre",
      image: "/images/anas.jpg",
      role: "Trésorière",
    },
    {
      id: 4,
      name: "Lucas Bernard",
      image: "/images/anas.jpg",
      role: "Secrétaire",
    },
    {
      id: 5,
      name: "Camille Petit",
      image: "/images/anas.jpg",
      role: "Responsable Communication",
    },
    {
      id: 6,
      name: "Antoine Moreau",
      image: "/images/anas.jpg",
      role: "Entraîneur Principal",
    },
    {
      id: 7,
      name: "Julie Roux",
      image: "/images/anas.jpg",
      role: "Coordinatrice Événements",
    },
    {
      id: 8,
      name: "Nicolas Fournier",
      image: "/images/anas.jpg",
      role: "Responsable Technique",
    },
  ]

  return (
    <section id="team"
      className={`py-16 ${montserrat.variable} ${oswald.variable}`}
      style={{
        background: "linear-gradient(to bottom, var(--gray-50), var(--gray-100))",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-6xl md:text-6xl lg:text-8xl font-bold mb-8 text-center font-[family-name:var(--font-oswald)] tracking-wide text-black"
          >
            Our Team
          </h2>
          <p
            className="text-2xl md:text-4xl max-w-3xl mx-auto font-[family-name:var(--font-montserrat)]"
            style={{ color: "var(--gray-700, #374151)" }}
          >
            Meet the members who run our club
          </p>
        </div>

        <div className="relative">
          {/* Left gradient fade effect */}
          <div
            className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, var(--gray-50, #f9fafb), transparent)" }}
          ></div>

          {/* Right gradient fade effect */}
          <div
            className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, var(--gray-50, #f9fafb), transparent)" }}
          ></div>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={40}
            slidesPerView={'auto'}
            loop={true}
            autoplay={{
              delay: 1,
              disableOnInteraction: false,
            }}
            speed={3000}
            freeMode={true}
            className="py-5"
          >
            {teamMembers.map((member) => (
              <SwiperSlide key={member.id} style={{ width: '280px' }}>
                <div
                  className="relative rounded-xl overflow-hidden shadow-lg"
                  style={{
                    width: "280px",
                    height: "380px",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  <div className="relative w-full h-full">
                    {/* Member image */}
                    <Image
                      src={member.image || "/placeholder.svg?height=400&width=300"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />

                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3), transparent)" }}
                    ></div>

                    {/* Member name */}
                    <div className="absolute bottom-16 left-0 w-full px-4">
                      <h3 className="text-white text-xl font-bold truncate">{member.name}</h3>
                    </div>

                    {/* Role badge */}
                    <div
                      className="absolute bottom-4 left-4 text-white px-4 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: "rgba(13, 148, 136, 0.9)" }}
                    >
                      {member.role}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

export default Office