"use client"

import type { ReactNode } from "react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
}

export function AnimatedSection({ children, className, delay = 0, direction = "up" }: AnimatedSectionProps) {
  const [isVisible, ref] = useIntersectionObserver({ threshold: 0.15 })

  const getDirectionClasses = () => {
    switch (direction) {
      case "up":
        return "translate-y-8"
      case "down":
        return "translate-y-[-8px]"
      case "left":
        return "translate-x-8"
      case "right":
        return "translate-x-[-8px]"
      case "none":
        return ""
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 transform-none" : `opacity-0 ${getDirectionClasses()}`,
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

