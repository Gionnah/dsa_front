"use client";

import { Search, Users, Trophy, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Light tokens ─────────────────────────────────────────────────────────────
const T = {
    bg:       '#f8f9fb',
    surface:  '#ffffff',
    border:   '#e2e8f0',
    borderMd: '#cbd5e1',
    text:     '#475569',
    textHi:   '#0f172a',
    textMid:  '#64748b',
    textDim:  '#94a3b8',
    teal:     '#0d9488',
    tealBg:   '#f0fdfa',
    tealBdr:  '#99f6e4',
    amber:    '#d97706',
    amberBg:  '#fffbeb',
    green:    '#16a34a',
    greenBg:  '#f0fdf4',
    red:      '#dc2626',
    redBg:    '#fef2f2',
    blue:     '#2563eb',
    blueBg:   '#eff6ff',
    raised:   '#f1f5f9'
};

const DIFF: Record<string, { color: string; bg: string; border: string; label: string; dot: string }> = {
    easy:   { color: T.green,  bg: T.greenBg,  border: '#bbf7d0', label: 'easy',   dot: T.green  },
    medium: { color: T.amber,  bg: T.amberBg,  border: '#fde68a', label: 'medium',  dot: T.amber  },
    hard:   { color: T.red,    bg: T.redBg,    border: '#fecaca', label: 'hard',   dot: T.red    },
};

const STATUS: Record<string, { color: string; bg: string; label: string }> = {
    in_progress: { color: T.blue,  bg: T.blueBg,  label: 'in progress' },
    completed:   { color: T.green, bg: T.greenBg, label: 'completed'   },
};

const mono = "'IBM Plex Mono', monospace";

// ─── Shimmer Effect Component ────────────────────────────────────────────────
const Shimmer = () => (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
);

// ─── Skeleton Components ─────────────────────────────────────────────────────
function SkeletonTopBar() {
    return (
        <div style={{
            background: T.surface, borderBottom: `1px solid ${T.border}`,
            padding: '0 36px', height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 80, height: 16, background: T.raised || '#f1f5f9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                    <Shimmer />
                </div>
                <div style={{ width: 60, height: 14, background: T.raised || '#f1f5f9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                    <Shimmer />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {[1, 2, 3].map((i) => (
                    <div key={i} style={{ width: 40, height: 14, background: T.raised || '#f1f5f9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                        <Shimmer />
                    </div>
                ))}
            </div>
        </div>
    );
}

function SkeletonSearchBar() {
    return (
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 480 }}>
                <div style={{
                    width: '100%', height: 42,
                    background: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: 8, position: 'relative', overflow: 'hidden',
                }}>
                    <Shimmer />
                </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ width: 60, height: 38, background: T.raised || '#f1f5f9', borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                        <Shimmer />
                    </div>
                ))}
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: '22px 26px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                    <div style={{ width: '80%', height: 20, background: T.raised || '#f1f5f9', borderRadius: 6, marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
                        <Shimmer />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ width: 50, height: 24, background: T.raised || '#f1f5f9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                            <Shimmer />
                        </div>
                    </div>
                </div>
                <div style={{ width: 16, height: 16, background: T.raised || '#f1f5f9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                    <Shimmer />
                </div>
            </div>
            <div style={{ marginBottom: 16 }}>
                <div style={{ width: '100%', height: 14, background: T.raised || '#f1f5f9', borderRadius: 4, marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
                    <Shimmer />
                </div>
                <div style={{ width: '70%', height: 14, background: T.raised || '#f1f5f9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                    <Shimmer />
                </div>
            </div>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: 14, borderTop: `1px solid ${T.border}`,
            }}>
                <div style={{ display: 'flex', gap: 18 }}>
                    <div style={{ width: 40, height: 14, background: T.raised || '#f1f5f9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                        <Shimmer />
                    </div>
                    <div style={{ width: 50, height: 14, background: T.raised || '#f1f5f9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                        <Shimmer />
                    </div>
                    <div style={{ width: 40, height: 14, background: T.raised || '#f1f5f9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                        <Shimmer />
                    </div>
                </div>
                <div style={{ width: 80, height: 12, background: T.raised || '#f1f5f9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                    <Shimmer />
                </div>
            </div>
            <Shimmer />
        </div>
    );
}

function SkeletonGrid() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: 14 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

// ─── Loading Screen Component ────────────────────────────────────────────────
function EnhancedLoadingScreen() {
    return (
        <div style={{ minHeight: '100vh', background: T.bg, fontFamily: mono, color: T.text }}>
            <SkeletonTopBar />
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
                <SkeletonSearchBar />
                <SkeletonGrid />
            </div>
            <div style={{
                position: 'fixed', bottom: 24, right: 24,
                display: 'flex', alignItems: 'center', gap: 12,
                background: T.surface, padding: '12px 20px',
                borderRadius: 40, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: `1px solid ${T.border}`,
                zIndex: 1000,
            }}>
                <div className="relative w-5 h-5">
                    <div className="absolute inset-0 border-2 border-teal-200 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-teal-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.textHi }}>loading challenges...</div>
                    <div style={{ fontSize: 10, color: T.textDim }}>fetching challenge data</div>
                </div>
            </div>
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

// ─── DiffPill Component ──────────────────────────────────────────────────────
function DiffPill({ difficulty }: { difficulty: string }) {
    const d = DIFF[difficulty] ?? { color: T.textMid, bg: '#f1f5f9', border: T.border, label: difficulty, dot: T.textMid };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 10, letterSpacing: '0.09em', textTransform: 'uppercase',
            color: d.color, background: d.bg, border: `1px solid ${d.border}`,
            borderRadius: 4, padding: '3px 9px', fontFamily: mono, fontWeight: 600,
            transition: 'all 0.2s ease',
        }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: d.dot }} />
            {d.label}
        </span>
    );
}

function StatusPill({ status }: { status: string }) {
    const s = STATUS[status];
    if (!s) return null;
    return (
        <span style={{
            fontSize: 10, letterSpacing: '0.07em', color: s.color,
            background: s.bg, borderRadius: 4, padding: '3px 9px',
            fontFamily: mono, fontWeight: 600, border: `1px solid ${s.color}33`,
            transition: 'all 0.2s ease',
        }}>
            {s.label}
        </span>
    );
}

function ChallengeCard({ challenge }: { challenge: any }) {
    const diff = DIFF[challenge.difficulty] ?? { color: T.textMid, dot: T.textMid, border: T.border, bg: '#f8fafc', label: challenge.difficulty };
    const [hovered, setHovered] = useState(false);

    return (
        <Link href={`/members/challenges/${challenge.id}`} style={{ textDecoration: 'none' }}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    background: T.surface,
                    border: `1px solid ${hovered ? diff.dot : T.border}`,
                    borderLeft: `3px solid ${diff.dot}`,
                    borderRadius: 10,
                    padding: '22px 26px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: hovered ? '0 8px 25px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                    display: 'flex', flexDirection: 'column', gap: 16,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                            color: T.textHi, fontSize: 15, fontWeight: 700,
                            margin: '0 0 10px', lineHeight: 1.35,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            transition: 'color 0.2s ease',
                        }}>
                            {challenge.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <DiffPill difficulty={challenge.difficulty} />
                            {challenge.join && challenge.status && <StatusPill status={challenge.status} />}
                        </div>
                    </div>
                    <div style={{
                        color: hovered ? diff.color : T.textDim,
                        transition: 'all 0.2s ease',
                        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                        marginTop: 2, flexShrink: 0,
                    }}>
                        <ArrowRight size={16} />
                    </div>
                </div>

                {challenge.description && (
                    <p style={{
                        color: T.textMid, fontSize: 13, lineHeight: 1.65, margin: 0,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                        {challenge.description.replace(/[#`*\[\]]/g, '').substring(0, 160)}
                    </p>
                )}

                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: 14, borderTop: `1px solid ${T.border}`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: T.textDim, fontSize: 12, transition: 'color 0.2s' }}>
                            <Users size={12} />
                            {challenge.participants_count ?? 0}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: T.amber, fontSize: 12, fontWeight: 600 }}>
                            <Trophy size={12} />
                            {challenge.xp_reward ?? 100} xp
                        </span>
                        <span style={{ color: T.textDim, fontSize: 12 }}>
                            {challenge.test_cases_count ?? challenge.test_cases?.length ?? 0} tests
                        </span>
                    </div>
                    <span style={{ color: T.textDim, fontSize: 11, fontFamily: mono, transition: 'color 0.2s' }}>
                        {new Date(challenge.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [diff, setDiff] = useState('all');
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                // Simulate progress for better UX
                const progressInterval = setInterval(() => {
                    setLoadingProgress(prev => Math.min(prev + 10, 90));
                }, 100);
                
                const res = await fetch('/api/challenges', { headers: { 'Content-Type': 'application/json' } });
                const data = await res.json();
                setChallenges(data);
                setFiltered(data);
                
                clearInterval(progressInterval);
                setLoadingProgress(100);
                setTimeout(() => setLoading(false), 300);
            } catch (e) { 
                console.error(e);
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(challenges.filter(c => {
            const matchSearch = !q || c.title.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q);
            const matchDiff = diff === 'all' || c.difficulty === diff;
            return matchSearch && matchDiff;
        }));
    }, [search, diff, challenges]);

    const counts = {
        easy:   challenges.filter(c => c.difficulty === 'easy').length,
        medium: challenges.filter(c => c.difficulty === 'medium').length,
        hard:   challenges.filter(c => c.difficulty === 'hard').length,
    };

    // Loading state
    if (loading) {
        return <EnhancedLoadingScreen />;
    }

    return (
        <div style={{ minHeight: '100vh', background: T.bg, fontFamily: mono, color: T.text }}>

            {/* ── Top bar ── */}
            <div style={{
                background: T.surface, borderBottom: `1px solid ${T.border}`,
                padding: '0 36px', height: 52,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                animation: 'fadeIn 0.5s ease-out',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ color: T.textHi, fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>
                        challenges
                    </span>
                    <span style={{ color: T.border }}>·</span>
                    <span style={{ color: T.textMid, fontSize: 11 }}>{filtered.length} results</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {Object.entries(DIFF).map(([key, d]) => (
                        <span key={key} style={{ fontSize: 11, color: T.textDim }}>
                            <span style={{ color: d.dot, fontWeight: 700 }}>{counts[key as keyof typeof counts]}</span>
                            {' '}{key}
                        </span>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

                {/* ── Search + filters ── */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 28, alignItems: 'center', animation: 'fadeInUp 0.5s ease-out' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: 480 }}>
                        <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: T.textDim, pointerEvents: 'none', transition: 'color 0.2s' }} />
                        <input
                            type="text"
                            placeholder="search challenges…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: '100%', background: T.surface,
                                border: `1px solid ${T.border}`, borderRadius: 8,
                                color: T.textHi, fontSize: 13,
                                padding: '10px 14px 10px 38px',
                                outline: 'none', boxSizing: 'border-box',
                                fontFamily: mono, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                transition: 'all 0.2s ease',
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = T.teal;
                                e.target.style.boxShadow = `0 0 0 3px ${T.teal}20`;
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = T.border;
                                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                        {[
                            { key: 'all',    label: 'All',    color: T.teal    },
                            { key: 'easy',   label: 'Easy',   color: T.green   },
                            { key: 'medium', label: 'Medium', color: T.amber   },
                            { key: 'hard',   label: 'Hard',   color: T.red     },
                        ].map(({ key, label, color }, idx) => {
                            const active = diff === key;
                            return (
                                <button 
                                    key={key} 
                                    onClick={() => setDiff(key)} 
                                    style={{
                                        background: active ? color : T.surface,
                                        border: `1px solid ${active ? color : T.border}`,
                                        borderRadius: 6, color: active ? '#fff' : T.textMid,
                                        fontSize: 12, fontWeight: active ? 700 : 400,
                                        padding: '8px 16px', cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontFamily: mono,
                                        boxShadow: active ? `0 2px 8px ${color}44` : 'none',
                                        transform: active ? 'scale(1.02)' : 'scale(1)',
                                    }}
                                    onMouseEnter={e => {
                                        if (!active) e.currentTarget.style.transform = 'scale(1.02)';
                                        e.currentTarget.style.boxShadow = `0 2px 6px rgba(0,0,0,0.08)`;
                                    }}
                                    onMouseLeave={e => {
                                        if (!active) e.currentTarget.style.transform = 'scale(1)';
                                        if (!active) e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Grid ── */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px 0', color: T.textDim, animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ fontSize: 48, marginBottom: 14, opacity: 0.3 }}>∅</div>
                        <p style={{ fontSize: 13, marginBottom: 20 }}>no challenges match your filters</p>
                        <button onClick={() => { setSearch(''); setDiff('all'); }} style={{
                            background: T.surface, border: `1px solid ${T.border}`,
                            color: T.text, fontSize: 12, padding: '8px 20px', borderRadius: 6,
                            cursor: 'pointer', fontFamily: mono, transition: 'all 0.2s ease',
                        }} onMouseEnter={e => { e.currentTarget.style.background = T.tealBg; e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.color = T.teal; }}
                           onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}>
                            reset filters
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: 14 }}>
                        {filtered.map((c, idx) => (
                            <div key={c.id} style={{ animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both` }}>
                                <ChallengeCard challenge={c} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style> */}
        </div>
    );
}