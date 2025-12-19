'use client'

import { motion } from 'framer-motion'

// Floating Shapes Background
interface FloatingShapesProps {
    className?: string
    variant?: 'default' | 'minimal' | 'dense'
}

export function FloatingShapes({ className = '', variant = 'default' }: FloatingShapesProps) {
    const shapes = variant === 'dense' ? 12 : variant === 'minimal' ? 4 : 8

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {Array.from({ length: shapes }).map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full ${i % 3 === 0
                        ? 'bg-blue-500/10 dark:bg-blue-400/5'
                        : i % 3 === 1
                            ? 'bg-purple-500/10 dark:bg-purple-400/5'
                            : 'bg-cyan-500/10 dark:bg-cyan-400/5'
                        }`}
                    style={{
                        width: `${Math.random() * 200 + 50}px`,
                        height: `${Math.random() * 200 + 50}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        x: [0, Math.random() * 50 - 25, 0],
                        y: [0, Math.random() * 50 - 25, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    )
}

// Gradient Orbs
interface GradientOrbsProps {
    className?: string
    colors?: string[]
}

export function GradientOrbs({
    className = '',
    colors = ['from-blue-500 to-purple-500', 'from-purple-500 to-pink-500', 'from-cyan-500 to-blue-500']
}: GradientOrbsProps) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {colors.map((color, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br ${color} opacity-20 blur-3xl`}
                    style={{
                        left: i === 0 ? '-10%' : i === 1 ? '50%' : '80%',
                        top: i === 0 ? '20%' : i === 1 ? '-20%' : '60%',
                    }}
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 15 + i * 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    )
}

// Grid Pattern
interface GridPatternProps {
    className?: string
    size?: number
    opacity?: number
}

export function GridPattern({ className = '', size = 40, opacity = 0.03 }: GridPatternProps) {
    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{
                backgroundImage: `
                    linear-gradient(to right, currentColor ${1}px, transparent 1px),
                    linear-gradient(to bottom, currentColor ${1}px, transparent 1px)
                `,
                backgroundSize: `${size}px ${size}px`,
                opacity,
            }}
        />
    )
}

// Dot Pattern - Enhanced with multiple variants
interface DotPatternProps {
    className?: string
    size?: number
    spacing?: number
    opacity?: number
    variant?: 'static' | 'gradient' | 'animated' | 'scattered'
    color?: 'blue' | 'purple' | 'mixed'
}

export function DotPattern({
    className = '',
    size = 2,
    spacing = 24,
    opacity = 0.1,
    variant = 'static',
    color = 'mixed'
}: DotPatternProps) {
    if (variant === 'animated') {
        // Animated floating dots
        return (
            <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
                {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full ${color === 'blue'
                                ? 'bg-blue-500'
                                : color === 'purple'
                                    ? 'bg-purple-500'
                                    : i % 3 === 0
                                        ? 'bg-blue-500'
                                        : i % 3 === 1
                                            ? 'bg-purple-500'
                                            : 'bg-cyan-500'
                            }`}
                        style={{
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            left: `${(i % 8) * 12.5 + Math.random() * 5}%`,
                            top: `${Math.floor(i / 8) * 20 + Math.random() * 10}%`,
                            opacity: Math.random() * 0.3 + 0.1,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.1, 0.4, 0.1],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: Math.random() * 4 + 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
        )
    }

    if (variant === 'gradient') {
        // Dots with gradient fade
        return (
            <div className={`absolute inset-0 pointer-events-none ${className}`}>
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at center, 
                                ${color === 'blue' ? 'rgba(59,130,246,0.3)' : color === 'purple' ? 'rgba(139,92,246,0.3)' : 'rgba(59,130,246,0.3)'} ${size}px, 
                                transparent ${size}px)
                        `,
                        backgroundSize: `${spacing}px ${spacing}px`,
                        maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                        opacity,
                    }}
                />
            </div>
        )
    }

    if (variant === 'scattered') {
        // Randomly positioned dots with varying sizes
        return (
            <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="rgb(139,92,246)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="rgb(6,182,212)" stopOpacity="0.4" />
                        </linearGradient>
                    </defs>
                    <pattern id="scatteredDots" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="20" r="2" fill="url(#dotGradient)" opacity="0.5" />
                        <circle cx="45" cy="10" r="1.5" fill="url(#dotGradient)" opacity="0.4" />
                        <circle cx="80" cy="35" r="2.5" fill="url(#dotGradient)" opacity="0.6" />
                        <circle cx="25" cy="60" r="1" fill="url(#dotGradient)" opacity="0.3" />
                        <circle cx="70" cy="70" r="2" fill="url(#dotGradient)" opacity="0.5" />
                        <circle cx="55" cy="90" r="1.5" fill="url(#dotGradient)" opacity="0.4" />
                        <circle cx="90" cy="85" r="1" fill="url(#dotGradient)" opacity="0.3" />
                        <circle cx="15" cy="85" r="2" fill="url(#dotGradient)" opacity="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#scatteredDots)" style={{ opacity }} />
                </svg>
            </div>
        )
    }

    // Default static dots
    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{
                backgroundImage: `radial-gradient(circle, currentColor ${size}px, transparent ${size}px)`,
                backgroundSize: `${spacing}px ${spacing}px`,
                opacity,
            }}
        />
    )
}

// Hexagon Pattern
interface HexagonPatternProps {
    className?: string
    opacity?: number
    color?: string
}

export function HexagonPattern({
    className = '',
    opacity = 0.05,
    color = 'stroke-blue-500'
}: HexagonPatternProps) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="hexagons" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                        <path
                            d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
                            fill="none"
                            className={color}
                            strokeWidth="0.5"
                        />
                        <path
                            d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
                            fill="none"
                            className={color}
                            strokeWidth="0.5"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hexagons)" style={{ opacity }} />
            </svg>
        </div>
    )
}

// Cross/Plus Pattern
interface CrossPatternProps {
    className?: string
    opacity?: number
    size?: number
}

export function CrossPattern({
    className = '',
    opacity = 0.05,
    size = 20
}: CrossPatternProps) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="crosses" width={size * 2} height={size * 2} patternUnits="userSpaceOnUse">
                        <path
                            d={`M${size} ${size - 4}v8M${size - 4} ${size}h8`}
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-blue-500 dark:text-blue-400"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#crosses)" style={{ opacity }} />
            </svg>
        </div>
    )
}

// Diamond Grid
interface DiamondGridProps {
    className?: string
    opacity?: number
}

export function DiamondGrid({ className = '', opacity = 0.04 }: DiamondGridProps) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgb(59,130,246)" />
                        <stop offset="100%" stopColor="rgb(139,92,246)" />
                    </linearGradient>
                    <pattern id="diamonds" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path
                            d="M20 0L40 20L20 40L0 20Z"
                            fill="none"
                            stroke="url(#diamondGradient)"
                            strokeWidth="0.5"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#diamonds)" style={{ opacity }} />
            </svg>
        </div>
    )
}

// Waves decoration
interface WavesProps {
    className?: string
    color?: string
    position?: 'top' | 'bottom'
}

export function Waves({
    className = '',
    color = 'fill-white dark:fill-slate-950',
    position = 'bottom'
}: WavesProps) {
    const transform = position === 'top' ? 'rotate-180' : ''

    return (
        <div className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 ${className}`}>
            <svg
                viewBox="0 0 1440 120"
                className={`w-full h-auto ${transform}`}
                preserveAspectRatio="none"
            >
                <path
                    className={color}
                    d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,101.3C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                />
            </svg>
        </div>
    )
}

