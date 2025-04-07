/**
 * This is a utility function that would be used in a scheduled task
 * to clean up expired trial accounts. In a real application, this would
 * be implemented as a cron job or scheduled task on the server.
 */

import api from "@/app/api/axios"

/**
 * Fetches all users and deletes those with expired trials who haven't contributed
 */
export async function cleanupExpiredTrials() {
  try {
    // Get all users
    const response = await api.get("/users")
    const users = response.data

    const now = new Date()
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000

    // Filter users with expired trials who haven't contributed
    const expiredUsers = users.filter((user) => {
      // Skip users who have contributed
      if (user.contributed) return false

      // Calculate trial expiration
      const registrationDate = new Date(user.registrationDate)
      const trialEndDate = new Date(registrationDate.getTime() + sevenDaysInMs)

      // Check if trial has expired
      return now > trialEndDate
    })

    // Delete expired users
    for (const user of expiredUsers) {
      console.log(`Deleting expired trial user: ${user.username} (${user.email})`)
      await api.delete(`/users/${user.id}`)
    }

    console.log(`Cleaned up ${expiredUsers.length} expired trial accounts`)
    return expiredUsers.length
  } catch (error) {
    console.error("Error cleaning up expired trials:", error)
    throw error
  }
}

