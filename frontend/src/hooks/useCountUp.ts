import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export function useCountUp(
    end: number,
    duration: number = 2000,
    start: number = 0
) {
    const [count, setCount] = useState(start)
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const hasAnimated = useRef(false)

    useEffect(() => {
        if (!isInView || hasAnimated.current) return
        hasAnimated.current = true

        let startTime: number | null = null
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)

            setCount(Math.floor(progress * (end - start) + start))

            if (progress < 1) {
                requestAnimationFrame(step)
            }
        }

        requestAnimationFrame(step)
    }, [end, duration, start, isInView])

    return { count, ref }
}
