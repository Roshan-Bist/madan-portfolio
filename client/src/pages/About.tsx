import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScrollReveal from '../components/ScrollReveal';
import Experience from '../components/Experience';

const About = () => {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/profile');
                if (res.data && res.data.length > 0) {
                    setProfile(res.data[0]);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) return <div className="container section">Loading...</div>;

    const highlightKeywords = (text: string) => {
        if (!text || !profile?.skills?.length) return text;

        // Extract all skill strings from the new grouped structure
        const keywords = profile.skills.flatMap((group: any) => group.items || []);
        if (keywords.length === 0) return text;

        // Escape special regex characters
        const escapedKeywords = keywords.map((k: string) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');

        const parts = text.split(regex);
        return parts.map((part: string, index: number) => {
            if (keywords.some((k: string) => k.toLowerCase() === part.toLowerCase())) {
                return <span key={index} className="highlight">{part}</span>;
            }
            return part;
        });
    };

    return (
        <React.Fragment>
            <div className="section" id="about">
                <div className="container about-container">
                    <h2 className="heading">About Me</h2>

                    <ScrollReveal>
                        <div className="about-glass-panel">
                            <div className="about-text">
                                <p className="bio-text">
                                    <span className="intro-label">Introduction: </span>
                                    {highlightKeywords(profile.bio)}
                                </p>

                                {profile.highlights && profile.highlights.length > 0 && (
                                    <div className="highlights-section">
                                        <h3 className="highlights-title">HIGHLIGHTS</h3>
                                        <div className="highlights-grid">
                                            {profile.highlights.map((highlight: string, index: number) => (
                                                <ScrollReveal key={index} delay={index * 0.08} threshold={0.1}>
                                                    <div className="highlight-card">
                                                    <div className="highlight-dot"></div>
                                                    <div className="highlight-text">{highlightKeywords(highlight)}</div>
                                                    </div>
                                                </ScrollReveal>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                <style>{`
        .about-glass-panel {
          background: rgba(17, 24, 39, 0.4);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 12px;
          padding: 3rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          border-left: 3px solid var(--primary-color);
        }

        .about-text p.bio-text {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          line-height: 1.8;
          margin-bottom: 3rem;
          color: var(--text-primary);
        }

        .intro-label {
          color: var(--primary-color);
          font-weight: 600;
        }

        .highlights-title {
            font-size: 1.25rem;
            letter-spacing: 2px;
            color: var(--primary-color);
            margin-bottom: 1.5rem;
            font-weight: 700;
            text-transform: uppercase;
        }

        .highlights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }

        .highlight-card {
            background: rgba(17, 34, 64, 0.5);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 1.5rem;
            display: flex;
            align-items: flex-start;
            gap: 16px;
            backdrop-filter: blur(10px);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.4s ease, box-shadow 0.4s ease;
            position: relative;
            overflow: hidden;
        }

        .highlight-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%);
            opacity: 0;
            transition: opacity 0.4s ease;
            z-index: 0;
            pointer-events: none;
        }

        .highlight-card:hover::before {
            opacity: 1;
        }

        .highlight-card:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: rgba(16, 185, 129, 0.3);
            box-shadow: 0 10px 30px -15px rgba(2, 12, 27, 0.7);
        }

        .highlight-dot {
            width: 10px; /* Slightly larger dot */
            height: 10px;
            background-color: var(--primary-color);
            border-radius: 50%;
            flex-shrink: 0;
            box-shadow: 0 0 12px 2px var(--primary-color); /* Stronger glow */
            margin-top: 6px; /* Align with first line of text */
            position: relative;
            z-index: 1;
        }

        .highlight-text {
            color: #f1f5f9; /* Near white for maximum readability against dark slate */
            font-size: 1.5rem; /* Slightly larger font */
            line-height: 1.6;
            font-weight: 400;
            position: relative;
            z-index: 1;
        }

        @media (max-width: 768px) {
          .about-glass-panel {
              padding: 2rem;
          }
          .highlights-grid {
              grid-template-columns: 1fr;
          }
        }

        .sub-heading {
            font-size: 1.8rem;
            color: var(--text-primary);
            margin-bottom: 1.5rem;
            position: relative;
            display: inline-block;
        }

        .sub-heading::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 40%;
            height: 2px;
            background: var(--primary-color);
            border-radius: 2px;
            transition: width 0.3s ease;
        }

        .sub-heading:hover::after {
            width: 100%;
        }

        .img-wrapper {
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            width: 100%;
            padding-bottom: 100%; /* Square */
            background: var(--bg-light);
        }

         .img-wrapper img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: grayscale(100%) contrast(1);
            transition: var(--transition);
         }

         .img-wrapper:hover img {
            filter: none;
         }
      `}</style>
            </div>
            <Experience />
        </React.Fragment>
    );
};

export default About;
