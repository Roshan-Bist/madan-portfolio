import { useEffect, useState } from 'react';

const SECTION_IDS = ['home', 'about', 'experience', 'articles', 'contact'];

export function useActiveSection() {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        SECTION_IDS.forEach((id) => {
            const element = document.getElementById(id);
            if (!element) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(id);
                    }
                },
                { rootMargin: '-40% 0px -45% 0px', threshold: 0 }
            );

            observer.observe(element);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    return activeSection;
}