// Curved Divider
interface CurvedDividerProps {
    className?: string
    color?: string
    flip?: boolean
}

export function CurvedDivider({
    className = '',
    color = 'fill-white dark:fill-slate-950',
    flip = false
}: CurvedDividerProps) {
    return (
        <div className={`absolute left-0 right-0 overflow-hidden ${className}`}>
            <svg
                viewBox="0 0 1440 100"
                className={`w-full h-auto ${flip ? 'rotate-180' : ''}`}
                preserveAspectRatio="none"
            >
                <path
                    className={color}
                    d="M0,100 C480,0 960,0 1440,100 L1440,100 L0,100 Z"
                />
            </svg>
        </div>
    )
}

// Animated Gradient Background
interface AnimatedGradientProps {
    className?: string
    colors?: string[]
}

export function AnimatedGradient({
    className = '',
    colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#3b82f6']
}: AnimatedGradientProps) {
    return (
        <motion.div
            className={`absolute inset-0 ${className}`}
            style={{
                background: `linear-gradient(45deg, ${colors.join(', ')})`,
                backgroundSize: '400% 400%',
            }}
            animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear',
            }}
        />
    )
}

// Particles
interface ParticlesProps {
    className?: string
    count?: number
    color?: string
}

export function Particles({
    className = '',
    count = 30,
    color = 'bg-white'
}: ParticlesProps) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full ${color} opacity-50`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -100],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 3,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    )
}

// Decorative Circles
interface DecorativeCirclesProps {
    className?: string
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    color?: string
}

export function DecorativeCircles({
    className = '',
    position = 'top-right',
    color = 'stroke-blue-500/20'
}: DecorativeCirclesProps) {
    const positions = {
        'top-left': '-top-20 -left-20',
        'top-right': '-top-20 -right-20',
        'bottom-left': '-bottom-20 -left-20',
        'bottom-right': '-bottom-20 -right-20',
    }

    return (
        <div className={`absolute ${positions[position]} ${className}`}>
            <motion.svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
                <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    className={color}
                    strokeWidth="1"
                />
                <circle
                    cx="100"
                    cy="100"
                    r="60"
                    fill="none"
                    className={color}
                    strokeWidth="1"
                    strokeDasharray="10 5"
                />
                <circle
                    cx="100"
                    cy="100"
                    r="40"
                    fill="none"
                    className={color}
                    strokeWidth="1"
                />
            </motion.svg>
        </div>
    )
}

// Glow Spot
interface GlowSpotProps {
    className?: string
    color?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    position?: { top?: string; left?: string; right?: string; bottom?: string }
    animate?: boolean
}

export function GlowSpot({
    className = '',
    color = 'bg-blue-500',
    size = 'md',
    position = { top: '50%', left: '50%' },
    animate = true
}: GlowSpotProps) {
    const sizes = {
        sm: 'w-32 h-32',
        md: 'w-64 h-64',
        lg: 'w-96 h-96',
        xl: 'w-[500px] h-[500px]',
    }

    return (
        <motion.div
            className={`absolute ${sizes[size]} ${color} rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
            style={position}
            animate={animate ? {
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.25, 0.15],
            } : undefined}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    )
}

// Section Gradient Overlay
interface SectionOverlayProps {
    className?: string
    variant?: 'top-fade' | 'bottom-fade' | 'both' | 'radial'
}

export function SectionOverlay({ className = '', variant = 'both' }: SectionOverlayProps) {
    const variants = {
        'top-fade': 'bg-gradient-to-b from-white dark:from-slate-950 to-transparent',
        'bottom-fade': 'bg-gradient-to-t from-white dark:from-slate-950 to-transparent',
        'both': 'bg-gradient-to-b from-white via-transparent to-white dark:from-slate-950 dark:via-transparent dark:to-slate-950',
        'radial': 'bg-[radial-gradient(ellipse_at_center,_transparent_0%,_white_100%)] dark:bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgb(2,6,23)_100%)]',
    }

    return (
        <div className={`absolute inset-0 pointer-events-none ${variants[variant]} ${className}`} />
    )
}
