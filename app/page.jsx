import HeroCarousel from "@/components/home/HeroCarousel"
import About from "@/components/home/About"
import Actualities from "@/components/home/Actualities"

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroCarousel />
      <About />
      <Actualities />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-teal-700 mb-6">Bienvenue au Club Sportif</h1>
        <p className="text-lg text-gray-700 mb-4">
          Découvrez nos activités sportives, nos événements et rejoignez notre communauté.
        </p>
        <p className="text-gray-600">Utilisez la barre de navigation ci-dessus pour explorer notre site.</p>
      </div>
    </div>
  )
}

