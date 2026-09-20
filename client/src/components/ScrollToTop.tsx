import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 400);
        };

        toggleVisibility();
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    className="scroll-to-top"
                    onClick={scrollToTop}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileHover={{ scale: 1.08, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={22} />
                </motion.button>
            )}
            <style>{`
                .scroll-to-top {
                    position: fixed;
                    bottom: 28px;
                    right: 28px;
                    background: var(--primary-color);
                    color: var(--bg-primary);
                    border: none;
                    border-radius: 50%;
                    width: 48px;
                    height: 48px;
                    cursor: pointer;
                    z-index: 999;
                    box-shadow: 0 4px 20px var(--primary-glow);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 768px) {
                    .scroll-to-top {
                        bottom: 20px;
                        right: 20px;
                        width: 44px;
                        height: 44px;
                    }
                }
            `}</style>
        </AnimatePresence>
    );
};

export default ScrollToTop;
