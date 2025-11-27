import { useEffect, useRef } from "react";

interface UseKeyboardNavigationProps {
  items: any[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  enabled?: boolean;
}

/**
 * Hook pour la navigation clavier avec les flèches
 */
export function useKeyboardNavigation({
  items,
  selectedIndex,
  onSelect,
  enabled = true,
}: UseKeyboardNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || items.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (containerRef.current && containerRef.current.contains(document.activeElement)) {
        const currentIndex = selectedIndex ?? -1;

        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            e.preventDefault();
            const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            onSelect(nextIndex);
            // Focus the next item
            const nextButton = containerRef.current.querySelector(
              `[data-choice-index="${nextIndex}"]`
            ) as HTMLElement;
            nextButton?.focus();
            break;

          case 'ArrowUp':
          case 'ArrowLeft':
            e.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            onSelect(prevIndex);
            // Focus the previous item
            const prevButton = containerRef.current.querySelector(
              `[data-choice-index="${prevIndex}"]`
            ) as HTMLElement;
            prevButton?.focus();
            break;

          case 'Enter':
          case ' ':
            if (currentIndex >= 0) {
              e.preventDefault();
              onSelect(currentIndex);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onSelect, enabled]);

  return containerRef;
}

