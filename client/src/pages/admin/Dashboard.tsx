import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    FileText, Briefcase, Sparkles, ArrowRight, UserPen, Plus,
    ExternalLink, Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DashboardStats {
    articles: number;
    experience: number;
    highlights: number;
}

interface RecentArticle {
    _id: string;
    title: string;
    author: string;
    createdAt: string;
}

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        articles: 0,
        experience: 0,
        highlights: 0,
    });
    const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
    const [profileName, setProfileName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profileRes, articlesRes] = await Promise.all([
                    axios.get('/api/profile'),
                    axios.get('/api/articles'),
                ]);

                const profile = profileRes.data?.[0] || {};
                const articles: RecentArticle[] = articlesRes.data?.articles || [];

                setProfileName(profile.name || user?.name || 'Admin');
                setStats({
                    articles: articles.length,
                    experience: profile.experience?.length || 0,
                    highlights: profile.highlights?.length || 0,
                });
                setRecentArticles(articles.slice(0, 4));
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user?.name]);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
        });

    const statCards = [
        {
            label: 'Published Articles',
            value: stats.articles,
            icon: FileText,
            accent: 'emerald',
        },
        {
            label: 'Experience Entries',
            value: stats.experience,
            icon: Briefcase,
            accent: 'cyan',
        },
        {
            label: 'Profile Highlights',
            value: stats.highlights,
            icon: Sparkles,
            accent: 'teal',
        },
    ];

    const quickActions = [
        {
            title: 'Manage Articles',
            description: 'Create, edit, or remove published articles.',
            to: '/admin/articles',
            icon: FileText,
        },
        {
            title: 'Edit Profile',
            description: 'Update bio, experience, and contact details.',
            to: '/admin/profile',
            icon: UserPen,
        },
    ];

    if (loading) {
        return (
            <div className="dashboard">
                <div className="dashboard-skeleton dashboard-skeleton--title skeleton" />
                <div className="dashboard-skeleton dashboard-skeleton--subtitle skeleton" />
                <div className="dashboard-stats">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton dashboard-skeleton--card" />
                    ))}
                </div>
                <DashboardStyles />
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <p className="dashboard-eyebrow">Admin Dashboard</p>
                    <h1 className="dashboard-title">Welcome back, {profileName}</h1>
                    <p className="dashboard-subtitle">
                        Manage your portfolio content, articles, and profile from one place.
                    </p>
                </div>
                <a href="/" target="_blank" rel="noopener noreferrer" className="dashboard-view-site">
                    <ExternalLink size={16} />
                    View Site
                </a>
            </header>

            <section className="dashboard-stats" aria-label="Overview statistics">
                {statCards.map(({ label, value, icon: Icon, accent }) => (
                    <div key={label} className={`dashboard-stat glass-panel dashboard-stat--${accent}`}>
                        <div className="dashboard-stat__icon-wrap">
                            <Icon size={22} />
                        </div>
                        <div className="dashboard-stat__info">
                            <span className="dashboard-stat__value">{value}</span>
                            <span className="dashboard-stat__label">{label}</span>
                        </div>
                    </div>
                ))}
            </section>

            <div className="dashboard-grid">
                <section className="dashboard-panel glass-panel">
                    <div className="dashboard-panel__header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div className="dashboard-actions">
                        {quickActions.map(({ title, description, to, icon: Icon }) => (
                            <Link key={to} to={to} className="dashboard-action-card">
                                <div className="dashboard-action-card__icon">
                                    <Icon size={20} />
                                </div>
                                <div className="dashboard-action-card__body">
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                </div>
                                <ArrowRight size={18} className="dashboard-action-card__arrow" />
                            </Link>
                        ))}
                        <Link to="/admin/articles" className="dashboard-action-card dashboard-action-card--cta">
                            <div className="dashboard-action-card__icon">
                                <Plus size={20} />
                            </div>
                            <div className="dashboard-action-card__body">
                                <h3>New Article</h3>
                                <p>Publish a new agronomy insight.</p>
                            </div>
                            <ArrowRight size={18} className="dashboard-action-card__arrow" />
                        </Link>
                    </div>
                </section>

                <section className="dashboard-panel glass-panel">
                    <div className="dashboard-panel__header">
                        <h2>Recent Articles</h2>
                        <Link to="/admin/articles" className="dashboard-panel__link">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>

                    {recentArticles.length === 0 ? (
                        <div className="dashboard-empty">
                            <FileText size={32} />
                            <p>No articles published yet.</p>
                            <Link to="/admin/articles" className="btn dashboard-empty__btn">
                                Create your first article
                            </Link>
                        </div>
                    ) : (
                        <ul className="dashboard-recent-list">
                            {recentArticles.map((article) => (
                                <li key={article._id} className="dashboard-recent-item">
                                    <div className="dashboard-recent-item__main">
                                        <span className="dashboard-recent-item__title">{article.title}</span>
                                        <span className="dashboard-recent-item__meta">
                                            <Clock size={12} />
                                            {formatDate(article.createdAt)} · {article.author}
                                        </span>
                                    </div>
                                    <Link
                                        to="/admin/articles"
                                        className="dashboard-recent-item__edit"
                                        aria-label={`Edit ${article.title}`}
                                    >
                                        Edit
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <DashboardStyles />
        </div>
    );
};

const DashboardStyles = () => (
    <style>{`
        .dashboard {
            max-width: 1100px;
            margin: 0 auto;
        }

        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .dashboard-eyebrow {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }

        .dashboard-title {
            font-size: clamp(1.5rem, 3vw, 2rem);
            font-weight: 800;
            color: var(--text-heading);
            margin-bottom: 0.5rem;
            letter-spacing: -0.5px;
        }

        .dashboard-subtitle {
            color: var(--text-secondary);
            font-size: 0.95rem;
            max-width: 520px;
            line-height: 1.6;
        }

        .dashboard-view-site {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 0.6rem 1rem;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
            border: 1px solid var(--glass-border);
            background: rgba(16, 185, 129, 0.06);
            transition: var(--transition);
            flex-shrink: 0;
        }

        .dashboard-view-site:hover {
            color: var(--primary-color);
            border-color: rgba(16, 185, 129, 0.35);
            background: rgba(16, 185, 129, 0.12);
        }

        .dashboard-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .dashboard-stat {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.25rem;
            border-radius: 12px;
            transition: transform 0.3s var(--ease-out-expo), border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .dashboard-stat:hover {
            transform: translateY(-3px);
            border-color: rgba(16, 185, 129, 0.3);
            box-shadow: 0 12px 32px rgba(16, 185, 129, 0.1);
        }

        .dashboard-stat__icon-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 10px;
            flex-shrink: 0;
        }

        .dashboard-stat--emerald .dashboard-stat__icon-wrap {
            background: rgba(16, 185, 129, 0.15);
            color: var(--primary-color);
        }

        .dashboard-stat--cyan .dashboard-stat__icon-wrap {
            background: rgba(6, 182, 212, 0.15);
            color: #22d3ee;
        }

        .dashboard-stat--teal .dashboard-stat__icon-wrap {
            background: rgba(20, 184, 166, 0.15);
            color: #2dd4bf;
        }

        .dashboard-stat__value {
            display: block;
            font-size: 1.75rem;
            font-weight: 800;
            color: var(--text-heading);
            line-height: 1;
            margin-bottom: 0.25rem;
        }

        .dashboard-stat__label {
            font-size: 0.8rem;
            color: var(--text-secondary);
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }

        @media (max-width: 900px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }

        .dashboard-panel {
            padding: 1.25rem;
            border-radius: 12px;
        }

        .dashboard-panel__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid var(--glass-border);
        }

        .dashboard-panel__header h2 {
            font-size: 1rem;
            font-weight: 700;
            color: var(--text-heading);
        }

        .dashboard-panel__link {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.8rem;
            color: var(--primary-color);
            transition: gap 0.2s ease;
        }

        .dashboard-panel__link:hover {
            gap: 8px;
        }

        .dashboard-actions {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .dashboard-action-card {
            display: flex;
            align-items: center;
            gap: 0.875rem;
            padding: 0.875rem;
            border-radius: 10px;
            border: 1px solid transparent;
            transition: var(--transition);
        }

        .dashboard-action-card:hover {
            background: rgba(16, 185, 129, 0.08);
            border-color: var(--glass-border);
        }

        .dashboard-action-card--cta {
            border: 1px dashed rgba(16, 185, 129, 0.35);
            background: rgba(16, 185, 129, 0.05);
        }

        .dashboard-action-card--cta:hover {
            background: rgba(16, 185, 129, 0.12);
            border-color: var(--primary-color);
        }

        .dashboard-action-card__icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: rgba(16, 185, 129, 0.12);
            color: var(--primary-color);
            flex-shrink: 0;
        }

        .dashboard-action-card__body {
            flex: 1;
            min-width: 0;
        }

        .dashboard-action-card__body h3 {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-heading);
            margin-bottom: 0.15rem;
        }

        .dashboard-action-card__body p {
            font-size: 0.8rem;
            color: var(--text-secondary);
            line-height: 1.4;
        }

        .dashboard-action-card__arrow {
            color: var(--text-secondary);
            flex-shrink: 0;
            transition: transform 0.25s ease, color 0.25s ease;
        }

        .dashboard-action-card:hover .dashboard-action-card__arrow {
            transform: translateX(3px);
            color: var(--primary-color);
        }

        .dashboard-recent-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .dashboard-recent-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 0.75rem;
            border-radius: 8px;
            transition: background 0.2s ease;
        }

        .dashboard-recent-item:hover {
            background: rgba(16, 185, 129, 0.06);
        }

        .dashboard-recent-item__main {
            min-width: 0;
        }

        .dashboard-recent-item__title {
            display: block;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-heading);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 0.2rem;
        }

        .dashboard-recent-item__meta {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.75rem;
            color: var(--text-secondary);
        }

        .dashboard-recent-item__edit {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--primary-color);
            padding: 0.35rem 0.75rem;
            border-radius: 6px;
            border: 1px solid rgba(16, 185, 129, 0.25);
            flex-shrink: 0;
            transition: var(--transition);
        }

        .dashboard-recent-item__edit:hover {
            background: rgba(16, 185, 129, 0.12);
        }

        .dashboard-empty {
            text-align: center;
            padding: 2rem 1rem;
            color: var(--text-secondary);
        }

        .dashboard-empty svg {
            color: var(--primary-color);
            opacity: 0.6;
            margin-bottom: 0.75rem;
        }

        .dashboard-empty p {
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }

        .dashboard-empty__btn {
            font-size: 0.875rem;
        }

        .dashboard-skeleton--title {
            width: 280px;
            height: 32px;
            margin-bottom: 0.75rem;
        }

        .dashboard-skeleton--subtitle {
            width: 400px;
            max-width: 100%;
            height: 18px;
            margin-bottom: 2rem;
        }

        .dashboard-skeleton--card {
            height: 88px;
            border-radius: 12px;
        }

        @media (max-width: 640px) {
            .dashboard-header {
                flex-direction: column;
            }

            .dashboard-view-site {
                align-self: flex-start;
            }
        }
    `}</style>
);

export default Dashboard;
