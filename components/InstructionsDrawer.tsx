"use client"
import { useEffect, useRef, useState } from 'react';
import { X, FileText, Image, FileCode2, Copy, Check, Maximize2, Minimize2, Menu, BookOpen, List, Type, Grid3x3 } from 'lucide-react';
import 'katex/dist/katex.min.css';

// Amélioration du renderer markdown avec support KaTeX
function MarkdownRenderer({ content }: { content: string }) {
    const [copied, setCopied] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
    const containerRef = useRef<HTMLDivElement>(null);

    const fontSizes = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg'
    };

    // Fonction pour copier le contenu
    const copyContent = () => {
        const textContent = content.replace(/\n/g, '\n');
        navigator.clipboard.writeText(textContent);
        setCopied('all');
        setTimeout(() => setCopied(null), 2000);
    };

    // Traitement du markdown avec support mathématique
    const processContent = (text: string) => {
        let processed = text
            // Protection des blocs de code
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match) => {
                return match.replace(/\n/g, '___CODE_NEWLINE___');
            })
            // Convertir les doubles sauts de ligne
            .replace(/\n\n/g, '___PARAGRAPH_BREAK___')
            // Convertir les sauts de ligne simples
            .replace(/\n/g, '<br/>')
            // Restaurer les paragraphes
            .replace(/___PARAGRAPH_BREAK___/g, '</p><p class="md-p">')
            // Restaurer les blocs de code
            .replace(/___CODE_NEWLINE___/g, '\n');

        // Conversion markdown
        let html = processed
            // Code blocks avec language
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
                const language = lang || 'text';
                return `<pre class="md-pre"><code class="language-${language}">${code.trim()}</code></pre>`;
            })
            // Inline code
            .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
            // Headers
            .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
            .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
            // Bold
            .replace(/\*\*(.+?)\*\*/g, '<strong class="md-strong">$1</strong>')
            // Italic
            .replace(/\*(.+?)\*/g, '<em class="md-em">$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="md-link">$1</a>')
            // Unordered lists
            .replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
            // Ordered lists
            .replace(/^\d+\. (.+)$/gm, '<li class="md-li">$1</li>')
            // Blockquotes
            .replace(/^> (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
            // Horizontal rules
            .replace(/^---$/gm, '<hr class="md-hr"/>')
            // Tables (simple)
            .replace(/\|(.+)\|/g, (match) => {
                const cells = match.split('|').filter(cell => cell.trim());
                const isHeader = cells.some(cell => cell.includes('---'));
                if (isHeader) return '';
                return `<tr class="md-tr">${cells.map(cell => 
                    `<td class="md-td">${cell.trim()}</td>`
                ).join('')}</tr>`;
            })
            .replace(/(<tr[\s\S]*?<\/tr>)/g, (match) => {
                return `<table class="md-table"><tbody>${match}</tbody></table>`;
            })
            // Checkboxes
            .replace(/\[x\]/g, '✅')
            .replace(/\[ \]/g, '⬜')
            // Superscript (^) 
            .replace(/\^\{([^}]+)\}/g, '<sup class="md-sup">$1</sup>')
            .replace(/\^([a-zA-Z0-9])/g, '<sup class="md-sup">$1</sup>')
            // Subscript (_)
            .replace(/\_\{([^}]+)\}/g, '<sub class="md-sub">$1</sub>')
            .replace(/\_([a-zA-Z0-9])/g, '<sub class="md-sub">$1</sub>')
            // Fraction (simple)
            .replace(/\/\(([^)]+)\)\//g, '<span class="md-fraction">$1</span>');

        return html;
    };

    // Rendu final avec styles
    const renderedContent = processContent(content);

    // Gestion du mode plein écran
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div ref={containerRef} className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-neutral-900 p-8 overflow-y-auto' : ''}`}>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                    <button
                        onClick={copyContent}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                        title="Copier le contenu"
                    >
                        {copied === 'all' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied === 'all' ? 'Copié !' : 'Copier'}
                    </button>
                    
                    <div className="w-px h-4 bg-neutral-700" />
                    
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setFontSize('small')}
                            className={`px-1.5 py-0.5 text-xs rounded transition-colors ${
                                fontSize === 'small' ? 'bg-teal-500/20 text-teal-400' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            A
                        </button>
                        <button
                            onClick={() => setFontSize('medium')}
                            className={`px-1.5 py-0.5 text-sm rounded transition-colors ${
                                fontSize === 'medium' ? 'bg-teal-500/20 text-teal-400' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            A
                        </button>
                        <button
                            onClick={() => setFontSize('large')}
                            className={`px-1.5 py-0.5 text-base rounded transition-colors ${
                                fontSize === 'large' ? 'bg-teal-500/20 text-teal-400' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            A
                        </button>
                    </div>
                </div>

                <button
                    onClick={toggleFullscreen}
                    className="p-1 text-gray-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                    title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
            </div>

            {/* Contenu */}
            <div className={`${fontSizes[fontSize]} prose prose-invert max-w-none`}>
                <style>{`
                    /* Styles de base */
                    .md-h1 { font-size: 1.8rem; font-weight: 700; color: #f0f0f0; margin: 1.5rem 0 0.8rem; letter-spacing: -0.02em; }
                    .md-h2 { font-size: 1.4rem; font-weight: 600; color: #e0e0e0; margin: 1.2rem 0 0.6rem; border-bottom: 1px solid #333; padding-bottom: 0.4rem; }
                    .md-h3 { font-size: 1.1rem; font-weight: 600; color: #d0d0d0; margin: 1rem 0 0.4rem; }
                    .md-p { margin: 0.6rem 0; line-height: 1.8; }
                    .md-strong { color: #e8e8e8; font-weight: 700; }
                    .md-em { color: #d0d0d0; font-style: italic; }
                    
                    /* Code */
                    .md-pre { 
                        background: rgba(0,0,0,0.5); 
                        border: 1px solid #2a2a2a; 
                        border-radius: 8px; 
                        padding: 1rem; 
                        overflow-x: auto; 
                        margin: 0.8rem 0; 
                        font-family: 'JetBrains Mono', 'Fira Code', monospace; 
                        font-size: 0.8rem; 
                        color: #a8d8a8; 
                        position: relative;
                    }
                    .md-pre::before {
                        content: 'code';
                        position: absolute;
                        top: 0.25rem;
                        right: 0.5rem;
                        font-size: 0.6rem;
                        color: #555;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    .md-inline-code { 
                        background: rgba(0,0,0,0.4); 
                        border: 1px solid #2a2a2a; 
                        border-radius: 4px; 
                        padding: 0.1em 0.4em; 
                        font-size: 0.85em; 
                        color: #7dd3d0; 
                        font-family: 'JetBrains Mono', monospace; 
                    }
                    
                    /* Liens */
                    .md-link { 
                        color: #5eead4; 
                        text-decoration: underline; 
                        text-underline-offset: 2px; 
                        transition: color 0.2s;
                    }
                    .md-link:hover { color: #99f6e4; }
                    
                    /* Listes */
                    .md-ul { margin: 0.6rem 0 0.6rem 1.5rem; list-style: disc; }
                    .md-li { margin: 0.3rem 0; color: #ccc; line-height: 1.6; }
                    
                    /* Notations mathématiques */
                    .md-sup { 
                        font-size: 0.7em; 
                        vertical-align: super; 
                        color: #7dd3d0; 
                        font-weight: 500;
                    }
                    .md-sub { 
                        font-size: 0.7em; 
                        vertical-align: sub; 
                        color: #7dd3d0; 
                        font-weight: 500;
                    }
                    .md-fraction {
                        display: inline-block;
                        text-align: center;
                        vertical-align: middle;
                        padding: 0 0.2em;
                    }
                    .md-fraction::before {
                        content: '(';
                    }
                    .md-fraction::after {
                        content: ')';
                    }
                    
                    /* Blockquotes */
                    .md-blockquote {
                        border-left: 3px solid #5eead4;
                        padding: 0.5rem 1rem;
                        margin: 0.8rem 0;
                        background: rgba(94, 234, 212, 0.05);
                        border-radius: 4px;
                        color: #b0b0b0;
                        font-style: italic;
                    }
                    
                    /* Horizontal rule */
                    .md-hr {
                        border: none;
                        height: 1px;
                        background: linear-gradient(to right, transparent, #333, transparent);
                        margin: 1.5rem 0;
                    }
                    
                    /* Tables */
                    .md-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 0.8rem 0;
                        font-size: 0.9rem;
                    }
                    .md-tr {
                        border-bottom: 1px solid #2a2a2a;
                    }
                    .md-td {
                        padding: 0.4rem 0.8rem;
                        color: #ccc;
                    }
                    .md-tr:first-child .md-td {
                        font-weight: 600;
                        color: #e0e0e0;
                    }
                    
                    /* Mise en évidence */
                    .highlight {
                        background: rgba(94, 234, 212, 0.1);
                        border-left: 2px solid #5eead4;
                        padding: 0.2rem 0.5rem;
                        border-radius: 2px;
                    }
                    
                    /* Animation de transition */
                    .md-body {
                        transition: font-size 0.2s ease;
                    }
                `}</style>
                <div 
                    className="md-body text-gray-200 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: `<p class="md-p">${renderedContent}</p>` }}
                />
            </div>

            {/* Pied de page - statistiques */}
            <div className="mt-6 pt-3 border-t border-neutral-800 flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                    <Type className="w-3 h-3" />
                    {content.length} caractères
                </span>
                <span className="flex items-center gap-1">
                    <List className="w-3 h-3" />
                    {content.split('\n').length} lignes
                </span>
                <span className="flex items-center gap-1">
                    <Grid3x3 className="w-3 h-3" />
                    {content.split(/\s+/).filter(w => w.length > 0).length} mots
                </span>
            </div>
        </div>
    );
}

type Tab = 'markdown' | 'pdf' | 'image' | 'fullscreen';

interface Props {
    open: boolean;
    onClose: () => void;
    challengeData: any;
    cloudinaryBase?: string;
}

export default function InstructionsDrawer({
    open,
    onClose,
    challengeData,
    cloudinaryBase = "https://res.cloudinary.com/YOUR_CLOUD_NAME",
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
    const [isFullscreen, setIsFullscreen] = useState(false);

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

    const tabLabels: Record<Tab, { icon: React.ReactNode; label: string; badge?: string }> = {
        markdown: { icon: <FileCode2 className="w-3.5 h-3.5" />, label: 'Description' },
        pdf: { icon: <FileText className="w-3.5 h-3.5" />, label: 'PDF' },
        image: { icon: <Image className="w-3.5 h-3.5" />, label: 'Image' },
        fullscreen: { icon: <Maximize2 className="w-3.5 h-3.5" />, label: 'Plein écran' },
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
                    open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-neutral-900 border-l border-neutral-700 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur flex-shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-4 h-4 text-teal-400" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-white font-semibold text-base leading-tight truncate">
                                    {challengeData?.title || 'Instructions'}
                                </h2>
                                <div className="flex items-center gap-2">
                                    {challengeData?.difficulty && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full inline-block font-medium ${
                                            challengeData.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                            challengeData.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                            {challengeData.difficulty}
                                        </span>
                                    )}
                                    {challengeData?.xp_reward && (
                                        <span className="text-xs text-yellow-500/80">
                                            +{challengeData.xp_reward} XP
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white hover:bg-neutral-700 rounded-lg p-1.5 transition-colors flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between gap-1 px-4 pt-3 border-b border-neutral-800 pb-0 flex-shrink-0">
                    <div className="flex gap-1 overflow-x-auto">
                        {availableTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-all whitespace-nowrap ${
                                    activeTab === tab
                                        ? 'border-teal-500 text-teal-400 bg-teal-500/10'
                                        : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {tabLabels[tab].icon}
                                {tabLabels[tab].label}
                                {tabLabels[tab].badge && (
                                    <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-teal-500/20 rounded-full">
                                        {tabLabels[tab].badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    
                    {/* Indicateur de progression (si disponible) */}
                    {challengeData?.progress && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Progression</span>
                            <div className="w-20 h-1 bg-neutral-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-teal-500 rounded-full transition-all duration-500"
                                    style={{ width: `${challengeData.progress}%` }}
                                />
                            </div>
                            <span className="text-teal-400">{challengeData.progress}%</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {activeTab === 'markdown' && hasMarkdown && (
                        <MarkdownRenderer content={challengeData.description} />
                    )}

                    {activeTab === 'pdf' && pdfUrl && (
                        <div className="h-full flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">Visualisation PDF</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => window.open(pdfUrl, '_blank')}
                                        className="text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2"
                                    >
                                        Ouvrir dans un nouvel onglet ↗
                                    </button>
                                    <button
                                        onClick={() => window.open(pdfUrl, '_blank')}
                                        className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2"
                                    >
                                        Télécharger ↓
                                    </button>
                                </div>
                            </div>
                            <iframe
                                src={`${pdfUrl}#toolbar=0`}
                                className="w-full rounded-lg border border-neutral-700"
                                style={{ height: 'calc(100vh - 250px)', minHeight: '400px' }}
                                title="PDF Description"
                            />
                        </div>
                    )}

                    {activeTab === 'image' && imgUrl && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">Image du sujet</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => window.open(imgUrl, '_blank')}
                                        className="text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2"
                                    >
                                        Voir en plein écran ↗
                                    </button>
                                    <button
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = imgUrl;
                                            link.download = 'challenge-image.jpg';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                        className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2"
                                    >
                                        Télécharger ↓
                                    </button>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden border border-neutral-700 bg-black/20 flex items-center justify-center">
                                <img
                                    src={imgUrl}
                                    alt="Challenge description"
                                    className="w-full object-contain"
                                    style={{ maxHeight: 'calc(100vh - 250px)', minHeight: '300px' }}
                                    onError={(e) => {
                                        e.currentTarget.src = '/images/placeholder-image.png';
                                        e.currentTarget.alt = 'Image non disponible';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {availableTabs.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-600 gap-2">
                            <FileText className="w-8 h-8" />
                            <p className="text-sm">Aucun sujet disponible</p>
                            <p className="text-xs text-gray-700">Vérifiez que les données du challenge sont chargées</p>
                        </div>
                    )}
                </div>

                {/* Footer avec raccourcis */}
                <div className="flex items-center justify-between px-5 py-2 border-t border-neutral-800 bg-neutral-900/50 flex-shrink-0">
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>⌘ + K</span>
                        <span className="w-px h-3 bg-neutral-700" />
                        <span>Rechercher</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>Esc</span>
                        <span className="w-px h-3 bg-neutral-700" />
                        <span>Fermer</span>
                    </div>
                </div>
            </div>
        </>
    );
}