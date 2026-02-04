"use client";

import { Star, Loader2, Search, Filter, Flame, Users, FileText, Calendar, Trophy, Zap, Target, Shield, Award } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChallengesPage() {
  const [challengesData, setChallengesData] = useState<any[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  const getChallenges = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/challenges', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setChallengesData(data);
      setFilteredChallenges(data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter challenges based on search term and difficulty
  useEffect(() => {
    setIsFiltering(true);
    
    const timer = setTimeout(() => {
      let filtered = challengesData;
      
      if (searchTerm) {
        filtered = filtered.filter(challenge => 
          challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          challenge.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (difficultyFilter !== "all") {
        filtered = filtered.filter(challenge => 
          challenge.difficulty === difficultyFilter
        );
      }
      
      setFilteredChallenges(filtered);
      setIsFiltering(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, difficultyFilter, challengesData]);

  useEffect(() => {
    getChallenges();
  }, []);

  const getDifficultyBadge = (difficulty: string) => {
    const config = {
      easy: {
        color: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
        icon: "🌱",
        label: "Beginner"
      },
      medium: {
        color: "bg-amber-500/10 text-amber-700 border-amber-200",
        icon: "🔥",
        label: "Intermediate"
      },
      hard: {
        color: "bg-rose-500/10 text-rose-700 border-rose-200",
        icon: "⚡",
        label: "Advanced"
      }
    };
    
    const style = config[difficulty as keyof typeof config] || config.easy;
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${style.color} flex items-center gap-1.5`}>
        <span className="text-sm">{style.icon}</span>
        {style.label}
      </span>
    );
  };

  const getStatusBadge = (challenge: any) => {
    if (challenge.join && challenge.status === "in_progress") {
      return (
        <span className="bg-blue-500/10 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 flex items-center gap-1.5">
          <Zap className="w-3 h-3" />
          In Progress
        </span>
      );
    } else if (challenge.join) {
      return (
        <span className="bg-emerald-500/10 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
          <Award className="w-3 h-3" />
          Completed
        </span>
      );
    }
    return null;
  };

  const getXPDisplay = (xp: number) => {
    return (
      <div className="flex items-center gap-2 bg-linear-to-r from-indigo-500/5 to-purple-500/5 px-4 py-2 rounded-xl border border-indigo-100">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <Trophy className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Reward</p>
          <p className="text-lg font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            +{xp} XP
          </p>
        </div>
      </div>
    );
  };

  const getCardGradient = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "from-white to-emerald-50 hover:to-emerald-100";
      case "medium":
        return "from-white to-amber-50 hover:to-amber-100";
      case "hard":
        return "from-white to-rose-50 hover:to-rose-100";
      default:
        return "from-white to-gray-50 hover:to-gray-100";
    }
  };

  const getCardBorder = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "border-emerald-200 hover:border-emerald-400";
      case "medium":
        return "border-amber-200 hover:border-amber-400";
      case "hard":
        return "border-rose-200 hover:border-rose-400";
      default:
        return "border-gray-200 hover:border-indigo-300";
    }
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Box */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search challenges by title or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 placeholder-neutral-400 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>
            
            {/* Difficulty Filter */}
            <div className="relative">
                <div className="w-full flex justify-end">
                  <Link 
                    href={'/members/leaderBoard'} 
                    className="group inline-flex items-center gap-3 font-semibold text-white py-3 px-6 text-sm border-0 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                      <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold">View Leaderboard</div>
                        <div className="text-xs text-indigo-100 font-normal">See top performers</div>
                      </div>
                      <Star className="w-4 h-4 text-amber-300 ml-2" />
                  </Link>
              </div>
            </div>
          </div>
          
          {/* Quick Filter Chips */}
          <div className="flex flex-wrap gap-3 mt-6">
            {["all", "easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  difficultyFilter === level
                    ? level === "easy" 
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm"
                      : level === "medium"
                      ? "bg-amber-100 text-amber-700 border border-amber-300 shadow-sm"
                      : level === "hard"
                      ? "bg-rose-100 text-rose-700 border border-rose-300 shadow-sm"
                      : "bg-indigo-100 text-indigo-700 border border-indigo-300 shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                {level === "all" && "All Challenges"}
                {level === "easy" && "🌱 Easy"}
                {level === "medium" && "🔥 Medium"}
                {level === "hard" && "⚡ Hard"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-screen text-gray-800">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-linear-to-r from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
              <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 animate-spin text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-3">Loading Challenges</h2>
            <p className="text-gray-600 text-center max-w-md">Preparing exciting challenges to boost your skills...</p>
            <div className="w-72 h-2 bg-gray-200 rounded-full mt-8 overflow-hidden">
              <div className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        ) : (
          /* Challenges Grid */
          <div className="space-y-6">
            {/* Header Stats */}
            <div className="flex items-center justify-between mb-2">
              {isFiltering && (
                <div className="flex items-center gap-3 px-4 py-2 bg-amber-50 rounded-lg border border-amber-200">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  <span className="text-sm text-amber-700">Filtering challenges...</span>
                </div>
              )}
            </div>
            
            {/* Challenges Grid */}
            {filteredChallenges.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredChallenges.map((challenge) => (
                  <Link 
                    href={`/members/challenges/${challenge.id}`}
                    key={challenge.id}
                    className={`relative bg-linear-to-br from-white to-gray-50  ${getCardBorder(challenge.difficulty)} rounded-md p-6 hover:scale-101 transition-all duration-300 shadow-sm hover:shadow-xl`}
                  >
                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/0 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative">
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              challenge.difficulty === "easy" ? "bg-emerald-100" :
                              challenge.difficulty === "medium" ? "bg-amber-100" :
                              "bg-rose-100"
                            }`}>
                              {challenge.difficulty === "easy" ? "🌱" :
                              challenge.difficulty === "medium" ? "🔥" : "⚡"}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {challenge.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                {getDifficultyBadge(challenge.difficulty)}
                                {getStatusBadge(challenge)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description/Stats */}
                      <div className="mb-6">
                        <p className="text-gray-600 line-clamp-2 mb-4">
                          {challenge.description || "Test your programming skills with this challenge."}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="ld:flex items-center justify-between pt-6 border-t border-gray-100">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500">
                              <FileText className="w-4 h-4" />
                              <span className="font-medium">{challenge.test_cases_count} tests</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500">
                              <Users className="w-4 h-4" />
                              <span className="font-medium">{challenge.participants_count} participants</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">{new Date(challenge.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {challenge.tags && challenge.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {challenge.tags.slice(0, 2).map((tag: string, index: number) => (
                                <span key={index} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                                  {tag}
                                </span>
                              ))}
                              {challenge.tags.length > 2 && (
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                                  +{challenge.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mt-4 w-full">
                          {/* {getXPDisplay(challenge.xp_reward)} */}
                          <div className="w-full h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : !isFiltering && (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-40 h-40 mx-auto mb-6">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-linear-to-r from-gray-200 to-gray-300 opacity-50"></div>
                    <Target className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">No Challenges Found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  {searchTerm 
                    ? `No challenges match "${searchTerm}". Try a different search term.`
                    : "No challenges match your current filters. Try selecting a different difficulty level."}
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setDifficultyFilter("all");
                  }}
                  className="px-6 py-3 bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}