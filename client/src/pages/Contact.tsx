import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import ScrollReveal from '../components/ScrollReveal';

const Contact = () => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        axios.get('/api/profile')
            .then((res) => {
                if (res.data?.[0]?.email) setEmail(res.data[0].email);
            })
            .catch(() => {});
    }, []);

    const mailto = email ? `mailto:${email}` : 'mailto:admin@example.com';

    return (
        <div className="section contact-section">
            <div className="container">
                <ScrollReveal>
                    <div className="contact-card glass-panel">
                        <span className="contact-eyebrow">04. What's Next?</span>
                        <h2 className="heading contact-heading">Get In Touch</h2>
                        <p className="contact-text">
                            I'm currently open to new opportunities. Whether you have a question,
                            a project in mind, or just want to say hello — I'd love to hear from you.
                        </p>

                        <motion.a
                            href={mailto}
                            className="btn contact-btn"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Mail size={18} />
                            Say Hello
                            <ArrowUpRight size={16} className="contact-btn__arrow" />
                        </motion.a>

                        {email && (
                            <p className="contact-email">
                                or email me at{' '}
                                <a href={mailto} className="contact-email__link">{email}</a>
                            </p>
                        )}
                    </div>
                </ScrollReveal>
            </div>

            <style>{`
        .contact-section {
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .contact-card {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: clamp(2.5rem, 6vw, 4rem);
            max-width: 680px;
            margin: 0 auto;
            border-radius: 16px;
            transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }

        .contact-card:hover {
            border-color: rgba(16, 185, 129, 0.35);
            box-shadow: 0 20px 60px rgba(16, 185, 129, 0.1);
        }

        .contact-eyebrow {
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
            letter-spacing: 0.05em;
        }

        .contact-heading {
            margin-bottom: 1.5rem;
        }

        .contact-text {
            max-width: 520px;
            color: var(--text-secondary);
            font-size: clamp(1rem, 2vw, 1.15rem);
            line-height: 1.8;
            margin-bottom: 2.5rem;
        }

        .contact-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 1rem 2rem;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 8px;
        }

        .contact-btn__arrow {
            transition: transform 0.3s var(--ease-out-expo);
        }

        .contact-btn:hover .contact-btn__arrow {
            transform: translate(2px, -2px);
        }

        .contact-email {
            margin-top: 1.5rem;
            font-size: 0.9rem;
            color: var(--text-secondary);
            font-family: var(--font-mono);
        }

        .contact-email__link {
            color: var(--primary-color);
            transition: opacity 0.2s ease;
        }

        .contact-email__link:hover {
            opacity: 0.8;
            text-decoration: underline;
        }
      `}</style>
        </div>
    );
};

export default Contact;
