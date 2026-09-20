import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container footer-inner">
                <p className="footer-built">
                    Built with <Heart size={14} className="footer-heart" /> React & Node.js by Roshan Bist
                </p>
                <p className="footer-copy">&copy; {year} All rights reserved.</p>
            </div>
            <style>{`
        .footer {
          padding: 2.5rem 0;
          border-top: 1px solid rgba(16, 185, 129, 0.1);
          text-align: center;
        }

        .footer-inner {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-built,
        .footer-copy {
          color: var(--text-secondary);
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .footer-heart {
          color: var(--primary-color);
          animation: pulseGlow 2s ease-in-out infinite;
        }
      `}</style>
        </footer>
    );
};

export default Footer;
