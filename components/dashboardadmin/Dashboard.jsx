"use client"

import { useState, useEffect } from "react"
import api from "@/app/api/axios"
import { motion } from "framer-motion"
import {
  Users,
  Trophy,
  MapPin,
  Calendar,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Clock,
} from "lucide-react"

export default function Dashboard() {
  const [stats, setStats] = useState({
    adherents: { count: 0, trend: 5.2 },
    tournaments: { count: 0, trend: 12.5 },
    trips: { count: 0, trend: -3.8 },
    friendlyMatches: { count: 0, trend: 7.1 },
    orders: { count: 0, trend: 9.3 },
    revenue: { amount: 0, trend: 15.7 },
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
        setIsLoading(true)
        try {
        const nbrUsers = await api.get('/users/count',{public:true});
        const nbrTournaments = await api.get('/activities/count?type=tournament',{public:true});
        const nbrTrips =await api.get('/activities/count?type=deplacement',{public:true});
        const nbrFriendlyMatches =await api.get('/activities/count?type=matchAmical',{public:true});
        const nbrOrders = await api.get('/orders/count',{public:true});
        setStats({
            adherents: { count: nbrUsers.data , trend: 5.2 },
            tournaments: { count: nbrTournaments.data , trend: 12.5 },
            trips: { count: nbrTrips.data, trend: -3.8 },
            friendlyMatches: { count: nbrFriendlyMatches.data , trend: 7.1 },
            orders: { count: nbrOrders.data, trend: 9.3 },
            revenue: { amount: 12580, trend: 15.7 },
          })
        
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
  }, []);

  

//   useEffect(() => {
//     const fetchStats = async () => {
//       setIsLoading(true)
//       try {
//         // In a real app, you would fetch this data from your API
//         // For now, we'll simulate a delay and use mock data
//         await new Promise((resolve) => setTimeout(resolve, 1000))

//         // Simulated API responses
//         setStats({
//           adherents: { count: 248, trend: 5.2 },
//           tournaments: { count: 12, trend: 12.5 },
//           trips: { count: 8, trend: -3.8 },
//           friendlyMatches: { count: 24, trend: 7.1 },
//           orders: { count: 156, trend: 9.3 },
//           revenue: { amount: 12580, trend: 15.7 },
//         })
//       } catch (error) {
//         console.error("Error fetching dashboard stats:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchStats()
//   }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  // Stat card component
  const StatCard = ({ title, value, trend, icon, color }) => (
    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>

        <div className="flex items-center mt-4">
          <span className={`text-sm font-medium ${trend >= 0 ? "text-green-500" : "text-red-500"} flex items-center`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-sm text-gray-500 ml-2">since last month</span>
        </div>
      </div>
    </motion.div>
  )

  // Recent activity component
  const RecentActivity = () => {
    const activities = [
      { id: 1, type: "tournament", title: "Football Tournament", date: "June 15, 2023", status: "Completed" },
      { id: 2, type: "trip", title: "Trip to Marseille", date: "June 22, 2023", status: "In Progress" },
      { id: 3, type: "match", title: "Friendly Match vs. Neighbor Club", date: "June 28, 2023", status: "Upcoming" },
      { id: 4, type: "order", title: "Order #12345", date: "June 30, 2023", status: "Delivered" },
      { id: 5, type: "tournament", title: "Basketball Tournament", date: "July 5, 2023", status: "Upcoming" },
    ]

    const getIcon = (type) => {
      switch (type) {
        case "tournament":
          return <Trophy className="w-5 h-5 text-yellow-500" />
        case "trip":
          return <MapPin className="w-5 h-5 text-red-500" />
        case "match":
          return <Activity className="w-5 h-5 text-blue-500" />
        case "order":
          return <ShoppingBag className="w-5 h-5 text-purple-500" />
        default:
          return <Calendar className="w-5 h-5 text-gray-500" />
      }
    }

    const getStatusColor = (status) => {
      switch (status) {
        case "Completed":
          return "bg-gray-100 text-gray-800"
        case "In Progress":
          return "bg-blue-100 text-blue-800"
        case "Upcoming":
          return "bg-green-100 text-green-800"
        case "Delivered":
          return "bg-purple-100 text-purple-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }

    return (
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-md overflow-hidden col-span-full lg:col-span-2"
      >
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="mr-4">{getIcon(activity.type)}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{activity.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.date}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your administration panel</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <StatCard
          title="Members"
          value={stats.adherents.count}
          trend={stats.adherents.trend}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />

        <StatCard
          title="Tournaments"
          value={stats.tournaments.count}
          trend={stats.tournaments.trend}
          icon={<Trophy className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
        />

        <StatCard
          title="Trips"
          value={stats.trips.count}
          trend={stats.trips.trend}
          icon={<MapPin className="w-6 h-6 text-white" />}
          color="bg-red-500"
        />

        <StatCard
          title="Friendly Matches"
          value={stats.friendlyMatches.count}
          trend={stats.friendlyMatches.trend}
          icon={<Activity className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />

        <StatCard
          title="Orders"
          value={stats.orders.count}
          trend={stats.orders.trend}
          icon={<ShoppingBag className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />

        <StatCard
          title="Revenue"
          value={`${stats.revenue.amount.toLocaleString()} €`}
          trend={stats.revenue.trend}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-teal-500"
        />

        <RecentActivity />
      </motion.div>
    </div>
  )
}

