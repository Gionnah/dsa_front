"use client";

import { useEffect, useState } from "react";
import { Trophy, Target, TrendingUp, Award, Clock, Zap } from "lucide-react";
import HomeLayout from "@/components/layout/HomeLayout";

export default function Dashboard() {
    const [userDetails, setUserDetails] = useState<any>(null);
    const [isDark, setIsDark] = useState(true);

    const getUserDetails = async () => {
        const response = await fetch('/api/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setUserDetails(data);
    }

    useEffect(() => {
        getUserDetails();
        
        // Vérifier la préférence de thème système
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(darkModeMediaQuery.matches);
        
        const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
        darkModeMediaQuery.addEventListener('change', handleChange);
        
        return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    }, []);

    const calculateRankPercentage = () => {
        if (!userDetails?.stat?.ranking) return 0;
        const { global_rank, total_users } = userDetails.stat.ranking;
        return ((total_users - global_rank) / total_users) * 100;
    };

    const getCurrentChallenge = () => {
        if (!userDetails?.challenges) return null;
        return userDetails.challenges.find((challenge: any) => challenge.status === "in_progress");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Classes CSS pour le mode sombre
    const bgPrimary = isDark ? "bg-neutral-900" : "bg-neutral-50";
    const bgCard = isDark ? "bg-black/30" : "bg-white";
    const bgSecondary = isDark ? "bg-neutral-700" : "bg-neutral-50";
    const borderColor = isDark ? "border-neutral-600" : "border-neutral-200";
    const textPrimary = isDark ? "text-white" : "text-neutral-800";
    const textSecondary = isDark ? "text-neutral-300" : "text-neutral-500";
    const textMuted = isDark ? "text-neutral-400" : "text-neutral-500";
    const ringColor = isDark ? "stroke-neutral-600" : "stroke-neutral-300";
    const progressBg = isDark ? "bg-neutral-600" : "bg-neutral-200";
    const progressFill = isDark ? "bg-green-400" : "bg-neutral-700";
    const buttonBg = isDark ? "bg-black/30 shadow-lg hover:bg-neutral-600 cursor-pointer" : "cursor-pointer bg-neutral-800 hover:bg-neutral-900";
    const avatarBg = isDark ? "bg-neutral-700" : "bg-neutral-100";
    const avatarText = isDark ? "text-neutral-300" : "text-neutral-700";

    return (
        <HomeLayout>
            <div className={`min-h-screen ${bgPrimary} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <section className={`relative bg-linear-to-b from-indigo-950 shadow-lg rounded-2xl p-8 mb-6 shadow-black border ${borderColor} transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                {/* Avatar */}
                                <div className={`w-24 h-24 rounded-xl bg-cyan-900/20 flex items-center justify-center border-4 border-cyan-600/5 transition-colors duration-300`}>
                                    <span className={`text-4xl font-bold ${avatarText}`}>
                                        {userDetails?.stat?.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                
                                <div>
                                    <h3 className={`text-3xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
                                        {userDetails?.stat?.user?.prenom && userDetails?.stat?.user?.nom 
                                            ? `${userDetails.stat.user.prenom} ${userDetails.stat.user.nom}`
                                            : userDetails?.stat?.user?.username || 'User'}
                                    </h3>
                                    <p className={`${textSecondary} text-base mb-3 flex items-center gap-2 transition-colors duration-300`}>
                                        <Award className="w-4 h-4" />
                                        Member
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-4 py-1.5 ${bgSecondary} rounded-lg text-sm font-medium ${textPrimary} flex items-center gap-2 border ${borderColor} transition-colors duration-300`}>
                                            <Zap className="w-4 h-4" />
                                            {userDetails?.stat?.user?.total_xp || 0} XP
                                        </span>
                                        <span className={textMuted}>•</span>
                                        <span className={`${textSecondary} flex items-center gap-2 transition-colors duration-300`}>
                                            <Target className="w-4 h-4" />
                                            {userDetails?.stat?.challenges?.joined || 0} Challenges
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Ranking Circle */}
                            <div className="relative">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke={isDark ? "#475569" : "#e2e8f0"}
                                        strokeWidth="8"
                                        fill="none"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke={isDark ? "#94a3b8" : "#64748b"}
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray="351.86"
                                        strokeDashoffset={351.86 - (calculateRankPercentage() / 100) * 351.86}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <Trophy className={`w-6 h-6 ${textMuted} mb-1 transition-colors duration-300`} />
                                    <span className={`text-2xl font-bold ${textPrimary} transition-colors duration-300`}>
                                        #{userDetails?.stat?.ranking?.global_rank || 1}
                                    </span>
                                    <span className={`text-xs ${textMuted} font-medium transition-colors duration-300`}>
                                        Global Rank
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Current Challenge */}
                        <div className="lg:col-span-2">
                            <div className={`${bgCard} rounded-2xl shadow-sm border ${borderColor} overflow-hidden transition-colors duration-300`}>
                                <div className={`bg-cyan-600 px-6 py-4 border-b ${borderColor} transition-colors duration-300`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className={`text-xl font-bold ${textPrimary} flex items-center gap-2 transition-colors duration-300`}>
                                                <Target className="w-5 h-5" />
                                                {userDetails?.stat?.user?.username || 'User'}
                                            </h2>
                                            <p className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}>
                                                ID: {userDetails?.stat?.user?.id || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className={`px-4 py-2 bg-black/20 rounded-lg border border-black/50 transition-colors duration-300`}>
                                                <p className={`text-xs ${textSecondary}`}>Challenges</p>
                                                <p className={`text-lg font-bold ${textPrimary}`}>{userDetails?.stat?.challenges?.joined || 0}</p>
                                            </div>
                                            <div className={`px-4 py-2 bg-black/20 rounded-lg border border-black/50 transition-colors duration-300`}>
                                                <p className={`text-xs ${textSecondary}`}>Success Rate</p>
                                                <p className={`text-lg font-bold ${textPrimary}`}>{userDetails?.stat?.challenges?.completion_rate || 0}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className={`bg-sky-950 rounded-xl p-6 border ${borderColor} transition-colors duration-300`}>
                                        <h3 className={`text-base font-semibold ${textPrimary} mb-4 flex items-center gap-2 transition-colors duration-300`}>
                                            <Clock className={`w-5 h-5 ${textMuted}`} />
                                            Current Challenge
                                        </h3>
                                        {getCurrentChallenge() ? (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className={`text-lg font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
                                                            {getCurrentChallenge()?.challenge_title || 'Unknown Challenge'}
                                                        </h4>
                                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-white/30 text-neutral-300 border-black/40' : 'bg-neutral-200 text-neutral-700 border-neutral-300'} border transition-colors duration-300`}>
                                                            {getCurrentChallenge()?.challenge_difficulty?.toUpperCase() || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <button className={`px-6 py-2.5 ${buttonBg} text-white rounded-lg font-medium transition-all duration-300`}>
                                                        Continue →
                                                    </button>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm text-neutral-600">
                                                        <span className={textSecondary}>Progress</span>
                                                        <span className={`font-medium ${textSecondary}`}>{getCurrentChallenge()?.attempts_count || 0} attempts</span>
                                                    </div>
                                                    <div className={`w-full h-2.5 ${progressBg} rounded-full overflow-hidden transition-colors duration-300`}>
                                                        <div 
                                                            className={`h-full ${progressFill} rounded-full transition-all duration-500`}
                                                            style={{width: `${Math.min((getCurrentChallenge()?.attempts_count || 0) * 20, 100)}%`}}
                                                        ></div>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className={`px-4 py-3 ${bgCard} rounded-lg border ${borderColor} transition-colors duration-300`}>
                                                        <p className={`text-xs ${textSecondary} mb-1`}>Experience</p>
                                                        <p className={`font-bold ${textPrimary}`}>
                                                            {getCurrentChallenge()?.xp_earned || 0}/{getCurrentChallenge()?.xp_reward || 0} XP
                                                        </p>
                                                    </div>
                                                    <div className={`px-4 py-3 ${bgCard} rounded-lg border ${borderColor} transition-colors duration-300`}>
                                                        <p className={`text-xs ${textSecondary} mb-1`}>Started on</p>
                                                        <p className={`font-bold ${textPrimary}`}>
                                                            {getCurrentChallenge()?.started_at ? formatDate(getCurrentChallenge().started_at) : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className={`w-16 h-16 ${bgSecondary} rounded-full flex items-center justify-center mx-auto mb-4 border ${borderColor} transition-colors duration-300`}>
                                                    <Target className={`w-8 h-8 ${textMuted}`} />
                                                </div>
                                                <p className={`${textSecondary} mb-4 transition-colors duration-300`}>No active challenge</p>
                                                <button className={`px-6 py-2.5 ${buttonBg} text-white rounded-lg font-medium transition-all duration-300`}>
                                                    Start a Challenge
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Stats & Recent Challenges */}
                        <div className="space-y-6">
                            {/* Statistics */}
                            <div className={`${bgCard} rounded-2xl shadow-sm border ${borderColor} overflow-hidden transition-colors duration-300`}>
                                <div className={`bg-amber-600 px-6 py-4 border-b ${borderColor} transition-colors duration-300`}>
                                    <h2 className={`text-lg font-bold ${textPrimary} flex items-center gap-2 transition-colors duration-300`}>
                                        <TrendingUp className="w-5 h-5" />
                                        Statistics
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={`bg-black/40 p-5 rounded-xl text-center border ${borderColor} hover:border-neutral-400 transition-all duration-300`}>
                                            <p className={`text-2xl font-bold ${textPrimary}`}>{userDetails?.stat?.challenges?.completed || 0}</p>
                                            <p className={`text-sm ${textSecondary} mt-1`}>Completed</p>
                                        </div>
                                        <div className={`bg-black/40 p-5 rounded-xl text-center border ${borderColor} hover:border-neutral-400 transition-all duration-300`}>
                                            <p className={`text-2xl font-bold ${textPrimary}`}>{userDetails?.stat?.challenges?.in_progress || 0}</p>
                                            <p className={`text-sm ${textSecondary} mt-1`}>In Progress</p>
                                        </div>
                                        <div className={`bg-black/40 p-5 rounded-xl text-center border ${borderColor} hover:border-neutral-400 transition-all duration-300`}>
                                            <p className={`text-2xl font-bold ${textPrimary}`}>{userDetails?.stat?.challenges?.completion_rate || 0}%</p>
                                            <p className={`text-sm ${textSecondary} mt-1`}>Success Rate</p>
                                        </div>
                                        <div className={`bg-black/40 p-5 rounded-xl text-center border ${borderColor} hover:border-neutral-400 transition-all duration-300`}>
                                            <p className={`text-2xl font-bold ${textPrimary}`}>#{userDetails?.stat?.ranking?.global_rank || 1}</p>
                                            <p className={`text-sm ${textSecondary} mt-1`}>Ranking</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Challenges */}
                            <div className={`${bgCard} rounded-2xl shadow-sm border ${borderColor} overflow-hidden transition-colors duration-300`}>
                                <div className={`bg-amber-600 px-6 py-4 border-b ${borderColor} transition-colors duration-300`}>
                                    <h2 className={`text-lg font-bold ${textPrimary} flex items-center gap-2 transition-colors duration-300`}>
                                        <Award className="w-5 h-5" />
                                        Recent Challenges
                                    </h2>
                                </div>
                                <div className="p-6 space-y-3">
                                    {userDetails?.challenges?.slice(0, 3).map((challenge: any) => (
                                        <div 
                                            key={challenge.id} 
                                            className={`bg-black/40 p-4 rounded-xl border ${borderColor} hover:border-neutral-400 transition-all duration-300`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <p className={`font-bold ${textPrimary} mb-1`}>{challenge.challenge_title}</p>
                                                    <p className={`text-sm ${textSecondary}`}>
                                                        {challenge.status === 'completed' ? '✅ Completed' : '🔄 In Progress'}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-neutral-600 text-neutral-300 border-neutral-500' : 'bg-neutral-200 text-neutral-700 border-neutral-300'} border transition-colors duration-300`}>
                                                    {challenge.challenge_difficulty}
                                                </span>
                                            </div>
                                            <div className={`flex justify-between text-xs ${textMuted}`}>
                                                <span className="flex items-center gap-1">
                                                    <Zap className="w-3 h-3" />
                                                    {challenge.xp_earned} XP
                                                </span>
                                                <span>{challenge.attempts_count} attempts</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}