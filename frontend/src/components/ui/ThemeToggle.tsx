'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Monitor } from 'lucide-react'

interface ThemeToggleProps {
  transparent?: boolean
}

export function ThemeToggle({ transparent = false }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    // Update class directly for immediate visual effect
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const buttonClass = transparent
    ? "relative w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden hover:bg-white/30 transition-colors"
    : "relative w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"

  // Show static button during SSR
  if (!mounted) {
    return (
      <button className={buttonClass} aria-label="Toggle theme">
        <Moon className={transparent ? "w-5 h-5 text-white" : "w-5 h-5 text-slate-700 dark:hidden"} />
        {!transparent && <Sun className="w-5 h-5 text-yellow-500 hidden dark:block" />}
      </button>
    )
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={buttonClass}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === 'dark' ? (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className={transparent ? "w-5 h-5 text-white" : "w-5 h-5 text-yellow-500"} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0, rotate: 90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className={transparent ? "w-5 h-5 text-white" : "w-5 h-5 text-slate-700"} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// Full Theme Switcher with System option
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-slate-800">
        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </div>
    )
  }

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ]

  return (
    <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-slate-800">
      {themes.map(({ value, icon: Icon, label }) => (
        <motion.button
          key={value}
          onClick={() => setTheme(value)}
          className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            theme === value
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={label}
        >
          {theme === value && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <Icon className="w-4 h-4 relative z-10" />
        </motion.button>
      ))}
    </div>
  )
}
