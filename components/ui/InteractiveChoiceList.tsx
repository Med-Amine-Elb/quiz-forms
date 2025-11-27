"use client";

import { motion } from "framer-motion";
import { 
  Check, 
  Building2, 
  DollarSign, 
  ShoppingCart, 
  Megaphone, 
  Users, 
  Factory, 
  Truck, 
  Award, 
  Laptop, 
  Scale, 
  MessageSquare, 
  FlaskConical 
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Choice {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface InteractiveChoiceListProps {
  choices: Choice[];
  onSelect: (choiceId: string) => void;
  selectedId?: string | null;
}

export default function InteractiveChoiceList({
  choices,
  onSelect,
  selectedId,
}: InteractiveChoiceListProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {choices.map((choice, index) => {
          const isSelected = selectedId === choice.id;
          return (
            <motion.button
              key={choice.id}
              onClick={() => onSelect(choice.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative px-6 py-4 rounded-2xl text-left transition-all duration-300",
                "border-2 font-inter text-base sm:text-lg font-medium",
                "focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-cyan-500/50",
                isSelected
                  ? "text-gray-900 border-[#53FF45] shadow-lg"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 hover:border-[#53FF45]/50 hover:bg-[#53FF45]/10"
              )}
              style={
                isSelected
                  ? {
                      background: 'linear-gradient(to right, #53FF45, #45E639)',
                      boxShadow: '0 10px 40px rgba(83, 255, 69, 0.4)',
                    }
                  : undefined
              }
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  {choice.icon && (
                    <motion.div
                      animate={{
                        x: [0, 5, 0],
                        y: [0, -3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.1,
                      }}
                      className={cn(
                        "shrink-0",
                        isSelected ? "text-gray-900" : "text-cyan-500"
                      )}
                    >
                      <choice.icon 
                        className={cn(
                          "w-6 h-6",
                          isSelected ? "text-gray-900" : "text-cyan-500"
                        )} 
                        strokeWidth={2}
                      />
                    </motion.div>
                  )}
                  <span className="flex-1">{choice.label}</span>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                    }}
                    className="ml-3 shrink-0"
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  </motion.div>
                )}
              </div>
              {isSelected && (
                <motion.div
                  layoutId="selectedBackground"
                  className="absolute inset-0 rounded-2xl -z-10"
                  style={{
                    background: 'linear-gradient(to right, #53FF45, #45E639)',
                  }}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

