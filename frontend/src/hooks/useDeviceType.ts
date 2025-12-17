'use client'

import { useEffect, useState } from 'react'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function useDeviceType(): DeviceType {
    const [deviceType, setDeviceType] = useState<DeviceType>('desktop')

    useEffect(() => {
        const checkDeviceType = () => {
            const width = window.innerWidth

            if (width < 768) {
                setDeviceType('mobile')
            } else if (width >= 768 && width < 1024) {
                setDeviceType('tablet')
            } else {
                setDeviceType('desktop')
            }
        }

        // Check on mount
        checkDeviceType()

        // Listen for resize
        window.addEventListener('resize', checkDeviceType)

        return () => window.removeEventListener('resize', checkDeviceType)
    }, [])

    return deviceType
}

// Alternative: Check user agent for more accurate detection
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            // Check both screen width and user agent
            const userAgent = navigator.userAgent.toLowerCase()
            const mobileKeywords = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
            const isMobileUA = mobileKeywords.test(userAgent)
            const isMobileWidth = window.innerWidth < 768

            setIsMobile(isMobileUA || isMobileWidth)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return isMobile
}
