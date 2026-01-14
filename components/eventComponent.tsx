import  { useState } from 'react';
import { Search, Calendar, Users, Trophy, Code, Zap, Target, ArrowLeftRight, MapPin, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const CodingEventsPage = ({ events }: { events: any[] }) => {
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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-800 border border-green-200';
      case 'finished': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="md:flex justify-between bg-gray-900 pt-6 px-6">
        <div className="text-center">
          <div className="md:flex mb-3 md:mb-0 items-center gap-4">
            <div className="w-52 h-16 flex items-center justify-center">
              <span className="text-gray-500 font-bold text-6xl">DSA</span>
            </div>
          </div>
          <h1 className="text-xl hidden md:block pl-6 md:text-sm font-black mb-4 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Compete. Code. Conquer.
          </h1>
        </div>
        
        {/* Search Section */}
        <div className="">
          <div className="">
            <div className="relative flex-1 mb-5">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
              />
            </div>
            
            <div className="flex md:gap-2 flex-wrap">
              {['all', 'upcoming', 'ongoing', 'finished'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2 cursor-pointer md:px-6 py-2 font-bold transition-all text-xs md:text-sm ${
                    filterStatus === status
                      ? 'text-gray-600 bg-indigo-50 rounded-t hover:bg-indigo-50 scale-105'
                      : 'text-white hover:bg-indigo-50 hover:text-gray-600'
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
      <div className="w-full p-2 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Timeline Container */}
          <div className="relative">
            {/* Timeline Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-400 via-purple-400 to-pink-400"></div>
            
            {/* Events List */}
            <div className="space-y-12">
              {sortedEvents.map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Timeline Marker */}
                  <div className={`absolute left-8 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-white z-10 ${
                    event.statut === 'upcoming' 
                      ? 'bg-blue-500' 
                      : event.statut === 'ongoing'
                      ? 'bg-green-500'
                      : 'bg-gray-400'
                  }`}></div>

                  {/* Event Card */}
                  <div className="ml-20">
                    {/* Event Content */}
                    <div className="md:flex md:items-stretch bg-white rounded-xl overflow-hidden border border-gray-200">
                      {/* Image on Left */}
                      <div className="md:w-1/4 relative">
                        <div className="relative h-48 md:h-full bg-linear-to-br from-gray-100 to-gray-200">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${
                              event.statut === 'upcoming' 
                                ? 'bg-linear-to-r from-blue-500 to-blue-600' 
                                : event.statut === 'ongoing'
                                ? 'bg-linear-to-r from-green-500 to-green-600'
                                : 'bg-linear-to-r from-gray-500 to-gray-600'
                            }`}>
                              {getEventIcon(event.title)}
                            </div>
                          </div>
                          {/* Status Badge */}
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(event.statut)}`}>
                              {event.status_display}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content on Right */}
                      <div className="md:w-3/4 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                            <p className="text-gray-600 mt-2">{event?.description ? event.description : "No description available."}</p>
                          </div>
                          
                          {/* Date for Mobile */}
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-700">
                              {formatDate(event.date_debut)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(event.date_debut)}
                            </div>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="grid grid-cols-1 gap-4 mb-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-600">
                                <Users className="w-4 h-4 mr-2 shrink-0" />
                                <span className="text-sm">{event.type_display} • {event.nombre_team} team{event.nombre_team !== 1 ? 's' : ''}</span>
                              </div>
                              
                              <div className="flex items-center text-gray-600">
                                <Code className="w-4 h-4 mr-2 shrink-0" />
                                <span className="text-sm">{event.challenges_count} challenge{event.challenges_count !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 shrink-0" />
                              <span className="text-sm">{event?.location ? event.location : "Location not specified"}</span>
                            </div>
                            <Link href={`/members/event/contest/${event.id}`} className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center ${
                                event.statut === 'upcoming' 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : event.statut === 'ongoing'
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-600 text-white hover:bg-gray-700'
                            }`}>
                                {event.statut === 'upcoming' 
                                ? 'Join Event' 
                                : event.statut === 'ongoing'
                                ? 'Join Event'
                                : 'View Results'
                                }
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {sortedEvents.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No events found</h3>
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