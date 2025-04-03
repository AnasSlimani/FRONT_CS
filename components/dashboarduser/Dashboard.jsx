"use client"

import { motion } from "framer-motion"
import { Trophy, Users, Calendar, TrendingUp, Award, Clock, Activity, BarChart3 } from "lucide-react"

const Dashboard = () => {
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
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  // Sample data for statistics
  const stats = [
    {
      title: "Tournaments",
      value: "12",
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      color: "from-yellow-400 to-yellow-600",
      change: "+3 this month",
    },
    {
      title: "Teams Joined",
      value: "5",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      color: "from-blue-400 to-blue-600",
      change: "+1 this month",
    },
    {
      title: "Upcoming Events",
      value: "3",
      icon: <Calendar className="w-6 h-6 text-teal-500" />,
      color: "from-teal-400 to-teal-600",
      change: "Next: Football Tournament",
    },
    {
      title: "Performance",
      value: "87%",
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      color: "from-green-400 to-green-600",
      change: "+12% from last month",
    },
  ]

  // Sample data for recent achievements
  const achievements = [
    {
      title: "Tournament MVP",
      description: "Recognized as the Most Valuable Player in the Basketball Championship",
      date: "Oct 15, 2023",
      icon: <Award className="w-10 h-10 text-yellow-500" />,
    },
    {
      title: "Team Captain",
      description: "Appointed as captain of the Football Team Alpha",
      date: "Sep 28, 2023",
      icon: <Users className="w-10 h-10 text-blue-500" />,
    },
    {
      title: "Perfect Attendance",
      description: "Attended all training sessions for 3 consecutive months",
      date: "Aug 10, 2023",
      icon: <Clock className="w-10 h-10 text-green-500" />,
    },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto">
      {/* Welcome section */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Welcome back, <span className="text-teal-600">John!</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Here's what's happening with your sporting activities today.
        </p>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{stat.title}</h3>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}>{stat.icon}</div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
                </div>
                <div className="h-12 w-24">
                  {/* Placeholder for mini chart */}
                  <div className="h-full w-full flex items-end space-x-1">
                    {[40, 70, 30, 60, 50, 80, 90].map((height, i) => (
                      <div
                        key={i}
                        className={`w-2 bg-gradient-to-t ${stat.color} rounded-t-sm`}
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity and Achievements section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity chart */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-teal-500" />
              Activity Overview
            </h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-teal-100 text-teal-700 rounded-md dark:bg-teal-700 dark:text-teal-100">
                Weekly
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-300">
                Monthly
              </button>
            </div>
          </div>

          {/* Activity chart placeholder */}
          <div className="h-64 w-full">
            <div className="h-full w-full flex items-end justify-between px-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <div
                    className="w-12 bg-gradient-to-t from-teal-500 to-teal-300 rounded-t-lg"
                    style={{ height: `${Math.random() * 70 + 30}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Hours</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">24.5</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Sessions</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">12</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Duration</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">2.1h</p>
            </div>
          </div>
        </motion.div>

        {/* Recent achievements */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Recent Achievements
            </h2>
            <button className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">{achievement.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{achievement.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{achievement.date}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-colors duration-300">
            Complete Challenges
          </button>
        </motion.div>
      </div>

      {/* Performance section */}
      <motion.div variants={itemVariants} className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-teal-500" />
            Performance Metrics
          </h2>
          <div className="flex space-x-2">
            <select className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md px-3 py-1 text-sm">
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Skill radar chart placeholder */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-200 dark:border-gray-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-200 dark:border-gray-600"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-dashed border-gray-200 dark:border-gray-600"></div>
                </div>

                {/* Skill points */}
                {[
                  { name: "Speed", value: 0.8, angle: 0 },
                  { name: "Strength", value: 0.7, angle: 72 },
                  { name: "Technique", value: 0.9, angle: 144 },
                  { name: "Teamwork", value: 0.85, angle: 216 },
                  { name: "Endurance", value: 0.75, angle: 288 },
                ].map((skill, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      transform: `rotate(${skill.angle}deg) translateY(-${skill.value * 60}px) rotate(-${skill.angle}deg)`,
                    }}
                  >
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {skill.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress bars */}
          <div className="md:col-span-2 space-y-4">
            {[
              { name: "Football", progress: 85, color: "bg-blue-500" },
              { name: "Basketball", progress: 70, color: "bg-orange-500" },
              { name: "Billard", progress: 90, color: "bg-green-500" },
              { name: "Team Leadership", progress: 75, color: "bg-purple-500" },
            ].map((skill, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <motion.div
                    className={`h-2.5 rounded-full ${skill.color}`}
                    style={{ width: `${skill.progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard

