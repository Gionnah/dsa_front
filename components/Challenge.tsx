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

function DiffPill({ difficulty }: { difficulty: string }) {
    const d = DIFF[difficulty] ?? { color: T.textMid, bg: '#f1f5f9', border: T.border, label: difficulty, dot: T.textMid };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 10, letterSpacing: '0.09em', textTransform: 'uppercase',
            color: d.color, background: d.bg, border: `1px solid ${d.border}`,
            borderRadius: 4, padding: '3px 9px', fontFamily: mono, fontWeight: 600,
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
                    transition: 'all 0.18s',
                    boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.07)' : '0 1px 3px rgba(0,0,0,0.04)',
                    display: 'flex', flexDirection: 'column', gap: 16,
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                            color: T.textHi, fontSize: 15, fontWeight: 700,
                            margin: '0 0 10px', lineHeight: 1.35,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
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
                        transition: 'color 0.15s, transform 0.15s',
                        transform: hovered ? 'translateX(3px)' : 'none',
                        marginTop: 2, flexShrink: 0,
                    }}>
                        <ArrowRight size={16} />
                    </div>
                </div>

                {/* Description */}
                {challenge.description && (
                    <p style={{
                        color: T.textMid, fontSize: 13, lineHeight: 1.65, margin: 0,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                        {challenge.description.replace(/[#`*\[\]]/g, '').substring(0, 160)}
                    </p>
                )}

                {/* Footer */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: 14, borderTop: `1px solid ${T.border}`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: T.textDim, fontSize: 12 }}>
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
                    <span style={{ color: T.textDim, fontSize: 11, fontFamily: mono }}>
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

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/challenges', { headers: { 'Content-Type': 'application/json' } });
                const data = await res.json();
                setChallenges(data);
                setFiltered(data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
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

    return (
        <div style={{ minHeight: '100vh', background: T.bg, fontFamily: mono, color: T.text }}>

            {/* ── Top bar ── */}
            <div style={{
                background: T.surface, borderBottom: `1px solid ${T.border}`,
                padding: '0 36px', height: 52,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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
                <div style={{ display: 'flex', gap: 10, marginBottom: 28, alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: 480 }}>
                        <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: T.textDim, pointerEvents: 'none' }} />
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
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                        {[
                            { key: 'all',    label: 'All',    color: T.teal    },
                            { key: 'easy',   label: 'Easy',   color: T.green   },
                            { key: 'medium', label: 'Medium', color: T.amber   },
                            { key: 'hard',   label: 'Hard',   color: T.red     },
                        ].map(({ key, label, color }) => {
                            const active = diff === key;
                            return (
                                <button key={key} onClick={() => setDiff(key)} style={{
                                    background: active ? color : T.surface,
                                    border: `1px solid ${active ? color : T.border}`,
                                    borderRadius: 6, color: active ? '#fff' : T.textMid,
                                    fontSize: 12, fontWeight: active ? 700 : 400,
                                    padding: '8px 16px', cursor: 'pointer',
                                    transition: 'all 0.15s', fontFamily: mono,
                                    boxShadow: active ? `0 2px 8px ${color}44` : 'none',
                                }}>
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Grid ── */}
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240, gap: 10, color: T.textDim }}>
                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontSize: 13 }}>loading challenges…</span>
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px 0', color: T.textDim }}>
                        <div style={{ fontSize: 40, marginBottom: 14, opacity: 0.3 }}>∅</div>
                        <p style={{ fontSize: 13, marginBottom: 20 }}>no challenges match your filters</p>
                        <button onClick={() => { setSearch(''); setDiff('all'); }} style={{
                            background: T.surface, border: `1px solid ${T.border}`,
                            color: T.text, fontSize: 12, padding: '8px 20px', borderRadius: 6,
                            cursor: 'pointer', fontFamily: mono,
                        }}>reset filters</button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: 14 }}>
                        {filtered.map(c => <ChallengeCard key={c.id} challenge={c} />)}
                    </div>
                )}
            </div>
        </div>
    );
}