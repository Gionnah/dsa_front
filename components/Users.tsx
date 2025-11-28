"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [usersData, setUsersData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [invitationUrl, setInvitationUrl] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPath, setSelectedPath] = useState("All paths");
  const [sortBy, setSortBy] = useState("Most recent");

  const getIsAdmin = async () => {
    try {
      const response = await fetch("/api/is-admin");
      const data = await response.json();
      setIsAdmin(data.is_admin);
    } catch (error) {
      console.error("Error checking admin rights:", error);
    }
  };

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
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvitationUrl = () => {
    const generateToken = () => {
      return (
        Array.from({ length: 32 }, () =>
          Math.random().toString(36).charAt(2)
        ).join("") + Date.now().toString(36)
      );
    };

    const token1 = generateToken();
    const token2 = generateToken();
    const url = `/members/invitation/${token1}/${token2}`;
    setInvitationUrl(url);
  };

  const copyInvitationUrl = () => {
    const fullUrl = `${invitationUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
    window.location.href = fullUrl;
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

  const getUserColor = (userId: any) => {
    return colorGradients[userId % colorGradients.length];
  };

  const formatUsername = (username: string) => {
    return username.startsWith('@') ? username : `@${username}`;
  };

  // Filter and search logic
  const filteredUsers = usersData.filter((user: any) => {
    const matchesSearch = 
      user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPath = selectedPath === "All paths" || user.parcours === selectedPath;
    
    return matchesSearch && matchesPath;
  });

  // Sort logic
  const sortedUsers = [...filteredUsers].sort((a: any, b: any) => {
    switch (sortBy) {
      case "Most recent":
        return b.id - a.id;
      case "Oldest":
        return a.id - b.id;
      case "Most XP":
        return b.total_xp - a.total_xp;
      case "Least XP":
        return a.total_xp - b.total_xp;
      default:
        return 0;
    }
  });

  // Get unique paths for filter dropdown
  const uniquePaths = ["All paths", ...new Set(usersData.map((user: any) => user.parcours))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 rounded-2xl px-8 py-10 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700 text-lg font-medium">Loading users...</span>
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
              {sortedUsers.length} User{sortedUsers.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Invitation button */}
          {isAdmin && (
            <div className="relative">
              <button
                onClick={copyInvitationUrl}
                className="inline-flex items-center hover:cursor-pointer gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Invite User
              </button>
              
              {showCopied && (
                <div className="absolute top-full right-0 mt-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg shadow-lg animate-fade-in">
                  ✓ Redirecting!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Last name, first name or @username..."
                className="w-full border text-gray-700 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Path</label>
            <select 
              className="w-full text-gray-700 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white"
              value={selectedPath}
              onChange={(e) => setSelectedPath(e.target.value)}
            >
              {uniquePaths.map((path) => (
                <option key={path as string} value={path as string}>{path as string}</option>
              ))}
            </select>
          </div>
          
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select 
              className="w-full text-gray-700 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Most recent</option>
              <option>Oldest</option>
              <option>Most XP</option>
              <option>Least XP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Registration N°
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Path
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Challenges
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers && sortedUsers.length > 0 ? (
                sortedUsers.map((user: any) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {user.photo ? (
                          <div className="relative group">
                            <img
                                src={user.photo}
                                alt={`${user.prenom} ${user.nom}`}
                                className="w-12 h-12 rounded-xl object-cover cursor-pointer border-2 border-white shadow-sm transition-transform duration-200 group-hover:scale-105"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  
                                  // Créer la modal
                                  const modal = document.createElement('div');
                                  modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm';
                                  modal.onclick = () => {
                                    document.body.removeChild(modal);
                                    document.body.style.overflow = 'auto'; // Réactiver le scroll
                                  };
                                  
                                  // Créer le conteneur de l'image
                                  const imageContainer = document.createElement('div');
                                  imageContainer.className = 'relative max-w-4xl max-h-[90vh] p-4';
                                  imageContainer.onclick = (e) => e.stopPropagation();
                                  
                                  // Créer l'image agrandie
                                  const img = document.createElement('img');
                                  img.src = user.photo;
                                  img.alt = `${user.prenom} ${user.nom}`;
                                  img.className = 'w-full h-full object-contain rounded-lg shadow-2xl';
                                  img.oncontextmenu = (e) => e.preventDefault();
                                  
                                  // Bouton de fermeture
                                  const closeButton = document.createElement('button');
                                  closeButton.className = 'absolute -top-2 -right-2 bg-white hover:bg-gray-100 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors';
                                  closeButton.innerHTML = `
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  `;
                                  closeButton.onclick = () => {
                                    document.body.removeChild(modal);
                                    document.body.style.overflow = 'auto';
                                  };
                                  
                                  // Empêcher le scroll du body quand la modal est ouverte
                                  document.body.style.overflow = 'hidden';
                                  
                                  imageContainer.appendChild(img);
                                  imageContainer.appendChild(closeButton);
                                  modal.appendChild(imageContainer);
                                  document.body.appendChild(modal);
                                }}
                                onContextMenu={(e) => e.preventDefault()}
                              />
                            <div className="absolute inset-0 rounded-xl bg-black/20 transition-all duration-200 flex items-center justify-center">
                              <svg className="w-5 h-5 text-white opacity-0 group-hover:opacity-70 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-xl bg-linear-to-br ${getUserColor(user.id)} flex items-center justify-center font-bold text-white shadow-sm text-lg`}
                          >
                            {user.prenom?.charAt(0) && user.nom?.charAt(0) 
                              ? `${user.prenom.charAt(0)}${user.nom.charAt(0)}` 
                              : user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
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
                      <button className="inline-flex cursor-not-allowed items-center gap-1 text-indigo-600 hover:text-indigo-400 text-sm font-medium transition-colors">
                        <span>View profile</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">No users found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}