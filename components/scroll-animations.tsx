"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ScrollAnimationProps {
  children: ReactNode
  animation?: "fade" | "slide-up" | "slide-left" | "slide-right" | "scale" | "rotate"
  delay?: number
  duration?: number
  className?: string
}

export function ScrollAnimation({
  children,
  animation = "fade",
  delay = 0,
  duration = 0.6,
  className = "",
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  const animationClass = {
    fade: "opacity-0 animate-fade-in",
    "slide-up": "opacity-0 translate-y-10 animate-slide-up",
    "slide-left": "opacity-0 translate-x-10 animate-slide-left",
    "slide-right": "opacity-0 -translate-x-10 animate-slide-right",
    scale: "opacity-0 scale-95 animate-scale-in",
    rotate: "opacity-0 rotate-3 animate-rotate-in",
  }[animation]

  return (
    <div
      ref={ref}
      className={`scroll-animation ${animationClass} ${className}`}
      style={{
        transitionDelay: `${delay}s`,
        transitionDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  )
}

export function ParallaxSection({
  children,
  speed = 0.5,
  className = "",
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const scrolled = window.scrollY
      const rect = ref.current.getBoundingClientRect()
      const elementTop = rect.top + scrolled
      const offset = (scrolled - elementTop) * speed
      ref.current.style.transform = `translateY(${offset}px)`
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={`parallax-section ${className}`}>
      {children}
    </div>
  )
}
