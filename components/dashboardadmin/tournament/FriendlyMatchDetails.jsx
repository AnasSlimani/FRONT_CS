"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  User,
  Loader2,
  AlertCircle,
  RefreshCw,
  Check,
  Trophy,
  Clock,
  Plus,
  X,
  Trash2,
  ChevronDown,
  Sparkles,
  ArrowDown,
  BarChart,
  Award,
  Save,
} from "lucide-react";
import api from "@/app/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/inpute";
import AvatarImage from "@/components/ui/avatar-image";
import confetti from "canvas-confetti";

const FriendlyMatchDetails = ({ activityId }) => {
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState({ teamA: [], teamB: [] });
  const [matchResult, setMatchResult] = useState({
    scoreTeamA: "0",
    scoreTeamB: "0",
    goalScorers: [],
    status: "pending", // pending, played
  });
  const [isGeneratingTeams, setIsGeneratingTeams] = useState(false);
  const [isSavingResult, setIsSavingResult] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [showScorerSelector, setShowScorerSelector] = useState(false);
  const [selectedTeamForGoal, setSelectedTeamForGoal] = useState(null);
  const [activeTab, setActiveTab] = useState("teams");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const confettiRef = useRef(null);

  // Run confetti animation
  const runConfetti = () => {
    if (confettiRef.current) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#1d4ed8", "#2563eb", "#60a5fa"],
      });
    }
  };

  useEffect(() => {
    const fetchActivityDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch activity details
        const activityResponse = await api.get(`/activities/${activityId}`);
        setActivity(activityResponse.data);

        // Fetch friendly match data if it exists
        try {
          const matchResponse = await api.get(
            `/friendly-matches/${activityId}`
          );
          if (matchResponse.data) {
            // Make sure we properly handle the goal scorers data
            const goalScorers = matchResponse.data.goalScorers || [];

            // Add a unique id for each goal scorer if it doesn't have one
            const goalScorersWithIds = goalScorers.map((g) => ({
              ...g,
              id: g.id || Date.now() + Math.random().toString(36).substr(2, 9),
            }));

            setTeams({
              teamA: matchResponse.data.teamA || [],
              teamB: matchResponse.data.teamB || [],
            });
            setMatchResult({
              scoreTeamA: matchResponse.data.scoreTeamA?.toString() || "0",
              scoreTeamB: matchResponse.data.scoreTeamB?.toString() || "0",
              goalScorers: goalScorersWithIds,
              status: matchResponse.data.status || "pending",
            });
            setHasExistingData(true);
          }
        } catch (matchErr) {
          // No existing match data, which is fine
          console.log("No existing match data found");
        }
      } catch (err) {
        console.error("Error fetching activity details:", err);
        setError("Failed to load match details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (activityId) {
      fetchActivityDetails();
    }
  }, [activityId]);

  const generateTeams = async () => {
    if (
      !activity ||
      !activity.individualParticipants ||
      activity.individualParticipants.length < 2
    ) {
      setError("Not enough participants to generate teams.");
      return;
    }

    setIsGeneratingTeams(true);
    setError(null);

    try {
      // Randomly shuffle the participants
      const shuffledParticipants = [...activity.individualParticipants].sort(
        () => 0.5 - Math.random()
      );

      // Split into two teams
      const halfLength = Math.ceil(shuffledParticipants.length / 2);
      const teamA = shuffledParticipants.slice(0, halfLength);
      const teamB = shuffledParticipants.slice(halfLength);

      // Save to backend
      const response = await api.post(`/friendly-matches`, {
        activityId,
        teamA,
        teamB,
        scoreTeamA: 0,
        scoreTeamB: 0,
        goalScorers: [],
        status: "pending",
      });

      setTeams({ teamA, teamB });
      setHasExistingData(true);

      showSuccess("Teams generated successfully!");
      setTimeout(() => runConfetti(), 300);
    } catch (err) {
      console.error("Error generating teams:", err);
      setError("Failed to generate teams. Please try again.");
    } finally {
      setIsGeneratingTeams(false);
    }
  };

  const handleScoreChange = (team, value) => {
    const numValue = Number.parseInt(value) || 0;

    setMatchResult((prev) => {
      // Calculate current goals for the team
      const currentGoals = prev.goalScorers.filter(
        (g) => g.team === team
      ).length;

      // If new score is higher, add new goal scorers
      if (numValue > currentGoals) {
        const newGoalScorers = [...prev.goalScorers];
        for (let i = currentGoals; i < numValue; i++) {
          newGoalScorers.push({
            id: Date.now() + i,
            playerId: "",
            playerName: "",
            team: team,
            minute: Math.floor(Math.random() * 90) + 1,
          });
        }

        return {
          ...prev,
          [team]: value,
          goalScorers: newGoalScorers,
        };
      }

      // If new score is lower, remove excess goal scorers
      else if (numValue < currentGoals) {
        // Get all goals not for this team
        const otherTeamGoals = prev.goalScorers.filter((g) => g.team !== team);
        // Get goals for this team and trim to the new score
        const thisTeamGoals = prev.goalScorers
          .filter((g) => g.team === team)
          .slice(0, numValue);

        return {
          ...prev,
          [team]: value,
          goalScorers: [...otherTeamGoals, ...thisTeamGoals],
        };
      }

      // If same number of goals, just update the score
      return {
        ...prev,
        [team]: value,
      };
    });
  };

  const addGoalScorer = (team) => {
    setMatchResult((prev) => {
      return {
        ...prev,
        goalScorers: [
          ...prev.goalScorers,
          {
            id: Date.now(),
            playerId: "",
            playerName: "",
            team: team,
            minute: Math.floor(Math.random() * 90) + 1,
          },
        ],
      };
    });
  };

  const removeGoalScorer = (id) => {
    setMatchResult((prev) => {
      return {
        ...prev,
        goalScorers: prev.goalScorers.filter((g) => g.id !== id),
      };
    });
  };

  const updateGoalScorer = (id, field, value) => {
    setMatchResult((prev) => {
      return {
        ...prev,
        goalScorers: prev.goalScorers.map((g) =>
          g.id === id ? { ...g, [field]: value } : g
        ),
      };
    });
  };

  const selectPlayerForGoal = (goalId, player, team) => {
    updateGoalScorer(goalId, "playerId", player.id);
    updateGoalScorer(goalId, "playerName", player.username);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const saveMatchResult = async () => {
    // Validate scores
    const scoreA = Number.parseInt(matchResult.scoreTeamA) || 0;
    const scoreB = Number.parseInt(matchResult.scoreTeamB) || 0;

    // Validate all goal scorers have players selected
    const hasUnassignedGoals = matchResult.goalScorers.some((g) => !g.playerId);
    if (hasUnassignedGoals) {
      setError("Please select a player for each goal.");
      return;
    }

    // Validate goal scorers count matches score
    const teamAGoals = matchResult.goalScorers.filter(
      (g) => g.team === "scoreTeamA"
    ).length;
    const teamBGoals = matchResult.goalScorers.filter(
      (g) => g.team === "scoreTeamB"
    ).length;

    if (teamAGoals !== scoreA || teamBGoals !== scoreB) {
      setError(
        `The number of goal scorers must match the score (Team A: ${scoreA}, Team B: ${scoreB}).`
      );
      return;
    }

    setIsSavingResult(true);
    setError(null);

    try {
      // Prepare goal scorers data - ensure we're sending the right format
      const goalScorersData = matchResult.goalScorers.map((g) => ({
        playerId: g.playerId,
        playerName: g.playerName,
        team: g.team,
        minute: g.minute,
      }));

      // Save match result to backend
      await api.put(`/friendly-matches/${activityId}`, {
        scoreTeamA: scoreA,
        scoreTeamB: scoreB,
        goalScorers: goalScorersData,
        status: "played",
      });

      setMatchResult((prev) => ({
        ...prev,
        status: "played",
      }));

      showSuccess("Match result saved successfully!");
      setTimeout(() => runConfetti(), 300);
    } catch (err) {
      console.error("Error saving match result:", err);
      setError("Failed to save match result. Please try again.");
    } finally {
      setIsSavingResult(false);
    }
  };

  const resetMatch = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset the match? All data will be lost."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/friendly-matches/${activityId}`);

      setTeams({ teamA: [], teamB: [] });
      setMatchResult({
        scoreTeamA: "0",
        scoreTeamB: "0",
        goalScorers: [],
        status: "pending",
      });
      setHasExistingData(false);

      showSuccess("Match reset successfully!");
    } catch (err) {
      console.error("Error resetting match:", err);
      setError("Failed to reset match. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-3" />
          <p className="text-blue-600 animate-pulse">
            Loading match details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start mb-6">
        <AlertCircle className="h-6 w-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-1">
            Error Loading Match
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start">
        <AlertCircle className="h-6 w-6 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-1">
            Match Not Found
          </h3>
          <p className="text-yellow-700">
            The requested match could not be found.
          </p>
        </div>
      </div>
    );
  }

  const hasGeneratedTeams = teams.teamA.length > 0 && teams.teamB.length > 0;
  const scoreTeamA = Number.parseInt(matchResult.scoreTeamA) || 0;
  const scoreTeamB = Number.parseInt(matchResult.scoreTeamB) || 0;
  const teamAGoalScorers = matchResult.goalScorers.filter(
    (g) => g.team === "scoreTeamA"
  );
  const teamBGoalScorers = matchResult.goalScorers.filter(
    (g) => g.team === "scoreTeamB"
  );

  // Check if scores match goal scorers
  const teamAGoalsMatch = teamAGoalScorers.length === scoreTeamA;
  const teamBGoalsMatch = teamBGoalScorers.length === scoreTeamB;

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100"
      ref={confettiRef}
    >
      {/* Success message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-center"
          >
            <Check className="h-5 w-5 mr-2 text-green-500" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-3 rounded-full mr-3">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Friendly Match Management</h2>
          </div>

          {hasGeneratedTeams && (
            <Button
              onClick={resetMatch}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Match
            </Button>
          )}
        </div>

        {hasGeneratedTeams && (
          <div className="mt-4 flex space-x-1">
            <button
              onClick={() => setActiveTab("teams")}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                activeTab === "teams"
                  ? "bg-white text-blue-700 shadow-lg"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <Users className="h-4 w-4 inline mr-1" />
              Teams
            </button>
            <button
              onClick={() => setActiveTab("result")}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                activeTab === "result"
                  ? "bg-white text-blue-700 shadow-lg"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <Trophy className="h-4 w-4 inline mr-1" />
              Match Result
            </button>
            <button
              onClick={() => setActiveTab("goals")}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                activeTab === "goals"
                  ? "bg-white text-blue-700 shadow-lg"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <Award className="h-4 w-4 inline mr-1" />
              Goal Scorers
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {hasGeneratedTeams ? (
          <div>
            {/* Teams Display */}
            {activeTab === "teams" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Team A */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border border-blue-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 border-b border-blue-200 flex justify-between items-center text-white">
                    <h4 className="font-semibold flex items-center text-lg">
                      <User className="h-5 w-5 mr-2" />
                      Team A
                    </h4>
                    <div className="px-3 py-1 bg-white rounded-full text-xs font-medium text-blue-700">
                      {teams.teamA.length} Players
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-b from-blue-50 to-white">
                    <ul className="space-y-2">
                      {teams.teamA.map((player) => (
                        <motion.li
                          key={player.id}
                          whileHover={{ x: 5 }}
                          className="flex items-center p-3 bg-white rounded-lg border border-blue-100 shadow-sm"
                        >
                          <div className="mr-3">
                            <AvatarImage
                              src={player.profilePicture || "/placeholder.svg"}
                              alt={player.username}
                              size={40}
                            />
                          </div>
                          <span className="font-medium text-gray-800">
                            {player.username}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Team B */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="border border-green-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 border-b border-green-200 flex justify-between items-center text-white">
                    <h4 className="font-semibold flex items-center text-lg">
                      <User className="h-5 w-5 mr-2" />
                      Team B
                    </h4>
                    <div className="px-3 py-1 bg-white rounded-full text-xs font-medium text-green-700">
                      {teams.teamB.length} Players
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-b from-green-50 to-white">
                    <ul className="space-y-2">
                      {teams.teamB.map((player) => (
                        <motion.li
                          key={player.id}
                          whileHover={{ x: 5 }}
                          className="flex items-center p-3 bg-white rounded-lg border border-green-100 shadow-sm"
                        >
                          <div className="mr-3">
                            <AvatarImage
                              src={player.profilePicture || "/placeholder.svg"}
                              alt={player.username}
                              size={40}
                            />
                          </div>
                          <span className="font-medium text-gray-800">
                            {player.username}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Match Result Tab */}
            {activeTab === "result" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2"
              >
                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <div className="bg-gradient-to-b from-gray-50 to-white p-8">
                    <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
                      Match Result
                    </h3>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="w-full md:w-2/5">
                        <div className="bg-blue-500 text-white text-center py-3 rounded-t-lg font-bold">
                          Team A
                        </div>
                        <div className="bg-gradient-to-b from-blue-50 to-white pt-6 pb-8 px-8 rounded-b-lg border border-blue-100 shadow-inner">
                          <Input
                            type="number"
                            value={matchResult.scoreTeamA}
                            onChange={(e) =>
                              handleScoreChange("scoreTeamA", e.target.value)
                            }
                            min="0"
                            className="block w-full text-5xl font-bold text-center text-blue-700 h-20 bg-white border-2 border-blue-300 focus:border-blue-500 shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="bg-gray-800 text-white font-bold text-xl px-6 py-3 rounded-lg shadow-md mb-2">
                          VS
                        </div>
                        <motion.div
                          animate={{
                            rotate: [0, 5, 0, -5, 0],
                          }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 5,
                            ease: "easeInOut",
                          }}
                        >
                          <BarChart className="h-10 w-10 text-gray-400" />
                        </motion.div>
                      </div>

                      <div className="w-full md:w-2/5">
                        <div className="bg-green-500 text-white text-center py-3 rounded-t-lg font-bold">
                          Team B
                        </div>
                        <div className="bg-gradient-to-b from-green-50 to-white pt-6 pb-8 px-8 rounded-b-lg border border-green-100 shadow-inner">
                          <Input
                            type="number"
                            value={matchResult.scoreTeamB}
                            onChange={(e) =>
                              handleScoreChange("scoreTeamB", e.target.value)
                            }
                            min="0"
                            className="block w-full text-5xl font-bold text-center text-green-700 h-20 bg-white border-2 border-green-300 focus:border-green-500 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mt-8">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center"
                        onClick={() => setActiveTab("goals")}
                      >
                        <ArrowDown className="h-5 w-5 mr-2" />
                        Continue to Goal Scorers
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Goal Scorers Tab */}
            {activeTab === "goals" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2"
              >
                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-4 text-white flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Goal Scorers
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-md transition-all"
                        onClick={() => {
                          setSelectedTeamForGoal("scoreTeamA");
                          addGoalScorer("scoreTeamA");
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Team A Goal
                      </button>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-md transition-all"
                        onClick={() => {
                          setSelectedTeamForGoal("scoreTeamB");
                          addGoalScorer("scoreTeamB");
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Team B Goal
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-b from-amber-50 to-white">
                    {/* Score summary */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-amber-100">
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">
                            Team A Goals
                          </div>
                          <div
                            className={`text-2xl font-bold ${
                              teamAGoalsMatch ? "text-blue-600" : "text-red-500"
                            }`}
                          >
                            {teamAGoalScorers.length} / {scoreTeamA}
                          </div>
                        </div>

                        <div className="text-center px-4">
                          <div className="text-sm text-gray-500 mb-1">
                            Total Score
                          </div>
                          <div className="text-2xl font-bold text-gray-800">
                            {scoreTeamA} - {scoreTeamB}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">
                            Team B Goals
                          </div>
                          <div
                            className={`text-2xl font-bold ${
                              teamBGoalsMatch
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {teamBGoalScorers.length} / {scoreTeamB}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Warning message if goals don't match score */}
                    {(!teamAGoalsMatch || !teamBGoalsMatch) && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-yellow-800 flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">
                            Goal scorers must match the score
                          </p>
                          <p className="text-sm mt-1">
                            Please add or remove goal scorers to match the final
                            score for each team.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Goal scorers list */}
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {matchResult.goalScorers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                          <p>
                            No goals added yet. Add goals using the buttons
                            above.
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Team A goals */}
                          {teamAGoalScorers.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-blue-700 font-medium mb-2 border-b border-blue-100 pb-1">
                                Team A Goals
                              </h4>
                              {teamAGoalScorers.map((goal) => (
                                <GoalScorerCard
                                  key={goal.id}
                                  goal={goal}
                                  team="A"
                                  players={teams.teamA}
                                  onUpdate={(field, value) =>
                                    updateGoalScorer(goal.id, field, value)
                                  }
                                  onRemove={() => removeGoalScorer(goal.id)}
                                  onSelectPlayer={(player) =>
                                    selectPlayerForGoal(
                                      goal.id,
                                      player,
                                      "scoreTeamA"
                                    )
                                  }
                                />
                              ))}
                            </div>
                          )}

                          {/* Team B goals */}
                          {teamBGoalScorers.length > 0 && (
                            <div>
                              <h4 className="text-green-700 font-medium mb-2 border-b border-green-100 pb-1">
                                Team B Goals
                              </h4>
                              {teamBGoalScorers.map((goal) => (
                                <GoalScorerCard
                                  key={goal.id}
                                  goal={goal}
                                  team="B"
                                  players={teams.teamB}
                                  onUpdate={(field, value) =>
                                    updateGoalScorer(goal.id, field, value)
                                  }
                                  onRemove={() => removeGoalScorer(goal.id)}
                                  onSelectPlayer={(player) =>
                                    selectPlayerForGoal(
                                      goal.id,
                                      player,
                                      "scoreTeamB"
                                    )
                                  }
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={
                          !teamAGoalsMatch || !teamBGoalsMatch || isSavingResult
                        }
                        className={`px-6 py-3 rounded-full font-bold flex items-center ${
                          !teamAGoalsMatch || !teamBGoalsMatch || isSavingResult
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                        }`}
                        onClick={saveMatchResult}
                      >
                        {isSavingResult ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Save Match Result
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-blue-50 to-white border border-blue-200 rounded-xl p-8 text-center shadow-lg"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: "easeInOut",
              }}
              className="mb-6"
            >
              <div className="bg-blue-100 p-4 rounded-full inline-block mx-auto">
                <Users className="h-16 w-16 text-blue-500" />
              </div>
            </motion.div>

            <h3 className="text-2xl font-bold text-blue-800 mb-3">
              Ready to Start the Match
            </h3>
            <p className="text-blue-700 mb-8 max-w-md mx-auto">
              Create two balanced teams from the available participants to begin
              the friendly match!
              {activity.individualParticipants && (
                <span className="block mt-2 font-medium">
                  {activity.individualParticipants.length} participants ready to
                  play
                </span>
              )}
            </p>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={generateTeams}
              disabled={
                isGeneratingTeams ||
                !activity.individualParticipants ||
                activity.individualParticipants.length < 2
              }
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg font-bold text-lg"
            >
              {isGeneratingTeams ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 inline-block animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2 inline-block" />
                  Generate Teams
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Goal Scorer Card Component
const GoalScorerCard = ({
  goal,
  team,
  players,
  onUpdate,
  onRemove,
  onSelectPlayer,
}) => {
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);

  const bgColor = team === "A" ? "bg-blue-50" : "bg-green-50";
  const borderColor = team === "A" ? "border-blue-200" : "border-green-200";
  const textColor = team === "A" ? "text-blue-700" : "text-green-700";
  const buttonBgColor = team === "A" ? "bg-blue-100" : "bg-green-100";
  const buttonHoverBgColor =
    team === "A" ? "hover:bg-blue-200" : "hover:bg-green-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${bgColor} ${borderColor} border rounded-lg p-4 mb-3 shadow-sm relative`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <button
              onClick={() => setShowPlayerSelector(!showPlayerSelector)}
              className={`flex-1 flex items-center justify-between ${
                goal.playerName ? "bg-white" : "bg-yellow-50"
              } border ${
                goal.playerName ? "border-gray-200" : "border-yellow-300"
              } rounded-lg p-2 ${textColor}`}
            >
              {goal.playerName ? (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">{goal.playerName}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                  <span className="text-yellow-700">Select player</span>
                </div>
              )}
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="flex items-center">
            <div className="w-24 flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              <input
                type="number"
                value={goal.minute}
                onChange={(e) =>
                  onUpdate(
                    "minute",
                    Math.max(
                      1,
                      Math.min(90, Number.parseInt(e.target.value) || 1)
                    )
                  )
                }
                min="1"
                max="90"
                className="w-12 border border-gray-300 rounded p-1 text-center text-sm"
              />
              <span className="ml-1 text-sm text-gray-500">min</span>
            </div>
          </div>
        </div>

        <button
          onClick={onRemove}
          className="ml-2 p-1.5 bg-white rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Player selector dropdown */}
      <AnimatePresence>
        {showPlayerSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg overflow-hidden"
          >
            <div
              className={`${textColor} ${buttonBgColor} p-2 text-sm font-medium flex justify-between items-center`}
            >
              <span>Select a player</span>
              <button
                onClick={() => setShowPlayerSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-36 overflow-y-auto">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`p-2 flex items-center cursor-pointer ${
                    player.id === goal.playerId
                      ? buttonBgColor
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    onSelectPlayer(player);
                    setShowPlayerSelector(false);
                  }}
                >
                  <div className="mr-2">
                    <AvatarImage
                      src={player.profilePicture || "/placeholder.svg"}
                      alt={player.username}
                      size={24}
                    />
                  </div>
                  <span className="text-sm font-medium">{player.username}</span>
                  {player.id === goal.playerId && (
                    <Check className="ml-auto h-4 w-4 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FriendlyMatchDetails;
