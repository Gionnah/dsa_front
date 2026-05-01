"use client"
import { useEffect, useRef, useState } from 'react';
import { X, FileText, Image, FileCode2 } from 'lucide-react';

// Simple markdown renderer (no external deps needed)
function MarkdownRenderer({ content }: { content: string }) {
    const html = content
        // Code blocks
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="md-pre"><code>$2</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
        // Headers
        .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="md-link">$1</a>')
        // Unordered lists
        .replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
        // Paragraphs (double newline)
        .replace(/\n\n/g, '</p><p class="md-p">')
        // Wrap list items
        .replace(/(<li[\s\S]*?<\/li>)/g, '<ul class="md-ul">$1</ul>');

    return (
        <div
            className="md-body text-gray-200 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: `<p class="md-p">${html}</p>` }}
            style={{
                ['--md-code-bg' as any]: 'rgba(0,0,0,0.4)',
            }}
        />
    );
}

type Tab = 'markdown' | 'pdf' | 'image';

interface Props {
    open: boolean;
    onClose: () => void;
    challengeData: any;
    // Cloudinary base URL — set via env or prop
    cloudinaryBase?: string;
}

export default function InstructionsDrawer({
    open,
    onClose,
    challengeData,
    cloudinaryBase = "https://res.cloudinary.com/YOUR_CLOUD_NAME", // ← remplacez ou passez via prop/env
}: Props) {
    const hasMarkdown = !!challengeData?.description;
    const hasPdf = !!challengeData?.description_pdf;
    const hasImage = !!challengeData?.description_img;

    const availableTabs: Tab[] = [
        ...(hasMarkdown ? ['markdown' as Tab] : []),
        ...(hasPdf ? ['pdf' as Tab] : []),
        ...(hasImage ? ['image' as Tab] : []),
    ];

    const [activeTab, setActiveTab] = useState<Tab>(availableTabs[0] || 'markdown');

    // Reset tab when drawer opens with new data
    useEffect(() => {
        if (open && availableTabs.length > 0) {
            setActiveTab(availableTabs[0]);
        }
    }, [open, challengeData?.id]);

    const pdfUrl = hasPdf
        ? `${cloudinaryBase}/${challengeData.description_pdf}`
        : null;
    const imgUrl = hasImage
        ? `${cloudinaryBase}/${challengeData.description_img}`
        : null;

    const tabLabels: Record<Tab, { icon: React.ReactNode; label: string }> = {
        markdown: { icon: <FileCode2 className="w-3.5 h-3.5" />, label: 'Description' },
        pdf: { icon: <FileText className="w-3.5 h-3.5" />, label: 'PDF' },
        image: { icon: <Image className="w-3.5 h-3.5" />, label: 'Image' },
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-xl bg-neutral-900 border-l border-neutral-700 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur">
                    <div>
                        <h2 className="text-white font-semibold text-base leading-tight">
                            {challengeData?.title || 'Instructions'}
                        </h2>
                        {challengeData?.difficulty && (
                            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block font-medium ${
                                challengeData.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                challengeData.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                                {challengeData.difficulty}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white hover:bg-neutral-700 rounded-lg p-1.5 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                {availableTabs.length > 1 && (
                    <div className="flex gap-1 px-4 pt-3 border-b border-neutral-800 pb-0">
                        {availableTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-all ${
                                    activeTab === tab
                                        ? 'border-teal-500 text-teal-400 bg-teal-500/10'
                                        : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {tabLabels[tab].icon}
                                {tabLabels[tab].label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {activeTab === 'markdown' && hasMarkdown && (
                        <div>
                            <style>{`
                                .md-h1 { font-size: 1.4rem; font-weight: 700; color: #f0f0f0; margin: 1rem 0 0.5rem; }
                                .md-h2 { font-size: 1.15rem; font-weight: 600; color: #e0e0e0; margin: 1rem 0 0.4rem; border-bottom: 1px solid #333; padding-bottom: 0.3rem; }
                                .md-h3 { font-size: 1rem; font-weight: 600; color: #d0d0d0; margin: 0.8rem 0 0.3rem; }
                                .md-p { margin: 0.5rem 0; line-height: 1.7; }
                                .md-pre { background: rgba(0,0,0,0.45); border: 1px solid #333; border-radius: 6px; padding: 0.75rem 1rem; overflow-x: auto; margin: 0.75rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #a8d8a8; }
                                .md-inline-code { background: rgba(0,0,0,0.4); border: 1px solid #444; border-radius: 4px; padding: 0.1em 0.4em; font-size: 0.85em; color: #7dd3d0; font-family: monospace; }
                                .md-link { color: #5eead4; text-decoration: underline; text-underline-offset: 2px; }
                                .md-link:hover { color: #99f6e4; }
                                .md-ul { margin: 0.4rem 0 0.4rem 1.2rem; list-style: disc; }
                                .md-li { margin: 0.2rem 0; color: #ccc; }
                            `}</style>
                            <MarkdownRenderer content={challengeData.description} />
                        </div>
                    )}

                    {activeTab === 'pdf' && pdfUrl && (
                        <div className="h-full flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">Visualisation PDF</p>
                                <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2"
                                >
                                    Ouvrir dans un nouvel onglet ↗
                                </a>
                            </div>
                            <iframe
                                src={`${pdfUrl}#toolbar=0`}
                                className="w-full rounded-lg border border-neutral-700"
                                style={{ height: 'calc(100vh - 200px)' }}
                                title="PDF Description"
                            />
                        </div>
                    )}

                    {activeTab === 'image' && imgUrl && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs text-gray-500">Image du sujet</p>
                            <div className="rounded-lg overflow-hidden border border-neutral-700 bg-black/20">
                                <img
                                    src={imgUrl}
                                    alt="Challenge description"
                                    className="w-full object-contain"
                                    style={{ maxHeight: 'calc(100vh - 220px)' }}
                                />
                            </div>
                            <a
                                href={imgUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2 text-right"
                            >
                                Voir en plein écran ↗
                            </a>
                        </div>
                    )}

                    {availableTabs.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-600 gap-2">
                            <FileText className="w-8 h-8" />
                            <p className="text-sm">Aucun sujet disponible</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
