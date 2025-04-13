"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Adherents from "./Adherents";
import Activities from "./Activities";
import Commandes from "./Commandes";
import ProfilAdmin from "./ProfilAdmin";
import Products from "./Products";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is an admin
    const token = localStorage.getItem("token");

    // For development, we'll skip the authentication check
    setAdminUser({
      username: "Admin User",
      email: "admin@example.com",
      role: "ADMIN",
    });

    setIsLoading(false);
  }, []);

  // Animation variants for page transitions
  const pageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
  };

  // Render the active component based on the selected tab
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "adherents":
        return <Adherents />;
      case "activities":
        return <Activities />;
      case "commandes":
        return <Commandes />;
      case "profile":
        return <ProfilAdmin user={adminUser} />;
      case "products":
        return <Products />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <motion.main
        className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
        key={activeTab}
      >
        {renderContent()}
      </motion.main>
    </div>
  );
}
