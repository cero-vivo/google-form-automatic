'use client'

import { useEffect } from 'react'

export default function ZoomPreventionScript() {
  useEffect(() => {
    // Prevent zoom via keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')
      ) {
        e.preventDefault()
        return false
      }
    }

    // Prevent zoom via mouse wheel + Ctrl/Cmd
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        return false
      }
    }

    // Prevent double-tap zoom on touch devices
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
        return false
      }
    }

    // Prevent gesturestart (pinch zoom) on iOS
    const handleGestureStart = (e: Event) => {
      e.preventDefault()
      return false
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, { passive: false })
    document.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('gesturestart', handleGestureStart, { passive: false })

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('gesturestart', handleGestureStart)
    }
  }, [])

  return null
}