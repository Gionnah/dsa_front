import { useState } from 'react';
import { Search, Calendar, Users, Trophy, Code, Zap, Target, ArrowLeftRight, MapPin, Award, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

const CodingEventsPage = ({ events }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredEvents = events.filter((event: any) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-500/10 text-blue-600 border border-blue-500/30';
      case 'ongoing': return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30';
      case 'finished': return 'bg-gray-500/10 text-gray-600 border border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getEventIcon = (title: string) => {
    if (title.includes('Algo')) return <Target className="w-6 h-6" />;
    if (title.includes('Python')) return <Code className="w-6 h-6" />;
    if (title.includes('Web')) return <Zap className="w-6 h-6" />;
    if (title.includes('Data')) return <ArrowLeftRight className="w-6 h-6" />;
    if (title.includes('Mobile')) return <Code className="w-6 h-6" />;
    return <Trophy className="w-6 h-6" />;
  };

  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime()
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-900 via-blue-900 to-slate-900 pt-8 pb-12 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative">
                <span className="text-7xl font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DSA
                </span>
                <div className="absolute -inset-2 bg-linear-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg blur-xl"></div>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              Compete. Code. Conquer.
            </h1>
          </div>
          
          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-indigo-950 bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:border-blue-400 focus:outline-none transition-all shadow-lg placeholder-gray-500"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap justify-center">
              {['all', 'upcoming', 'ongoing', 'finished'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-2.5 font-bold transition-all text-sm rounded-lg cursor-pointer ${
                    filterStatus === status
                      ? 'bg-white text-blue-600 shadow-lg scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  {status === 'all' ? 'All Events' : status === 'upcoming' ? 'Upcoming' : status === 'ongoing' ? 'Live' : 'Completed'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="w-full p-4 md:p-6">
        <div className="mx-auto">
          {/* Timeline Container */}
          <div className="relative">
            {/* Timeline Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-1 bg-linear-to-b from-blue-400 via-purple-400 to-pink-400 rounded-full"></div>
            
            {/* Events List */}
            <div className="space-y-8">
              {sortedEvents.map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Timeline Marker */}
                  <div className={`absolute left-4 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 border-white shadow-lg z-10 ${
                    event.statut === 'upcoming' 
                      ? 'bg-linear-to-br from-blue-500 to-blue-600' 
                      : event.statut === 'ongoing'
                      ? 'bg-linear-to-br from-emerald-500 to-emerald-600 animate-pulse'
                      : 'bg-linear-to-br from-gray-400 to-gray-500'
                  }`}></div>

                  {/* Event Card */}
                  <div className="ml-12">
                    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1">
                      <div className="md:flex">
                        {/* Image on Left */}
                        <div className="md:w-1/3 relative">
                          <div className={`relative h-48 md:h-full bg-linear-to-br ${
                            event.statut === 'upcoming' 
                              ? 'from-blue-500 to-indigo-600' 
                              : event.statut === 'ongoing'
                              ? 'from-emerald-500 to-teal-600'
                              : 'from-gray-500 to-slate-600'
                          }`}>
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
                                {getEventIcon(event.title)}
                              </div>
                            </div>
                            {/* Status Badge */}
                            <div className="absolute top-4 left-4">
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${getStatusColor(event.statut)} bg-white/90`}>
                                {event.status_display}
                              </span>
                            </div>
                            {/* Date Badge */}
                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                              <div className="text-2xl font-bold text-gray-800 leading-none">
                                {new Date(event.date_debut).getDate()}
                              </div>
                              <div className="text-xs font-semibold text-gray-600">
                                {new Date(event.date_debut).toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content on Right */}
                        <div className="md:w-2/3 p-4">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 mb-5 leading-relaxed">
                            {event?.description || "No description available."}
                          </p>

                          {/* Event Details */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-3 text-gray-700">
                              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold">{event.nombre_team} Teams</div>
                                <div className="text-xs text-gray-500">{event.type_display}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-gray-700">
                              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                <Code className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold">{event.challenges_count} Challenges</div>
                                <div className="text-xs text-gray-500">To solve</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-700">
                              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold">{event?.location || "Online"}</div>
                                <div className="text-xs text-gray-500">Location</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-700">
                              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold">{formatTime(event.date_debut)}</div>
                                <div className="text-xs text-gray-500">{formatDate(event.date_debut)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Action link */}
                          <Link href={`/members/event/contest/${event.id}`} className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                            event.statut === 'upcoming' 
                              ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/50' 
                              : event.statut === 'ongoing'
                              ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:shadow-emerald-500/50'
                              : 'bg-linear-to-r from-gray-600 to-slate-600 text-white hover:shadow-gray-500/50'
                          }`}>
                            {event.statut === 'upcoming' 
                              ? 'Join Event' 
                              : event.statut === 'ongoing'
                              ? 'Join Live Event'
                              : 'View Results'
                            }
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {sortedEvents.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-12 h-12 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No events found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingEventsPage;