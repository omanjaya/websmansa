'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useState, useEffect, useRef } from 'react'

// Staggered container for list animations
interface StaggerContainerProps {
    children: ReactNode
    className?: string
    staggerDelay?: number
    as?: 'div' | 'ul' | 'section'
}

export function StaggerContainer({
    children,
    className = '',
    staggerDelay = 0.1,
    as = 'div'
}: StaggerContainerProps) {
    const Component = motion[as]

    return (
        <Component
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
        >
            {children}
        </Component>
    )
}

// Staggered item
interface StaggerItemProps {
    children: ReactNode
    className?: string
    index?: number
}

export function StaggerItem({ children, className = '', index = 0 }: StaggerItemProps) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                        type: 'spring',
                        stiffness: 100,
                        damping: 15,
                        delay: index * 0.05,
                    }
                },
            }}
        >
            {children}
        </motion.div>
    )
}

// Fade in on scroll
interface FadeInOnScrollProps {
    children: ReactNode
    className?: string
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    delay?: number
    duration?: number
}

export function FadeInOnScroll({
    children,
    className = '',
    direction = 'up',
    delay = 0,
    duration = 0.6
}: FadeInOnScrollProps) {
    const directions = {
        up: { y: 40 },
        down: { y: -40 },
        left: { x: 40 },
        right: { x: -40 },
        none: {},
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, ...directions[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1]
            }}
        >
            {children}
        </motion.div>
    )
}

// Scale and fade on scroll
interface ScaleInProps {
    children: ReactNode
    className?: string
    delay?: number
}

export function ScaleIn({ children, className = '', delay = 0 }: ScaleInProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay,
                type: 'spring',
                stiffness: 100,
            }}
        >
            {children}
        </motion.div>
    )
}

// Parallax wrapper
interface ParallaxProps {
    children: ReactNode
    className?: string
    speed?: number // -1 to 1, negative = opposite direction
}

export function Parallax({ children, className = '', speed = 0.5 }: ParallaxProps) {
    return (
        <motion.div
            className={className}
            initial={{ y: 0 }}
            whileInView={{ y: speed * -50 }}
            viewport={{ once: false, margin: '-200px' }}
            transition={{
                type: 'tween',
                ease: 'linear',
            }}
        >
            {children}
        </motion.div>
    )
}

// Hover scale effect
interface HoverScaleProps {
    children: ReactNode
    className?: string
    scale?: number
}

export function HoverScale({ children, className = '', scale = 1.02 }: HoverScaleProps) {
    return (
        <motion.div
            className={className}
            whileHover={{ scale }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.div>
    )
}

// Animated counter
interface CountUpProps {
    value: number
    duration?: number
    className?: string
    suffix?: string
    prefix?: string
}

export function CountUp({
    value,
    duration = 2,
    className = '',
    suffix = '',
    prefix = ''
}: CountUpProps) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                {prefix}
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {value}
                </motion.span>
                {suffix}
            </motion.span>
        </motion.span>
    )
}

// Animated presence wrapper for filter changes
interface AnimatedListProps {
    children: ReactNode
    className?: string
}

export function AnimatedList({ children, className = '' }: AnimatedListProps) {
    return (
        <AnimatePresence mode="popLayout">
            <motion.div
                className={className}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

// Floating animation
interface FloatProps {
    children: ReactNode
    className?: string
    duration?: number
    distance?: number
}

export function Float({
    children,
    className = '',
    duration = 3,
    distance = 10
}: FloatProps) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -distance, 0],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            {children}
        </motion.div>
    )
}

// Pulse glow animation
interface PulseGlowProps {
    children: ReactNode
    className?: string
    color?: string
}

export function PulseGlow({
    children,
    className = '',
    color = 'rgba(59, 130, 246, 0.5)'
}: PulseGlowProps) {
    return (
        <motion.div
            className={`relative ${className}`}
            whileHover="hover"
        >
            <motion.div
                className="absolute inset-0 rounded-inherit blur-xl opacity-0"
                style={{ backgroundColor: color }}
                variants={{
                    hover: {
                        opacity: 0.6,
                        scale: 1.1,
                    }
                }}
                transition={{ duration: 0.3 }}
            />
            <div className="relative">{children}</div>
        </motion.div>
    )
}

// Text reveal animation
interface TextRevealProps {
    text: string
    className?: string
    delay?: number
}

export function TextReveal({ text, className = '', delay = 0 }: TextRevealProps) {
    const words = text.split(' ')

    return (
        <motion.span className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    className="inline-block mr-[0.25em]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * 0.1,
                        ease: [0.25, 0.1, 0.25, 1]
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    )
}

