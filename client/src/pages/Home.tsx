import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import axios from 'axios';
import { assetUrl } from '../config/api';

const Home = () => {
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/profile');
                if (res.data && res.data.length > 0) {
                    setProfile(res.data[0]);
                } else {
                    setError("No profile data found.");
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError("Failed to load profile data.");
            }
        };

        fetchProfile();
    }, []);

    const scrollToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (error) return <div className="container section" style={{ color: '#f87171' }}>{error}</div>;

    if (!profile) {
        return (
            <div className="hero section">
                <div className="container">
                    <div className="hero-content hero-skeleton">
                        <div className="skeleton hero-skeleton__img" />
                        <div className="hero-skeleton__text">
                            <div className="skeleton hero-skeleton__line hero-skeleton__line--sm" />
                            <div className="skeleton hero-skeleton__line hero-skeleton__line--lg" />
                            <div className="skeleton hero-skeleton__line hero-skeleton__line--md" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const imageUrl = assetUrl(profile.image);
    const resumeUrl = assetUrl(profile.resume);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 28 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
        },
    };

    return (
        <div className="home-page">
            <section className="hero section">
                <div className="container">
                    <motion.div
                        className="hero-content"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {profile.image && (
                            <motion.div className="hero-img-wrapper" variants={itemVariants}>
                                <div className="hero-img-ring" />
                                <img
                                    src={imageUrl}
                                    alt={profile.name}
                                    className="hero-profile-img"
                                />
                            </motion.div>
                        )}
                        <div className="hero-text-content">
                            {profile.name && (
                                <motion.h2 className="hero-greeting" variants={itemVariants}>
                                    Hi, my name is
                                </motion.h2>
                            )}
                            {profile.name && (
                                <motion.h1 className="hero-name" variants={itemVariants}>
                                    {profile.name}.
                                </motion.h1>
                            )}
                            <motion.h2 className="hero-title" variants={itemVariants}>
                                {profile.title || "Backend Engineer"}
                            </motion.h2>

                            {profile.resume && (
                                <motion.div variants={itemVariants}>
                                    <a
                                        href={resumeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline hero-cv-btn"
                                    >
                                        Download CV
                                    </a>
                                </motion.div>
                            )}

                            <motion.div className="social-links-hero" variants={itemVariants}>
                                {profile.socialLinks?.github && (
                                    <motion.a
                                        href={profile.socialLinks.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="social-btn"
                                        aria-label="GitHub"
                                        whileHover={{ y: -5, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Github size={22} />
                                    </motion.a>
                                )}
                                {profile.socialLinks?.linkedin && (
                                    <motion.a
                                        href={profile.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="social-btn"
                                        aria-label="LinkedIn"
                                        whileHover={{ y: -5, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Linkedin size={22} />
                                    </motion.a>
                                )}
                                {profile.email && (
                                    <motion.a
                                        href={`mailto:${profile.email}`}
                                        className="social-btn"
                                        aria-label="Email"
                                        whileHover={{ y: -5, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Mail size={22} />
                                    </motion.a>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                <motion.button
                    className="scroll-indicator"
                    onClick={scrollToAbout}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    whileHover={{ opacity: 1 }}
                    aria-label="Scroll to about section"
                >
                    <span>Scroll</span>
                    <ChevronDown size={20} className="scroll-indicator__chevron" />
                </motion.button>
            </section>

            <style>{`
            .hero {
                min-height: calc(100vh - var(--header-height));
                display: flex;
                flex-direction: column;
                justify-content: center;
                position: relative;
            }

            .hero-content {
                display: flex;
                align-items: center;
                gap: clamp(24px, 5vw, 60px);
            }

            .hero-text-content {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            .hero-greeting {
                color: var(--primary-color);
                font-size: clamp(1rem, 2vw, 1.2rem);
                margin-bottom: 0.75rem;
                font-weight: 400;
                font-family: var(--font-mono);
            }

            .hero-img-wrapper {
                position: relative;
                flex-shrink: 0;
            }

            .hero-img-ring {
                position: absolute;
                inset: -8px;
                border-radius: 50%;
                border: 2px solid rgba(16, 185, 129, 0.2);
                animation: pulseGlow 3s ease-in-out infinite;
            }

            .hero-profile-img {
                width: clamp(180px, 28vw, 280px);
                height: clamp(180px, 28vw, 280px);
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid var(--primary-color);
                box-shadow: 0 10px 40px -10px var(--primary-glow);
                transition: transform 0.5s var(--ease-out-expo), box-shadow 0.5s ease;
                position: relative;
                z-index: 1;
            }

            .hero-img-wrapper:hover .hero-profile-img {
                transform: scale(1.03);
                box-shadow: 0 20px 50px -10px var(--primary-glow);
            }

            .hero-name {
                font-size: clamp(36px, 7vw, 72px);
                font-weight: 800;
                color: var(--text-heading);
                line-height: 1.05;
                margin-bottom: 12px;
                letter-spacing: -1.5px;
                background: linear-gradient(135deg, var(--text-heading) 0%, var(--text-primary) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .hero-title {
                font-size: clamp(20px, 3.5vw, 36px);
                font-weight: 600;
                color: var(--text-secondary);
                line-height: 1.3;
                margin-bottom: 2rem;
                max-width: 600px;
            }

            .hero-cv-btn {
                margin-bottom: 2rem;
            }

            .btn-outline:hover {
                background: rgba(16, 185, 129, 0.2);
                transform: translateY(-2px);
                box-shadow: 0 8px 24px var(--primary-glow);
            }

            .social-links-hero {
                display: flex;
                gap: 16px;
                flex-wrap: wrap;
            }

            .scroll-indicator {
                position: absolute;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%);
                background: none;
                border: none;
            }

            .hero-skeleton {
                gap: 40px;
            }

            .hero-skeleton__img {
                width: 240px;
                height: 240px;
                border-radius: 50%;
                flex-shrink: 0;
            }

            .hero-skeleton__text {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 16px;
                max-width: 500px;
            }

            .hero-skeleton__line {
                height: 20px;
            }

            .hero-skeleton__line--sm { width: 40%; height: 16px; }
            .hero-skeleton__line--lg { width: 80%; height: 48px; }
            .hero-skeleton__line--md { width: 60%; height: 28px; }

            @media (max-width: 768px) {
                .hero-content {
                    flex-direction: column;
                    text-align: center;
                }
                .hero-text-content {
                    align-items: center;
                }
                .social-links-hero {
                    justify-content: center;
                }
                .scroll-indicator {
                    bottom: 1rem;
                }
            }
        `}</style>
        </div>
    );
};

export default Home;
