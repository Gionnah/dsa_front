"use client";

import { Star, Loader2, Search, Filter, Flame, Users, FileText, Calendar, Trophy, Zap, Target, Shield, Award, ArrowRight, Clock } from "lucide-react";
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
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${style.color} flex items-center gap-1.5 whitespace-nowrap`}>
        <span className="text-sm">{style.icon}</span>
        {style.label}
      </span>
    );
  };

  const getStatusBadge = (challenge: any) => {
    if (challenge.join && challenge.status === "in_progress") {
      return (
        <span className="bg-blue-500/10 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 flex items-center gap-1.5 whitespace-nowrap">
          <Zap className="w-3 h-3" />
          In Progress
        </span>
      );
    } else if (challenge.join) {
      return (
        <span className="bg-emerald-500/10 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200 flex items-center gap-1.5 whitespace-nowrap">
          <Award className="w-3 h-3" />
          Completed
        </span>
      );
    }
    return null;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return {
          gradient: "from-emerald-500/5 via-emerald-500/10 to-emerald-500/5",
          border: "border-emerald-200/50 hover:border-emerald-400",
          glow: "hover:shadow-emerald-200/50",
          icon: "bg-linear-to-br from-emerald-400 to-emerald-600"
        };
      case "medium":
        return {
          gradient: "from-amber-500/5 via-amber-500/10 to-amber-500/5",
          border: "border-amber-200/50 hover:border-amber-400",
          glow: "hover:shadow-amber-200/50",
          icon: "bg-linear-to-br from-amber-400 to-amber-600"
        };
      case "hard":
        return {
          gradient: "from-rose-500/5 via-rose-500/10 to-rose-500/5",
          border: "border-rose-200/50 hover:border-rose-400",
          glow: "hover:shadow-rose-200/50",
          icon: "bg-linear-to-br from-rose-400 to-rose-600"
        };
      default:
        return {
          gradient: "from-gray-500/5 via-gray-500/10 to-gray-500/5",
          border: "border-gray-200/50 hover:border-gray-400",
          glow: "hover:shadow-gray-200/50",
          icon: "bg-linear-to-br from-gray-400 to-gray-600"
        };
    }
  };

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header Section */}
        {/* <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Code Challenges
              </h1>
              <p className="text-gray-600">Master your skills through practice and competition</p>
            </div>
            
            <Link 
              href={'/members/leaderBoard'} 
              className="group inline-flex items-center gap-3 font-semibold text-white py-3.5 px-6 text-sm rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold">Leaderboard</div>
                <div className="text-xs text-indigo-100 font-normal">Top performers</div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div> */}

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
            {/* Search Box */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search challenges by title or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 placeholder-neutral-400 bg-gray-50/50 border border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-300 text-gray-700"
                />
              </div>
            </div>
            
            {/* Quick Filter Chips */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {["all", "easy", "medium", "hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficultyFilter(level)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      difficultyFilter === level
                        ? level === "easy" 
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                          : level === "medium"
                          ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                          : level === "hard"
                          ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
                          : "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
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

            {/* Results Counter */}
            {!isLoading && !isFiltering && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-indigo-600">{filteredChallenges.length}</span> challenge{filteredChallenges.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>

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
            {/* Filtering Indicator */}
            {isFiltering && (
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 rounded-xl border border-amber-200 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Filtering challenges...</span>
              </div>
            )}
            
            {/* Challenges Grid */}
            {filteredChallenges.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredChallenges.map((challenge) => {
                  const colors = getDifficultyColor(challenge.difficulty);
                  return (
                    <Link 
                      href={`/members/challenges/${challenge.id}`}
                      key={challenge.id}
                      className={`group relative bg-white border-2 ${colors.border} rounded-2xl overflow-hidden hover:shadow-2xl ${colors.glow} transition-all duration-300 hover:-translate-y-1`}
                    >
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-linear-to-br ${colors.gradient} opacity-50`}></div>
                      
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <div className="relative p-6">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-14 h-14 rounded-xl ${colors.icon} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                            {challenge.difficulty === "easy" ? "🌱" :
                            challenge.difficulty === "medium" ? "🔥" : "⚡"}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                              {challenge.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                              {getDifficultyBadge(challenge.difficulty)}
                              {getStatusBadge(challenge)}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                          {challenge.description || "Test your programming skills with this challenge."}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          <div className="bg-gray-50/50 rounded-lg p-3 text-center border border-gray-100">
                            <FileText className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-500 mb-0.5">Tests</p>
                            <p className="text-sm font-bold text-gray-900">{challenge.test_cases_count}</p>
                          </div>
                          
                          <div className="bg-gray-50/50 rounded-lg p-3 text-center border border-gray-100">
                            <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-500 mb-0.5">Participants</p>
                            <p className="text-sm font-bold text-gray-900">{challenge.participants_count}</p>
                          </div>
                          
                          <div className="bg-gray-50/50 rounded-lg p-3 text-center border border-gray-100">
                            <Trophy className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-500 mb-0.5">XP</p>
                            <p className="text-sm font-bold text-gray-900">{challenge.xp_reward || 100}</p>
                          </div>
                        </div>

                        {/* Tags */}
                        {challenge.tags && challenge.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {challenge.tags.slice(0, 3).map((tag: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-100">
                                {tag}
                              </span>
                            ))}
                            {challenge.tags.length > 3 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg border border-gray-200">
                                +{challenge.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(challenge.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium text-sm group-hover:shadow-lg group-hover:from-indigo-700 group-hover:to-purple-700 transition-all">
                            Start Challenge
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : !isFiltering && (
              /* Empty State */
              <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-linear-to-r from-gray-200 to-gray-300 rounded-full opacity-50 animate-pulse"></div>
                  <Target className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-gray-400" />
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
                  className="px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
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