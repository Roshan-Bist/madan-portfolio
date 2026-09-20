import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, FileText, Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: '/admin/profile', label: 'Edit Profile', icon: User },
        { to: '/admin/articles', label: 'Articles', icon: FileText },
    ];

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="admin-layout">
            {sidebarOpen && (
                <button
                    className="admin-sidebar-backdrop"
                    onClick={closeSidebar}
                    aria-label="Close menu"
                />
            )}

            <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
                <div className="admin-sidebar__top">
                    <div className="admin-logo">
                        <span className="admin-logo__dot" />
                        Admin Panel
                    </div>
                    <button
                        className="admin-sidebar-close"
                        onClick={closeSidebar}
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {user?.name && (
                    <div className="admin-user-chip">
                        <div className="admin-user-chip__avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="admin-user-chip__info">
                            <span className="admin-user-chip__name">{user.name}</span>
                            <span className="admin-user-chip__role">Administrator</span>
                        </div>
                    </div>
                )}

                <nav className="admin-nav">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `admin-nav-link ${isActive ? 'admin-nav-link--active' : ''}`
                            }
                            onClick={closeSidebar}
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={18} />
                    Logout
                </button>
            </aside>

            <div className="admin-main">
                <header className="admin-topbar">
                    <button
                        className="admin-menu-btn"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={22} />
                    </button>
                    <span className="admin-topbar__title">Portfolio Admin</span>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>

            <style>{`
                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                    min-height: 100dvh;
                    background: var(--bg-primary);
                }

                .admin-sidebar-backdrop {
                    display: none;
                }

                .admin-sidebar {
                    width: 260px;
                    background: var(--bg-secondary);
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid var(--glass-border);
                    flex-shrink: 0;
                    z-index: 100;
                }

                .admin-sidebar__top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                }

                .admin-logo {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--text-heading);
                }

                .admin-logo__dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    box-shadow: 0 0 10px var(--primary-glow);
                }

                .admin-sidebar-close {
                    display: none;
                    color: var(--text-secondary);
                    padding: 4px;
                }

                .admin-user-chip {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0.75rem;
                    margin-bottom: 1.25rem;
                    border-radius: 10px;
                    background: rgba(16, 185, 129, 0.08);
                    border: 1px solid var(--glass-border);
                }

                .admin-user-chip__avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(16, 185, 129, 0.2);
                    color: var(--primary-color);
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .admin-user-chip__name {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-heading);
                }

                .admin-user-chip__role {
                    font-size: 0.7rem;
                    color: var(--text-secondary);
                }

                .admin-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                    flex: 1;
                }

                .admin-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--text-secondary);
                    padding: 0.65rem 0.875rem;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: var(--transition);
                    border: 1px solid transparent;
                }

                .admin-nav-link:hover {
                    color: var(--text-heading);
                    background: rgba(16, 185, 129, 0.08);
                }

                .admin-nav-link--active {
                    color: var(--primary-color);
                    background: rgba(16, 185, 129, 0.12);
                    border-color: rgba(16, 185, 129, 0.25);
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(239, 68, 68, 0.08);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #fca5a5;
                    cursor: pointer;
                    padding: 0.65rem 0.875rem;
                    font-size: 0.9rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                    transition: var(--transition);
                }

                .logout-btn:hover {
                    background: rgba(239, 68, 68, 0.15);
                    color: #fecaca;
                }

                .admin-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }

                .admin-topbar {
                    display: none;
                    align-items: center;
                    gap: 12px;
                    padding: 0.875rem 1rem;
                    border-bottom: 1px solid var(--glass-border);
                    background: rgba(6, 78, 59, 0.9);
                    backdrop-filter: blur(10px);
                }

                .admin-menu-btn {
                    color: var(--primary-color);
                    padding: 4px;
                }

                .admin-topbar__title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-heading);
                }

                .admin-content {
                    flex: 1;
                    padding: clamp(1.25rem, 3vw, 2rem);
                    overflow-y: auto;
                }

                @media (max-width: 768px) {
                    .admin-sidebar-backdrop {
                        display: block;
                        position: fixed;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 99;
                        border: none;
                        cursor: pointer;
                    }

                    .admin-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        height: 100vh;
                        height: 100dvh;
                        transform: translateX(-100%);
                        transition: transform 0.3s var(--ease-out-expo);
                    }

                    .admin-sidebar--open {
                        transform: translateX(0);
                    }

                    .admin-sidebar-close {
                        display: flex;
                    }

                    .admin-topbar {
                        display: flex;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
