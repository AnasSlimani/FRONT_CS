"use client"
import { useParams } from "next/navigation"
import ActivityDetails from "@/components/activities/ActivityDetails"

const ActivityDetailsPage = () => {
  const params = useParams()
  const id = params.id

  return <div className="mt-16">
    <ActivityDetails id={id} />
  </div>
}

export default ActivityDetailsPage
