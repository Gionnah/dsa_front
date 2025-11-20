"use client";

import { useEffect, useState } from "react";
import { Trophy, Target, TrendingUp, Award, Clock, Zap, ChevronRight, Calendar, BarChart3 } from "lucide-react";
import HomeLayout from "@/components/layout/HomeLayout";

export default function Dashboard() {
    const [userDetails, setUserDetails] = useState<any>(null);

    const getUserDetails = async () => {
        try {
            const response = await fetch('/api/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setUserDetails(data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    const calculateRankPercentage = () => {
        if (!userDetails?.stat?.ranking) return 0;
        const { global_rank, total_users } = userDetails.stat.ranking;
        return ((total_users - global_rank) / total_users) * 100;
    };

    const getCurrentChallenge = () => {
        if (!userDetails?.challenges || !Array.isArray(userDetails.challenges)) {
            return null;
        }
        return userDetails.challenges.find((challenge: any) => challenge?.status === "in_progress");
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const recentChallenges = Array.isArray(userDetails?.challenges) 
        ? userDetails.challenges.slice(0, 5) 
        : [];

    return (
        <HomeLayout>
            <div className="min-h-screen bg-indigo-50 rounded-lg w-full">
                <div className="space-y-2">
                    {/* Header Compact */}
                    <div className="bg-[url(/background.jpeg)] bg-cover relative shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-26 h-26 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-md">
                                    {userDetails?.stat?.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">
                                        {userDetails?.stat?.user?.prenom && userDetails?.stat?.user?.nom 
                                            ? `${userDetails.stat.user.prenom} ${userDetails.stat.user.nom}`
                                            : userDetails?.stat?.user?.username || 'User'}
                                    </h1>
                                    <p className="text-slate-300 text-sm">@{userDetails?.stat?.user?.username || 'username'}</p>
                                </div>
                                <div className="absolute w-full h-full bg-linear-to-t from-black/35 top-0 left-0"></div>
                            </div>
                            
                            <div className="relative">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke={"#e2e8f0"}
                                        strokeWidth="8"
                                        fill="none"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke={"#64748b"}
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray="351.86"
                                        strokeDashoffset={351.86 - (calculateRankPercentage() / 100) * 351.86}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <Trophy className={`w-6 h-6 mb-1 transition-colors duration-300`} />
                                    <span className={`text-sm font-bold transition-colors duration-300`}>
                                        #{userDetails?.stat?.ranking?.global_rank || 1}
                                    </span>
                                    <span className={`text-xs  font-medium transition-colors duration-300`}>
                                        Global Rank
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - 2 columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-3">
                        {/* Main column - Current challenge */}
                        <div className="lg:col-span-2 space-y-2">
                            {/* Current challenge */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                <div className="border-b border-slate-200 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-blue-600" />
                                            Current Challenge
                                        </h2>
                                        {getCurrentChallenge() && (
                                            <span className="text-sm text-slate-500">Started on {getCurrentChallenge()?.started_at ? formatDate(getCurrentChallenge().started_at) : 'N/A'}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    {getCurrentChallenge() ? (
                                        <div className="space-y-6">                                            
                                            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                                        {getCurrentChallenge()?.challenge_title || 'Unknown Challenge'}
                                                    </h3>
                                                    <span className="text-sm font-bold text-blue-600">{Math.min((getCurrentChallenge()?.attempts_count || 0) * 20, 100)}%</span>
                                                </div>
                                                <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-slate-200 mb-3">
                                                    <div 
                                                        className="h-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-500 rounded-full"
                                                        style={{width: `${Math.min((getCurrentChallenge()?.attempts_count || 0) * 20, 100)}%`}}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="inline-block px-4 py-1.5 rounded-lg text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                                                            Difficulty: {getCurrentChallenge()?.challenge_difficulty?.toUpperCase() || 'N/A'}
                                                        </span>
                                                        <span className="text-slate-500 text-sm">•</span>
                                                        <span className="text-slate-600 text-sm font-medium">{getCurrentChallenge()?.attempts_count || 0} Attempts</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-200">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Zap className="w-5 h-5 text-amber-600" />
                                                        <p className="text-sm font-semibold text-slate-700">Current XP</p>
                                                    </div>
                                                    <p className="text-3xl font-bold text-slate-900 mb-1">
                                                        {getCurrentChallenge()?.xp_earned || 0}
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        {getCurrentChallenge()?.xp_reward || 0} XP
                                                    </p>
                                                </div>
                                                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Calendar className="w-5 h-5 text-blue-600" />
                                                        <p className="text-sm font-semibold text-slate-700">Started at</p>
                                                    </div>
                                                    <p className="text-lg font-bold text-slate-900 mb-1">
                                                        {getCurrentChallenge()?.started_at ? new Date(getCurrentChallenge().started_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        {getCurrentChallenge()?.started_at ? Math.floor((Date.now() - new Date(getCurrentChallenge().started_at).getTime()) / (1000 * 60 * 60 * 24)) : 0} days ago
                                                    </p>
                                                </div>
                                            </div>

                                            <button className="w-full cursor-pointer px-6 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 ease-in-out duration-300 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                                                Continue this challenge
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                                <Target className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">No current challenge</h3>
                                            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                                You don't have any active challenges at the moment. Start a new challenge to earn experience and improve your ranking!
                                            </p>
                                            <button className="px-8 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                                                Discover available challenges
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Detailed statistics */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                <div className="border-b border-slate-200 px-6 py-4">
                                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-purple-600" />
                                        Your Statistics
                                    </h2>
                                </div>
                                
                                <div className="p-6">
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="text-center p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                            <p className="text-4xl font-bold text-slate-900 mb-1">{userDetails?.stat?.challenges?.completed || 0}</p>
                                            <p className="text-sm font-semibold text-slate-600">Challenges completed</p>
                                        </div>
                                        <div className="text-center p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                                            <p className="text-4xl font-bold text-slate-900 mb-1">{userDetails?.stat?.challenges?.in_progress || 0}</p>
                                            <p className="text-sm font-semibold text-slate-600">In progress</p>
                                        </div>
                                        <div className="text-center p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                                            <p className="text-4xl font-bold text-slate-900 mb-1">{userDetails?.stat?.challenges?.completion_rate || 0}%</p>
                                            <p className="text-sm font-semibold text-slate-600">Success rate</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            You have participated in a total of <span className="font-bold text-slate-900">{userDetails?.stat?.challenges?.joined || 0} challenges</span>. 
                                            Your success rate is <span className="font-bold text-slate-900">{userDetails?.stat?.challenges?.completion_rate || 0}%</span>, 
                                            which places you at rank <span className="font-bold text-slate-900">#{userDetails?.stat?.ranking?.global_rank || 1}</span> in the global ranking 
                                            out of {userDetails?.stat?.ranking?.total_users || 0} users. Keep it up to progress even further!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Side column - History */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                <div className="border-b border-slate-200 px-6 py-4">
                                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-purple-600" />
                                        Recent Activity
                                    </h2>
                                </div>
                                
                                <div className="p-6">                                    
                                    <div className="space-y-3">
                                        {recentChallenges.length > 0 ? (
                                            recentChallenges.map((challenge: any) => (
                                                <div 
                                                    key={challenge.id} 
                                                    className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-slate-900 text-sm mb-1">
                                                                {challenge.challenge_title}
                                                            </h4>
                                                            <p className="text-xs text-slate-500">
                                                                {challenge.status === 'completed' 
                                                                    ? '✅ Challenge completed successfully' 
                                                                    : '⏳ Challenge in progress'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-200">
                                                        <div className="flex items-center gap-4">
                                                            <span className="flex items-center gap-1 text-slate-600">
                                                                <Zap className="w-3 h-3 text-amber-500" />
                                                                <span className="font-semibold">{challenge.xp_earned}</span> XP
                                                            </span>
                                                            <span className="flex items-center gap-1 text-slate-600">
                                                                <Clock className="w-3 h-3 text-blue-500" />
                                                                <span className="font-semibold">{challenge.attempts_count}</span> attempts
                                                            </span>
                                                        </div>
                                                        <span className="px-2 py-1 rounded bg-white text-slate-600 border border-slate-200 font-semibold">
                                                            {challenge.challenge_difficulty}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                                    <Award className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 text-sm">No recent activity</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Ranking Info */}
                            <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-300">
                                        <Trophy className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Your ranking</p>
                                        <p className="text-2xl font-bold text-slate-900">#{userDetails?.stat?.ranking?.global_rank || 1}</p>
                                    </div>
                                </div>
                                
                                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden mb-3 border border-amber-200">
                                    <div 
                                        className="h-full bg-linear-to-r from-amber-500 to-orange-500 transition-all duration-1000 rounded-full"
                                        style={{width: `${calculateRankPercentage()}%`}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}