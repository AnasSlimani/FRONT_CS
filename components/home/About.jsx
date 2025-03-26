"use client"
import { useScroll, useTransform, motion, useSpring, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text3D, Center, Float } from "@react-three/drei"
import { Montserrat, Oswald, Raleway } from "next/font/google"
import Link from "next/link"
import { BackgroundBeams } from "@/components/ui/background-beams";

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

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
})

// Enhanced 3D Scene component with better lighting and effects
function ClubSportif3D() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0d9488" />
      <pointLight position={[10, -5, -10]} intensity={0.3} color="#ffffff" />

      <Center>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
          <group position={[0, 0, 0]}>
            {/* CLUB text */}
            <Text3D
              font="/fonts/Geist_Bold.json"
              position={[-3.5, 0.5, 0]}
              scale={1}
              height={0.4}
              bevelEnabled
              bevelThickness={0.05}
              bevelSize={0.02}
              bevelSegments={5}
            >
              CLUB
              <meshPhysicalMaterial
                color="#000000"
                metalness={0.6}
                roughness={0.3}
                clearcoat={1}
                clearcoatRoughness={0.2}
                emissive="#222222"
                emissiveIntensity={0.2}
              />
            </Text3D>

            {/* SPORTIF text */}
            <Text3D
              font="/fonts/Geist_Bold.json"
              position={[-4.2, -1, 0]}
              scale={1}
              height={0.4}
              bevelEnabled
              bevelThickness={0.05}
              bevelSize={0.02}
              bevelSegments={5}
            >
              SPORTIF
              <meshPhysicalMaterial
                color="#000000"
                metalness={0.6}
                roughness={0.3}
                clearcoat={1}
                clearcoatRoughness={0.2}
                emissive="#222222"
                emissiveIntensity={0.2}
              />
            </Text3D>
          </group>
        </Float>
      </Center>

      <Environment preset="studio" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </>
  )
}

// Animated number counter component
function AnimatedCounter({ value, duration = 2 }) {
  const counterRef = useRef(null)
  const isInView = useInView(counterRef, { once: true, margin: "-100px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      let startTime
      const animateCount = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * value))
        if (progress < 1) {
          requestAnimationFrame(animateCount)
        }
      }
      requestAnimationFrame(animateCount)
    }
  }, [isInView, value, duration])

  return <span ref={counterRef}>{count}</span>
}

// Animated gradient text component
function GradientText({ children, className }) {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-400 ${className}`}>
      {children}
    </span>
  )
}

const aboutText = {
  title: "Notre Histoire et Notre Mission",
  paragraphs: [
    "JAGUARS Fondé en 1983, le Club Sportif Jaguars est né de la passion d'un groupe d'amis déterminés à créer un espace où le sport serait accessible à tous.",
    "Aujourd'hui, nous sommes fiers d'offrir plus de 12 disciplines sportives, d'accueillir plus de 850 adhérents et de compter sur une équipe de 25 entraîneurs qualifiés.",
    "Notre mission est de promouvoir l'excellence sportive, l'esprit d'équipe et le développement personnel à travers la pratique du sport dans un environnement inclusif et stimulant.",
  ],
  highlight: "Rejoignez-nous et faites partie de notre histoire.",
  stats: [
    { value: 40, label: "Années d'expérience" },
    { value: 12, label: "Disciplines sportives" },
    { value: 850, label: "Adhérents actifs" },
    { value: 25, label: "Entraîneurs qualifiés" },
  ],
}

export default function About() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const statsRef = useRef(null)

  const isTextInView = useInView(textRef, { once: false, amount: 0.3 })
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  // Smoother animations with spring
  const springY = useSpring(y, { stiffness: 100, damping: 30 })
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 })

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${montserrat.variable} ${oswald.variable} ${raleway.variable}`}
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #f0f4f8 100%)",
        padding: "4rem 0",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-cyan-300/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          style={{
            opacity: springOpacity,
            y: springY,
            scale: springScale,
          }}
          className="px-4 md:px-0"
        >
          {/* About Us Badge */}
          <div className="flex justify-center md:justify-start mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-teal-700 text-white px-4 py-2 rounded-full uppercase shadow-lg"
            >
              <span className="text-xl">★</span>
              <span className="font-[family-name:var(--font-montserrat)] tracking-wider">About Us</span>
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row items-center">
            {/* Text Content - Left Side */}
            <div className="md:w-1/2 md:pr-8 lg:pr-16" ref={textRef}>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isTextInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center md:text-left font-[family-name:var(--font-oswald)] tracking-wide text-black"
              >
                {aboutText.title}
              </motion.h2>

              <div className="space-y-6 text-lg md:text-xl text-center md:text-left">
                {aboutText.paragraphs.map((paragraph, pIndex) => (
                  <motion.p
                    key={pIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isTextInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, delay: 0.3 + pIndex * 0.2 }}
                    className="font-[family-name:var(--font-raleway)] text-gray-700 leading-relaxed"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isTextInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-xl md:text-2xl mt-8 text-center md:text-left font-[family-name:var(--font-montserrat)] font-semibold text-black"
              >
                {aboutText.highlight}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isTextInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex justify-center md:justify-start mt-8"
              >
                <Link
                  href="/join-us"
                  className="group relative inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full uppercase transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden font-[family-name:var(--font-montserrat)] tracking-wider"
                >
                  <span className="relative z-10">Rejoignez-nous</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="absolute inset-0 w-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </motion.div>

              {/* Stats Section */}
              <div ref={statsRef} className="grid grid-cols-2 gap-6 mt-12">
                {aboutText.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-black mb-1 font-[family-name:var(--font-oswald)]">
                      <AnimatedCounter value={stat.value} />
                      {index === 0 && "+"}
                    </div>
                    <div className="text-sm md:text-base text-gray-600 font-[family-name:var(--font-raleway)]">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 3D Content - Right Side - Now directly on background */}
            <div className="md:w-1/2 h-[350px] md:h-[500px] lg:h-[600px] mt-10 md:mt-0 absolute md:relative right-0 top-0 md:top-auto w-full md:w-1/2 pointer-events-none">
              <Canvas
                camera={{ position: [0, 0, 10], fov: 40 }}
                style={{ position: "absolute", width: "100%", height: "100%" }}
              >
                <ClubSportif3D />
              </Canvas>
            </div>
          </div>
        </motion.div>
      </div>
      <BackgroundBeams />
    </section>
  )
}

