import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScrollReveal from '../components/ScrollReveal';

const Experience = () => {
    const [experience, setExperience] = useState<any[]>([]);

    const [skills, setSkills] = useState<string[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/profile');
                if (res.data && res.data.length > 0) {
                    setExperience(res.data[0].experience || []);
                    setSkills(res.data[0].skills || []);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const highlightKeywords = (text: string) => {
        if (!text || !skills.length) return text;

        // Extract all skill strings from the new grouped structure
        const keywords = skills.flatMap((group: any) => group.items || []);
        if (keywords.length === 0) return text;

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

    if (!experience.length) return null;

    return (
        <div className="section" id="experience">
            <div className="container">
                <ScrollReveal threshold={0.2}>
                    <div className="experience-section">
                        <h2 className="heading">Work Experience</h2>
                        <div className="timeline">
                            {experience.map((exp: any, index: number) => (
                                <ScrollReveal key={index} delay={index * 0.1} threshold={0.15}>
                                    <div className="timeline-item">
                                        <div className="timeline-dot"></div>
                                        <div className="timeline-content">
                                            <h4>{exp.title} <span className="company">@ {exp.company}</span></h4>
                                            <div className="duration">
                                                <span>{exp.duration}</span>
                                            </div>
                                            <ul className="experience-desc-list">
                                                {exp.description?.split('\n').filter((line: string) => line.trim() !== '').map((line: string, i: number) => (
                                                    <li key={i}>{highlightKeywords(line.replace(/^-\s*/, ''))}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            <style>{`
             .timeline {
                 position: relative;
                 max-width: 900px;
                 margin: 0 auto;
                 padding: 20px 0;
             }
    
             .timeline::after {
                 content: '';
                 position: absolute;
                 width: 2px;
                 background: linear-gradient(to bottom, var(--primary-color), rgba(16, 185, 129, 0.1));
                 top: 0;
                 bottom: 0;
                 left: 20px;
                 margin-left: -1px;
             }
    
             .timeline-item {
                 padding: 10px 0 30px 50px;
                 position: relative;
                 width: 100%;
                 display: flex;
             }
    
             .timeline-dot {
                 width: 16px;
                 height: 16px;
                 position: absolute;
                 background: var(--bg-primary);
                 border: 2px solid var(--primary-color);
                 border-radius: 50%;
                 left: 13px;
                 top: 24px;
                 z-index: 1;
                 transition: all 0.3s ease;
             }
    
             .timeline-item:hover .timeline-dot {
                 background: var(--primary-color);
                 box-shadow: 0 0 12px var(--primary-color);
             }
    
             .timeline-content {
                 padding: 25px 30px;
                 background: rgba(17, 34, 64, 0.5);
                 border: 1px solid var(--glass-border);
                 border-radius: 8px;
                 width: 100%;
                 backdrop-filter: blur(10px);
                 transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.4s ease, box-shadow 0.4s ease;
                 position: relative;
                 overflow: hidden;
             }

             .timeline-content::before {
                 content: '';
                 position: absolute;
                 top: 0; left: 0; right: 0; bottom: 0;
                 background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%);
                 opacity: 0;
                 transition: opacity 0.4s ease;
                 z-index: 0;
                 pointer-events: none;
             }

             .timeline-content:hover::before {
                 opacity: 1;
             }
    
             .timeline-content:hover {
                 transform: translateY(-6px);
                 border-color: rgba(16, 185, 129, 0.3);
                 box-shadow: 0 12px 40px rgba(16, 185, 129, 0.1);
             }

             @media (max-width: 768px) {
                 .timeline-content {
                     padding: 20px;
                 }
                 .timeline-content h4 {
                     font-size: 1.1rem;
                 }
             }
    
             .timeline-content h4 {
                 font-size: 1.3rem;
                 color: var(--text-heading);
                 margin-bottom: 0.5rem;
                 position: relative;
                 z-index: 1;
             }
    
             .timeline-content .company {
                 color: var(--primary-color);
                 font-weight: 500;
                 position: relative;
                 z-index: 1;
             }
    
             .timeline-content .duration {
                 font-family: var(--font-mono);
                 font-size: 0.9rem;
                 color: var(--primary-color);
                 margin-bottom: 1.5rem;
                 display: flex;
                 align-items: center;
                 position: relative;
                 z-index: 1;
             }
    
             .experience-desc-list {
                 list-style: none;
                 padding: 0;
                 margin: 0;
                 position: relative;
                 z-index: 1;
             }
    
             .experience-desc-list li {
                 position: relative;
                 padding-left: 25px;
                 margin-bottom: 12px;
                 color: var(--text-secondary);
                 line-height: 1.6;
             }
    
             .experience-desc-list li::before {
                 content: '▹';
                 position: absolute;
                 left: 0;
                 top: 2px;
                 color: var(--primary-color);
                 font-size: 1.2rem;
             }
            `}</style>
        </div>
    );
};

export default Experience;
