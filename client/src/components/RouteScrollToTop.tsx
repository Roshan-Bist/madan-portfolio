import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const scrollToSection = (id: string, behavior: ScrollBehavior = 'smooth') => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior });
        return true;
    }
    return false;
};

const scrollWindowToTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
};

/** Scrolls to top on route change, or to a hash section when navigating to /#section */
const RouteScrollToTop = () => {
    const { pathname, hash, state } = useLocation();

    useEffect(() => {
        const sectionFromState = (state as { scrollTo?: string } | null)?.scrollTo;

        if (sectionFromState) {
            let attempts = 0;
            let timer: ReturnType<typeof setTimeout>;
            const tryScroll = () => {
                if (scrollToSection(sectionFromState) || attempts >= 8) return;
                attempts += 1;
                timer = setTimeout(tryScroll, 50);
            };
            tryScroll();
            return () => clearTimeout(timer);
        }

        if (hash) {
            const id = hash.replace('#', '');
            let attempts = 0;
            let timer: ReturnType<typeof setTimeout>;
            const tryScroll = () => {
                if (scrollToSection(id) || attempts >= 8) return;
                attempts += 1;
                timer = setTimeout(tryScroll, 50);
            };
            tryScroll();
            return () => clearTimeout(timer);
        }

        scrollWindowToTop();
        requestAnimationFrame(scrollWindowToTop);
        const t1 = setTimeout(scrollWindowToTop, 0);
        const t2 = setTimeout(scrollWindowToTop, 50);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [pathname, hash, state]);

    return null;
};

export default RouteScrollToTop;

export { scrollToSection, scrollWindowToTop };
