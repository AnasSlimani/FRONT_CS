"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Carousel, Card } from "@/components/ui/apple-cards-carousel"
import api from "@/app/api/axios"

export default function Actualities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const response = await api.get('/activities')
        setActivities(response.data.slice(0, 5)) // Show only the first 5
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const cards = activities.map((activity, index) => {
    const imagePath = activity.image?.startsWith("/") ? activity.image : `/images/${activity.image}`
    return (
      <Card
        key={activity.id || index}
        card={{
          category: activity.type,
          title: activity.name || "Activity",
          src: imagePath,
          content: (
            <DummyContent
              description={activity.description || "No description available"}
              image={imagePath}
            />
          )
        }}
        index={index}
        layout={true}
      />
    )
  })
  

  return (
    <div id="actualities" className="w-full h-full pt-15 pb-10 bg-black">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Get to know Our Actualities !
      </h2>
      {!loading && <Carousel items={cards} />}
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
