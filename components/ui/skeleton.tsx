"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export default function Skeleton({
  className,
  variant = "default",
  width,
  height,
  animate = true,
}: SkeletonProps) {
  const baseClasses = "bg-gray-200 rounded";
  
  const variantClasses = {
    default: "rounded-lg",
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  const content = (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  );

  if (!animate) return content;

  return (
    <motion.div
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn("overflow-hidden", className)}
      style={style}
    >
      <div className={cn(baseClasses, variantClasses[variant], "w-full h-full")} />
    </motion.div>
  );
}

