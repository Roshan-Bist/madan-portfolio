import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Plus, Pencil, Trash2, Save, X, FileText, Image as ImageIcon,
    Calendar, User, Loader2, AlertTriangle, Eye,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

const EMPTY_FORM = {
    title: '',
    content: '',
    photo: '',
    author: 'Madan Saud',
};

const ArticleManager = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<any>(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const [formDirty, setFormDirty] = useState(false);

    const authHeaders = () => ({
        Authorization: localStorage.getItem('token') || '',
    });

    const fetchArticles = useCallback(async () => {
        try {
            const res = await axios.get('/api/articles');
            setArticles(res.data.articles || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
            toast.error('Failed to load articles');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const openEditor = (article?: any) => {
        if (article) {
            setCurrentArticle(article);
            setFormData({
                title: article.title,
                content: article.content,
                photo: article.photo || '',
                author: article.author || 'Madan Saud',
            });
        } else {
            setCurrentArticle(null);
            setFormData(EMPTY_FORM);
        }
        setFormDirty(false);
        setIsEditorOpen(true);
    };

    const closeEditor = () => {
        if (formDirty && !window.confirm('You have unsaved changes. Discard them?')) return;
        setIsEditorOpen(false);
        setCurrentArticle(null);
        setFormDirty(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setFormDirty(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (currentArticle) {
                const res = await axios.put(
                    `/api/articles/${currentArticle._id}`,
                    formData,
                    { headers: authHeaders() }
                );
                setArticles((prev) =>
                    prev.map((a) => (a._id === currentArticle._id ? res.data.article : a))
                );
                toast.success('Article updated successfully');
            } else {
                const res = await axios.post('/api/articles', formData, { headers: authHeaders() });
                setArticles((prev) => [res.data.article, ...prev]);
                toast.success('Article published successfully');
            }
            setIsEditorOpen(false);
            setCurrentArticle(null);
            setFormDirty(false);
        } catch (error) {
            console.error('Error saving article:', error);
            toast.error('Failed to save article');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeletingId(deleteTarget._id);

        try {
            await axios.delete(`/api/articles/${deleteTarget._id}`, { headers: authHeaders() });
            setArticles((prev) => prev.filter((a) => a._id !== deleteTarget._id));
            toast.success('Article deleted');
            if (currentArticle?._id === deleteTarget._id) {
                setIsEditorOpen(false);
                setCurrentArticle(null);
            }
        } catch (error) {
            console.error('Error deleting article:', error);
            toast.error('Failed to delete article');
        } finally {
            setDeletingId(null);
            setDeleteTarget(null);
        }
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
        });

    const wordCount = formData.content.trim()
        ? formData.content.trim().split(/\s+/).length
        : 0;

    if (loading) {
        return (
            <div className="am-page">
                <div className="am-skeleton am-skeleton--title skeleton" />
                <div className="am-skeleton am-skeleton--subtitle skeleton" />
                <div className="am-list">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton am-skeleton--card" />
                    ))}
                </div>
                <ArticleManagerStyles />
            </div>
        );
    }

    return (
        <div className="am-page">
            <header className="am-header">
                <div>
                    <p className="am-eyebrow">Content Management</p>
                    <h1 className="am-title">Manage Articles</h1>
                    <p className="am-subtitle">Create, edit, and organize your agronomy insights.</p>
                </div>
                <button type="button" onClick={() => openEditor()} className="am-btn am-btn--primary">
                    <Plus size={18} />
                    Add New Article
                </button>
            </header>

            {articles.length === 0 ? (
                <div className="am-empty glass-panel">
                    <FileText size={40} />
                    <h3>No articles yet</h3>
                    <p>Start writing your first agronomy piece.</p>
                    <button type="button" onClick={() => openEditor()} className="am-btn am-btn--primary">
                        <Plus size={18} />
                        Create First Article
                    </button>
                </div>
            ) : (
                <div className="am-list">
                    {articles.map((article, index) => (
                        <motion.article
                            key={article._id}
                            className="am-card glass-panel"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="am-card__thumb">
                                {article.photo ? (
                                    <img src={article.photo} alt="" loading="lazy" />
                                ) : (
                                    <div className="am-card__thumb-placeholder">
                                        <ImageIcon size={28} />
                                    </div>
                                )}
                            </div>

                            <div className="am-card__body">
                                <h3 className="am-card__title">{article.title}</h3>
                                <p className="am-card__excerpt">
                                    {article.content.length > 140
                                        ? `${article.content.slice(0, 140)}...`
                                        : article.content}
                                </p>
                                <div className="am-card__meta">
                                    <span><User size={12} /> {article.author}</span>
                                    <span><Calendar size={12} /> {formatDate(article.createdAt)}</span>
                                </div>
                            </div>

                            <div className="am-card__actions">
                                <a
                                    href={`/article/${article._id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="am-action-btn am-action-btn--ghost"
                                    title="Preview article"
                                >
                                    <Eye size={15} />
                                    <span>Preview</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => openEditor(article)}
                                    className="am-action-btn am-action-btn--edit"
                                >
                                    <Pencil size={15} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteTarget(article)}
                                    className="am-action-btn am-action-btn--delete"
                                    disabled={deletingId === article._id}
                                >
                                    {deletingId === article._id ? (
                                        <Loader2 size={15} className="am-spin" />
                                    ) : (
                                        <Trash2 size={15} />
                                    )}
                                    <span>Delete</span>
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </div>
            )}

            {/* Slide-over editor */}
            <AnimatePresence>
                {isEditorOpen && (
                    <>
                        <motion.div
                            className="am-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeEditor}
                        />
                        <motion.aside
                            className="am-editor"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        >
                            <div className="am-editor__header">
                                <div>
                                    <p className="am-editor__eyebrow">
                                        {currentArticle ? 'Editing' : 'New draft'}
                                    </p>
                                    <h2>{currentArticle ? 'Edit Article' : 'New Article'}</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeEditor}
                                    className="am-editor__close"
                                    aria-label="Close editor"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="am-editor__form">
                                <div className="am-editor__scroll">
                                    <div className="am-field">
                                        <label htmlFor="title">Article Title</label>
                                        <input
                                            id="title"
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter a compelling title..."
                                            autoFocus
                                        />
                                    </div>

                                    <div className="am-field">
                                        <label htmlFor="content">
                                            Content
                                            <span className="am-field__hint">{wordCount} words</span>
                                        </label>
                                        <textarea
                                            id="content"
                                            name="content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            rows={12}
                                            required
                                            placeholder="Write your article content here. Use blank lines between paragraphs."
                                        />
                                    </div>

                                    <div className="am-field">
                                        <label htmlFor="photo">Cover Image URL</label>
                                        <div className="am-input-icon">
                                            <ImageIcon size={16} />
                                            <input
                                                id="photo"
                                                type="url"
                                                name="photo"
                                                value={formData.photo}
                                                onChange={handleChange}
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                        <div className="am-image-preview">
                                            {formData.photo ? (
                                                <img
                                                    src={formData.photo}
                                                    alt="Cover preview"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <span className="am-image-preview__empty">
                                                    <ImageIcon size={24} />
                                                    Image preview
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="am-field">
                                        <label htmlFor="author">Author</label>
                                        <div className="am-input-icon">
                                            <User size={16} />
                                            <input
                                                id="author"
                                                type="text"
                                                name="author"
                                                value={formData.author}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="am-editor__footer">
                                    <button
                                        type="button"
                                        onClick={closeEditor}
                                        className="am-btn am-btn--ghost"
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="am-btn am-btn--primary"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <Loader2 size={18} className="am-spin" />
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        {saving
                                            ? 'Saving...'
                                            : currentArticle
                                                ? 'Update Article'
                                                : 'Publish Article'}
                                    </button>
                                </div>
                            </form>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Delete confirmation modal */}
            <AnimatePresence>
                {deleteTarget && (
                    <>
                        <motion.div
                            className="am-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !deletingId && setDeleteTarget(null)}
                        />
                        <motion.div
                            className="am-modal-wrap"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="am-modal"
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2 }}
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="delete-modal-title"
                            >
                            <div className="am-modal__icon">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 id="delete-modal-title">Delete article?</h3>
                            <p>
                                &ldquo;{deleteTarget.title}&rdquo; will be permanently removed.
                                This action cannot be undone.
                            </p>
                            <div className="am-modal__actions">
                                <button
                                    type="button"
                                    className="am-btn am-btn--ghost"
                                    onClick={() => setDeleteTarget(null)}
                                    disabled={!!deletingId}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="am-btn am-btn--danger"
                                    onClick={confirmDelete}
                                    disabled={!!deletingId}
                                >
                                    {deletingId ? (
                                        <Loader2 size={16} className="am-spin" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                    Delete
                                </button>
                            </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ArticleManagerStyles />
        </div>
    );
};

const ArticleManagerStyles = () => (
    <style>{`
        .am-page {
            max-width: 960px;
            margin: 0 auto;
        }

        .am-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1.5rem;
            margin-bottom: 1.75rem;
        }

        .am-eyebrow {
            font-family: var(--font-mono);
            font-size: 0.7rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--primary-color);
            margin-bottom: 0.4rem;
        }

        .am-title {
            font-size: clamp(1.35rem, 3vw, 1.75rem);
            font-weight: 800;
            color: var(--text-heading);
            margin-bottom: 0.35rem;
        }

        .am-subtitle {
            font-size: 0.9rem;
            color: var(--text-secondary);
        }

        .am-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 0.6rem 1.1rem;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 600;
            transition: var(--transition);
            white-space: nowrap;
        }

        .am-btn--primary {
            background: var(--primary-color);
            color: var(--bg-primary);
            border: 1px solid var(--primary-color);
        }

        .am-btn--primary:hover:not(:disabled) {
            background: #34d399;
            box-shadow: 0 4px 20px var(--primary-glow);
            transform: translateY(-1px);
        }

        .am-btn--ghost {
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--glass-border);
        }

        .am-btn--ghost:hover:not(:disabled) {
            color: var(--text-heading);
            border-color: rgba(16, 185, 129, 0.35);
            background: rgba(16, 185, 129, 0.08);
        }

        .am-btn--danger {
            background: rgba(239, 68, 68, 0.15);
            color: #fca5a5;
            border: 1px solid rgba(239, 68, 68, 0.35);
        }

        .am-btn--danger:hover:not(:disabled) {
            background: rgba(239, 68, 68, 0.25);
            color: #fecaca;
        }

        .am-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .am-list {
            display: flex;
            flex-direction: column;
            gap: 0.875rem;
        }

        .am-card {
            display: grid;
            grid-template-columns: 96px 1fr auto;
            gap: 1rem;
            align-items: center;
            padding: 1rem;
            border-radius: 12px;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .am-card:hover {
            border-color: rgba(16, 185, 129, 0.3);
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.08);
        }

        .am-card__thumb {
            width: 96px;
            height: 72px;
            border-radius: 8px;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.2);
            flex-shrink: 0;
        }

        .am-card__thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .am-card__thumb-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            opacity: 0.4;
        }

        .am-card__body {
            min-width: 0;
        }

        .am-card__title {
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--text-heading);
            margin-bottom: 0.35rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .am-card__excerpt {
            font-size: 0.8rem;
            color: var(--text-secondary);
            line-height: 1.5;
            margin-bottom: 0.5rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .am-card__meta {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            font-size: 0.7rem;
            color: var(--text-secondary);
        }

        .am-card__meta span {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .am-card__actions {
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-shrink: 0;
        }

        .am-action-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 0.4rem 0.75rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            transition: var(--transition);
            border: 1px solid transparent;
            min-width: 88px;
        }

        .am-action-btn--ghost {
            color: var(--text-secondary);
            border-color: var(--glass-border);
            background: rgba(255, 255, 255, 0.03);
        }

        .am-action-btn--ghost:hover {
            color: var(--text-heading);
            background: rgba(255, 255, 255, 0.06);
        }

        .am-action-btn--edit {
            color: var(--primary-color);
            background: rgba(16, 185, 129, 0.1);
            border-color: rgba(16, 185, 129, 0.25);
        }

        .am-action-btn--edit:hover {
            background: rgba(16, 185, 129, 0.18);
            transform: translateX(-2px);
        }

        .am-action-btn--delete {
            color: #fca5a5;
            background: rgba(239, 68, 68, 0.08);
            border-color: rgba(239, 68, 68, 0.2);
        }

        .am-action-btn--delete:hover:not(:disabled) {
            background: rgba(239, 68, 68, 0.15);
            color: #fecaca;
        }

        .am-action-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .am-empty {
            text-align: center;
            padding: 3rem 2rem;
            border-radius: 12px;
        }

        .am-empty svg {
            color: var(--primary-color);
            opacity: 0.5;
            margin-bottom: 1rem;
        }

        .am-empty h3 {
            color: var(--text-heading);
            margin-bottom: 0.5rem;
        }

        .am-empty p {
            color: var(--text-secondary);
            margin-bottom: 1.25rem;
            font-size: 0.9rem;
        }

        /* Editor slide-over */
        .am-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(4px);
            z-index: 200;
        }

        .am-editor {
            position: fixed;
            top: 0;
            right: 0;
            width: min(520px, 100vw);
            height: 100vh;
            height: 100dvh;
            background: var(--bg-secondary);
            border-left: 1px solid var(--glass-border);
            z-index: 201;
            display: flex;
            flex-direction: column;
            box-shadow: -20px 0 60px rgba(0, 0, 0, 0.3);
        }

        .am-editor__header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 1.25rem 1.25rem 1rem;
            border-bottom: 1px solid var(--glass-border);
            flex-shrink: 0;
        }

        .am-editor__eyebrow {
            font-family: var(--font-mono);
            font-size: 0.65rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--primary-color);
            margin-bottom: 0.25rem;
        }

        .am-editor__header h2 {
            font-size: 1.15rem;
            font-weight: 700;
            color: var(--text-heading);
        }

        .am-editor__close {
            color: var(--text-secondary);
            padding: 6px;
            border-radius: 8px;
            transition: var(--transition);
        }

        .am-editor__close:hover {
            color: var(--text-heading);
            background: rgba(16, 185, 129, 0.1);
        }

        .am-editor__form {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
        }

        .am-editor__scroll {
            flex: 1;
            overflow-y: auto;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        .am-field label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--text-title);
            margin-bottom: 0.5rem;
        }

        .am-field__hint {
            font-weight: 400;
            font-size: 0.7rem;
            color: var(--text-secondary);
            font-family: var(--font-mono);
        }

        .am-field input,
        .am-field textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
            font-size: 0.9rem;
            font-family: inherit;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .am-field textarea {
            resize: vertical;
            min-height: 200px;
            line-height: 1.65;
        }

        .am-field input:focus,
        .am-field textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }

        .am-field input::placeholder,
        .am-field textarea::placeholder {
            color: rgba(167, 243, 208, 0.35);
        }

        .am-input-icon {
            position: relative;
        }

        .am-input-icon svg {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
            pointer-events: none;
        }

        .am-input-icon input {
            padding-left: 2.25rem;
        }

        .am-image-preview {
            margin-top: 0.75rem;
            aspect-ratio: 16 / 9;
            border-radius: 8px;
            overflow: hidden;
            border: 1px dashed var(--glass-border);
            background: rgba(0, 0, 0, 0.2);
        }

        .am-image-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .am-image-preview__empty {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            color: var(--text-secondary);
            font-size: 0.8rem;
            opacity: 0.5;
        }

        .am-editor__footer {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            padding: 1rem 1.25rem;
            border-top: 1px solid var(--glass-border);
            background: rgba(6, 78, 59, 0.5);
            flex-shrink: 0;
        }

        /* Delete modal */
        .am-modal-wrap {
            position: fixed;
            inset: 0;
            z-index: 202;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            pointer-events: none;
        }

        .am-modal {
            pointer-events: auto;
            width: min(400px, 100%);
            padding: 1.5rem;
            background: var(--bg-secondary);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
            text-align: center;
        }

        .am-modal__icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 1rem;
            border-radius: 50%;
            background: rgba(239, 68, 68, 0.12);
            color: #f87171;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .am-modal h3 {
            color: var(--text-heading);
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }

        .am-modal p {
            color: var(--text-secondary);
            font-size: 0.875rem;
            line-height: 1.5;
            margin-bottom: 1.25rem;
        }

        .am-modal__actions {
            display: flex;
            gap: 0.75rem;
            justify-content: center;
        }

        .am-spin {
            animation: amSpin 0.8s linear infinite;
        }

        @keyframes amSpin {
            to { transform: rotate(360deg); }
        }

        .am-skeleton--title { width: 220px; height: 28px; margin-bottom: 0.5rem; }
        .am-skeleton--subtitle { width: 320px; height: 16px; margin-bottom: 1.5rem; }
        .am-skeleton--card { height: 96px; border-radius: 12px; }

        @media (max-width: 768px) {
            .am-header {
                flex-direction: column;
            }

            .am-card {
                grid-template-columns: 72px 1fr;
                grid-template-rows: auto auto;
            }

            .am-card__thumb {
                width: 72px;
                height: 56px;
            }

            .am-card__actions {
                grid-column: 1 / -1;
                flex-direction: row;
                flex-wrap: wrap;
            }

            .am-action-btn {
                flex: 1;
                justify-content: center;
                min-width: 0;
            }

            .am-editor {
                width: 100vw;
            }
        }

        .am-editor__scroll::-webkit-scrollbar {
            width: 6px;
        }

        .am-editor__scroll::-webkit-scrollbar-thumb {
            background: rgba(16, 185, 129, 0.3);
            border-radius: 3px;
        }
    `}</style>
);

export default ArticleManager;
