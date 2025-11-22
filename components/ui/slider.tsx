"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  variant?: "default" | "satisfaction"
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, variant = "default", ...props }, ref) => {
  const isSatisfaction = variant === "satisfaction"
  
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track 
        className={cn(
          "relative h-2 w-full grow overflow-hidden rounded-full",
          isSatisfaction 
            ? "bg-gradient-to-r from-red-500 via-orange-500 via-amber-500 via-emerald-500 to-cyan-500" 
            : "bg-gray-200"
        )}
      >
        <SliderPrimitive.Range 
          className={cn(
            "absolute h-full",
            isSatisfaction 
              ? "bg-transparent" 
              : "bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600"
          )} 
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className={cn(
          "block rounded-full bg-white shadow-lg transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          isSatisfaction
            ? "h-8 w-8 border-4 border-cyan-500 focus-visible:ring-cyan-500"
            : "h-5 w-5 border-2 border-cyan-500 focus-visible:ring-cyan-500"
        )} 
      />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

