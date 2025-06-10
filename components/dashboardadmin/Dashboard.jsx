"use client"

import { useState, useEffect } from "react"
import api from "@/app/api/axios"
import { motion, AnimatePresence } from "framer-motion"
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
  ArrowRight,
  Info,
  CheckCircle,
  Clock3,
  Sparkles,
  BarChart3,
  LineChart,
  PieChart,
  RefreshCw,
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Doughnut } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

export default function Dashboard() {
  const [stats, setStats] = useState({
    adherents: { count: 0, trend: 5.2, history: [] },
    tournaments: { count: 0, trend: 12.5 },
    trips: { count: 0, trend: -3.8 },
    friendlyMatches: { count: 0, trend: 7.1 },
    orders: { count: 0, trend: 9.3, history: [] },
    revenue: { amount: 0, trend: 15.7, history: [] },
  })
  const [orderStatusData, setOrderStatusData] = useState({ labels: [], data: [], colors: [] })
  const [revenueData, setRevenueData] = useState({ labels: [], data: [] })
  const [activityDistribution, setActivityDistribution] = useState({ labels: [], data: [], colors: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Generate mock historical data for charts
  const generateMockHistoricalData = (baseValue, volatility, months = 6) => {
    const data = []
    let currentValue = baseValue

    for (let i = 0; i < months; i++) {
      // Add some random variation
      const change = (Math.random() - 0.5) * 2 * volatility * currentValue
      currentValue = Math.max(0, currentValue + change)
      data.push(Math.round(currentValue))
    }

    return data
  }

  const fetchDashboardData = async () => {
    setRefreshing(true)
    try {
      // Fetch real data from API
      const nbrUsers = await api.get("/users/count", { public: true })
      const nbrTournaments = await api.get("/activities/count?type=tournament", { public: true })
      const nbrTrips = await api.get("/activities/count?type=deplacement", { public: true })
      const nbrFriendlyMatches = await api.get("/activities/count?type=matchAmical", { public: true })
      const nbrOrders = await api.get("/orders/count", { public: true })
      const revenus = await api.get("/orders/status/completed", { public: true })
      const totalRevenue = revenus.data.reduce((sum, order) => sum + (order.price || 0), 0)

      // Generate mock historical data for charts
      const memberHistory = generateMockHistoricalData(nbrUsers.data, 0.1)
      memberHistory[memberHistory.length - 1] = nbrUsers.data // Ensure last value matches current count
      const orderHistory = generateMockHistoricalData(nbrOrders.data, 0.15)
      const revenueHistory = generateMockHistoricalData(totalRevenue / 6, 0.2)

      setStats({
        adherents: {
          count: nbrUsers.data,
          trend: 5.2,
          history: memberHistory,
        },
        tournaments: { count: nbrTournaments.data, trend: 12.5 },
        trips: { count: nbrTrips.data, trend: -3.8 },
        friendlyMatches: { count: nbrFriendlyMatches.data, trend: 7.1 },
        orders: {
          count: nbrOrders.data,
          trend: 9.3,
          history: orderHistory,
        },
        revenue: {
          amount: totalRevenue,
          trend: 15.7,
          history: revenueHistory,
        },
      })

      // Set order status distribution data
      // In a real app, you would fetch this from your API
      const totalOrders = nbrOrders.data || 100
      const completedOrders = Math.round(totalOrders * 0.65)
      const pendingOrders = Math.round(totalOrders * 0.25)
      const canceledOrders = totalOrders - completedOrders - pendingOrders

      setOrderStatusData({
        labels: ["Completed", "Pending", "Canceled"],
        data: [completedOrders, pendingOrders, canceledOrders],
        colors: [
          "rgba(16, 185, 129, 0.8)", // green
          "rgba(245, 158, 11, 0.8)", // amber
          "rgba(239, 68, 68, 0.8)", // red
        ],
      })

      // Set activity distribution data - removed training as requested
      setActivityDistribution({
        labels: ["Tournaments", "Trips", "Friendly Matches"],
        data: [nbrTournaments.data, nbrTrips.data, nbrFriendlyMatches.data],
        colors: [
          "rgba(234, 179, 8, 0.8)", // yellow
          "rgba(239, 68, 68, 0.8)", // red
          "rgba(59, 130, 246, 0.8)", // blue
        ],
      })

      // Set revenue data (last 6 months)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      setRevenueData({
        labels: months,
        data: revenueHistory,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
    },
  }

  // Stat card component with improved design and animations
  const StatCard = ({ title, value, trend, icon, color, bgColor }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300"
    >
      <div className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-5">{icon}</div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1 font-display">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
          </div>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className={`p-3 rounded-full ${bgColor} ${color} shadow-lg`}
          >
            {icon}
          </motion.div>
        </div>

        <div className="flex items-center mt-4">
          <motion.span
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className={`text-sm font-medium ${
              trend >= 0 ? "text-green-500" : "text-red-500"
            } flex items-center px-2 py-1 rounded-full ${trend >= 0 ? "bg-green-50" : "bg-red-50"}`}
          >
            {trend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {Math.abs(trend)}%
          </motion.span>
          <span className="text-sm text-gray-500 ml-2">since last month</span>
        </div>
      </div>
    </motion.div>
  )

  // Chart card component with improved design
  const ChartCard = ({ title, icon, children, className = "" }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="mr-2 p-2 rounded-md bg-gray-50">{icon}</div>
            <h2 className="text-lg font-bold text-gray-800 font-display">{title}</h2>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1 rounded-md hover:bg-gray-100"
              onClick={() => {}}
            >
              <Info className="w-4 h-4 text-gray-400" />
            </motion.button>
          </div>
        </div>
        <div className="h-64">{children}</div>
      </div>
    </motion.div>
  )

  // Recent activity component with improved design
  const RecentActivity = () => {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchActivities = async () => {
        try {
          const response = await api.get("/activities")
          setActivities(response.data.slice(0, 5))
        } catch (error) {
          console.error("Failed to load recent activities:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchActivities()
    }, [])

    const getIcon = (type) => {
      switch (type) {
        case "tournament":
          return <Trophy className="w-5 h-5 text-yellow-500" />
        case "deplacement":
          return <MapPin className="w-5 h-5 text-red-500" />
        case "matchAmical":
          return <Activity className="w-5 h-5 text-blue-500" />
        case "order":
          return <ShoppingBag className="w-5 h-5 text-purple-500" />
        default:
          return <Calendar className="w-5 h-5 text-gray-500" />
      }
    }

    const getStatusBadge = (isFull) => {
      const status = isFull ? "Completed" : "In Progress"
      const colorClass = isFull
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
        : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass} shadow-sm flex items-center`}>
          {isFull ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock3 className="w-3 h-3 mr-1" />}
          {status}
        </span>
      )
    }

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 col-span-full lg:col-span-2"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="mr-2 p-2 rounded-md bg-gray-50">
                <Calendar className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 font-display">Recent Activities</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="text-teal-500 hover:text-teal-600 text-sm font-medium flex items-center bg-teal-50 px-3 py-1 rounded-full"
            >
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </motion.button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="rounded-full h-8 w-8 border-2 border-t-teal-500 border-r-teal-500 border-b-transparent border-l-transparent"
                ></motion.div>
              </div>
            ) : activities.length === 0 ? (
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="text-center py-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
              >
                <Calendar className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">No recent activities found</p>
              </motion.div>
            ) : (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id || activity._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-all duration-300"
                >
                  <motion.div whileHover={{ rotate: 15 }} className="mr-4 p-2 rounded-full bg-white shadow-sm">
                    {getIcon(activity.type)}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{activity.title || "Activity"}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.date || new Date().toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(activity.isTournamentFull)}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  // Member growth chart
  const MemberGrowthChart = () => {
    const data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Members",
          data: stats.adherents.history,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: (context) => {
            const ctx = context.chart.ctx
            const gradient = ctx.createLinearGradient(0, 0, 0, 300)
            gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)")
            gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
            return gradient
          },
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(17, 24, 39, 0.9)",
          padding: 12,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          borderColor: "rgba(59, 130, 246, 0.5)",
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            title: (tooltipItems) => {
              return `${tooltipItems[0].label}`
            },
            label: (context) => {
              return [
                `Members: ${context.parsed.y}`,
                `Growth: ${
                  context.dataIndex > 0
                    ? (
                        ((context.parsed.y - data.datasets[0].data[context.dataIndex - 1]) /
                          data.datasets[0].data[context.dataIndex - 1]) *
                        100
                      ).toFixed(1) + "%"
                    : "N/A"
                }`,
              ]
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
            },
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    }

    return <Line data={data} options={options} />
  }

  // Revenue chart
  const RevenueChart = () => {
    const data = {
      labels: revenueData.labels,
      datasets: [
        {
          label: "Revenue (€)",
          data: revenueData.data,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "rgba(20, 184, 166, 0.8)");
            gradient.addColorStop(1, "rgba(20, 184, 166, 0.3)");
            return gradient;
          },
          borderRadius: 6,
          borderWidth: 0,
          hoverBackgroundColor: "rgba(20, 184, 166, 1)",
        },
      ],
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(17, 24, 39, 0.9)",
          padding: 12,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          borderColor: "rgba(20, 184, 166, 0.5)",
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            title: (tooltipItems) => {
              return `${tooltipItems[0].label}`;
            },
            label: (context) => {
              return [
                `Revenue: ${context.parsed.y}€`,
                `Growth: ${
                  context.dataIndex > 0
                    ? (
                        ((context.parsed.y -
                          data.datasets[0].data[context.dataIndex - 1]) /
                          data.datasets[0].data[context.dataIndex - 1]) *
                        100
                      ).toFixed(1) + "%"
                    : "N/A"
                }`,
              ];
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
            },
            callback: (value) => value + "€",
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
            },
          },
        },
      },
    }; // ✅ fixed: semicolon here (instead of comma)
  
    return <Line data={data} options={options} />;
  };
  
  const OrderStatusChart = () => {
    const data = {
      labels: orderStatusData.labels,
      datasets: [
        {
          data: orderStatusData.data,
          backgroundColor: orderStatusData.colors,
          borderWidth: 0,
          hoverOffset: 15,
        },
      ],
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          position: "right",
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              family: "'Inter', sans-serif",
              size: 12,
            },
            generateLabels: (chart) => {
              const datasets = chart.data.datasets;
              return chart.data.labels.map((label, i) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);
                return {
                  text: `${label}: ${datasets[0].data[i]}`,
                  fillStyle: datasets[0].backgroundColor[i],
                  strokeStyle: datasets[0].backgroundColor[i],
                  lineWidth: 0,
                  hidden: false,
                  index: i,
                  fontColor: "#64748b",
                };
              });
            },
          },
          onClick: () => {}, // Disable default legend click behavior
        },
        tooltip: {
          backgroundColor: "rgba(17, 24, 39, 0.9)",
          padding: 12,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          borderWidth: 1,
          displayColors: true,
          callbacks: {
            label: (context) => {
              const value = context.raw;
              const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return [
                `${context.label}: ${value} orders`,
                `Percentage: ${percentage}%`,
              ];
            },
          },
        },
      },
    }; // ✅ fixed: semicolon here (instead of comma)
  
    return (
      <div className="relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <p className="text-gray-500 text-xs">Total</p>
          <p className="text-2xl font-bold text-gray-800 font-display">
            {orderStatusData.data.reduce((a, b) => a + b, 0)}
          </p>
        </div>
      </div>
    );
  };
  

  // Activity distribution chart
  const ActivityDistributionChart = () => {
    const data = {
      labels: activityDistribution.labels,
      datasets: [
        {
          data: activityDistribution.data,
          backgroundColor: activityDistribution.colors,
          borderWidth: 0,
          hoverOffset: 15,
        },
      ],
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          position: "right",
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              family: "'Inter', sans-serif",
              size: 12,
            },
            generateLabels: (chart) => {
              const datasets = chart.data.datasets
              return chart.data.labels.map((label, i) => {
                const meta = chart.getDatasetMeta(0)
                const style = meta.controller.getStyle(i)
                
                return {
                  text: `${label}: ${datasets[0].data[i]}`,
                  fillStyle: datasets[0].backgroundColor[i],
                  strokeStyle: datasets[0].backgroundColor[i],
                  lineWidth: 0,
                  hidden: false,
                  index: i,
                  fontColor: "#64748b",
                }
              })
            },
          },
          onClick: () => {}, // Disable default legend click behavior
        },
        tooltip: {
          backgroundColor: "rgba(17, 24, 39, 0.9)",
          padding: 12,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          borderWidth: 1,
          displayColors: true,
          callbacks: {
            label: (context) => {
              const value = context.raw
              const total = context.dataset.data.reduce((acc, val) => acc + val, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return [
                `${context.label}: ${value} activities`,
                `Percentage: ${percentage}%`,
              ]
            },
          },
        },
      },
    }

    return (
      <div className="relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <p className="text-gray-500 text-xs">Total</p>
          <p className="text-2xl font-bold text-gray-800 font-display">
            {activityDistribution.data.reduce((a, b) => a + b, 0)}
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="h-8 w-8 text-teal-500" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl flex font-bold bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Dashboard
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <Sparkles className="ml-2 h-6 w-6 text-yellow-500" />
            </motion.span>
          </h1>
          <p className="text-gray-600 mt-1">Welcome to your administration panel</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            fetchDashboardData()
          }}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
        >
          <motion.span
            animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: refreshing ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
          </motion.span>
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </motion.button>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 bg-white rounded-xl shadow-sm p-1 border border-gray-100 flex"
      >
        <motion.button
          whileHover={{ backgroundColor: activeTab === "overview" ? "" : "rgba(0,0,0,0.05)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            activeTab === "overview"
              ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md"
              : "text-gray-600"
          }`}
        >
          Overview
        </motion.button>
        <motion.button
          whileHover={{ backgroundColor: activeTab === "members" ? "" : "rgba(0,0,0,0.05)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab("members")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            activeTab === "members"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
              : "text-gray-600"
          }`}
        >
          Members
        </motion.button>
        <motion.button
          whileHover={{ backgroundColor: activeTab === "activities" ? "" : "rgba(0,0,0,0.05)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab("activities")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            activeTab === "activities"
              ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-md"
              : "text-gray-600"
          }`}
        >
          Activities
        </motion.button>
        <motion.button
          whileHover={{ backgroundColor: activeTab === "orders" ? "" : "rgba(0,0,0,0.05)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab("orders")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            activeTab === "orders"
              ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md"
              : "text-gray-600"
          }`}
        >
          Orders
        </motion.button>
      </motion.div>

      {/* Stats Overview */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              <StatCard
                title="Members"
                value={stats.adherents.count}
                trend={stats.adherents.trend}
                icon={<Users className="w-6 h-6 text-white" />}
                color="text-white"
                bgColor="bg-gradient-to-r from-blue-500 to-indigo-600"
              />

              <StatCard
                title="Tournaments"
                value={stats.tournaments.count}
                trend={stats.tournaments.trend}
                icon={<Trophy className="w-6 h-6 text-white" />}
                color="text-white"
                bgColor="bg-gradient-to-r from-yellow-500 to-amber-600"
              />

              <StatCard
                title="Trips"
                value={stats.trips.count}
                trend={stats.trips.trend}
                icon={<MapPin className="w-6 h-6 text-white" />}
                color="text-white"
                bgColor="bg-gradient-to-r from-red-500 to-rose-600"
              />

              <StatCard
                title="Friendly Matches"
                value={stats.friendlyMatches.count}
                trend={stats.friendlyMatches.trend}
                icon={<Activity className="w-6 h-6 text-white" />}
                color="text-white"
                bgColor="bg-gradient-to-r from-green-500 to-emerald-600"
              />

              <StatCard
                title="Orders"
                value={stats.orders.count}
                trend={stats.orders.trend}
                icon={<ShoppingBag className="w-6 h-6 text-white" />}
                color="text-white"
                bgColor="bg-gradient-to-r from-purple-500 to-pink-600"
              />

              <StatCard
                title="Revenue"
                value={`${stats.revenue.amount.toLocaleString()} €`}
                trend={stats.revenue.trend}
                icon={<DollarSign className="w-6 h-6 text-white" />}
                color="text-white"
                bgColor="bg-gradient-to-r from-teal-500 to-emerald-600"
              />
            </motion.div>

            {/* Charts Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              <ChartCard title="Member Growth" icon={<LineChart className="w-5 h-5 text-blue-500" />}>
                <MemberGrowthChart />
              </ChartCard>

              <ChartCard title="Monthly Revenue" icon={<BarChart3 className="w-5 h-5 text-teal-500" />}>
                <RevenueChart />
              </ChartCard>

              <ChartCard title="Order Status Distribution" icon={<PieChart className="w-5 h-5 text-purple-500" />}>
                <OrderStatusChart />
              </ChartCard>

              <ChartCard title="Activity Distribution" icon={<PieChart className="w-5 h-5 text-yellow-500" />}>
                <ActivityDistributionChart />
              </ChartCard>
            </motion.div>

            {/* Recent Activity Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6"
            >
              <RecentActivity />
            </motion.div>

            {/* Quick Info Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 transition-all duration-300"
              >
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800">Member Engagement</h3>
                    <p className="text-sm text-blue-600 mt-1">
                      {Math.round(stats.adherents.count * 0.75)} members are actively participating in club activities
                      this month.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 transition-all duration-300"
              >
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800">Upcoming Events</h3>
                    <p className="text-sm text-green-600 mt-1">
                      {stats.tournaments.count + stats.friendlyMatches.count} events are scheduled for the next 30 days.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 transition-all duration-300"
              >
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-purple-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-purple-800">Shop Performance</h3>
                    <p className="text-sm text-purple-600 mt-1">
                      Average order value is {Math.round(stats.revenue.amount / stats.orders.count)}€ with a{" "}
                      {stats.revenue.trend}% increase.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "members" && (
          <motion.div
            key="members"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 font-display">Member Analytics</h2>
            <div className="h-64">
              <MemberGrowthChart />
            </div>
          </motion.div>
        )}

        {activeTab === "activities" && (
          <motion.div
            key="activities"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 font-display">Activity Analytics</h2>
            <div className="h-64">
              <ActivityDistributionChart />
            </div>
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 font-display">Order Analytics</h2>
            <div className="h-64">
              <OrderStatusChart />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
