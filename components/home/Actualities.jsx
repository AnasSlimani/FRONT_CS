"use client"
import Image from "next/image"
import { Carousel, Card } from "@/components/ui/apple-cards-carousel"

export default function Actualities() {
  const cards = data.map((card, index) => <Card key={card.src} card={card} index={index} layout={true} />)

  return (
    <div className="w-full h-full pt-15 pb-10 bg-black">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Get to know Our Actualities !
      </h2>
      <Carousel items={cards} />
    </div>
  )
}

const DummyContent = ({ description, image }) => {
    return (
      <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700">À propos :</span> {description}
        </p>
        {image && (
          <Image
            src={image}
            alt="image liée à l'actualité"
            height={500}
            width={500}
            className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-6"
          />
        )}
      </div>
    )
  }
  
  const data = [
    {
      category: "Réunion",
      title: "Assemblée Générale du Club",
      src: "/images/reunion.jpg",
      content: (
        <DummyContent
          description="Rejoignez-nous le 5 avril pour discuter des projets de la saison et de l'organisation générale du club."
          image="/images/reunion.jpg"
        />
      ),
    },
    {
      category: "Tournoi football",
      title: "Tournoi Interclubs - 01/01/2025",
      src: "/images/tournoiFB.jpg",
      content: (
        <DummyContent
          description="Tournoi de printemps entre les sections football, handball, et basketball. Rendez-vous le 15 mai !"
          image="/images/tournoiFB.jpg"
        />
      ),
    },
    {
      category: "Événement",
      title: "Fête du Club 01/02/2025",
      src: "/images/fete.jpg",
      content: (
        <DummyContent
          description="Un moment festif pour célébrer nos athlètes, avec animations, musique et remise de médailles le 20 juin."
          image="/images/fete.jpg"
        />
      ),
    },
    {
      category: "Tournoi Du Billard",
      title: "Le Samedi 16/02/2025",
      src: "/images/billard.jpg",
      content: (
        <DummyContent
          description="Venez participer à notre tournoi de billard ! Ouvert à tous les niveaux."
          image="/images/billard.jpg"
        />
      ),
    },
    {
      category: "Rencontre VolleyBall",
      title: "Match Amical - GI vs IID",
      src: "/images/volleyball.jpg",
      content: (
        <DummyContent
          description="Match amical entre nos anciens et les nouvelles recrues du club, le 7 juillet à 18h."
          image="/images/volleyball.jpg"
        />
      ),
    },
    {
      category: "Tournoi FIFA",
      title: "Inscriptions Mois Mars",
      src: "/images/fifa.jpg",
      content: (
        <DummyContent
          description="Les inscriptions pour notre tournoi FIFA sont ouvertes ! Places limitées, inscrivez-vous vite."
          image="/images/fifa.jpg"
        />
      ),
    },
  ]
  
  

