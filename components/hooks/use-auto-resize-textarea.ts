import { useRef, RefObject } from "react";

interface UseAutoResizeTextareaProps {
  minHeight?: number;
  maxHeight?: number;
}

export function useAutoResizeTextarea({
  minHeight = 64,
  maxHeight = 200,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = (reset = false) => {
    if (textareaRef.current) {
      if (reset) {
        textareaRef.current.style.height = `${minHeight}px`;
      } else {
        textareaRef.current.style.height = `${minHeight}px`;
        const scrollHeight = textareaRef.current.scrollHeight;
        const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
        textareaRef.current.style.height = `${newHeight}px`;
      }
    }
  };

  return { textareaRef, adjustHeight };
}

