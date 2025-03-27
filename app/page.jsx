import HeroCarousel from "@/components/home/HeroCarousel"
import About from "@/components/home/About"
import Actualities from "@/components/home/Actualities"
import Office from "@/components/home/Offise"
import Partnership from '@/components/home/Partnership'
import Contactus from '@/components/home/Contactus'

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroCarousel />
      <About />
      <Actualities />
      <Office />
      <Partnership />
      <Contactus />
    </div>
  )
}

