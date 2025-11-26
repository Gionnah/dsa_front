"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [usersData, setUsersData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [invitationUrl, setInvitationUrl] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const getIsAdmin = async () => {
    try {
      const response = await fetch("/api/is-admin");
      const data = await response.json();
      setIsAdmin(data.is_admin);
    }
    catch (error) {
      console.error("Erreur lors de la vérification des droits admin:", error);
    }
  }
  
  useEffect(() => {
    getIsAdmin();
    fetchUsers();
    generateInvitationUrl();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsersData(data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Génère une URL d'invitation avec deux tokens aléatoires
  const generateInvitationUrl = () => {
    const generateToken = () => {
      return Array.from({ length: 32 }, () => 
        Math.random().toString(36).charAt(2)
      ).join('') + Date.now().toString(36);
    };
    
    const token1 = generateToken();
    const token2 = generateToken();
    const url = `/members/invitation/${token1}/${token2}`;
    setInvitationUrl(url);
  };

  // Copie l'URL d'invitation dans le presse-papier
  const copyInvitationUrl = () => {
    const fullUrl = `${window.location.origin}${invitationUrl}`;
    window.location.href = fullUrl;
    navigator.clipboard.writeText(fullUrl);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
    window.location.href = fullUrl;
  };

  // Tableau de couleurs prédéfinies pour les avatars
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

  // Fonction pour obtenir une couleur basée sur l'ID de l'utilisateur
  const getUserColor = (userId: any) => {
    return colorGradients[userId % colorGradients.length];
  };

  // Fonction pour formater le nom d'utilisateur avec @
  const formatUsername = (username: string) => {
    return username.startsWith('@') ? username : `@${username}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 rounded-2xl px-8 py-10 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700 text-lg font-medium">Chargement des utilisateurs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Users List</h1>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col lg:flex-row items-end gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-gray-900 font-semibold">
              {usersData.length} User{usersData.length > 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Bouton d'invitation */}

          {
            isAdmin &&
            <div className="relative">
            <button
              onClick={copyInvitationUrl}
              className="inline-flex items-center hover:cursor-pointer gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Invitation 
            </button>
            
            {/* Notification de copie */}
            {showCopied && (
              <div className="absolute top-full right-0 mt-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg shadow-lg animate-fade-in">
                ✓ Redirection!
              </div>
            )}
            </div>
          }
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search..</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Last name, first name or @username..."
                className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none"
              />
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Parcours</label>
            <select className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white">
              <option>Tous les parcours</option>
              <option>Développement Web</option>
              <option>Data Science</option>
              <option>DevOps</option>
            </select>
          </div>
          
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
            <select className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white">
              <option>Plus récents</option>
              <option>Plus anciens</option>
              <option>Plus d'XP</option>
              <option>Moins d'XP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table des utilisateurs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  N° Inscription
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Parcours
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Challenges
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Expérience
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {usersData && usersData?.length > 0 && usersData?.map((user: any) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-linear-to-br ${getUserColor(user.id)} flex items-center justify-center font-bold text-white shadow-sm text-lg`}
                      >
                        {user.prenom?.charAt(0) && user.nom?.charAt(0) 
                          ? `${user.prenom.charAt(0)}${user.nom.charAt(0)}` 
                          : user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.prenom} {user.nom}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatUsername(user.username)}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      #{user.numero_inscription}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 font-medium">
                      {user.parcours}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">
                        {user.challenges_joined}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-bold text-amber-600">
                        {user.total_xp.toLocaleString()} XP
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
                      <span>Voir profil</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usersData.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">Aucun utilisateur trouvé</p>
            <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}
      </div>

      {/* URL d'invitation cachée (pour référence) */}
      {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-1">Lien d'invitation généré</p>
            <code className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded break-all">
              {window.location.origin}{invitationUrl}
            </code>
          </div>
        </div>
      </div> */}
    </div>
  );
}