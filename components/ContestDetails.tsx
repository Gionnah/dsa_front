"use client";

import { useEffect, useMemo, useState } from "react";
import { Trophy, Users, Clock, Target, Award, X, Mail, Edit, Trash2, Crown, Medal, ChevronRight, Zap } from "lucide-react";
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
// Component
// =============================

export default function ContestPage({ contestData, teamData }: { contestData: ContestData, teamData: any }) {
    const { details, challenges, leaderboard } = contestData;
    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
    const [showManageTeam, setShowManageTeam] = useState(false);
    const [teamName, setTeamName] = useState<string>("");
    const [memberEmail, setMemberEmail] = useState<string>("");
    const [now, setNow] = useState(Date.now());
    const [listTeam, setListTeam] = useState<any>([]);

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

    if (!details) {
        return <p className="text-center p-6">Chargement du contest…</p>;
    }



    const toggleCreateTeamModal = () => {
        setShowCreateTeamModal(!showCreateTeamModal);
    }

    const toggleManageTeam = () => {
        setShowManageTeam(!showManageTeam);
    }

    const handleCreateTeam = (e: React.FormEvent) => {
        e.preventDefault();
        const data  = fetch('/api/contests/' + details.id + '/teams', {
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
            const data  = fetch('/api/contests/' + details.id + '/teams/' + listTeam?.team_id, {
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
                linear: "from-emerald-600 via-teal-500 to-emerald-600",
                badge: "bg-emerald-500/20 text-emerald-100 border border-emerald-400/30",
                icon: <Zap className="w-6 h-6" />
            };
        }
        if (details.is_finished) {
            return {
                linear: "from-gray-600 via-slate-500 to-gray-600",
                badge: "bg-gray-500/20 text-gray-100 border border-gray-400/30",
                icon: <Trophy className="w-6 h-6" />
            };
        }
        return {
            linear: "from-blue-600 via-indigo-500 to-blue-600",
            badge: "bg-blue-500/20 text-blue-100 border border-blue-400/30",
            icon: <Clock className="w-6 h-6" />
        };
    };

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

    const getRankColor = (rank: number) => {
        if (rank === 1) return "from-yellow-500 to-yellow-600";
        if (rank === 2) return "from-gray-400 to-gray-500";
        if (rank === 3) return "from-amber-600 to-amber-700";
        return "from-indigo-600 to-indigo-700";
    };

    const colorGradients = [
        "from-teal-500 to-blue-600",
        "from-blue-500 to-indigo-600",
        "from-green-500 to-emerald-600",
        "from-amber-500 to-orange-600",
        "from-purple-500 to-pink-600",
        "from-red-500 to-orange-600",
        "from-indigo-500 to-purple-600",
        "from-pink-500 to-rose-600",
        "from-cyan-500 to-blue-600",
        "from-orange-500 to-red-600",
    ];

    const getUserColor = (userId: number) => {
        return colorGradients[userId % colorGradients.length];
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Create Team Modal */}
                {showCreateTeamModal && (
                    <div className="fixed min-h-screen inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="relative animation-scale bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
                            <button 
                                onClick={toggleCreateTeamModal} 
                                className="absolute top-4 cursor-pointer right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-center text-gray-900">Create Your Team</h2>
                                <p className="text-center text-gray-500 mt-2">Choose a name for your team</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="teamName" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Team Name <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        id="teamName"
                                        type="text" 
                                        className="w-full px-4 py-3 text-indigo-900 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors" 
                                        placeholder="Enter team name"
                                        value={teamName} 
                                        onChange={(e) => setTeamName(e.target.value)} 
                                    />
                                </div>
                                <button 
                                    onClick={handleCreateTeam}
                                    className="w-full py-3 cursor-pointer transition-all duration-300 ease-in-out bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl"
                                >
                                    Create Team
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manage Team Sidebar */}
                {showManageTeam && (
                    <div className="fixed inset-0 z-50 flex min-h-screen     justify-end">
                        <div 
                            onClick={toggleManageTeam}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        ></div>
                        
                        <div className="relative w-full max-w-md animation-slide bg-white h-full shadow-2xl overflow-y-auto">
                            <div className="sticky top-0 bg-linear-to-r from-emerald-600 to-teal-600 text-white p-6 shadow-lg">
                                <button 
                                    onClick={toggleManageTeam}
                                    className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="text-center pt-8">
                                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold">{teamData?.dataTeam?.team_name}</h2>
                                    <p className="text-emerald-100 text-sm mt-1">Team Management</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Invite Member */}
                                { teamData?.dataTeam?.is_captain &&
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Mail className="w-5 h-5 text-indigo-600" />
                                            Invite Member
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <input 
                                                    type="email" 
                                                    placeholder="member@example.com"
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors" 
                                                    value={memberEmail} 
                                                    onChange={(e) => setMemberEmail(e.target.value)} 
                                                />
                                            </div>
                                            <button 
                                                onClick={handleInviteMember}
                                                className="w-full py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                            >
                                                Send Invitation
                                            </button>
                                        </div>
                                    </div>
                                }

                                {/* Team Members */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-emerald-600" />
                                        Team Members
                                    </h3>
                                    <div className="space-y-3">
                                        {/* Example member */}
                                    {
                                        listTeam?.members?.map((member: any) => {
                                            return (
                                                <div key={member.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                         <div
                                                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-linear-to-br ${getUserColor(member.id)} flex items-center justify-center font-bold text-white shadow-sm text-base md:text-lg flex-shrink-0`}
                                                        >
                                                            {member.prenom?.charAt(0) && member.nom?.charAt(0) 
                                                            ? `${member.prenom.charAt(0)}${member.nom.charAt(0)}` 
                                                            : member.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{member?.prenom && member?.nom ? <>{member.prenom} {member.nom}</> : member.username}</p>
                                                            <p className="text-xs text-gray-500">{member.email}</p>
                                                        </div>
                                                    </div>
                                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                                        {teamData?.dataTeam?.is_captain ? "Leader" : "Member"}
                                                    </span>
                                                    {teamData?.dataTeam?.is_captain && member?.id != listTeam?.capitaine_id && <> <button className="text-red-500 hover:text-red-700"> x </button> </> }
                                                </div>
                                            )
                                        })
                                    }
                                    
                                        
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            { teamData?.dataTeam?.is_captain ?
                                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
                                    <button onClick={deleteTeam} className="flex-1 py-3 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                    <button className="flex-1 cursor-not-allowed py-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div> :
                                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
                                    <button className="flex-1 py-3 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                                        <X className="w-4 h-4" />
                                        Leave this team
                                    </button>
                                </div>

                            }
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end">
                    {!teamData?.dataTeam?.is_member  ? (
                        <button 
                            onClick={toggleCreateTeamModal} 
                            className="py-3 px-6 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <Users className="w-5 h-5" />
                            Create Team
                        </button>
                    ) : (
                        <button 
                            onClick={toggleManageTeam} 
                            className="py-3 px-6 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <Users className="w-5 h-5" />
                            {!teamData?.dataTeam?.is_captain ? 'Manage Team': 'View Team'}
                        </button>
                    )}
                </div>

                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`lg:col-span-2 bg-linear-to-r ${statusConfig.linear} text-white rounded-2xl shadow-xl p-8 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                        
                        <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${statusConfig.badge} backdrop-blur-sm mb-4`}>
                                        {statusConfig.icon}
                                        {details.status_display}
                                    </span>
                                    <h1 className="text-3xl md:text-4xl font-black mb-2">{details.title}</h1>
                                </div>
                            </div>

                            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock className="w-6 h-6" />
                                    <span className="text-sm font-semibold opacity-90">
                                        {!details.has_started ? "Starts in" : details.is_ongoing ? "Time Remaining" : "Contest Ended"}
                                    </span>
                                </div>
                                <div className="text-4xl font-black font-mono">
                                    {!details.has_started && formatDuration(countdown)}
                                    {details.is_ongoing && formatDuration(countdown)}
                                    {details.is_finished && "00:00:00"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-indigo-600" />
                            Contest Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                <p className="text-sm text-gray-600 mb-1">Type</p>
                                <p className="font-bold text-blue-700 text-lg">Team</p>
                            </div>
                            <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                                <p className="text-sm text-gray-600 mb-1">Registered Teams</p>
                                <p className="font-bold text-emerald-700 text-lg">
                                    {leaderboard?.leaderboard?.length ?? 0}
                                </p>
                            </div>
                            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                <p className="text-sm text-gray-600 mb-1">Challenges</p>
                                <p className="font-bold text-purple-700 text-lg">
                                    {challenges?.challenges?.length ?? 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    {/* Challenges */}
                    {showChallenges && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                Challenges
                            </h2>

                            {challenges && challenges.challenges?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {challenges.challenges.map((c) => (
                                        <Link href={`/members/challenges/${c?.id}/`}
                                            key={c.id}
                                            className="group bg-linear-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-300 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-bold text-gray-900 flex-1 group-hover:text-indigo-600 transition-colors">{c.title}</h3>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4 text-yellow-600" />
                                                <span className="text-sm font-bold text-gray-700">{c.points} XP</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-linear-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
                                    <Target className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                                    <p className="text-yellow-800 font-semibold">No challenges available yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Leaderboard */}
                    {showLeaderboard && leaderboard && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-white" />
                                </div>
                                Leaderboard
                            </h2>

                            <div className="space-y-4">
                                {leaderboard.leaderboard.map((team) => (
                                    <div
                                        key={team.id}
                                        className="bg-linear-to-r from-white to-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${getRankColor(team.rank)} flex flex-col items-center justify-center text-white shadow-lg`}>
                                                {getRankBadge(team.rank)}
                                                <span className="text-2xl font-black">#{team.rank}</span>
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-900">{team.nom}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {team.membres_count} members
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {formatDuration(team.temps_total * 1000)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 mb-1">Total XP</p>
                                                <p className="text-3xl font-black bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                                    {team.xp_total}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}