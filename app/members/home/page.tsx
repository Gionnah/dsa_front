"use client";

import { useEffect, useState } from "react";
import { Trophy, Target, TrendingUp, Award, Clock, Zap, ChevronRight, Calendar, BarChart3 } from "lucide-react";
import HomeLayout from "@/components/layout/HomeLayout";
import Link from "next/link";

// Modal component for scall images
function ImageModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // exit with Escape touch
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 font-mono"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute -top-14 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm transition-all duration-200 border border-white/20 hover:scale-110"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full max-h-[85vh] object-contain"
          />
          
          {/* description */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white text-sm font-mono text-center">{alt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
    const [userDetails, setUserDetails] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

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

    const getUserAvatar = () => {
        if (userDetails?.stat?.user?.photo) {
            return `${userDetails.stat.user.photo}`;
        }
        return null;
    };

    const getUserInitials = () => {
        return userDetails?.stat?.user?.username?.charAt(0)?.toUpperCase() || 'U';
    };

    const getUserFullName = () => {
        if (userDetails?.stat?.user?.prenom && userDetails?.stat?.user?.nom) {
            return `${userDetails.stat.user.prenom} ${userDetails.stat.user.nom}`;
        }
        return userDetails?.stat?.user?.username || 'User';
    };

    return (
        <HomeLayout>
            <div className="min-h-screen bg-indigo-50 rounded-lg w-full font-mono">
                {/* Modal for scal image */}
                {selectedImage && (
                    <ImageModal
                        src={selectedImage.src}
                        alt={selectedImage.alt}
                        onClose={() => setSelectedImage(null)}
                    />
                )}

                <div className="space-y-4 md:space-y-6">
                    {/* Header Compact */}
                    <div className="bg-[url(/background.jpeg)] bg-cover relative shadow-sm p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 md:gap-4">
                                {getUserAvatar() ? (
                                    <div 
                                        className="relative group cursor-pointer"
                                        onClick={() => setSelectedImage({ 
                                            src: getUserAvatar()!, 
                                            alt: getUserFullName()
                                        })}
                                    >
                                        <img
                                            src={getUserAvatar()!}
                                            alt={getUserFullName()}
                                            className="w-14 h-14 md:w-20 md:h-20 rounded-full object-cover border-4 border-white shadow-md transition-transform duration-200 group-hover:scale-110"
                                            onContextMenu={(e) => e.preventDefault()}
                                        />
                                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                                            <svg className="w-4 h-4 md:w-6 md:h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg md:text-2xl font-bold shadow-md">
                                        {getUserInitials()}
                                    </div>
                                )}
                                <div className="text-white">
                                    <h1 className="text-base md:text-lg font-bold">
                                        {getUserFullName()}
                                    </h1>
                                    <p className="text-slate-200 text-xs">@{userDetails?.stat?.user?.username || 'username'}</p>
                                </div>
                                <div className="absolute w-full h-full bg-gradient-to-t from-black/35 top-0 left-0"></div>
                            </div>
                            
                            <div className="relative">
                                <svg className="w-16 h-16 md:w-24 md:h-24 transform -rotate-90">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        stroke={"#e2e8f0"}
                                        strokeWidth="6"
                                        fill="none"
                                    />
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        stroke={"#64748b"}
                                        strokeWidth="6"
                                        fill="none"
                                        strokeDasharray="351.86"
                                        strokeDashoffset={351.86 - (calculateRankPercentage() / 100) * 351.86}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <Trophy className="w-3 h-3 md:w-5 md:h-5 mb-0.5" />
                                    <span className="text-xs md:text-sm font-bold">
                                        #{userDetails?.stat?.ranking?.global_rank || 1}
                                    </span>
                                    <span className="text-[10px] md:text-xs text-slate-200 font-medium">
                                        Rank
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Responsive grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 px-3 md:px-4">
                        {/* Main column - Current challenge */}
                        <div className="lg:col-span-2 space-y-4 md:space-y-6">
                            {/* Current challenge */}
                            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                                <div className="border-b border-slate-200 px-4 md:px-6 py-2.5 md:py-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <h2 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
                                            <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                                            Current Challenge
                                        </h2>
                                        {getCurrentChallenge() && (
                                            <span className="text-xs text-slate-500">{getCurrentChallenge()?.started_at ? formatDate(getCurrentChallenge().started_at) : 'N/A'}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-4 md:p-5">
                                    {getCurrentChallenge() ? (
                                        <div className="space-y-3 md:space-y-4">                                            
                                            <div className="bg-slate-50 rounded-lg p-3 md:p-4 border border-slate-200">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                                                    <h3 className="text-lg md:text-xl font-bold text-slate-900">
                                                        {getCurrentChallenge()?.challenge_title || 'Unknown Challenge'}
                                                    </h3>
                                                    <span className="text-xs font-bold text-blue-600">{Math.min((getCurrentChallenge()?.attempts_count || 0) * 20, 100)}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-slate-200 mb-2">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 rounded-full"
                                                        style={{width: `${Math.min((getCurrentChallenge()?.attempts_count || 0) * 20, 100)}%`}}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                                                            {getCurrentChallenge()?.challenge_difficulty?.toUpperCase() || 'N/A'}
                                                        </span>
                                                        <span className="hidden sm:inline text-slate-400 text-xs">•</span>
                                                        <span className="text-slate-600 text-xs font-medium">{getCurrentChallenge()?.attempts_count || 0} Attempts</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 md:p-4 border border-amber-200">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600" />
                                                        <p className="text-xs font-semibold text-slate-700">Current XP</p>
                                                    </div>
                                                    <p className="text-xl md:text-2xl font-bold text-slate-900 mb-0.5">
                                                        {getCurrentChallenge()?.xp_earned || 0}
                                                    </p>
                                                    <p className="text-xs text-slate-600">
                                                        of {getCurrentChallenge()?.xp_reward || 0} XP
                                                    </p>
                                                </div>
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 md:p-4 border border-blue-200">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                                                        <p className="text-xs font-semibold text-slate-700">Started</p>
                                                    </div>
                                                    <p className="text-base md:text-lg font-bold text-slate-900 mb-0.5">
                                                        {getCurrentChallenge()?.started_at ? new Date(getCurrentChallenge().started_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'N/A'}
                                                    </p>
                                                    <p className="text-xs text-slate-600">
                                                        {getCurrentChallenge()?.started_at ? Math.floor((Date.now() - new Date(getCurrentChallenge().started_at).getTime()) / (1000 * 60 * 60 * 24)) : 0} days ago
                                                    </p>
                                                </div>
                                            </div>

                                            <button onClick={() => {}} className="w-full hover:bg-indigo-300 cursor-not-allowed px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 ease-in-out duration-300 text-white rounded-md font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 group text-sm">
                                                Continue challenge
                                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 md:py-8">
                                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                                                <Target className="w-6 h-6 md:w-7 md:h-7 text-slate-400" />
                                            </div>
                                            <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1">No current challenge</h3>
                                            <p className="text-slate-600 mb-3 max-w-md mx-auto text-xs">
                                                You don't have any active challenges. Start a new challenge to earn XP!
                                            </p>
                                            <Link href={`/members/challenges`} className="inline-block px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md font-semibold hover:shadow-md transition-all text-xs">
                                                Discover challenges
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Detailed statistics */}
                            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                                <div className="border-b border-slate-200 px-4 md:px-6 py-2.5 md:py-3">
                                    <h2 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
                                        <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600" />
                                        Statistics
                                    </h2>
                                </div>
                                
                                <div className="p-4 md:p-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                        <div className="text-center p-2.5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                            <p className="text-xl md:text-2xl font-bold text-slate-900 mb-0.5">{userDetails?.stat?.challenges?.completed || 0}</p>
                                            <p className="text-[11px] font-semibold text-slate-600">Completed</p>
                                        </div>
                                        <div className="text-center p-2.5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                                            <p className="text-xl md:text-2xl font-bold text-slate-900 mb-0.5">{userDetails?.stat?.challenges?.in_progress || 0}</p>
                                            <p className="text-[11px] font-semibold text-slate-600">In progress</p>
                                        </div>
                                        <div className="text-center p-2.5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                                            <p className="text-xl md:text-2xl font-bold text-slate-900 mb-0.5">{userDetails?.stat?.challenges?.completion_rate || 0}%</p>
                                            <p className="text-[11px] font-semibold text-slate-600">Success rate</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                        <p className="text-[11px] text-slate-600 leading-relaxed">
                                            Participated in <span className="font-bold text-slate-900">{userDetails?.stat?.challenges?.joined || 0} challenges</span>. 
                                            Success rate: <span className="font-bold text-slate-900">{userDetails?.stat?.challenges?.completion_rate || 0}%</span>, 
                                            Global rank: <span className="font-bold text-slate-900">#{userDetails?.stat?.ranking?.global_rank || 1}</span> 
                                            out of {userDetails?.stat?.ranking?.total_users || 0} users.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Side column - History */}
                        <div className="space-y-4 md:space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                                <div className="border-b border-slate-200 px-4 md:px-6 py-2.5 md:py-3">
                                    <h2 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
                                        <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600" />
                                        Recent Activity
                                    </h2>
                                </div>
                                
                                <div className="p-3 md:p-4">                                    
                                    <div className="space-y-2">
                                        {recentChallenges.length > 0 ? (
                                            recentChallenges.map((challenge: any) => (
                                                <div 
                                                    key={challenge.id} 
                                                    className="bg-slate-50 rounded-md p-2.5 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
                                                >
                                                    <div className="flex items-start justify-between mb-1">
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-slate-900 text-xs mb-0.5">
                                                                {challenge.challenge_title}
                                                            </h4>
                                                            <p className="text-[10px] text-slate-500">
                                                                {challenge.status === 'completed' 
                                                                    ? '✓ Completed' 
                                                                    : '⏳ In progress'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-[10px] mt-1.5 pt-1.5 border-t border-slate-200">
                                                        <div className="flex items-center gap-2">
                                                            <span className="flex items-center gap-0.5 text-slate-600">
                                                                <Zap className="w-2.5 h-2.5 text-amber-500" />
                                                                <span className="font-semibold">{challenge.xp_earned}</span> XP
                                                            </span>
                                                            <span className="flex items-center gap-0.5 text-slate-600">
                                                                <Clock className="w-2.5 h-2.5 text-blue-500" />
                                                                <span className="font-semibold">{challenge.attempts_count}</span> att
                                                            </span>
                                                        </div>
                                                        <span className="px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-semibold text-[10px]">
                                                            {challenge.challenge_difficulty}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-1">
                                                    <Award className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 text-[11px]">No recent activity</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Ranking Info */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-sm border border-amber-200 p-3 md:p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-100 flex items-center justify-center border border-amber-300">
                                        <Trophy className="w-3.5 h-3.5 md:w-5 md:h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-700">Your rank</p>
                                        <p className="text-lg md:text-xl font-bold text-slate-900">#{userDetails?.stat?.ranking?.global_rank || 1}</p>
                                    </div>
                                </div>
                                
                                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden mb-1.5 border border-amber-200">
                                    <div 
                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 rounded-full"
                                        style={{width: `${calculateRankPercentage()}%`}}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-600 text-center">
                                    Better than {Math.round(calculateRankPercentage())}% of users
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}