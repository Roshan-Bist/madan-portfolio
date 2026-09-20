import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const Articles = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await axios.get('/api/articles');
                setArticles(res.data.articles || []);
            } catch (error) {
                console.error("Error fetching articles:", error);
                setFetchError("Couldn't load articles. Make sure the server is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculateReadingTime = (text: string) => {
        if (!text) return 1;
        const wordsPerMinute = 200;
        const words = text.split(/\s+/).length;
        return Math.max(1, Math.ceil(words / wordsPerMinute));
    };

    if (loading) {
        return (
            <div className="container articles-page">
                <div className="articles-header">
                    <div className="skeleton articles-skeleton__badge" />
                    <div className="skeleton articles-skeleton__title" />
                    <div className="skeleton articles-skeleton__subtitle" />
                </div>
                <div className="articles-grid">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton articles-skeleton__card" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container articles-page">
            <div className="articles-header">
                <div className="articles-badge">Knowledge Base</div>
                <h2 className="articles-title">Agronomy Insights</h2>
                <p className="articles-subtitle">
                    Explore our latest research, farming methodologies, and deep dives into sustainable agriculture practices.
                </p>
            </div>

            {fetchError ? (
                <div className="glass-panel articles-empty articles-error">
                    <p>{fetchError}</p>
                </div>
            ) : articles.length === 0 ? (
                <div className="glass-panel articles-empty">
                    <p>No articles have been published yet. Please check back later!</p>
                </div>
            ) : (
                <div className="articles-grid">
                    {articles.map((article, index) => (
                        <article
                            key={article._id}
                            className="article-card glass-panel"
                            style={{ animationDelay: `${index * 0.08}s` }}
                        >
                                {article.photo && (
                                    <div className="article-card__image-wrap">
                                        <div className="article-card__image-overlay" />
                                        <div className="article-card__read-time">
                                            <Clock size={12} />
                                            {calculateReadingTime(article.content)} min
                                        </div>
                                        <img
                                            src={article.photo}
                                            alt={article.title}
                                            className="article-card__image"
                                            loading="lazy"
                                        />
                                    </div>
                                )}

                                <div className="article-card__body">
                                    <div className="article-card__meta">
                                        <span className="article-card__meta-item">
                                            <User size={12} /> {article.author}
                                        </span>
                                        <span className="article-card__meta-item">
                                            <Calendar size={12} /> {formatDate(article.createdAt)}
                                        </span>
                                    </div>

                                    <h3 className="article-card__title">{article.title}</h3>

                                    <p className="article-card__excerpt">
                                        {article.content.length > 150
                                            ? `${article.content.substring(0, 150)}...`
                                            : article.content}
                                    </p>

                                    <Link
                                        to={`/article/${article._id}`}
                                        className="article-card__link"
                                    >
                                        Read Full Article
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </article>
                    ))}
                </div>
            )}

            <style>{`
                .articles-page {
                    min-height: 80vh;
                    padding: clamp(3rem, 8vw, 6rem) 0 3rem;
                }

                .articles-header {
                    text-align: center;
                    margin-bottom: clamp(2.5rem, 6vw, 4rem);
                }

                .articles-badge {
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
                    margin-bottom: 1rem;
                }

                .articles-title {
                    font-size: clamp(2rem, 5vw, 3rem);
                    font-weight: 800;
                    color: var(--text-heading);
                    margin-bottom: 1rem;
                    letter-spacing: -0.5px;
                }

                .articles-subtitle {
                    color: var(--text-secondary);
                    max-width: 560px;
                    margin: 0 auto;
                    font-size: clamp(1rem, 2vw, 1.1rem);
                    line-height: 1.7;
                }

                .articles-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
                    gap: clamp(1.5rem, 3vw, 2rem);
                }

                .article-card {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    border-radius: 16px;
                    overflow: hidden;
                    opacity: 0;
                    animation: fadeInUp 0.6s var(--ease-out-expo) forwards;
                    transition: transform 0.4s var(--ease-out-expo), border-color 0.4s ease, box-shadow 0.4s ease;
                }

                .article-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(16, 185, 129, 0.35);
                    box-shadow: 0 20px 50px rgba(16, 185, 129, 0.12);
                }

                .article-card__image-wrap {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                }

                @media (min-width: 768px) {
                    .article-card__image-wrap { height: 220px; }
                }

                .article-card__image-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, var(--bg-primary), transparent);
                    opacity: 0.5;
                    z-index: 1;
                    transition: opacity 0.3s ease;
                }

                .article-card:hover .article-card__image-overlay {
                    opacity: 0.3;
                }

                .article-card__read-time {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 12px;
                    border-radius: 999px;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(8px);
                    font-size: 0.75rem;
                    color: var(--text-heading);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .article-card__image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s var(--ease-out-expo);
                }

                .article-card:hover .article-card__image {
                    transform: scale(1.06);
                }

                .article-card__body {
                    padding: clamp(1.25rem, 3vw, 1.75rem);
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }

                .article-card__meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 1rem;
                }

                .article-card__meta-item {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    padding: 4px 10px;
                    border-radius: 6px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                }

                .article-card__title {
                    font-size: clamp(1.1rem, 2.5vw, 1.35rem);
                    font-weight: 700;
                    color: var(--text-heading);
                    margin-bottom: 0.75rem;
                    line-height: 1.35;
                    transition: color 0.3s ease;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .article-card:hover .article-card__title {
                    color: var(--primary-color);
                }

                .article-card__excerpt {
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                    line-height: 1.65;
                    margin-bottom: 1.5rem;
                    flex-grow: 1;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .article-card__link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    align-self: flex-start;
                    padding: 10px 18px;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--primary-color);
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    transition: var(--transition);
                }

                .article-card__link:hover {
                    background: rgba(16, 185, 129, 0.2);
                    gap: 12px;
                }

                .article-card__link svg {
                    transition: transform 0.3s var(--ease-out-expo);
                }

                .article-card__link:hover svg {
                    transform: translateX(3px);
                }

                .articles-empty {
                    text-align: center;
                    padding: 3rem;
                    border-radius: 16px;
                    max-width: 560px;
                    margin: 0 auto;
                    color: var(--text-secondary);
                }

                .articles-error {
                    border-color: rgba(239, 68, 68, 0.3);
                    color: #fca5a5;
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .articles-skeleton__badge {
                    width: 140px;
                    height: 28px;
                    margin: 0 auto 1rem;
                    border-radius: 999px;
                }

                .articles-skeleton__title {
                    width: 280px;
                    height: 40px;
                    margin: 0 auto 1rem;
                }

                .articles-skeleton__subtitle {
                    width: 400px;
                    max-width: 90%;
                    height: 20px;
                    margin: 0 auto;
                }

                .articles-skeleton__card {
                    height: 380px;
                    border-radius: 16px;
                }
            `}</style>
        </div>
    );
};

export default Articles;
