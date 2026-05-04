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
    const [showPopupDelete, setShowPopupDelete] = useState(false);
    const [showManageTeam, setShowManageTeam] = useState(false);
    const [teamName, setTeamName] = useState<string>("");
    const [memberEmail, setMemberEmail] = useState<string>("");
    const [now, setNow] = useState(Date.now());
    const [listTeam, setListTeam] = useState<any>([]);
    const [invitation, setInvitation] = useState<any>([]);
    const [showInvitation, setShowInvitation] = useState<boolean>(false);

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
    useEffect(()=>{
        getInvitation()
    }, [showInvitation])
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
        return <p className="text-center p-6 font-mono text-teal-600">Chargement du contest…</p>;
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
        const data = await fetch('/api/contests/invitation',
            {
                method: 'POST',
                body : JSON.stringify({
                    token,
                    mode
                })
            }
        )

        setShowInvitation(false);
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

    return (
        <div className="min-h-screen bg-gray-50 font-mono">
            <div className="max-w-7xl mx-auto space-y-6 p-6">
                
                {/* Create Team Modal */}
                {showCreateTeamModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                            <button 
                                onClick={toggleCreateTeamModal} 
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="mb-6">
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
                                        className="w-full px-3 py-2 font-mono text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500" 
                                        placeholder="Enter team name"
                                        value={teamName} 
                                        onChange={(e) => setTeamName(e.target.value)} 
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors"
                                >
                                    Create Team
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Manage Team Sidebar */}
                {showManageTeam && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <div 
                            onClick={toggleManageTeam}
                            className="absolute inset-0 bg-black/50"
                        ></div>
                        
                        <div className="relative w-full max-w-md bg-white h-full shadow-xl overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
                                <button 
                                    onClick={toggleManageTeam}
                                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="text-center pt-6">
                                    <h2 className="text-xl font-semibold text-gray-900">{teamData?.dataTeam?.team_name}</h2>
                                    <p className="text-gray-500 text-sm mt-1">Team Management</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Invite Member */}
                                {teamData?.dataTeam?.is_captain && (
                                    <div>
                                        <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-teal-600" />
                                            Invite Member
                                        </h3>
                                        <form onSubmit={handleInviteMember} className="space-y-3">
                                            <input 
                                                type="email" 
                                                placeholder="member@example.com"
                                                className="w-full px-3 py-2 font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500" 
                                                value={memberEmail} 
                                                onChange={(e) => setMemberEmail(e.target.value)} 
                                                required
                                            />
                                            <button 
                                                type="submit"
                                                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors"
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
                                        Team Members
                                    </h3>
                                    <div className="space-y-2">
                                        {listTeam?.members?.map((member: any) => (
                                            <div key={member.id} className="border border-gray-200 rounded-md p-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-md bg-teal-100 flex items-center justify-center font-medium text-teal-700 text-sm">
                                                        {member.prenom?.charAt(0) && member.nom?.charAt(0) 
                                                            ? `${member.prenom.charAt(0)}${member.nom.charAt(0)}` 
                                                            : member.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{member?.prenom && member?.nom ? <>{member.prenom} {member.nom}</> : member.username}</p>
                                                        <p className="text-xs text-gray-500">{member.email}</p>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                                                    {teamData?.dataTeam?.is_captain && member?.id === listTeam?.capitaine_id ? "Leader" : "Member"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {teamData?.dataTeam?.is_captain ? (
                                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                                    <button onClick={() => setShowPopupDelete(true)} className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2">
                                        <Trash2 className="w-4 h-4" />
                                        Delete Team
                                    </button>
                                    <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-not-allowed">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div>
                            ) : (
                                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                                    <button className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-not-allowed">
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
                    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                            <h1 className='text-orange-600 text-lg font-semibold text-center mb-3'>Warning</h1>
                            <p className='text-gray-600 text-center text-sm mb-2'>This action will unregister you from the contest as well as all the team members.</p> 
                            <p className='text-gray-600 text-center text-sm mb-4'>
                                <span className='font-medium text-gray-900'>Note:</span> You can create a new team or join an existing team only before the contest starts.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowPopupDelete(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>    
                                <button onClick={deleteTeam} className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors">
                                    Yes, Delete
                                </button>    
                            </div>                
                        </div>
                    </div>
                )}

                {showInvitation && (
                    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full px-6 relative py-8">
                            <div className="absolute top-0 right-0 bg-red-600 text-white p-1 cursor-pointer" onClick={() => setShowInvitation(!showInvitation)}> X </div>
                            {
                                invitation && invitation?.length > 0 ? invitation?.map((inv: any, index: number) => {
                                    return (
                                        <div className="w-full border-y border-gray-400 py-3" key={index}>
                                            <p className='text-gray-600 text-center text-sm mb-4'>
                                                <span className='font-medium text-gray-900'>Note:</span> {inv?.message}
                                            </p>
                                            <div className="flex gap-3">
                                                <button onClick={() => submitInvitation(inv.token, 'decline')} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                                    Decline
                                                </button>    
                                                <button onClick={() => submitInvitation(inv.token, 'accept')} className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors">
                                                    Accept
                                                </button>    
                                            </div>  
                                        </div>
                                    )
                                }) : (
                                    <div className="text-center text-gray-500">
                                        No invitation.
                                    </div>
                                )
                            }    
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end gap-2">
                    {invitation && 
                        <button 
                            onClick={() => setShowInvitation(!showInvitation)} 
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md transition-colors flex items-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            View invitation
                        </button>

                    }
                    {!teamData?.dataTeam?.is_member ? (
                        <button 
                            onClick={toggleCreateTeamModal} 
                            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors flex items-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            Create Team
                        </button>
                    ) : (
                        <button 
                            onClick={toggleManageTeam} 
                            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors flex items-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            {teamData?.dataTeam?.is_captain ? 'Manage Team' : 'View Team'}
                        </button>
                    )}
                </div>

                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`lg:col-span-2 bg-white border ${statusConfig.border} rounded-lg shadow-sm p-6`}>
                        <div className="mb-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.badge} mb-3`}>
                                {statusConfig.icon}
                                {details.status_display}
                            </span>
                            <h1 className="text-2xl font-bold text-gray-900">{details.title}</h1>
                        </div>

                        <div className="mt-6 bg-gray-50 rounded-md p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                    {!details.has_started ? "Starts in" : details.is_ongoing ? "Time Remaining" : "Contest Ended"}
                                </span>
                            </div>
                            <div className="text-3xl font-mono font-semibold text-gray-900">
                                {!details.has_started && formatDuration(countdown)}
                                {details.is_ongoing && formatDuration(countdown)}
                                {details.is_finished && "00:00:00"}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-teal-600" />
                            Contest Stats
                        </h3>
                        <div className="space-y-3">
                            <div className="border-b border-gray-100 pb-2">
                                <p className="text-xs text-gray-500 mb-1">Type</p>
                                <p className="font-medium text-gray-900 text-sm">Team Contest</p>
                            </div>
                            <div className="border-b border-gray-100 pb-2">
                                <p className="text-xs text-gray-500 mb-1">Registered Teams</p>
                                <p className="font-medium text-gray-900 text-sm">
                                    {leaderboard?.leaderboard?.length ?? 0}
                                </p>
                            </div>
                            <div className="pb-2">
                                <p className="text-xs text-gray-500 mb-1">Challenges</p>
                                <p className="font-medium text-gray-900 text-sm">
                                    {challenges?.challenges?.length ?? 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    {/* Challenges */}
                    {showChallenges && teamData?.dataTeam?.is_member &&  (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Target className="w-4 h-4 text-teal-600" />
                                Challenges
                            </h2>

                            {challenges && challenges.challenges?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {challenges.challenges.map((c) => (
                                        <Link href={`/members/challenges/${c?.id}/`}
                                            key={c.id}
                                            className="block border border-gray-200 rounded-md p-4 hover:border-teal-300 hover:shadow-sm transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-medium text-gray-900 text-sm flex-1">{c.title}</h3>
                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Award className="w-3 h-3 text-orange-500" />
                                                <span className="text-xs font-medium text-gray-600">{c.points} XP</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
                                    <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No challenges available yet</p>
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
                                {leaderboard.leaderboard.map((team) => (
                                    <div
                                        key={team.id}
                                        className="border border-gray-200 rounded-md p-4 hover:border-teal-300 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-md bg-gray-100 flex flex-col items-center justify-center">
                                                {getRankBadge(team.rank)}
                                                <span className="text-sm font-bold text-gray-700">#{team.rank}</span>
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{team.nom}</h3>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {team.membres_count}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDuration(team.temps_total * 1000)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 mb-1">Total XP</p>
                                                <p className="text-xl font-semibold text-teal-600">
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