import { useState, useEffect } from 'react';
import { Search, Calendar, Users, Trophy, Code, Zap, Target, ArrowLeftRight, MapPin, Award, ChevronRight, Clock, Swords } from 'lucide-react';
import Link from 'next/link';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
    bg:      '#f8f9fb',
    surface: '#ffffff',
    raised:  '#f1f5f9',
    border:  '#e2e8f0',
    borderMd:'#cbd5e1',
    text:    '#475569',
    textHi:  '#0f172a',
    textMid: '#64748b',
    textDim: '#94a3b8',
    teal:    '#0d9488',
    tealBg:  '#f0fdfa',
    tealBdr: '#99f6e4',
    amber:   '#d97706',
    blue:    '#2563eb',
    blueBg:  '#eff6ff',
    blueBdr: '#bfdbfe',
};

const STATUS: Record<string, { color: string; bg: string; border: string; line: string }> = {
    upcoming: { color: T.blue,    bg: T.blueBg,  border: T.blueBdr,  line: T.blue    },
    ongoing:  { color: T.teal,    bg: T.tealBg,  border: T.tealBdr,  line: T.teal    },
    finished: { color: T.textMid, bg: T.raised,  border: T.border,   line: T.borderMd },
};

const mono = "'IBM Plex Mono', monospace";
const sans = "'Inter', system-ui, sans-serif";

const FILTERS = [
    { key: 'all',      label: 'all'      },
    { key: 'upcoming', label: 'upcoming' },
    { key: 'ongoing',  label: 'live'     },
    { key: 'finished', label: 'finished' },
];

function fmtDate(s: string) {
    return new Date(s).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Skeleton Components ─────────────────────────────────────────────────────
function EventCardSkeleton() {
    return (
        <div style={{ display: 'flex', gap: 0, marginBottom: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                <div style={{ marginTop: 20, flexShrink: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: T.border }} />
                </div>
                <div style={{ flex: 1, width: 2, marginTop: 6, background: T.border, minHeight: 24 }} />
            </div>
            <div style={{ flex: 1, paddingLeft: 14, paddingBottom: 18 }}>
                <div style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    overflow: 'hidden',
                    display: 'flex',
                    minHeight: 130,
                }}>
                    <div style={{ width: 150, flexShrink: 0, background: T.raised, 
                        // animation: 'pulse 1.5s ease-in-out infinite' 
                        }} />
                    <div style={{ flex: 1, padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <div style={{ width: 60, height: 20, background: T.raised, borderRadius: 4, 
                                // animation: 'pulse 1.5s ease-in-out infinite' 
                                }} />
                            <div style={{ width: 40, height: 16, background: T.raised, borderRadius: 4,
                                //  animation: 'pulse 1.5s ease-in-out infinite' 
                                 }} />
                        </div>
                        <div style={{ width: '80%', height: 20, background: T.raised, borderRadius: 6, marginBottom: 8, 
                            // animation: 'pulse 1.5s ease-in-out infinite' 
                            }} />
                        <div style={{ width: '100%', height: 32, background: T.raised, borderRadius: 6, marginBottom: 12, 
                            // animation: 'pulse 1.5s ease-in-out infinite' 
                            }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <div style={{ width: 80, height: 24, background: T.raised, borderRadius: 5, 
                                    // animation: 'pulse 1.5s ease-in-out infinite' 
                                }} />
                                <div style={{ width: 80, height: 24, background: T.raised, borderRadius: 5, 
                                    // animation: 'pulse 1.5s ease-in-out infinite' 
                                }} />
                            </div>
                            <div style={{ width: 60, height: 20, background: T.raised, borderRadius: 4, 
                                // animation: 'pulse 1.5s ease-in-out infinite' 
                                }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HeaderSkeleton() {
    return (
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 pt-8 pb-12 px-6 shadow-xl">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="w-32 h-12 bg-white/10 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="w-64 h-8 bg-white/10 rounded-lg mx-auto mb-3 animate-pulse"></div>
                </div>
                
                <div className="max-w-4xl mx-auto">
                    <div className="relative mb-6">
                        <div className="w-full h-14 bg-white/10 rounded-xl animate-pulse"></div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap justify-center">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-24 h-10 bg-white/10 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TopBarSkeleton() {
    return (
        <div style={{
            background: T.surface, borderBottom: `1px solid ${T.border}`,
            padding: '0 36px', height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
            <div style={{ width: 60, height: 16, background: T.raised, borderRadius: 4,
                //  animation: 'pulse 1.5s ease-in-out infinite' 
                 }} />
            <div style={{ width: 100, height: 16, background: T.raised, borderRadius: 4, 
                // animation: 'pulse 1.5s ease-in-out infinite' 
                }} />
        </div>
    );
}

function ControlsSkeleton() {
    return (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 300 }}>
                <div style={{ width: '100%', height: 34, background: T.raised, borderRadius: 7, 
                    // animation: 'pulse 1.5s ease-in-out infinite' 
                    }} />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ width: 70, height: 32, background: T.raised, borderRadius: 6, 
                        // animation: 'pulse 1.5s ease-in-out infinite' 
                    }} />
                ))}
            </div>
        </div>
    );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, color: T.textMid, fontFamily: mono,
            background: T.raised, border: `1px solid ${T.border}`,
            borderRadius: 5, padding: '4px 9px', whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
        }}>
            <span style={{ color: T.teal, transition: 'transform 0.2s' }}>{icon}</span>
            {label}
        </span>
    );
}

