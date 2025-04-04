"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Activity from "./Activity"
import api from "@/app/api/axios";

const Content = ({ activeFilter }) => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch activities on component mount and when activeFilter changes
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await api.get('/activities');
        setActivities(response.data);

        filterActivities(response.data, activeFilter);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
        console.log(activities);

      }
    };

    fetchActivities();
    
  }, [activeFilter]); // Only depend on activeFilter

  // Separate filtering function
  const filterActivities = (activitiesToFilter, filter) => {
    let result = [...activitiesToFilter];
    
    if (filter === "all") {
      setFilteredActivities(result);
    } else if (filter === "tournaments") {
      result = result.filter((activity) => activity.type === "tournament");
      setFilteredActivities(result);
    } else if (filter === "deplacements") {
      result = result.filter((activity) => activity.type === "deplacement");
      setFilteredActivities(result);
    } else if (filter === "matchAmicaux") {
      result = result.filter((activity) => activity.type === "MATCH_AMICAL");
    }
    setFilteredActivities(result);
  };

  if (loading) {
    return <div className="text-center py-16">Loading activities...</div>;
  }

  if (filteredActivities.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No activities found</h3>
        <p className="text-gray-500">Try changing your filter selection</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15"
        >
          {filteredActivities.map((activity) => (
            <Activity key={activity.id} activity={activity} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Content;