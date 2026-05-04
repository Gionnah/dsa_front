"use client";

import { useEffect, useMemo, useState } from "react";
import { Trophy, Users, Clock, Target, Award, X, Mail, Edit, Trash2, Crown, Medal, ChevronRight, Zap, Loader2 } from "lucide-react";
import Link from "next/link";

// =============================
// Types
// =============================

type ContestDetails = {
  id: number;
  title: string;
  date_debut: string;
  date_fin: string;
  statut: "upcoming" | "ongoing" | "finished" | string;
  status_display: string;
  is_ongoing: boolean;
  is_finished: boolean;
  has_started: boolean;
};

type Team = {
  id: number;
  nom: string;
  xp_total: number;
  temps_total: number;
  membres_count: number;
  rank: number;
};

type Challenge = {
  id: number;
  title: string;
  points: number;
};

type ContestData = {
  details: ContestDetails;
  challenges?: {
    challenges: Challenge[];
  };
  leaderboard?: {
    leaderboard: Team[];
  };
};

// =============================
// Utils
// =============================

function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// =============================
// Shimmer Effect Component
// =============================

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
);

// =============================
// Enhanced Skeleton Components
// =============================

function SkeletonHeader() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6 relative overflow-hidden">
        <div className="mb-4">
          <div className="w-24 h-6 bg-gray-200 rounded-full mb-3 relative overflow-hidden">
            <Shimmer />
          </div>
          <div className="w-3/4 h-8 bg-gray-200 rounded relative overflow-hidden">
            <Shimmer />
          </div>
        </div>
        <div className="mt-6 bg-gray-50 rounded-md p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-gray-200 rounded relative overflow-hidden">
              <Shimmer />
            </div>
            <div className="w-24 h-4 bg-gray-200 rounded relative overflow-hidden">
              <Shimmer />
            </div>
          </div>
          <div className="w-32 h-8 bg-gray-200 rounded relative overflow-hidden">
            <Shimmer />
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 relative overflow-hidden">
        <div className="w-32 h-5 bg-gray-200 rounded mb-4 relative overflow-hidden">
          <Shimmer />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-100 pb-2">
              <div className="w-16 h-3 bg-gray-200 rounded mb-1 relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonChallenges() {
  return (
    <div className="mb-8">
      <div className="w-32 h-6 bg-gray-200 rounded mb-4 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-md p-4 relative overflow-hidden">
            <div className="flex items-start justify-between mb-2">
              <div className="w-3/4 h-4 bg-gray-200 rounded relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="w-12 h-3 bg-gray-200 rounded relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
            <Shimmer />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonLeaderboard() {
  return (
    <div>
      <div className="w-32 h-6 bg-gray-200 rounded mb-4 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border border-gray-200 rounded-md p-4 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-gray-100 relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="flex-1">
                <div className="w-32 h-4 bg-gray-200 rounded mb-2 relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-3 bg-gray-200 rounded relative overflow-hidden">
                    <Shimmer />
                  </div>
                  <div className="w-16 h-3 bg-gray-200 rounded relative overflow-hidden">
                    <Shimmer />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="w-12 h-3 bg-gray-200 rounded mb-1 relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="w-16 h-5 bg-gray-200 rounded relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
            </div>
            <Shimmer />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonTeamCard() {
  return (
    <div className="border border-gray-200 rounded-md p-3 flex items-center justify-between relative overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-gray-200 relative overflow-hidden">
          <Shimmer />
        </div>
        <div>
          <div className="w-24 h-4 bg-gray-200 rounded mb-1 relative overflow-hidden">
            <Shimmer />
          </div>
          <div className="w-32 h-3 bg-gray-200 rounded relative overflow-hidden">
            <Shimmer />
          </div>
        </div>
      </div>
      <div className="w-16 h-5 bg-gray-200 rounded relative overflow-hidden">
        <Shimmer />
      </div>
      <Shimmer />
    </div>
  );
}

// =============================
// Loading Screen Component
// =============================

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 font-mono">
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        {/* Loading spinner header */}
        <div className="flex justify-center items-center py-12 animate-in fade-in duration-500">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-teal-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 text-sm animate-pulse">Loading contest data...</p>
          </div>
        </div>

        {/* Skeleton content */}
        <div className="opacity-50">
          <SkeletonHeader />
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mt-6">
            <SkeletonChallenges />
            <SkeletonLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================
// Component
// =============================

export default function ContestPage({ contestData, teamData }: { contestData: ContestData, teamData: any }) {
    const { details, challenges, leaderboard } = contestData;
    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
    const [showPopupDelete, setShowPopupDelete] = useState(false);
    const [showManageTeam, setShowManageTeam] = useState(false);
    const [teamName, setTeamName] = useState<string>("");
    const [memberEmail, setMemberEmail] = useState<string>("");
    const [now, setNow] = useState(Date.now());
    const [listTeam, setListTeam] = useState<any>([]);
    const [invitation, setInvitation] = useState<any>([]);
    const [showInvitation, setShowInvitation] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    const start = useMemo(
        () => details ? new Date(details.date_debut).getTime() : 0,
        [details?.date_debut]
    );
    
    const end = useMemo(
        () => details ? new Date(details.date_fin).getTime() : 0,
        [details?.date_fin]
    );

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const getInvitation = async () => {
        try {
            const res = await fetch('/api/contests/invitation');
            const data = await res.json();
            setInvitation(data?.data);
        }
        catch (e: any){
            console.error(e);
        }
    }

    useEffect(() => {
        // Simulate initial loading
        const loadData = async () => {
            await Promise.all([getInvitation(), new Promise(resolve => setTimeout(resolve, 800))]);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const getLitTeam = async () => {
        if (teamData?.dataTeam?.is_member) {
            const res = await fetch('/api/contests/' + details.id + '/teams/' + teamData?.dataTeam?.team_id, {
                method: "GET",
            })
            const data = await res.json()
            setListTeam(data?.listTeam);
        }
    }

    useEffect(() => {
        getLitTeam();
    }, [showCreateTeamModal, showManageTeam, teamData?.dataTeam?.is_member]);

    const countdown = useMemo(() => {
        if (!details || !details.has_started) return start - now;
        if (details.is_ongoing) return end - now;
        return 0;
    }, [now, start, end, details]);

    if (!details || isLoading) {
        return <LoadingScreen />;
    }

    const toggleCreateTeamModal = () => {
        setShowCreateTeamModal(!showCreateTeamModal);
    }

    const toggleManageTeam = () => {
        setShowManageTeam(!showManageTeam);
    }

    const handleCreateTeam = (e: React.FormEvent) => {
        e.preventDefault();
        fetch('/api/contests/' + details.id + '/teams', {
            method: "POST",
            body: JSON.stringify({
                nom: teamName,
            })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Team created:", data);
            toggleCreateTeamModal();
        })
        .catch((error) => {
            console.error("Error creating team:", error);
        });
    };

    const handleInviteMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (memberEmail)
        {
            fetch('/api/contests/' + details.id + '/teams/' + listTeam?.team_id, {
                method: "POST",
                body: JSON.stringify({
                    user_email: memberEmail,
                })
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("ok:", data);
                setMemberEmail('');
            })
            .catch((error) => {
                console.error("Error invitation:", error);
            });
        }
    };
    const showChallenges = details.is_ongoing || details.is_finished;
    const showLeaderboard = details.is_ongoing || details.is_finished;

    const getStatusConfig = () => {
        if (details.is_ongoing) {
            return {
                bg: "bg-teal-50",
                border: "border-teal-200",
                badge: "bg-teal-100 text-teal-700",
                icon: <Zap className="w-6 h-6 text-teal-600" />
            };
        }
        if (details.is_finished) {
            return {
                bg: "bg-gray-50",
                border: "border-gray-200",
                badge: "bg-gray-100 text-gray-700",
                icon: <Trophy className="w-6 h-6 text-gray-600" />
            };
        }
        return {
            bg: "bg-orange-50",
            border: "border-orange-200",
            badge: "bg-orange-100 text-orange-700",
            icon: <Clock className="w-6 h-6 text-orange-600" />
        };
    };

    const submitInvitation = async (token: string, mode: string) => {
        await fetch('/api/contests/invitation',
            {
                method: 'POST',
                body : JSON.stringify({
                    token,
                    mode
                })
            }
        )
        setShowInvitation(false);
        window.location.reload();
    }

    const deleteTeam = async () => {
        const del = await fetch('/api/contests/' + details.id + '/teams/' + listTeam?.team_id, {
            method: "DELETE",
            body: JSON.stringify({
                id: details.id
            })
        });
        if (del.ok) {
            console.log("Team deleted");
            toggleManageTeam();
        } else {
            alert("Error deleting team");
            console.error("Error deleting team");
        }
    }

    const statusConfig = getStatusConfig();

    const getRankBadge = (rank: number) => {
        if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
        if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
        return null;
    };

    // Animation classes
    const fadeIn = "animate-in fade-in duration-500";
    const slideUp = "animate-in slide-in-from-bottom-4 duration-500";
    const slideRight = "animate-in slide-in-from-right duration-500";
    const scaleIn = "animate-in zoom-in duration-300";

    return (
        <div className="min-h-screen bg-gray-50 font-mono">
            {/* <style jsx>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
            `}</style> */}

            <div className="max-w-7xl mx-auto space-y-6 p-6">
                
                {/* Create Team Modal */}
                {showCreateTeamModal && (
                    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4`}>
                        <div className={`relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 ${scaleIn}`}>
                            <button 
                                onClick={toggleCreateTeamModal} 
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="mb-6">
                                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-6 h-6 text-teal-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-center text-gray-900">Create Your Team</h2>
                                <p className="text-center text-gray-500 text-sm mt-1">Choose a name for your team</p>
                            </div>

                            <form onSubmit={handleCreateTeam} className="space-y-4">
                                <div>
                                    <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Team Name <span className="text-orange-500">*</span>
                                    </label>
                                    <input 
                                        id="teamName"
                                        type="text" 
                                        className="w-full px-3 py-2 font-mono text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200" 
                                        placeholder="Enter team name"
                                        value={teamName} 
                                        onChange={(e) => setTeamName(e.target.value)} 
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    Create Team
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Manage Team Sidebar */}
                {showManageTeam && (
                    <div className={`fixed inset-0 z-50 flex justify-end`}>
                        <div 
                            onClick={toggleManageTeam}
                            className="absolute inset-0 bg-black/50 "
                        ></div>
                        
                        <div className={`relative w-full max-w-md bg-white h-full shadow-xl overflow-y-auto ${slideRight}`}>
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
                                <button 
                                    onClick={toggleManageTeam}
                                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="text-center pt-6">
                                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Users className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">{teamData?.dataTeam?.team_name}</h2>
                                    <p className="text-gray-500 text-sm mt-1">Team Management</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Invite Member */}
                                {teamData?.dataTeam?.is_captain && (
                                    <div className="">
                                        <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-teal-600" />
                                            Invite Member
                                        </h3>
                                        <form onSubmit={handleInviteMember} className="space-y-3">
                                            <input 
                                                type="email" 
                                                placeholder="member@example.com"
                                                className="w-full px-3 py-2 font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200" 
                                                value={memberEmail} 
                                                onChange={(e) => setMemberEmail(e.target.value)} 
                                                required
                                            />
                                            <button 
                                                type="submit"
                                                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-all duration-200 hover:scale-105 active:scale-95"
                                            >
                                                Send Invitation
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Team Members */}
                                <div>
                                    <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-teal-600" />
                                        Team Members ({listTeam?.members?.length || 0})
                                    </h3>
                                    <div className="space-y-2">
                                        {!listTeam?.members ? (
                                            <>
                                                {[1, 2, 3].map((i) => (
                                                    <SkeletonTeamCard key={i} />
                                                ))}
                                            </>
                                        ) : (
                                            listTeam?.members?.map((member: any, idx: number) => (
                                                <div 
                                                    key={member.id} 
                                                    className="border border-gray-200 rounded-md p-3 flex items-center justify-between hover:shadow-sm transition-all"
                                                    // style={{ animationDelay: `${idx * 50}ms` }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-md bg-teal-100 flex items-center justify-center font-medium text-teal-700 text-sm transition-transform duration-200 hover:scale-110">
                                                            {member.prenom?.charAt(0) && member.nom?.charAt(0) 
                                                                ? `${member.prenom.charAt(0)}${member.nom.charAt(0)}` 
                                                                : member.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">{member?.prenom && member?.nom ? <>{member.prenom} {member.nom}</> : member.username}</p>
                                                            <p className="text-xs text-gray-500">{member.email}</p>
                                                        </div>
                                                    </div>
                                                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                                                        {teamData?.dataTeam?.is_captain && member?.id === listTeam?.capitaine_id ? "Leader" : "Member"}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {teamData?.dataTeam?.is_captain ? (
                                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                                    <button 
                                        onClick={() => setShowPopupDelete(true)} 
                                        className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Team
                                    </button>
                                    <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 cursor-not-allowed">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div>
                            ) : (
                                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                                    <button className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 cursor-not-allowed">
                                        <X className="w-4 h-4" />
                                        Leave Team
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Delete Confirmation Popup */}
                {showPopupDelete && (
                    <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4`}>
                        <div className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 ${scaleIn}`}>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-orange-600" />
                            </div>
                            <h1 className='text-orange-600 text-lg font-semibold text-center mb-3'>Warning</h1>
                            <p className='text-gray-600 text-center text-sm mb-2'>This action will unregister you from the contest as well as all the team members.</p> 
                            <p className='text-gray-600 text-center text-sm mb-4'>
                                <span className='font-medium text-gray-900'>Note:</span> You can create a new team or join an existing team only before the contest starts.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowPopupDelete(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95">
                                    Cancel
                                </button>    
                                <button onClick={deleteTeam} className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-all duration-200 hover:scale-105 active:scale-95">
                                    Yes, Delete
                                </button>    
                            </div>                
                        </div>
                    </div>
                )}

                {/* Invitation Modal */}
                {showInvitation && (
                    <div className={`fixed inset-0 bg-black/50 h-screen z-50 flex items-center justify-center p-4`}>
                        <div className={`bg-white rounded-lg shadow-lg max-w-md w-full px-6 relative py-8 ${scaleIn}`}>
                            <button 
                                onClick={() => setShowInvitation(!showInvitation)} 
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-all duration-200 hover:rotate-90"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="text-center mb-4">
                                <Mail className="w-12 h-12 text-teal-500 mx-auto" />
                                <h3 className="text-lg font-semibold text-gray-900 mt-2">Team Invitation</h3>
                            </div>
                            {
                                invitation && invitation?.length > 0 ? invitation?.map((inv: any, index: number) => {
                                    return (
                                        <div className="w-full border-t border-gray-200 py-4" 
                                        // style={{ animationDelay: `${index * 100}ms` }} key={index}
                                        >
                                            <p className='text-gray-600 text-center text-sm mb-4'>
                                                {inv?.message}
                                            </p>
                                            <div className="flex gap-3">
                                                <button onClick={() => submitInvitation(inv.token, 'decline')} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95">
                                                    Decline
                                                </button>    
                                                <button onClick={() => submitInvitation(inv.token, 'accept')} className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-all duration-200 hover:scale-105 active:scale-95">
                                                    Accept
                                                </button>    
                                            </div>  
                                        </div>
                                    )
                                }) : (
                                    <div className="text-center text-gray-500 py-6">
                                        No pending invitations.
                                    </div>
                                )
                            }    
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className={`flex justify-end gap-3 ${fadeIn} ${slideUp}`}>
                    {invitation && invitation?.length > 0 && (
                        <button 
                            onClick={() => setShowInvitation(!showInvitation)} 
                            className="relative px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-sm"
                        >
                            <Mail className="w-4 h-4" />
                            Invitations
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                {invitation.length}
                            </span>
                        </button>
                    )}
                    {!teamData?.dataTeam?.is_member ? (
                        <button 
                            onClick={toggleCreateTeamModal} 
                            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-sm"
                        >
                            <Users className="w-4 h-4" />
                            Create Team
                        </button>
                    ) : (
                        <button 
                            onClick={toggleManageTeam} 
                            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-sm"
                        >
                            <Users className="w-4 h-4" />
                            {teamData?.dataTeam?.is_captain ? 'Manage Team' : 'View Team'}
                        </button>
                    )}
                </div>

                {/* Header Section */}
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${fadeIn} ${slideUp}`} style={{ animationDelay: "100ms" }}>
                    <div className={`lg:col-span-2 bg-white border ${statusConfig.border} rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md`}>
                        <div className="mb-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.badge} mb-3 transition-all duration-200 hover:scale-105`}>
                                {statusConfig.icon}
                                {details.status_display}
                            </span>
                            <h1 className="text-2xl font-bold text-gray-900">{details.title}</h1>
                        </div>

                        <div className="mt-6 bg-gray-50 rounded-md p-4 border border-gray-200 transition-all duration-300 hover:shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                    {!details.has_started ? "Starts in" : details.is_ongoing ? "Time Remaining" : "Contest Ended"}
                                </span>
                            </div>
                            <div className="text-3xl font-mono font-semibold text-gray-900 tabular-nums">
                                {!details.has_started && formatDuration(countdown)}
                                {details.is_ongoing && formatDuration(countdown)}
                                {details.is_finished && "00:00:00"}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md">
                        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-teal-600" />
                            Contest Stats
                        </h3>
                        <div className="space-y-3">
                            <div className="border-b border-gray-100 pb-2 transition-all duration-200 hover:pl-2">
                                <p className="text-xs text-gray-500 mb-1">Type</p>
                                <p className="font-medium text-gray-900 text-sm">Team Contest</p>
                            </div>
                            <div className="border-b border-gray-100 pb-2 transition-all duration-200 hover:pl-2">
                                <p className="text-xs text-gray-500 mb-1">Registered Teams</p>
                                <p className="font-medium text-gray-900 text-sm">
                                    {leaderboard?.leaderboard?.length ?? 0}
                                </p>
                            </div>
                            <div className="pb-2 transition-all duration-200 hover:pl-2">
                                <p className="text-xs text-gray-500 mb-1">Challenges</p>
                                <p className="font-medium text-gray-900 text-sm">
                                    {challenges?.challenges?.length ?? 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md ${fadeIn} ${slideUp}`} 
                // style={{ animationDelay: "200ms" }}
                >
                    {/* Challenges */}
                    {showChallenges && teamData?.dataTeam?.is_member && (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Target className="w-4 h-4 text-teal-600" />
                                Challenges
                            </h2>

                            {challenges && challenges.challenges?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {challenges.challenges.map((c, idx) => (
                                        <Link 
                                            href={`/members/challenges/${c?.id}/`}
                                            key={c.id}
                                            className="group block border border-gray-200 rounded-md p-4 hover:border-teal-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02] "
                                            // style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-medium text-gray-900 text-sm flex-1 group-hover:text-teal-600 transition-colors">{c.title}</h3>
                                                <ChevronRight className="w-4 h-4 text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-teal-500" />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Award className="w-3 h-3 text-orange-500" />
                                                <span className="text-xs font-medium text-gray-600">{c.points} XP</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center transition-all duration-300 hover:shadow-sm">
                                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No challenges available yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Check back later for new challenges</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Leaderboard */}
                    {showLeaderboard && leaderboard && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-teal-600" />
                                Leaderboard
                            </h2>

                            <div className="space-y-3">
                                {leaderboard.leaderboard.map((team, idx) => (
                                    <div
                                        key={team.id}
                                        className="group border border-gray-200 rounded-md p-4 hover:border-teal-300 hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
                                        // style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-md bg-gray-100 flex flex-col items-center justify-center transition-all duration-200 group-hover:scale-110">
                                                {getRankBadge(team.rank)}
                                                <span className="text-sm font-bold text-gray-700">#{team.rank}</span>
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">{team.nom}</h3>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {team.membres_count} members
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDuration(team.temps_total * 1000)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 mb-1">Total XP</p>
                                                <p className="text-xl font-semibold text-teal-600 tabular-nums">
                                                    {team.xp_total.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state when no content */}
                    {(!showChallenges || !teamData?.dataTeam?.is_member) && !showLeaderboard && (
                        <div className="text-center py-12">
                            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No content available</h3>
                            <p className="text-gray-500 text-sm">Join a team to access challenges and leaderboard</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
