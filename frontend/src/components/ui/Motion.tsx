'use client'

import { motion, HTMLMotionProps, Variants } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'

// Fade In Animation
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Fade Up Animation
export function FadeUp({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Slide In From Left
export function SlideInLeft({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Slide In From Right
export function SlideInRight({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Scale In Animation
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.3,
  className = '',
  ...props
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Scroll Reveal Animation (triggers when element comes into view)
export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  className = '',
  once = true,
  amount = 0.3,
}: {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
  once?: boolean
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 40 }
      case 'down':
        return { opacity: 0, y: -40 }
      case 'left':
        return { opacity: 0, x: 40 }
      case 'right':
        return { opacity: 0, x: -40 }
      default:
        return { opacity: 0, y: 40 }
    }
  }

  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 }
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 }
      default:
        return { opacity: 1, y: 0 }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={isInView ? getFinalPosition() : getInitialPosition()}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger Container for staggered children animations
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
  ...props
}: {
  children: ReactNode
  staggerDelay?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Stagger Item (to be used inside StaggerContainer)
export function StaggerItem({
  children,
  className = '',
  ...props
}: {
  children: ReactNode
  className?: string
} & HTMLMotionProps<'div'>) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  )
}

// Hover Scale Animation
export function HoverScale({
  children,
  scale = 1.02,
  className = '',
  ...props
}: {
  children: ReactNode
  scale?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Float Animation (continuous floating effect)
export function Float({
  children,
  duration = 3,
  className = '',
  ...props
}: {
  children: ReactNode
  duration?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Pulse Animation
export function Pulse({
  children,
  className = '',
  ...props
}: {
  children: ReactNode
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Page Transition Wrapper
export function PageTransition({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Text Reveal Animation (character by character)
export function TextReveal({
  text,
  className = '',
  delay = 0,
  duration = 0.05,
}: {
  text: string
  className?: string
  delay?: number
  duration?: number
}) {
  const letters = Array.from(text)

  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: delay + index * duration,
            ease: 'easeOut',
          }}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  )
}

// Counter Animation
export function AnimatedCounter({
  value,
  duration = 2,
  className = '',
}: {
  value: number
  duration?: number
  className?: string
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration }}
      >
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  )
}
