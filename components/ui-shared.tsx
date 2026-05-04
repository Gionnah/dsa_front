"use client";

// ─── Shared design tokens ─────────────────────────────────────────────────────
export const T = {
    bg:      '#f8f9fb',
    surface: '#ffffff',
    raised:  '#f1f5f9',
    border:  '#e2e8f0',
    text:    '#475569',
    textHi:  '#0f172a',
    textMid: '#64748b',
    textDim: '#94a3b8',
    teal:    '#0d9488',
    tealBg:  '#f0fdfa',
    tealBdr: '#99f6e4',
    amber:   '#d97706',
    green:   '#16a34a',
    red:     '#dc2626',
    blue:    '#2563eb',
    blueBg:  '#eff6ff',
};

export const mono = "'IBM Plex Mono', 'JetBrains Mono', Consolas, monospace";
export const sans = "'Inter', system-ui, sans-serif";

// ─── PageLoader — used as full-page skeleton ─────────────────────────────────
export function PageLoader({ label = "loading…" }: { label?: string }) {
    return (
        <div style={{
            minHeight: '60vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 20,
            fontFamily: mono,
        }}>
            {/* Animated bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 32 }}>
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                        width: 4, borderRadius: 2,
                        background: T.teal,
                        animation: `barBounce 1s ease-in-out ${i * 0.12}s infinite alternate`,
                    }} />
                ))}
            </div>
            <span style={{ fontSize: 12, color: T.textDim, letterSpacing: '0.1em' }}>
                {label}
            </span>
            <style>{`
                @keyframes barBounce {
                    from { height: 8px;  opacity: 0.3; }
                    to   { height: 32px; opacity: 1;   }
                }
            `}</style>
        </div>
    );
}

// ─── InlineLoader — small spinner for buttons / inline use ───────────────────
export function InlineLoader({ size = 14, color = T.teal }: { size?: number; color?: string }) {
    return (
        <>
            <svg
                width={size} height={size} viewBox="0 0 24 24" fill="none"
                stroke={color} strokeWidth="2.5" strokeLinecap="round"
                style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
            >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );
}

// ─── RowSkeleton — placeholder row while data loads ──────────────────────────
export function RowSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 24px',
                    borderBottom: `1px solid ${T.border}`,
                    animation: `shimmer 1.6s ease-in-out ${i * 0.07}s infinite alternate`,
                }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: T.raised }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                        <div style={{ height: 12, width: '45%', borderRadius: 4, background: T.raised }} />
                        <div style={{ height: 10, width: '28%', borderRadius: 4, background: T.border }} />
                    </div>
                    <div style={{ height: 10, width: 60, borderRadius: 4, background: T.border }} />
                    <div style={{ height: 10, width: 50, borderRadius: 4, background: T.border }} />
                </div>
            ))}
            <style>{`
                @keyframes shimmer {
                    from { opacity: 0.6; }
                    to   { opacity: 1;   }
                }
            `}</style>
        </div>
    );
}