import { useState } from 'react';
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

// ─── Chip ─────────────────────────────────────────────────────────────────────
function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, color: T.textMid, fontFamily: mono,
            background: T.raised, border: `1px solid ${T.border}`,
            borderRadius: 5, padding: '4px 9px', whiteSpace: 'nowrap',
        }}>
            <span style={{ color: T.teal }}>{icon}</span>
            {label}
        </span>
    );
}

// ─── EventCard with Timeline ────────────────────────────────────────────────────────────────
function EventCard({ event, isLast }: { event: any; isLast: boolean }) {
    const st     = STATUS[event.statut] ?? STATUS.finished;
    const isLive = event.statut === 'ongoing';

    return (
        <div style={{ display: 'flex', gap: 0 }}>

            {/* ── Timeline column ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                {/* Dot */}
                <div style={{ position: 'relative', marginTop: 20, flexShrink: 0 }}>
                    <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: st.line, zIndex: 1, position: 'relative',
                    }} />
                    {isLive && (
                        <div style={{
                            position: 'absolute', top: -3, left: -3,
                            width: 16, height: 16, borderRadius: '50%',
                            border: `2px solid ${T.teal}`, opacity: 0.5,
                            animation: 'ping 1.6s ease-out infinite',
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
                            transition: 'box-shadow 0.15s, transform 0.15s',
                            minHeight: 130,
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)';
                            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
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
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                                {/* Gradient overlay */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to right, rgba(0,0,0,0.15), transparent)',
                                }} />
                                {/* Date badge */}
                                <div style={{
                                    position: 'absolute', bottom: 8, left: 8,
                                    background: 'rgba(15,23,42,0.72)', backdropFilter: 'blur(6px)',
                                    borderRadius: 6, padding: '5px 8px',
                                    color: '#fff', fontFamily: mono, lineHeight: 1,
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
                            {/* Header */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    {/* Status badge */}
                                    <span style={{
                                        fontSize: 10, fontFamily: mono, fontWeight: 700,
                                        letterSpacing: '0.08em', textTransform: 'uppercase',
                                        color: st.color, background: st.bg, border: `1px solid ${st.border}`,
                                        borderRadius: 4, padding: '3px 9px',
                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                    }}>
                                        {isLive && (
                                            <span style={{
                                                width: 5, height: 5, borderRadius: '50%',
                                                background: T.teal, display: 'inline-block',
                                                animation: 'pulse 1.4s ease-in-out infinite',
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

                            {/* Footer: chips + CTA */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    <Chip icon={<Swords size={10} />} label={`${event.challenges_count} challenges`} />
                                    <Chip icon={<Calendar size={10} />} label={fmtDate(event.date_debut)} />
                                    <Chip icon={<Clock size={10} />}    label={`ends ${fmtDate(event.date_fin)}`} />
                                </div>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 3,
                                    fontSize: 12, fontWeight: 600, color: st.color, flexShrink: 0,
                                }}>
                                    {event.statut === 'upcoming' ? 'register' : event.statut === 'ongoing' ? 'join now' : 'results'}
                                    <ChevronRight size={13} />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────────────────
const CodingEventsPage = ({ events }: { events: any[] }) => {
    const [search, setSearch]       = useState('');
    const [filter, setFilter]       = useState('all');
    const mono = "'IBM Plex Mono', monospace";

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

    return (
        <div style={{ minHeight: '100vh', background: T.bg, fontFamily: mono, color: T.text }}>
            <style>{`
                @keyframes pulse { 0%,100%{opacity:1}  50%{opacity:.3} }
                @keyframes ping  { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
            `}</style>

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
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl text-indigo-950 bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:border-blue-400 focus:outline-none transition-all shadow-lg placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="flex gap-2 flex-wrap justify-center">
                    {['all', 'upcoming', 'ongoing', 'finished'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-6 py-2.5 font-bold transition-all text-sm rounded-lg cursor-pointer ${
                          filter === status
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

            {/* Top bar */}
            <div style={{
                background: T.surface, borderBottom: `1px solid ${T.border}`,
                padding: '0 36px', height: 52,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
                <span style={{ color: T.textHi, fontSize: 14, fontWeight: 700, fontFamily: mono }}>events</span>
                <span style={{ fontSize: 12, color: T.textDim, fontFamily: mono }}>
                    {counts.all} total · {counts.ongoing ?? 0} live
                </span>
            </div>

            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '36px 28px' }}>
                {/* Page heading */}
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ color: T.textHi, fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>
                        Coding Events
                    </h1>
                    <p style={{ color: T.textMid, fontSize: 13, margin: 0 }}>
                        Compete with your team, solve challenges, climb the leaderboard.
                    </p>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                    <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 300 }}>
                        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.textDim }} />
                        <input
                            type="text" placeholder="search events…" value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                paddingLeft: 30, paddingRight: 12, height: 34,
                                background: T.surface, border: `1px solid ${T.border}`,
                                borderRadius: 7, fontSize: 12, color: T.textHi,
                                fontFamily: mono, outline: 'none', transition: 'border-color 0.15s',
                            }}
                            onFocus={e => (e.target.style.borderColor = T.teal)}
                            onBlur={e  => (e.target.style.borderColor = T.border)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {FILTERS.map(f => {
                            const active = filter === f.key;
                            return (
                                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                                    background: active ? T.tealBg : T.surface,
                                    border: `1px solid ${active ? T.tealBdr : T.border}`,
                                    borderRadius: 6, color: active ? T.teal : T.textMid,
                                    fontSize: 11, fontWeight: active ? 700 : 400,
                                    padding: '6px 11px', cursor: 'pointer', fontFamily: mono,
                                    display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.15s',
                                }}>
                                    {f.label}
                                    {counts[f.key] !== undefined && (
                                        <span style={{
                                            fontSize: 10, borderRadius: 8, padding: '1px 5px', fontWeight: 700,
                                            background: active ? T.teal : T.raised,
                                            color: active ? '#fff' : T.textDim,
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
                    }}>
                        <Search size={24} style={{ margin: '0 auto 10px', color: T.border, display: 'block' }} />
                        no events match your search
                    </div>
                ) : (
                    <div>
                        {filtered.map((event, idx) => (
                            <EventCard key={event.id} event={event} isLast={idx === filtered.length - 1} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodingEventsPage;