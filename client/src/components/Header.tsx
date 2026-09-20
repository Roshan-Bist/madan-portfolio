import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useActiveSection } from '../hooks/useActiveSection';
import { useScrolled } from '../hooks/useScrolled';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeSection = useActiveSection();
  const scrolled = useScrolled(30);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Experience', id: 'experience' },
    { name: 'Articles', id: 'articles' },
    { name: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header-container">
        <motion.div
          className="logo"
          onClick={() => scrollToSection('home')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="logo-text">Portfolio</span>
          <span className="logo-dot" />
        </motion.div>

        <nav className="nav nav--desktop">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.name} className="nav-item">
                <button
                  className={`nav-link ${activeSection === link.id ? 'nav-link--active' : ''}`}
                  onClick={() => scrollToSection(link.id)}
                >
                  <span className="nav-link__text">{link.name}</span>
                  {activeSection === link.id && (
                    <motion.span
                      className="nav-link__indicator"
                      layoutId="nav-indicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.nav
              className="nav nav--mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <ul className="nav-list nav-list--mobile">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    className="nav-item"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <button
                      className={`nav-link nav-link--mobile ${activeSection === link.id ? 'nav-link--active' : ''}`}
                      onClick={() => scrollToSection(link.id)}
                    >
                      <span className="nav-link__index">0{i + 1}.</span>
                      {link.name}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: rgba(6, 78, 59, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 1000;
          height: var(--header-height);
          display: flex;
          align-items: center;
          border-bottom: 1px solid transparent;
          transition: height 0.35s var(--ease-out-expo), background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }

        .header--scrolled {
          height: calc(var(--header-height) - 8px);
          background: rgba(6, 78, 59, 0.92);
          border-bottom-color: rgba(16, 185, 129, 0.12);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .logo-text {
          color: var(--text-heading);
          font-weight: 700;
          font-size: 1.35rem;
          letter-spacing: -0.5px;
        }

        .logo-dot {
          width: 8px;
          height: 8px;
          background: var(--primary-color);
          border-radius: 50%;
          box-shadow: 0 0 12px var(--primary-color);
        }

        .nav-list {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }

        .nav-link {
          position: relative;
          color: var(--text-secondary);
          font-size: 0.95rem;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: color 0.25s ease, background 0.25s ease;
        }

        .nav-link:hover {
          color: var(--text-heading);
          background: rgba(16, 185, 129, 0.08);
        }

        .nav-link--active {
          color: var(--primary-color);
        }

        .nav-link__indicator {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: var(--primary-color);
          border-radius: 2px;
          box-shadow: 0 0 8px var(--primary-glow);
        }

        .menu-toggle {
          display: none;
          color: var(--primary-color);
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .menu-toggle:hover {
          background: rgba(16, 185, 129, 0.1);
        }

        .nav-backdrop {
          display: none;
        }

        .nav--mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .nav--desktop {
            display: none;
          }

          .menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .nav-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 999;
          }

          .nav--mobile {
            display: flex;
            position: fixed;
            top: 0;
            right: 0;
            width: min(85%, 320px);
            height: 100vh;
            height: 100dvh;
            background: var(--bg-secondary);
            border-left: 1px solid var(--glass-border);
            z-index: 1001;
            align-items: center;
            justify-content: center;
            box-shadow: -20px 0 60px rgba(0, 0, 0, 0.3);
          }

          .nav-list--mobile {
            flex-direction: column;
            gap: 0.5rem;
            padding: 2rem;
            width: 100%;
          }

          .nav-link--mobile {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.25rem;
            padding: 1rem 1.25rem;
            width: 100%;
            text-align: left;
            border-radius: 8px;
          }

          .nav-link__index {
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--primary-color);
            min-width: 28px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
