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

type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

type Invitation = {
  token: string;
  message: string;
};

type TeamMember = {
  id: number;
  username: string;
  email: string;
  prenom?: string;
  nom?: string;
};

type TeamDetails = {
  team_id: number;
  team_name: string;
  is_captain: boolean;
  is_member: boolean;
  members?: TeamMember[];
  capitaine_id?: number;
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
// Toast Component
// =============================

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' :
                 type === 'error' ? 'bg-red-50 border-red-200' :
                 'bg-blue-50 border-blue-200';
  
  const textColor = type === 'success' ? 'text-green-800' :
                   type === 'error' ? 'text-red-800' :
                   'text-blue-800';
  
  const iconColor = type === 'success' ? 'text-green-500' :
                   type === 'error' ? 'text-red-500' :
                   'text-blue-500';

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className={`${bgColor} border rounded-lg shadow-lg p-4 max-w-md flex items-start gap-3`}>
        <div className={`${iconColor} font-bold`}>
          {type === 'success' && '✓'}
          {type === 'error' && '⚠'}
          {type === 'info' && 'ℹ'}
        </div>
        <p className={`text-sm flex-1 ${textColor}`}>{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          ×
        </button>
      </div>
    </div>
  );
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
        <div className="flex justify-center items-center py-12 animate-in fade-in duration-500">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-teal-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 text-sm animate-pulse">Loading contest data...</p>
          </div>
        </div>
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
// Main Component
// =============================

export default function ContestPage({ contestData, teamData }: { contestData: ContestData, teamData: any }) {
    const { details, challenges, leaderboard } = contestData;
    
    // UI States
    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
    const [showPopupDelete, setShowPopupDelete] = useState(false);
    const [showManageTeam, setShowManageTeam] = useState(false);
    const [showInvitation, setShowInvitation] = useState<boolean>(false);
    
    // Form States
    const [teamName, setTeamName] = useState<string>("");
    const [memberEmail, setMemberEmail] = useState<string>("");
    
    // Data States
    const [now, setNow] = useState(Date.now());
    const [listTeam, setListTeam] = useState<TeamDetails | null>(null);
    const [invitation, setInvitation] = useState<Invitation[]>([]);
    
    // Loading States
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);
    const [isInvitingMember, setIsInvitingMember] = useState(false);
    const [isDeletingTeam, setIsDeletingTeam] = useState(false);
    const [isSubmittingInvitation, setIsSubmittingInvitation] = useState(false);
    const [isLoadingTeam, setIsLoadingTeam] = useState(false);
    const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
    
    // Error States
    const [createTeamError, setCreateTeamError] = useState<string | null>(null);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [invitationError, setInvitationError] = useState<string | null>(null);
    
    // Toast State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
    };

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

    // =============================
    // API: Get Invitations
    // =============================
    const getInvitation = async () => {
        setIsLoadingInvitations(true);
        setInvitationError(null);
        
        try {
            const res = await fetch('/api/contests/invitation');
            
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('Non authentifié. Veuillez vous reconnecter.');
                }
                if (res.status === 403) {
                    throw new Error('Accès non autorisé.');
                }
                if (res.status === 404) {
                    setInvitation([]);
                    return { success: true, data: [] };
                }
                throw new Error(`Erreur ${res.status}: ${res.statusText}`);
            }
            
            const data = await res.json();
            
            if (data?.data && Array.isArray(data.data)) {
                setInvitation(data.data);
                if (data.data.length > 0) {
                    showToast(`${data.data.length} invitation(s) en attente`, 'info');
                }
            } else {
                setInvitation([]);
            }
            
            return { success: true, data: data?.data || [] };
            
        } catch (e: any) {
            console.error('Erreur getInvitation:', e);
            const errorMessage = e.message || 'Impossible de charger les invitations';
            setInvitationError(errorMessage);
            showToast(errorMessage, 'error');
            return { success: false, error: errorMessage };
        } finally {
            setIsLoadingInvitations(false);
        }
    };

    // =============================
    // API: Get Team Details
    // =============================
    const getLitTeam = async () => {
        if (!teamData?.dataTeam?.is_member || !details?.id) {
            setListTeam(null);
            return;
        }
        
        setIsLoadingTeam(true);
        setDeleteError(null);
        
        try {
            const res = await fetch(`/api/contests/${details.id}/teams/${teamData.dataTeam.team_id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!res.ok) {
                if (res.status === 404) {
                    setListTeam(null);
                    return { success: true, data: null };
                }
                if (res.status === 401) {
                    throw new Error('Non authentifié');
                }
                if (res.status === 403) {
                    throw new Error('Accès non autorisé à cette équipe');
                }
                throw new Error(`Erreur ${res.status}: ${res.statusText}`);
            }
            
            const data = await res.json();
            
            if (data?.listTeam) {
                setListTeam(data.listTeam);
                return { success: true, data: data.listTeam };
            } else {
                setListTeam(null);
                return { success: true, data: null };
            }
            
        } catch (e: any) {
            console.error('Erreur getLitTeam:', e);
            const errorMessage = e.message || 'Impossible de charger les détails de l\'équipe';
            showToast(errorMessage, 'error');
            return { success: false, error: errorMessage };
        } finally {
            setIsLoadingTeam(false);
        }
    };

    // =============================
    // API: Create Team
    // =============================
    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!teamName.trim()) {
            showToast('Veuillez entrer un nom d\'équipe', 'error');
            return;
        }
        
        if (teamName.trim().length < 3) {
            showToast('Le nom d\'équipe doit contenir au moins 3 caractères', 'error');
            return;
        }
        
        setIsCreatingTeam(true);
        setCreateTeamError(null);
        
        try {
            const res = await fetch(`/api/contests/${details.id}/teams`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: teamName.trim(),
                })
            });
            
            let data;
            try {
                data = await res.json();
            } catch (e) {
                throw new Error('Réponse invalide du serveur');
            }
            
            if (!res.ok) {
                if (res.status === 400) {
                    throw new Error(data?.message || 'Données invalides pour la création de l\'équipe');
                }
                if (res.status === 409) {
                    throw new Error('Une équipe avec ce nom existe déjà ou vous êtes déjà dans une équipe');
                }
                if (res.status === 403) {
                    throw new Error('Le concours a déjà commencé, vous ne pouvez plus créer d\'équipe');
                }
                if (res.status === 429) {
                    throw new Error('Trop de tentatives. Veuillez réessayer plus tard.');
                }
                throw new Error(data?.message || `Erreur ${res.status}: Impossible de créer l'équipe`);
            }
            
            if (data?.success === false) {
                throw new Error(data?.message || 'Erreur lors de la création');
            }
            
            showToast(`Équipe "${teamName}" créée avec succès !`, 'success');
            setTeamName('');
            toggleCreateTeamModal();
            
            await getLitTeam();
            
        } catch (e: any) {
            console.error('Erreur createTeam:', e);
            const errorMessage = e.message || 'Erreur inattendue lors de la création';
            setCreateTeamError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setIsCreatingTeam(false);
        }
    };

    // =============================
    // API: Invite Member
    // =============================
    const handleInviteMember = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!memberEmail) {
            showToast('Veuillez entrer une adresse email', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(memberEmail)) {
            showToast('Veuillez entrer une adresse email valide', 'error');
            return;
        }
        
        setIsInvitingMember(true);
        setInviteError(null);
        
        try {
            const res = await fetch(`/api/contests/${details.id}/teams/${listTeam?.team_id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_email: memberEmail.trim(),
                })
            });
            
            let data;
            try {
                data = await res.json();
            } catch (e) {
                throw new Error('Réponse invalide du serveur');
            }
            
            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error('Utilisateur non trouvé');
                }
                if (res.status === 400) {
                    throw new Error(data?.message || 'Email invalide ou utilisateur déjà dans une équipe');
                }
                if (res.status === 409) {
                    throw new Error('Ce membre est déjà dans votre équipe ou a déjà une invitation en attente');
                }
                if (res.status === 403) {
                    throw new Error('Vous n\'êtes pas capitaine de cette équipe');
                }
                if (res.status === 429) {
                    throw new Error('Trop d\'invitations envoyées. Veuillez réessayer plus tard.');
                }
                throw new Error(data?.message || `Erreur ${res.status}: Impossible d'inviter le membre`);
            }
            
            showToast(`Invitation envoyée à ${memberEmail}`, 'success');
            setMemberEmail('');
            await getLitTeam();
            
        } catch (e: any) {
            console.error('Erreur inviteMember:', e);
            const errorMessage = e.message || 'Erreur lors de l\'envoi de l\'invitation';
            setInviteError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setIsInvitingMember(false);
        }
    };

    // =============================
    // API: Submit Invitation Response
    // =============================
    const submitInvitation = async (token: string, mode: 'accept' | 'decline') => {
        setIsSubmittingInvitation(true);
        
        try {
            const res = await fetch('/api/contests/invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    mode
                })
            });
            
            let data;
            try {
                data = await res.json();
            } catch (e) {
                throw new Error('Réponse invalide du serveur');
            }
            
            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error('Invitation non trouvée ou expirée');
                }
                if (res.status === 400) {
                    throw new Error(data?.message || 'Action invalide');
                }
                if (res.status === 409) {
                    throw new Error('Cette invitation a déjà été traitée');
                }
                if (res.status === 403) {
                    throw new Error('Vous n\'êtes pas autorisé à traiter cette invitation');
                }
                throw new Error(data?.message || `Erreur ${res.status}: Impossible de traiter l'invitation`);
            }
            
            const actionText = mode === 'accept' ? 'acceptée' : 'refusée';
            showToast(`Invitation ${actionText} avec succès`, 'success');
            
            setShowInvitation(false);
            
            await Promise.all([
                getInvitation(),
                getLitTeam()
            ]);
            
            if (mode === 'accept') {
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
            
        } catch (e: any) {
            console.error('Erreur submitInvitation:', e);
            const errorMessage = e.message || 'Erreur lors du traitement de l\'invitation';
            showToast(errorMessage, 'error');
        } finally {
            setIsSubmittingInvitation(false);
        }
    };

    // =============================
    // API: Delete Team
    // =============================
    const deleteTeam = async () => {
        if (!listTeam?.team_id) {
            showToast('Aucune équipe à supprimer', 'error');
            return;
        }
        
        setIsDeletingTeam(true);
        setDeleteError(null);
        
        try {
            const res = await fetch(`/api/contests/${details.id}/teams/${listTeam.team_id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: details.id
                })
            });
            
            let data;
            try {
                data = await res.json();
            } catch (e) {
                if (res.ok) {
                    // La suppression a réussi même sans réponse JSON
                    showToast('Équipe supprimée avec succès', 'success');
                    setShowPopupDelete(false);
                    toggleManageTeam();
                    setListTeam(null);
                    return;
                }
                throw new Error('Réponse invalide du serveur');
            }
            
            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error('Équipe non trouvée');
                }
                if (res.status === 403) {
                    throw new Error('Vous n\'êtes pas autorisé à supprimer cette équipe');
                }
                if (res.status === 400) {
                    throw new Error(data?.message || 'Impossible de supprimer l\'équipe');
                }
                throw new Error(data?.message || `Erreur ${res.status}: Impossible de supprimer l'équipe`);
            }
            
            showToast('Équipe supprimée avec succès', 'success');
            setShowPopupDelete(false);
            toggleManageTeam();
            setListTeam(null);
            
        } catch (e: any) {
            console.error('Erreur deleteTeam:', e);
            const errorMessage = e.message || 'Erreur lors de la suppression';
            setDeleteError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setIsDeletingTeam(false);
        }
    };

    // =============================
    // Initialization Effects
    // =============================
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                getInvitation(),
                new Promise(resolve => setTimeout(resolve, 500))
            ]);
            setIsLoading(false);
        };
        loadData();
    }, [showInvitation, showCreateTeamModal, showManageTeam, showInvitation]);

    useEffect(() => {
        if (teamData?.dataTeam?.is_member) {
            getLitTeam();
        }
    }, [showCreateTeamModal, showManageTeam, teamData?.dataTeam?.is_member]);

    // =============================
    // Computed Values
    // =============================
    const countdown = useMemo(() => {
        if (!details || !details.has_started) return start - now;
        if (details.is_ongoing) return end - now;
        return 0;
    }, [now, start, end, details]);

    const toggleCreateTeamModal = () => {
        setShowCreateTeamModal(!showCreateTeamModal);
        setCreateTeamError(null);
        setTeamName("");
    }

    const toggleManageTeam = () => {
        setShowManageTeam(!showManageTeam);
        setInviteError(null);
    }

    const showChallenges = details?.is_ongoing || details?.is_finished;
    const showLeaderboard = details?.is_ongoing || details?.is_finished;

    const getStatusConfig = () => {
        if (details?.is_ongoing) {
            return {
                bg: "bg-teal-50",
                border: "border-teal-200",
                badge: "bg-teal-100 text-teal-700",
                icon: <Zap className="w-6 h-6 text-teal-600" />
            };
        }
        if (details?.is_finished) {
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

    const getRankBadge = (rank: number) => {
        if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
        if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
        return null;
    };

    const statusConfig = getStatusConfig();
    const fadeIn = "animate-in fade-in duration-500";
    const slideUp = "animate-in slide-in-from-bottom-4 duration-500";
    const slideRight = "animate-in slide-in-from-right duration-500";
    const scaleIn = "animate-in zoom-in duration-300";

    if (!details || isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-mono">
            {/* Toast Notifications */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}

            <div className="max-w-7xl mx-auto space-y-6 p-6">
                
                {/* Create Team Modal */}
                {showCreateTeamModal && (
                    <div className={`fixed h-screen inset-0 z-50 flex items-center justify-center bg-black/50 p-4`}>
                        <div className={`relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 ${scaleIn}`}>
                            <button 
                                onClick={toggleCreateTeamModal} 
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90"
                                disabled={isCreatingTeam}
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
                                        className="w-full px-3 py-2 font-mono text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                                        placeholder="Enter team name (min. 3 characters)"
                                        value={teamName} 
                                        onChange={(e) => setTeamName(e.target.value)} 
                                        required
                                        disabled={isCreatingTeam}
                                        minLength={3}
                                    />
                                </div>
                                {createTeamError && (
                                    <div className="text-red-600 text-xs bg-red-50 p-2 rounded border border-red-200">
                                        {createTeamError}
                                    </div>
                                )}
                                <button 
                                    type="submit"
                                    disabled={isCreatingTeam}
                                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                >
                                    {isCreatingTeam ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Team'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Manage Team Sidebar */}
                {showManageTeam && (
                    <div className={`fixed h-screen inset-0 z-50 flex justify-end`}>
                        <div 
                            onClick={toggleManageTeam}
                            className="absolute inset-0 bg-black/50"
                        ></div>
                        
                        <div className={`relative w-full max-w-md bg-white h-full shadow-xl overflow-y-auto ${slideRight}`}>
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
                                <button 
                                    onClick={toggleManageTeam}
                                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90"
                                    disabled={isDeletingTeam || isInvitingMember}
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
                                                className="w-full px-3 py-2 font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                                                value={memberEmail} 
                                                onChange={(e) => setMemberEmail(e.target.value)} 
                                                required
                                                disabled={isInvitingMember}
                                            />
                                            {inviteError && (
                                                <div className="text-red-600 text-xs bg-red-50 p-2 rounded border border-red-200">
                                                    {inviteError}
                                                </div>
                                            )}
                                            <button 
                                                type="submit"
                                                disabled={isInvitingMember}
                                                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                            >
                                                {isInvitingMember ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    'Send Invitation'
                                                )}
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
                                        {isLoadingTeam ? (
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
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-md bg-teal-100 flex items-center justify-center font-medium text-teal-700 text-sm transition-transform duration-200 hover:scale-110">
                                                            {member.prenom?.charAt(0) && member.nom?.charAt(0) 
                                                                ? `${member.prenom.charAt(0)}${member.nom.charAt(0)}` 
                                                                : member.username?.charAt(0).toUpperCase() || '?'}
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
                            {deleteError && (
                                <div className="mx-6 mb-2 text-red-600 text-xs bg-red-50 p-2 rounded border border-red-200">
                                    {deleteError}
                                </div>
                            )}
                            {teamData?.dataTeam?.is_captain ? (
                                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                                    <button 
                                        onClick={() => setShowPopupDelete(true)} 
                                        disabled={isDeletingTeam}
                                        className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Team
                                    </button>
                                    <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 cursor-not-allowed" disabled>
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div>
                            ) : (
                                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                                    <button className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 cursor-not-allowed" disabled>
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
                    <div className={`fixed h-screen inset-0 bg-black/50 z-50 flex items-center justify-center p-4`}>
                        <div className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 ${scaleIn}`}>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-orange-600" />
                            </div>
                            <h1 className='text-orange-600 text-lg font-semibold text-center mb-3'>Warning</h1>
                            <p className='text-gray-600 text-center text-sm mb-2'>This action will unregister you from the contest as well as all the team members.</p> 
                            <p className='text-gray-600 text-center text-sm mb-4'>
                                <span className='font-medium text-gray-900'>Note:</span> You can create a new team or join an existing team only before the contest starts.
                            </p>
                            {deleteError && (
                                <div className="mb-3 text-red-600 text-xs bg-red-50 p-2 rounded border border-red-200">
                                    {deleteError}
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowPopupDelete(false)} 
                                    disabled={isDeletingTeam}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>    
                                <button 
                                    onClick={deleteTeam} 
                                    disabled={isDeletingTeam}
                                    className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                >
                                    {isDeletingTeam ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Yes, Delete'
                                    )}
                                </button>    
                            </div>                
                        </div>
                    </div>
                )}

                {/* Invitation Modal */}
                {showInvitation && (
                    <div className={`fixed h-screen inset-0 bg-black/50 h-screen z-50 flex items-center justify-center p-4`}>
                        <div className={`bg-white rounded-lg shadow-lg max-w-md w-full px-6 relative py-8 ${scaleIn}`}>
                            <button 
                                onClick={() => setShowInvitation(false)} 
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-all duration-200 hover:rotate-90"
                                disabled={isSubmittingInvitation}
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="text-center mb-4">
                                <Mail className="w-12 h-12 text-teal-500 mx-auto" />
                                <h3 className="text-lg font-semibold text-gray-900 mt-2">Team Invitation</h3>
                            </div>
                            {invitationError && (
                                <div className="mb-3 text-red-600 text-xs bg-red-50 p-2 rounded border border-red-200 text-center">
                                    {invitationError}
                                </div>
                            )}
                            {isLoadingInvitations ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                                </div>
                            ) : invitation && invitation.length > 0 ? (
                                invitation.map((inv: any, index: number) => (
                                    <div className="w-full border-t border-gray-200 py-4" key={index}>
                                        <p className='text-gray-600 text-center text-sm mb-4'>
                                            {inv?.message}
                                        </p>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => submitInvitation(inv.token, 'decline')} 
                                                disabled={isSubmittingInvitation}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Decline
                                            </button>    
                                            <button 
                                                onClick={() => submitInvitation(inv.token, 'accept')} 
                                                disabled={isSubmittingInvitation}
                                                className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                            >
                                                {isSubmittingInvitation ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Accept'
                                                )}
                                            </button>    
                                        </div>  
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-6">
                                    No pending invitations.
                                </div>
                            )}    
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className={`flex justify-end gap-3 ${fadeIn} ${slideUp}`}>
                    {invitation && invitation.length > 0 && (
                        <button 
                            onClick={() => setShowInvitation(true)} 
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
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${fadeIn} ${slideUp}`}>
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
                <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md ${fadeIn} ${slideUp}`}>
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
                                            className="group block border border-gray-200 rounded-md p-4 hover:border-teal-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
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