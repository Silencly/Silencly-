"use client"

import { motion } from "framer-motion"
import { forwardRef } from "react"

interface TimelineContentProps {
  as?: any
  animationNum: number
  timelineRef?: React.RefObject<any>
  customVariants: any
  className?: string
  children?: React.ReactNode
}

export const TimelineContent = forwardRef<any, TimelineContentProps>(
  (
    {
      as = "div",
      animationNum,
      timelineRef,
      customVariants,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Component = motion[as as keyof typeof motion] || motion.div

    return (
      <Component
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, root: timelineRef }}
        variants={{
          hidden: customVariants.hidden,
          visible: customVariants.visible(animationNum),
        }}
        className={className}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

TimelineContent.displayName = "TimelineContent"