// ─── EventCard with Timeline ─────────────────────────────────────────────────
function EventCard({ event, isLast }: { event: any; isLast: boolean }) {
    const st     = STATUS[event.statut] ?? STATUS.finished;
    const isLive = event.statut === 'ongoing';

    return (
        <div style={{ display: 'flex', gap: 0, }}>

            {/* ── Timeline column ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                {/* Dot */}
                <div style={{ position: 'relative', marginTop: 20, flexShrink: 0 }}>
                    <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: st.line, zIndex: 1, position: 'relative',
                        transition: 'transform 0.2s ease',
                    }} />
                    {isLive && (
                        <div style={{
                            position: 'absolute', top: -3, left: -3,
                            width: 16, height: 16, borderRadius: '50%',
                            border: `2px solid ${T.teal}`, opacity: 0.5,
                            // animation: 'ping 1.6s ease-out infinite',
                        }} />
                    )}
                </div>
                {/* Line */}
                {!isLast && (
                    <div style={{
                        flex: 1, width: 2, marginTop: 6,
                        background: `linear-gradient(to bottom, ${st.line}55, ${T.border})`,
                        minHeight: 24,
                    }} />
                )}
            </div>

            {/* ── Card ── */}
            <div style={{ flex: 1, paddingLeft: 14, paddingBottom: isLast ? 0 : 18 }}>
                <Link href={`/members/event/contest/${event.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div
                        style={{
                            background: T.surface,
                            border: `1px solid ${T.border}`,
                            borderLeft: `3px solid ${st.line}`,
                            borderRadius: 10,
                            overflow: 'hidden',
                            display: 'flex',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                            minHeight: 130,
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                        }}
                    >
                        {/* Image */}
                        {event.contest_img && (
                            <div style={{ width: 150, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                                <img
                                    src={event.contest_img}
                                    alt={event.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to right, rgba(0,0,0,0.15), transparent)',
                                }} />
                                <div style={{
                                    position: 'absolute', bottom: 8, left: 8,
                                    background: 'rgba(15,23,42,0.72)', backdropFilter: 'blur(6px)',
                                    borderRadius: 6, padding: '5px 8px',
                                    color: '#fff', fontFamily: mono, lineHeight: 1,
                                    transition: 'transform 0.2s ease',
                                }}>
                                    <div style={{ fontSize: 17, fontWeight: 800 }}>
                                        {new Date(event.date_debut).getDate()}
                                    </div>
                                    <div style={{ fontSize: 10, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 1 }}>
                                        {new Date(event.date_debut).toLocaleDateString('en-US', { month: 'short' })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                                    <span style={{
                                        fontSize: 10, fontFamily: mono, fontWeight: 700,
                                        letterSpacing: '0.08em', textTransform: 'uppercase',
                                        color: st.color, background: st.bg, border: `1px solid ${st.border}`,
                                        borderRadius: 4, padding: '3px 9px',
                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                        transition: 'all 0.2s ease',
                                    }}>
                                        {isLive && (
                                            <span style={{
                                                width: 5, height: 5, borderRadius: '50%',
                                                background: T.teal, display: 'inline-block',
                                                // animation: 'pulse 1.4s ease-in-out infinite',
                                            }} />
                                        )}
                                        {event.status_display}
                                    </span>
                                    <span style={{ fontSize: 11, color: T.textDim, fontFamily: mono }}>
                                        {event.type_display}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: T.textHi, margin: '0 0 5px', lineHeight: 1.3 }}>
                                    {event.title}
                                </h3>
                                {event.description && (
                                    <p style={{
                                        fontSize: 12, color: T.textMid, margin: 0, lineHeight: 1.55,
                                        display: '-webkit-box', WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                    }}>
                                        {event.description}
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    <Chip icon={<Swords size={10} />} label={`${event.challenges_count} challenges`} />
                                    <Chip icon={<Calendar size={10} />} label={fmtDate(event.date_debut)} />
                                    <Chip icon={<Clock size={10} />}    label={`ends ${fmtDate(event.date_fin)}`} />
                                </div>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 3,
                                    fontSize: 12, fontWeight: 600, color: st.color, flexShrink: 0,
                                    transition: 'gap 0.2s ease',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.gap = '6px')}
                                onMouseLeave={e => (e.currentTarget.style.gap = '3px')}>
                                    {event.statut === 'upcoming' ? 'register' : event.statut === 'ongoing' ? 'join now' : 'results'}
                                    <ChevronRight size={13} style={{ transition: 'transform 0.2s ease' }} />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
const CodingEventsPage = ({ events }: { events: any[] }) => {
    const [search, setSearch]       = useState('');
    const [filter, setFilter]       = useState('all');
    const [loading, setLoading]     = useState(true);

    useEffect(() => {
        // Simulate loading for better UX
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const safe = events ?? [];

    const counts: Record<string, number> = { all: safe.length };
    safe.forEach(e => { counts[e.statut] = (counts[e.statut] ?? 0) + 1; });

    const filtered = [...safe]
        .filter(e => {
            const s = e.title.toLowerCase().includes(search.toLowerCase());
            const f = filter === 'all' || e.statut === filter;
            return s && f;
        })
        .sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());

    // Loading State
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: T.bg, fontFamily: mono, color: T.text }}>
                <style>{`
                    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
                    @keyframes ping { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
                `}</style>
                <HeaderSkeleton />
                <TopBarSkeleton />
                <div style={{ maxWidth: 1400, margin: '0 auto', padding: '36px 28px' }}>
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ width: 200, height: 28, background: T.raised, borderRadius: 8, marginBottom: 8, 
                            animation: 'pulse 1.5s ease-in-out infinite' 
                            }} />
                        <div style={{ width: 300, height: 16, background: T.raised, borderRadius: 4, 
                            animation: 'pulse 1.5s ease-in-out infinite' 
                            }} />
                    </div>
                    <ControlsSkeleton />
                    <div>
                        {[1, 2, 3].map((i) => (
                            <EventCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: T.bg, fontFamily: mono, color: T.text }}>
            <style>{`
                @keyframes pulse { 0%,100%{opacity:1}  50%{opacity:.3} }
                // @keyframes ping  { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
                // @keyframes fadeInSlideUp {
                //     from { opacity: 0; transform: translateY(20px); }
                //     to { opacity: 1; transform: translateY(0); }
                // }
                // @keyframes fadeIn {
                //     from { opacity: 0; }
                //     to { opacity: 1; }
                // }
            `}</style>

            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 pt-8 pb-12 px-6 shadow-xl" 
            // style={{ animation: 'fadeIn 0.6s ease-out' }}
            >
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center mb-4">
                    <div className="relative">
                      <span className="text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-in zoom-in duration-500">
                        DSA
                      </span>
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg blur-xl animate-pulse"></div>
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 animate-in slide-in-from-bottom duration-500">
                    Compete. Code. Conquer.
                  </h1>
                </div>
                
                {/* Search Section */}
                <div className="max-w-4xl mx-auto">
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-all duration-200" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl text-indigo-950 bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:border-blue-400 focus:outline-none transition-all duration-300 shadow-lg placeholder-gray-500 hover:shadow-xl"
                      style={{ transition: 'all 0.3s ease' }}
                    />
                  </div>
                  
                  <div className="flex gap-2 flex-wrap justify-center">
                    {['all', 'upcoming', 'ongoing', 'finished'].map((status, idx) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-6 py-2.5 font-bold transition-all text-white duration-300 text-sm rounded-lg cursor-pointer duration-500`}
                        onMouseEnter={e => {
                            if (filter !== status) {
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <span className={filter === status
                            ? 'bg-white text-blue-600 shadow-lg scale-105 inline-block px-6 py-2.5 rounded-lg'
                            : 'inline-block px-6 py-2.5'
                        } style={{ transition: 'all 0.3s ease' }}>
                            {status === 'all' ? 'All Events' : status === 'upcoming' ? 'Upcoming' : status === 'ongoing' ? 'Live' : 'Completed'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Top bar */}
            <div style={{
                background: T.surface, borderBottom: `1px solid ${T.border}`,
                padding: '0 36px', height: 52,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                // animation: 'fadeIn 0.5s ease-out',
            }}>
                <span style={{ color: T.textHi, fontSize: 14, fontWeight: 700, fontFamily: mono }}>events</span>
                <span style={{ fontSize: 12, color: T.textDim, fontFamily: mono }}>
                    {counts.all} total · {counts.ongoing ?? 0} live
                </span>
            </div>

            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '36px 28px' }}>
                {/* Page heading */}
                <div 
                // style={{ marginBottom: 24, animation: 'fadeInSlideUp 0.5s ease-out' }}
                >
                    <h1 style={{ color: T.textHi, fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>
                        Coding Events
                    </h1>
                    <p style={{ color: T.textMid, fontSize: 13, margin: 0 }}>
                        Compete with your team, solve challenges, climb the leaderboard.
                    </p>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 32,
                    //  animation: 'fadeInSlideUp 0.5s ease-out 0.1s both' 
                    }}
                     >
                    <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 300 }}>
                        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.textDim, transition: 'color 0.2s' }} />
                        <input
                            type="text" placeholder="search events…" value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                paddingLeft: 30, paddingRight: 12, height: 34,
                                background: T.surface, border: `1px solid ${T.border}`,
                                borderRadius: 7, fontSize: 12, color: T.textHi,
                                fontFamily: mono, outline: 'none', transition: 'all 0.2s ease',
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = T.teal;
                                e.target.style.boxShadow = `0 0 0 2px ${T.teal}20`;
                            }}
                            onBlur={e  => {
                                e.target.style.borderColor = T.border;
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {FILTERS.map((f, idx) => {
                            const active = filter === f.key;
                            return (
                                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                                    background: active ? T.tealBg : T.surface,
                                    border: `1px solid ${active ? T.tealBdr : T.border}`,
                                    borderRadius: 6, color: active ? T.teal : T.textMid,
                                    fontSize: 11, fontWeight: active ? 700 : 400,
                                    padding: '6px 11px', cursor: 'pointer', fontFamily: mono,
                                    display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s ease',
                                    transform: active ? 'scale(1.02)' : 'scale(1)',
                                }}
                                onMouseEnter={e => {
                                    if (!active) e.currentTarget.style.transform = 'scale(1.02)';
                                }}
                                onMouseLeave={e => {
                                    if (!active) e.currentTarget.style.transform = 'scale(1)';
                                }}>
                                    {f.label}
                                    {counts[f.key] !== undefined && (
                                        <span style={{
                                            fontSize: 10, borderRadius: 8, padding: '1px 5px', fontWeight: 700,
                                            background: active ? T.teal : T.raised,
                                            color: active ? '#fff' : T.textDim,
                                            transition: 'all 0.2s ease',
                                        }}>{counts[f.key]}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Timeline */}
                {filtered.length === 0 ? (
                    <div style={{
                        background: T.surface, border: `1px solid ${T.border}`,
                        borderRadius: 10, padding: '52px 0', textAlign: 'center',
                        color: T.textDim, fontSize: 13, fontFamily: mono,
                        // animation: 'fadeIn 0.5s ease-out',
                    }}>
                        <Search size={24} style={{ margin: '0 auto 10px', color: T.border, display: 'block', transition: 'transform 0.2s' }} />
                        no events match your search
                    </div>
                ) : (
                    <div>
                        {filtered.map((event, idx) => (
                            <div key={event.id} 
                            // style={{ animation: `fadeInSlideUp 0.4s ease-out ${idx * 0.05}s both` }}
                            >
                                <EventCard event={event} isLast={idx === filtered.length - 1} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodingEventsPage;