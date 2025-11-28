"use client"
import HomeLayout from '@/components/layout/HomeLayout';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Trophy, 
  Target, 
  Award, 
  Calendar, 
  Mail, 
  User, 
  BookOpen, 
  Star, 
  TrendingUp,
  Clock,
  Zap,
  MapPin,
  GraduationCap,
  Shield,
  BarChart3
} from 'lucide-react';

// Modal component pour les images
function ImageModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
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
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full max-h-[80vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default function GetUserPage() {
    const { id } = useParams<{id: string}>();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

    const getUserData = async () => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'GET'
            });
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserData();
    }, [id]);

    const getUserInitials = () => {
        if (!userData?.user) return 'U';
        const { prenom, nom, username } = userData.user;
        if (prenom && nom) {
            return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
        }
        return username.charAt(0).toUpperCase();
    };

    const getUserFullName = () => {
        if (!userData?.user) return 'User';
        const { prenom, nom, username } = userData.user;
        if (prenom && nom) {
            return `${prenom} ${nom}`;
        }
        return username;
    };

    const calculateRankPercentage = () => {
        if (!userData?.ranking) return 0;
        const { global_rank, total_users } = userData.ranking;
        return ((total_users - global_rank) / total_users) * 100;
    };

    if (loading) {
        return (
            <HomeLayout>
                <div className="min-h-screen bg-indigo-50 rounded-lg w-full flex items-center justify-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-700 text-lg font-medium">Loading profile...</span>
                    </div>
                </div>
            </HomeLayout>
        );
    }

    if (!userData?.user) {
        return (
            <HomeLayout>
                <div className="min-h-screen bg-indigo-50 rounded-lg w-full flex items-center justify-center">
                    <div className="text-center">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
                        <p className="text-gray-600">The user profile you're looking for doesn't exist.</p>
                    </div>
                </div>
            </HomeLayout>
        );
    }

    const { user, challenges, ranking } = userData;

    return (
        <HomeLayout>
            <div className="min-h-screen bg-indigo-50 rounded-lg w-full">
                {/* Modal pour l'image */}
                {selectedImage && (
                    <ImageModal
                        src={selectedImage.src}
                        alt={selectedImage.alt}
                        onClose={() => setSelectedImage(null)}
                    />
                )}

                <div className="space-y-4 md:space-y-6">
                    {/* Header Section - Inspiré du dashboard */}
                    <div className="bg-[url(/background.jpeg)] bg-cover relative shadow-sm p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 md:gap-4">
                                {user.photo ? (
                                    <div 
                                        className="relative group cursor-pointer"
                                        onClick={() => setSelectedImage({ 
                                            src: user.photo, 
                                            alt: getUserFullName()
                                        })}
                                    >
                                        <img
                                            src={user.photo}
                                            alt={getUserFullName()}
                                            className="w-16 h-16 md:w-26 md:h-26 rounded-full object-cover border-4 border-white shadow-md transition-transform duration-200 group-hover:scale-110"
                                            onContextMenu={(e) => e.preventDefault()}
                                        />
                                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                                            <svg className="w-5 h-5 md:w-8 md:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 md:w-26 md:h-26 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl md:text-4xl font-bold shadow-md">
                                        {getUserInitials()}
                                    </div>
                                )}
                                <div className="text-white">
                                    <h1 className="text-lg md:text-xl font-bold">
                                        {getUserFullName()}
                                    </h1>
                                    <p className="text-slate-200 text-xs md:text-sm">@{user.username}</p>
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-200 text-xs md:text-sm">
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-3 h-3 md:w-4 md:h-4" />
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                                            <span>{user.parcours}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <GraduationCap className="w-3 h-3 md:w-4 md:h-4" />
                                            <span>{user.classe}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute w-full h-full bg-linear-to-t from-black/35 top-0 left-0"></div>
                            </div>
                            
                            <div className="relative">
                                <svg className="w-20 h-20 md:w-32 md:h-32 transform -rotate-90">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        stroke={"#e2e8f0"}
                                        strokeWidth="8"
                                        fill="none"
                                    />
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
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
                                    <Trophy className={`w-4 h-4 md:w-6 md:h-6 mb-1 text-white`} />
                                    <span className={`text-xs md:text-sm font-bold text-white`}>
                                        #{ranking.global_rank}
                                    </span>
                                    <span className={`text-xs text-slate-200 font-medium`}>
                                        Global Rank
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 px-3 md:px-4">
                        {/* Left Column - Stats and Info */}
                        <div className="lg:col-span-2 space-y-4 md:space-y-6">
                            {/* XP Progress Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                <div className="border-b border-slate-200 px-4 md:px-6 py-3 md:py-4">
                                    <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Zap className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                                        Experience & Progress
                                    </h2>
                                </div>
                                <div className="p-4 md:p-6">
                                    <div className="bg-slate-50 rounded-lg p-4 md:p-5 border border-slate-200">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                                                Total Experience
                                            </h3>
                                            <span className="text-sm font-bold text-blue-600">{user.total_xp} XP</span>
                                        </div>
                                        <div className="w-full h-2 md:h-3 bg-white rounded-full overflow-hidden border border-slate-200 mb-3">
                                            <div 
                                                className="h-full bg-linear-to-r from-amber-500 to-orange-500 transition-all duration-500 rounded-full"
                                                style={{width: `${Math.min((user.total_xp / 10000) * 100, 100)}%`}}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                                <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-lg text-xs md:text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                                                    Level: {Math.floor(user.total_xp / 1000) + 1}
                                                </span>
                                                <span className="hidden sm:inline text-slate-500 text-sm">•</span>
                                                <span className="text-slate-600 text-xs md:text-sm font-medium">{user.challenges_joined} Challenges Joined</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Statistics Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                <div className="border-b border-slate-200 px-4 md:px-6 py-3 md:py-4">
                                    <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                                        Challenge Statistics
                                    </h2>
                                </div>
                                
                                <div className="p-4 md:p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                                        <div className="text-center p-3 md:p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                            <p className="text-2xl md:text-4xl font-bold text-slate-900 mb-1">{challenges.completed}</p>
                                            <p className="text-xs md:text-sm font-semibold text-slate-600">Completed</p>
                                        </div>
                                        <div className="text-center p-3 md:p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                                            <p className="text-2xl md:text-4xl font-bold text-slate-900 mb-1">{challenges.in_progress}</p>
                                            <p className="text-xs md:text-sm font-semibold text-slate-600">In Progress</p>
                                        </div>
                                        <div className="text-center p-3 md:p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                                            <p className="text-2xl md:text-4xl font-bold text-slate-900 mb-1">{challenges.completion_rate}%</p>
                                            <p className="text-xs md:text-sm font-semibold text-slate-600">Success Rate</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 rounded-lg p-4 md:p-5 border border-slate-200">
                                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                                            {getUserFullName()} has participated in a total of <span className="font-bold text-slate-900">{user.challenges_joined} challenges</span>. 
                                            With a success rate of <span className="font-bold text-slate-900">{challenges.completion_rate}%</span>, 
                                            they are currently ranked <span className="font-bold text-slate-900">#{ranking.global_rank}</span> globally 
                                            out of {ranking.total_users} users.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                <div className="border-b border-slate-200 px-4 md:px-6 py-3 md:py-4">
                                    <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Award className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                                        Recent Activity
                                    </h2>
                                </div>
                                
                                <div className="p-4 md:p-6">                                    
                                    <div className="space-y-3">
                                        <div className="text-center py-8 md:py-12">
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 md:mb-4">
                                                <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">No recent activity</h3>
                                            <p className="text-slate-600 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
                                                Challenge activity and achievements will appear here
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Profile Details */}
                        <div className="space-y-4 md:space-y-6">
                            {/* Profile Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                <div className="border-b border-slate-200 px-4 md:px-6 py-3 md:py-4">
                                    <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                                        Profile Information
                                    </h2>
                                </div>
                                
                                <div className="p-4 md:p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 mb-2 block">Registration Number</label>
                                            <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-gray-900 text-sm">
                                                {user.numero_inscription}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 mb-2 block">Academic Path</label>
                                            <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-gray-900 text-sm">
                                                {user.parcours}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 mb-2 block">Class</label>
                                            <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-gray-900 text-sm">
                                                {user.classe}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 mb-2 block">Member Since</label>
                                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-gray-900 text-sm">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span>Recently joined</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ranking Stats */}
                            <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-200 p-4 md:p-6">
                                <div className="flex items-center gap-3 mb-3 md:mb-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-300">
                                        <Trophy className="w-4 h-4 md:w-6 md:h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs md:text-sm font-semibold text-slate-700">Global Ranking</p>
                                        <p className="text-xl md:text-2xl font-bold text-slate-900">#{ranking.global_rank}</p>
                                    </div>
                                </div>
                                
                                <div className="w-full h-2 md:h-2.5 bg-white rounded-full overflow-hidden mb-2 md:mb-3 border border-amber-200">
                                    <div 
                                        className="h-full bg-linear-to-r from-amber-500 to-orange-500 transition-all duration-1000 rounded-full"
                                        style={{width: `${calculateRankPercentage()}%`}}
                                    />
                                </div>
                                <p className="text-xs text-slate-600 text-center">
                                    Better than {Math.round(calculateRankPercentage())}% of users
                                </p>
                            </div>

                            {/* Performance Badge */}
                            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-4 md:p-6">
                                <div className="text-center">
                                    <Shield className="w-8 h-8 md:w-10 md:h-10 text-blue-600 mx-auto mb-2" />
                                    <h3 className="text-sm md:text-base font-bold text-slate-900 mb-1">Performance Level</h3>
                                    <div className="flex justify-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < Math.min(3, Math.floor(challenges.completion_rate / 20))
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        {challenges.completion_rate >= 80 ? 'Elite Solver' :
                                         challenges.completion_rate >= 60 ? 'Advanced Coder' :
                                         challenges.completion_rate >= 40 ? 'Rising Star' :
                                         'Beginner'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}