"use client"
import { motion } from "framer-motion"
import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text3D, Center, Float } from "@react-three/drei"
import { Montserrat, Oswald } from "next/font/google"
import Link from "next/link"
import { ArrowRight, Award, Users, Calendar, Briefcase } from "lucide-react"
import { BackgroundBeams } from "@/components/ui/background-beams"

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

// Enhanced 3D Scene component
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
              ABOUT
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
              position={[-1.9, -1, 0]}
              scale={1}
              height={0.4}
              bevelEnabled
              bevelThickness={0.05}
              bevelSize={0.02}
              bevelSegments={5}
            >
              US
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

// Stats data
const stats = [
  {
    value: "12+",
    label: "Années d'expérience",
    icon: <Calendar className="w-5 h-5 text-teal-500" />,
  },
  {
    value: "10",
    label: "Disciplines sportives",
    icon: <Award className="w-5 h-5 text-teal-500" />,
  },
  {
    value: "150+",
    label: "Adhérents actifs",
    icon: <Users className="w-5 h-5 text-teal-500" />,
  },
  {
    value: "25",
    label: "Entraîneurs qualifiés",
    icon: <Briefcase className="w-5 h-5 text-teal-500" />,
  },
]

export default function About() {
  const sectionRef = useRef(null)

  return (
    <section id="about"
      ref={sectionRef}
      className={`relative py-16 overflow-hidden ${montserrat.variable} ${oswald.variable}`}
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #f0f4f8 100%)",
      }}
    >
      {/* Background beams with pointer-events-none to allow interactions with content */}
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundBeams className="opacity-30" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left side - 3D Content */}
          <div className="w-full lg:w-2/5 h-[300px] lg:h-[400px] order-2 lg:order-1 relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 40 }} style={{ width: "100%", height: "100%" }}>
              <ClubSportif3D />
            </Canvas>
          </div>

          {/* Right side - Content */}
          <div className="w-full lg:w-3/5 order-1 lg:order-2">
            {/* About Us Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-teal-700 text-white px-4 py-2 rounded-full uppercase shadow-lg mb-6"
            >
              <span className="text-xl">★</span>
              <span className="font-[family-name:var(--font-montserrat)] tracking-wider text-sm">INFORMATIONS</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-oswald)] tracking-wide text-black"
            >
              Notre Histoire et Notre Mission
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-700 mb-6"
            >
              Fondé en 2013, le Club Sportif Jaguars est né de la passion d'un groupe d'amis déterminés à créer un
              espace sportif inclusif. Aujourd'hui, avec 12 disciplines, 850+ adhérents et 25 entraîneurs qualifiés,
              nous promouvons l'excellence sportive et le développement personnel dans un environnement stimulant.
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {stat.icon}
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                href="#joinus"
                className="group inline-flex items-center gap-2 bg-black hover:bg-white hover:text-black text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <span>Rejoignez-nous</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

