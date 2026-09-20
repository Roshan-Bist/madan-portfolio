import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Calendar, User, ArrowLeft, Clock, Share2, Bookmark,
    Check, Copy, ChevronUp,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import ScrollToTop from '../components/ScrollToTop';

const ArticleDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const shareRef = useRef<HTMLDivElement>(null);

    const goToArticles = useCallback(() => {
        navigate('/', { state: { scrollTo: 'articles' } });
    }, [navigate]);

    useEffect(() => {
        setScrolled(false);
        setScrollProgress(0);
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
        const t1 = setTimeout(() => window.scrollTo(0, 0), 0);
        const t2 = setTimeout(() => window.scrollTo(0, 0), 100);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [id]);

    useEffect(() => {
        if (!loading && article) {
            window.scrollTo(0, 0);
            setScrolled(false);
            setScrollProgress(0);
        }
    }, [loading, article, id]);

    useEffect(() => {
        if (!shareOpen) return;
        const close = (e: MouseEvent) => {
            if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
                setShareOpen(false);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [shareOpen]);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const scrollTop = document.documentElement.scrollTop;
                const height =
                    document.documentElement.scrollHeight -
                    document.documentElement.clientHeight;
                setScrollProgress(height > 0 ? scrollTop / height : 0);
                setScrolled(scrollTop > 200);
                ticking = false;
            });
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await axios.get(`/api/articles/${id}`);
                setArticle(res.data.article);
            } catch (err) {
                console.error('Error fetching article:', err);
                setError('Failed to load article. It may have been deleted or the URL is incorrect.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchArticle();
    }, [id]);

    useEffect(() => {
        if (id) {
            setBookmarked(localStorage.getItem(`bookmark-${id}`) === 'true');
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: 'long', day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculateReadingTime = (text: string) => {
        if (!text) return 1;
        const words = text.split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
    };

    const toggleBookmark = useCallback(() => {
        if (!id) return;
        const next = !bookmarked;
        setBookmarked(next);
        if (next) localStorage.setItem(`bookmark-${id}`, 'true');
        else localStorage.removeItem(`bookmark-${id}`);
        toast.success(next ? 'Article saved for later' : 'Bookmark removed');
    }, [id, bookmarked]);

    const copyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
            setShareOpen(false);
        } catch {
            toast.error('Could not copy link');
        }
    }, []);

    const handleShare = useCallback(async () => {
        if (!article) return;
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.content?.slice(0, 120),
                    url,
                });
            } catch {
                /* user cancelled */
            }
        } else {
            setShareOpen((v) => !v);
        }
    }, [article]);

    const paragraphs = article?.content
        ? article.content.split(/\n\n+/).filter((p: string) => p.trim() !== '')
        : [];

    if (loading) {
        return (
            <div className="article-page">
                <div className="article-page__ambient" aria-hidden="true" />
                <main className="article-main">
                    <div className="article-toolbar-skeleton">
                        <div className="skeleton article-skel article-skel--btn" />
                        <div className="article-skel-actions">
                            <div className="skeleton article-skel article-skel--icon" />
                            <div className="skeleton article-skel article-skel--icon" />
                        </div>
                    </div>
                    <div className="article-skel article-skel--badge skeleton" />
                    <div className="skeleton article-skel article-skel--title" />
                    <div className="skeleton article-skel article-skel--meta skeleton" />
                    <div className="skeleton article-skel article-skel--image skeleton" />
                    <div className="article-skel-lines">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="skeleton article-skel article-skel--line" style={{ width: `${100 - i * 8}%` }} />
                        ))}
                    </div>
                </main>
                <ArticleStyles />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="article-page">
                <main className="article-main article-main--centered">
                    <motion.div
                        className="article-error"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2>Oops!</h2>
                        <p>{error || "We couldn't find the article you're looking for."}</p>
                        <button type="button" onClick={goToArticles} className="btn article-error__btn">
                            <ArrowLeft size={16} />
                            Back to Articles
                        </button>
                    </motion.div>
                </main>
                <ArticleStyles />
            </div>
        );
    }

    const readTime = calculateReadingTime(article.content);
    const progressPercent = Math.round(scrollProgress * 100);

    return (
        <div className="article-page">
            <ScrollToTop />

            {/* Reading progress */}
            <div className="article-progress-track" aria-hidden="true">
                <div
                    className="article-progress-fill"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Sticky reading bar */}
            <AnimatePresence>
                {scrolled && (
                    <motion.div
                        className="article-sticky-bar"
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    >
                        <div className="article-sticky-bar__inner">
                            <button type="button" onClick={goToArticles} className="article-sticky-bar__back" aria-label="Back to articles">
                                <ArrowLeft size={16} />
                            </button>
                            <span className="article-sticky-bar__title">{article.title}</span>
                            <span className="article-sticky-bar__progress">{progressPercent}%</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="article-page__ambient" aria-hidden="true">
                <div className="ambient-orb ambient-orb--1" />
                <div className="ambient-orb ambient-orb--2" />
            </div>

            <main className="article-main">
                {/* Toolbar */}
                <motion.div
                    className="article-toolbar"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <button type="button" onClick={goToArticles} className="article-back-btn">
                        <ArrowLeft size={18} />
                        <span className="article-back-btn__label">Back to Articles</span>
                    </button>

                    <div className="article-actions">
                        <div className="article-share-wrap" ref={shareRef}>
                            <motion.button
                                className="article-action-btn"
                                onClick={handleShare}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                aria-label="Share article"
                                aria-expanded={shareOpen}
                            >
                                <Share2 size={18} />
                            </motion.button>
                            <AnimatePresence>
                                {shareOpen && (
                                    <motion.div
                                        className="article-share-menu"
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <button onClick={copyLink} className="article-share-menu__item">
                                            <Copy size={15} />
                                            Copy link
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.button
                            className={`article-action-btn ${bookmarked ? 'article-action-btn--active' : ''}`}
                            onClick={toggleBookmark}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
                            aria-pressed={bookmarked}
                        >
                            {bookmarked ? <Check size={18} /> : <Bookmark size={18} />}
                        </motion.button>
                    </div>
                </motion.div>

                <article className="article-container">
                    <motion.header
                        className="article-header"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="article-badge">Agronomy Insights</span>
                        <h1 className="article-title">{article.title}</h1>

                        <div className="article-meta">
                            <span className="article-meta__item">
                                <User size={14} />
                                {article.author}
                            </span>
                            <span className="article-meta__divider" />
                            <span className="article-meta__item">
                                <Calendar size={14} />
                                {formatDate(article.createdAt)}
                            </span>
                            <span className="article-meta__divider" />
                            <span className="article-meta__item">
                                <Clock size={14} />
                                {readTime} min read
                            </span>
                        </div>
                    </motion.header>

                    {article.photo && (
                        <motion.div
                            className="article-hero-image"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="article-hero-image__overlay" />
                            <motion.img
                                src={article.photo}
                                alt={article.title}
                                loading="eager"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </motion.div>
                    )}

                    <div className="article-body-wrap">
                        <aside className="article-reading-aside" aria-label="Reading progress">
                            <div className="article-reading-ring">
                                <svg viewBox="0 0 36 36">
                                    <circle className="article-reading-ring__bg" cx="18" cy="18" r="15.9" />
                                    <circle
                                        className="article-reading-ring__fill"
                                        cx="18" cy="18" r="15.9"
                                        strokeDasharray={`${progressPercent}, 100`}
                                    />
                                </svg>
                                <span className="article-reading-ring__label">{progressPercent}%</span>
                            </div>
                            <span className="article-reading-aside__hint">
                                <ChevronUp size={12} />
                                Keep reading
                            </span>
                        </aside>

                        <motion.div
                            className="article-content-card glass-panel"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {paragraphs.map((paragraph: string, index: number) => (
                                <p
                                    key={index}
                                    className={index === 0 ? 'article-paragraph article-paragraph--lead' : 'article-paragraph'}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </motion.div>
                    </div>

                    <motion.footer
                        className="article-footer"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="article-footer__divider" />
                        <p className="article-footer__text">Thanks for reading</p>
                        <button type="button" onClick={goToArticles} className="btn article-footer__btn">
                            Explore more articles
                            <ArrowLeft size={16} className="article-footer__btn-icon" />
                        </button>
                    </motion.footer>
                </article>
            </main>

            <ArticleStyles />
        </div>
    );
};

const ArticleStyles = () => (
    <style>{`
        .article-page {
            min-height: 100vh;
            min-height: 100dvh;
            background: var(--bg-primary);
            color: var(--text-primary);
            position: relative;
            overflow-x: hidden;
        }

        .article-page__ambient {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }

        .article-progress-track {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: rgba(16, 185, 129, 0.1);
            z-index: 100;
        }

        .article-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), #06b6d4);
            box-shadow: 0 0 12px var(--primary-glow);
            transition: width 0.1s linear;
        }

        .article-sticky-bar {
            position: fixed;
            top: 3px;
            left: 0;
            right: 0;
            z-index: 99;
            background: rgba(6, 78, 59, 0.92);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--glass-border);
        }

        .article-sticky-bar__inner {
            max-width: 800px;
            margin: 0 auto;
            padding: 10px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .article-sticky-bar__back {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            color: var(--text-secondary);
            transition: var(--transition);
            flex-shrink: 0;
        }

        .article-sticky-bar__back:hover {
            background: rgba(16, 185, 129, 0.12);
            color: var(--primary-color);
        }

        .article-sticky-bar__title {
            flex: 1;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-heading);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .article-sticky-bar__progress {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--primary-color);
            flex-shrink: 0;
        }

        .article-main {
            position: relative;
            z-index: 1;
            max-width: 800px;
            margin: 0 auto;
            padding: 1rem clamp(1rem, 4vw, 1.5rem) 2.5rem;
            width: 100%;
        }

        .article-main--centered {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
        }

        .article-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 1.25rem;
        }

        .article-back-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 18px;
            border-radius: 999px;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
            background: rgba(16, 185, 129, 0.08);
            border: 1px solid var(--glass-border);
            transition: var(--transition);
        }

        .article-back-btn:hover {
            color: var(--text-heading);
            border-color: rgba(16, 185, 129, 0.35);
            background: rgba(16, 185, 129, 0.15);
            transform: translateX(-2px);
        }

        .article-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .article-share-wrap {
            position: relative;
        }

        .article-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            color: var(--text-secondary);
            background: rgba(16, 185, 129, 0.08);
            border: 1px solid var(--glass-border);
            transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }

        .article-action-btn:hover {
            color: var(--primary-color);
            border-color: rgba(16, 185, 129, 0.35);
            background: rgba(16, 185, 129, 0.15);
        }

        .article-action-btn--active {
            color: var(--primary-color);
            background: rgba(16, 185, 129, 0.2);
            border-color: var(--primary-color);
        }

        .article-share-menu {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            min-width: 160px;
            background: var(--bg-secondary);
            border: 1px solid var(--glass-border);
            border-radius: 10px;
            padding: 6px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
            z-index: 50;
        }

        .article-share-menu__item {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            color: var(--text-primary);
            transition: background 0.2s ease;
        }

        .article-share-menu__item:hover {
            background: rgba(16, 185, 129, 0.12);
            color: var(--primary-color);
        }

        .article-header {
            text-align: center;
            margin-bottom: 1.5rem;
        }

        .article-badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 999px;
            border: 1px solid rgba(16, 185, 129, 0.3);
            background: rgba(16, 185, 129, 0.1);
            color: var(--primary-color);
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: 1.25rem;
        }

        .article-title {
            font-size: clamp(1.75rem, 5vw, 2.75rem);
            font-weight: 800;
            color: var(--text-heading);
            line-height: 1.2;
            letter-spacing: -0.5px;
            margin-bottom: 1.5rem;
        }

        .article-meta {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 8px 4px;
            padding: 1rem 0;
            border-top: 1px solid var(--glass-border);
            border-bottom: 1px solid var(--glass-border);
        }

        .article-meta__item {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.85rem;
            color: var(--text-secondary);
            padding: 4px 10px;
        }

        .article-meta__item svg {
            color: var(--primary-color);
            flex-shrink: 0;
        }

        .article-meta__divider {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.3);
        }

        .article-hero-image {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 9;
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 1.5rem;
            border: 1px solid var(--glass-border);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 480px) {
            .article-hero-image {
                aspect-ratio: 4 / 3;
                border-radius: 12px;
            }
        }

        .article-hero-image__overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, var(--bg-primary), transparent 50%);
            z-index: 1;
            pointer-events: none;
        }

        .article-hero-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .article-body-wrap {
            display: grid;
            grid-template-columns: 56px 1fr;
            gap: 1.5rem;
            align-items: start;
        }

        @media (max-width: 640px) {
            .article-body-wrap {
                grid-template-columns: 1fr;
            }
        }

        .article-reading-aside {
            position: sticky;
            top: 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }

        @media (max-width: 640px) {
            .article-reading-aside {
                display: none;
            }
        }

        .article-reading-ring {
            position: relative;
            width: 48px;
            height: 48px;
        }

        .article-reading-ring svg {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
        }

        .article-reading-ring__bg {
            fill: none;
            stroke: rgba(16, 185, 129, 0.15);
            stroke-width: 2.5;
        }

        .article-reading-ring__fill {
            fill: none;
            stroke: var(--primary-color);
            stroke-width: 2.5;
            stroke-linecap: round;
            transition: stroke-dasharray 0.15s ease-out;
        }

        .article-reading-ring__label {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-mono);
            font-size: 0.6rem;
            font-weight: 600;
            color: var(--primary-color);
        }

        .article-reading-aside__hint {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            font-size: 0.6rem;
            color: var(--text-secondary);
            writing-mode: vertical-rl;
            opacity: 0.6;
        }

        .article-content-card {
            padding: clamp(1.5rem, 4vw, 2.5rem);
            border-radius: 16px;
        }

        .article-paragraph {
            font-size: clamp(1rem, 2.2vw, 1.125rem);
            line-height: 1.85;
            color: var(--text-primary);
            margin-bottom: 1.75rem;
        }

        .article-paragraph:last-child {
            margin-bottom: 0;
        }

        .article-paragraph--lead::first-letter {
            font-size: clamp(2.5rem, 6vw, 3.5rem);
            line-height: 1;
            float: left;
            margin: 0.05em 0.12em 0 0;
            color: var(--primary-color);
            font-weight: 800;
            font-family: var(--font-main);
        }

        .article-footer {
            text-align: center;
            margin-top: clamp(2.5rem, 6vw, 4rem);
            padding-bottom: 2rem;
        }

        .article-footer__divider {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 1.5rem;
        }

        .article-footer__divider::before,
        .article-footer__divider::after {
            content: '';
            width: 48px;
            height: 1px;
            background: var(--glass-border);
        }

        .article-footer__text {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 1.25rem;
        }

        .article-footer__btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .article-footer__btn-icon {
            transform: rotate(180deg);
        }

        .article-error {
            text-align: center;
            padding: 2.5rem;
            border-radius: 16px;
            background: rgba(239, 68, 68, 0.08);
            border: 1px solid rgba(239, 68, 68, 0.25);
            max-width: 420px;
        }

        .article-error h2 {
            color: var(--text-heading);
            margin-bottom: 0.75rem;
        }

        .article-error p {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }

        .article-error__btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        /* Skeleton */
        .article-toolbar-skeleton {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2.5rem;
        }

        .article-skel-actions {
            display: flex;
            gap: 8px;
        }

        .article-skel {
            border-radius: 8px;
        }

        .article-skel--btn { width: 160px; height: 40px; border-radius: 999px; }
        .article-skel--icon { width: 42px; height: 42px; border-radius: 50%; }
        .article-skel--badge { width: 140px; height: 28px; border-radius: 999px; margin: 0 auto 1.25rem; }
        .article-skel--title { width: 90%; height: 48px; margin: 0 auto 1.5rem; }
        .article-skel--meta { width: 70%; height: 24px; margin: 0 auto 2rem; }
        .article-skel--image { width: 100%; aspect-ratio: 16/9; border-radius: 16px; margin-bottom: 2rem; }
        .article-skel-lines { display: flex; flex-direction: column; gap: 12px; }
        .article-skel--line { height: 16px; }

        @media (max-width: 480px) {
            .article-back-btn__label {
                display: none;
            }

            .article-back-btn {
                padding: 10px 12px;
            }

            .article-action-btn {
                width: 38px;
                height: 38px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .article-hero-image img {
                transition: none !important;
            }
        }
    `}</style>
);

export default ArticleDetail;