// Shimmer/skeleton loading
interface ShimmerProps {
    className?: string
    width?: string
    height?: string
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function Shimmer({
    className = '',
    width = '100%',
    height = '20px',
    rounded = 'md'
}: ShimmerProps) {
    const roundedClasses = {
        none: '',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        full: 'rounded-full',
    }

    return (
        <div
            className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700 ${roundedClasses[rounded]} ${className}`}
            style={{ width, height }}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            />
        </div>
    )
}

// Medal shine effect for Prestasi page
interface MedalShineProps {
    children: ReactNode
    className?: string
    isActive?: boolean
}

export function MedalShine({ children, className = '', isActive = true }: MedalShineProps) {
    return (
        <motion.div
            className={`relative overflow-hidden ${className}`}
            whileHover={isActive ? "shine" : "rest"}
        >
            <motion.div
                className="absolute inset-0 opacity-0"
                style={{
                    background: `linear-gradient(
                        120deg,
                        transparent 0%,
                        transparent 40%,
                        rgba(255,255,255,0.8) 50%,
                        transparent 60%,
                        transparent 100%
                    )`,
                    backgroundSize: '200% 100%',
                }}
                variants={{
                    shine: {
                        opacity: 1,
                        backgroundPosition: ['200% 0%', '-200% 0%'],
                    },
                    rest: {
                        opacity: 0,
                    }
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                }}
            />
            {children}
        </motion.div>
    )
}

// Confetti trigger component
interface ConfettiTriggerProps {
    children: ReactNode
    className?: string
    trigger?: 'hover' | 'click' | 'manual'
    onTrigger?: () => void
    colors?: string[]
    particleCount?: number
    spread?: number
}

export function ConfettiTrigger({
    children,
    className = '',
    trigger = 'hover',
    onTrigger,
    colors = ['#FFD700', '#FFA500', '#C0C0C0', '#FF6B6B', '#4ECDC4'],
    particleCount = 50,
    spread = 60
}: ConfettiTriggerProps) {
    const handleConfetti = () => {
        // Dynamically import canvas-confetti to avoid SSR issues
        import('canvas-confetti').then((confetti) => {
            confetti.default({
                particleCount,
                spread,
                origin: { y: 0.7 },
                colors,
                disableForReducedMotion: true,
            })
        })

        if (onTrigger) onTrigger()
    }

    if (trigger === 'manual') {
        return <div className={className}>{children}</div>
    }

    return (
        <motion.div
            className={className}
            {...(trigger === 'hover' && {
                onHoverStart: handleConfetti
            })}
            {...(trigger === 'click' && {
                onClick: handleConfetti
            })}
        >
            {children}
        </motion.div>
    )
}

// Typewriter text effect for Alumni testimonials
interface TypewriterTextProps {
    text: string
    className?: string
    speed?: number
    delay?: number
    cursor?: boolean
}

export function TypewriterText({
    text,
    className = '',
    speed = 50,
    delay = 0,
    cursor = true
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState('')
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            let index = 0
            const interval = setInterval(() => {
                if (index < text.length) {
                    setDisplayedText(text.slice(0, index + 1))
                    index++
                } else {
                    setIsComplete(true)
                    clearInterval(interval)
                }
            }, speed)

            return () => clearInterval(interval)
        }, delay * 1000)

        return () => clearTimeout(timer)
    }, [text, speed, delay])

    return (
        <span className={className}>
            {displayedText}
            {cursor && !isComplete && (
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-current ml-1"
                />
            )}
        </span>
    )
}

// Animated counter with easing for stats
interface AnimatedCounterProps {
    value: number
    duration?: number
    className?: string
    suffix?: string
    prefix?: string
    delay?: number
    formatter?: (value: number) => string
}

export function AnimatedCounter({
    value,
    duration = 2,
    className = '',
    suffix = '',
    prefix = '',
    delay = 0,
    formatter = (val) => val.toString()
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true)
                        let startTime: number
                        let animationFrame: number

                        const animate = (timestamp: number) => {
                            if (!startTime) startTime = timestamp
                            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

                            // Easing function for smooth animation
                            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
                            setCount(Math.floor(easeOutQuart * value))

                            if (progress < 1) {
                                animationFrame = requestAnimationFrame(animate)
                            }
                        }

                        animationFrame = requestAnimationFrame(animate)

                        return () => cancelAnimationFrame(animationFrame)
                    }
                })
            },
            { threshold: 0.1 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            const currentRef = ref.current
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [value, duration, hasAnimated])

    return (
        <span ref={ref} className={className}>
            {prefix}{formatter(count)}{suffix}
        </span>
    )
}

// 3D Card Tilt Effect for Gallery
interface TiltCardProps {
    children: ReactNode
    className?: string
    intensity?: number
    resetOnLeave?: boolean
}

export function TiltCard({
    children,
    className = '',
    intensity = 0.1,
    resetOnLeave = true
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height

        const centerX = 0.5
        const centerY = 0.5

        const rotateX = (y - centerY) * intensity * 20
        const rotateY = (centerX - x) * intensity * 20

        ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
    }

    const handleMouseLeave = () => {
        if (!ref.current || !resetOnLeave) return
        ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: 'preserve-3d' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.div>
    )
}

// Urgent Banner with pulsing animation for Pengumuman
interface UrgentBannerProps {
    children: ReactNode
    className?: string
    variant?: 'danger' | 'warning' | 'info'
    pulse?: boolean
}

export function UrgentBanner({
    children,
    className = '',
    variant = 'danger',
    pulse = true
}: UrgentBannerProps) {
    const variantStyles = {
        danger: {
            bg: 'bg-gradient-to-r from-red-500 to-red-600',
            shadow: 'shadow-red-500/30',
            pulse: 'rgba(239, 68, 68, 0.4)'
        },
        warning: {
            bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
            shadow: 'shadow-amber-500/30',
            pulse: 'rgba(245, 158, 11, 0.4)'
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
            shadow: 'shadow-blue-500/30',
            pulse: 'rgba(59, 130, 246, 0.4)'
        }
    }

    const style = variantStyles[variant]

    return (
        <motion.div
            className={`relative overflow-hidden rounded-xl ${style.bg} ${style.shadow} shadow-lg ${className}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Pulsing background effect */}
            {pulse && (
                <motion.div
                    className="absolute inset-0 rounded-xl"
                    animate={{
                        boxShadow: [
                            `0 0 0 0 ${style.pulse}`,
                            `0 0 0 15px transparent`,
                            `0 0 0 0 ${style.pulse}`,
                        ],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            )}

            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                }}
                animate={{
                    backgroundPosition: ['200% 0%', '-200% 0%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    )
}

// Countdown Timer for events and deadlines
interface CountdownTimerProps {
    targetDate: Date | string
    className?: string
    onComplete?: () => void
    showDays?: boolean
    showHours?: boolean
    showMinutes?: boolean
    showSeconds?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export function CountdownTimer({
    targetDate,
    className = '',
    onComplete,
    showDays = true,
    showHours = true,
    showMinutes = true,
    showSeconds = true,
    size = 'md'
}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isComplete: false
    })

    useEffect(() => {
        const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate

        const calculateTimeLeft = () => {
            const now = new Date()
            const difference = target.getTime() - now.getTime()

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true })
                if (onComplete) onComplete()
                return
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                isComplete: false
            })
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [targetDate, onComplete])

    const sizeStyles = {
        sm: {
            container: 'gap-1',
            box: 'w-10 h-10',
            number: 'text-lg font-bold',
            label: 'text-[8px]'
        },
        md: {
            container: 'gap-2',
            box: 'w-14 h-14',
            number: 'text-xl font-bold',
            label: 'text-[10px]'
        },
        lg: {
            container: 'gap-3',
            box: 'w-20 h-20',
            number: 'text-3xl font-bold',
            label: 'text-xs'
        }
    }

    const styles = sizeStyles[size]

    const TimeBox = ({ value, label }: { value: number, label: string }) => (
        <motion.div
            className={`flex flex-col items-center justify-center ${styles.box} bg-white/10 backdrop-blur-sm rounded-lg`}
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <motion.span
                className={`${styles.number} text-white`}
                key={`${label}-${value}`}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {value.toString().padStart(2, '0')}
            </motion.span>
            <span className={`${styles.label} text-white/70 uppercase tracking-wider`}>
                {label}
            </span>
        </motion.div>
    )

    if (timeLeft.isComplete) {
        return (
            <div className={`flex items-center justify-center ${className}`}>
                <span className="text-white font-medium">Waktu habis!</span>
            </div>
        )
    }

    return (
        <div className={`flex ${styles.container} ${className}`}>
            {showDays && <TimeBox value={timeLeft.days} label="Hari" />}
            {showHours && <TimeBox value={timeLeft.hours} label="Jam" />}
            {showMinutes && <TimeBox value={timeLeft.minutes} label="Mnt" />}
            {showSeconds && <TimeBox value={timeLeft.seconds} label="Dtk" />}
        </div>
    )
}

// Pulse Alert indicator
interface PulseAlertProps {
    className?: string
    color?: 'red' | 'yellow' | 'green' | 'blue'
    size?: 'sm' | 'md' | 'lg'
}

export function PulseAlert({
    className = '',
    color = 'red',
    size = 'md'
}: PulseAlertProps) {
    const colorStyles = {
        red: 'bg-red-500',
        yellow: 'bg-yellow-500',
        green: 'bg-green-500',
        blue: 'bg-blue-500'
    }

    const sizeStyles = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    }

    return (
        <span className={`relative flex ${sizeStyles[size]} ${className}`}>
            <motion.span
                className={`absolute inline-flex h-full w-full rounded-full ${colorStyles[color]} opacity-75`}
                animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className={`relative inline-flex rounded-full ${sizeStyles[size]} ${colorStyles[color]}`} />
        </span>
    )
}
