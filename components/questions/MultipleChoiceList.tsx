"use client";

import { motion } from "framer-motion";
import { CheckSquare2, SquareStack } from "lucide-react";
import ModernChoiceCard from "./ModernChoiceCard";

interface Choice {
  id: string;
  label: string;
  emoji?: string;
  title?: string;
  description?: string;
}

interface MultipleChoiceListProps {
  choices: Choice[];
  onSelect: (choiceIds: string[]) => void;
  selectedIds?: string[];
  accentColor?: string;
  isFirstQuestion?: boolean;
  questionId?: number;
}

export default function MultipleChoiceList({
  choices,
  onSelect,
  selectedIds = [],
  accentColor,
  isFirstQuestion = false,
  questionId,
}: MultipleChoiceListProps) {
  // Disable animations for question 14 for testing
  const disableAnimations = questionId === 14;
  const handleToggle = (choiceId: string) => {
    const newSelectedIds = selectedIds.includes(choiceId)
      ? selectedIds.filter(id => id !== choiceId)
      : [...selectedIds, choiceId];
    onSelect(newSelectedIds);
  };

  // Stack vertically for 3 or fewer choices
  const isVerticalLayout = choices.length <= 3;
  const selectedCount = selectedIds.length;
  
  // Use regular div instead of motion.div when animations are disabled
  const IndicatorWrapper = disableAnimations ? 'div' : motion.div;
  const IndicatorInner = disableAnimations ? 'div' : motion.div;
  const IconWrapper = disableAnimations ? 'div' : motion.div;
  const ListWrapper = disableAnimations ? 'div' : motion.div;
  
  return (
    <div className={`w-full mx-auto max-w-4xl`}>
      {/* Multiple Selection Indicator */}
      <IndicatorWrapper
        {...(disableAnimations ? {} : {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          transition: { 
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1,
          },
        })}
        className="mb-6 flex items-center justify-center gap-3"
        style={disableAnimations ? {} : { willChange: 'transform, opacity' }}
      >
        <IndicatorInner
          {...(disableAnimations ? {} : {
            whileHover: { scale: 1.02 },
            transition: { duration: 0.2 },
          })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 backdrop-blur-sm border-2 shadow-lg"
          style={{
            borderColor: accentColor || '#06b6d4',
            boxShadow: `0 4px 20px ${accentColor || '#06b6d4'}20`,
          }}
        >
          <IconWrapper
            {...(disableAnimations ? {} : {
              animate: selectedCount > 0 ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              } : {},
              transition: { duration: 0.4 },
            })}
          >
            {selectedCount > 0 ? (
              <CheckSquare2 
                className="w-5 h-5" 
                style={{ color: accentColor || '#06b6d4' }} 
              />
            ) : (
              <SquareStack 
                className="w-5 h-5" 
                style={{ color: accentColor || '#06b6d4' }} 
              />
            )}
          </IconWrapper>
          <span 
            className="font-inter font-semibold text-sm sm:text-base"
            style={{ color: accentColor || '#06b6d4' }}
          >
            {selectedCount > 0 
              ? `${selectedCount} ${selectedCount === 1 ? 'option sélectionnée' : 'options sélectionnées'}`
              : 'Sélection multiple - Cliquez sur plusieurs options'
            }
          </span>
        </IndicatorInner>
      </IndicatorWrapper>

      <ListWrapper
        {...(disableAnimations ? {} : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { 
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          },
        })}
        style={disableAnimations ? {} : {
          willChange: 'transform, opacity',
        }}
        className={`grid gap-5 ${
          isVerticalLayout 
            ? 'grid-cols-1' 
            : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {choices.map((choice, index) => (
          <ModernChoiceCard
            key={choice.id}
            id={choice.id}
            label={choice.label}
            isSelected={selectedIds.includes(choice.id)}
            onClick={() => handleToggle(choice.id)}
            index={index}
            accentColor={accentColor}
            icon={(choice as any).icon}
            isFirstQuestion={isFirstQuestion}
            emoji={choice.emoji}
            title={choice.title}
            description={choice.description}
            disableAnimations={disableAnimations}
            questionId={questionId}
          />
        ))}
      </ListWrapper>
    </div>
  );
}







