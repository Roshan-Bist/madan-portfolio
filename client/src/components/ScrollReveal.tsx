import React from 'react';
import { motion } from 'motion/react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface ScrollRevealProps {
    children: React.ReactNode;
    threshold?: number;
    className?: string;
    delay?: number;
    direction?: Direction;
    duration?: number;
}

const directionOffset: Record<Direction, { x: number; y: number }> = {
    up: { x: 0, y: 32 },
    down: { x: 0, y: -32 },
    left: { x: 32, y: 0 },
    right: { x: -32, y: 0 },
    none: { x: 0, y: 0 },
};

const ScrollReveal = ({
    children,
    threshold = 0.05,
    className = '',
    delay = 0,
    direction = 'up',
    duration = 0.7,
}: ScrollRevealProps) => {
    const offset = directionOffset[direction];

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, x: offset.x, y: offset.y }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: threshold, margin: '0px 0px -60px 0px' }}
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1] as const,
            }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
