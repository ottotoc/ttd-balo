import React from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

export default function AnimatedSection({ 
  children, 
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  className = ''
}) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1, triggerOnce: true })

  const animations = {
    'fade-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
    },
    'fade-down': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(-30px)'
    },
    'fade-left': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(30px)'
    },
    'fade-right': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-30px)'
    },
    'zoom-in': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.9)'
    },
    'zoom-out': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(1.1)'
    },
    'flip-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'rotateX(0deg)' : 'rotateX(45deg)'
    },
    'slide-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(50px)'
    }
  }

  const style = {
    ...animations[animation],
    transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`
  }

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}


