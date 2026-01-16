import type { Question } from "@/data/questions";

type Loader = () => Promise<unknown>;

const componentLoaders: Partial<Record<Question["type"], Loader>> = {
  choice: () =>
    Promise.all([
      import("@/components/questions/ChoiceQuestion"),
      import("@/components/questions/ModernChoiceList"),
      import("@/components/ui/InteractiveChoiceList"),
    ]),
  text: () => import("@/components/questions/TextQuestion"),
  rating: () => import("@/components/questions/RatingQuestion"),
  satisfaction: () => import("@/components/questions/SatisfactionRating"),
  multiple: () => import("@/components/questions/MultipleChoiceList"),
  slider: () => import("@/components/questions/RatingSlider"),
};

const loadedTypes = new Set<Question["type"]>();

export function preloadQuestionType(type?: Question["type"]) {
  if (!type || loadedTypes.has(type)) {
    return;
  }

  const loader = componentLoaders[type];
  if (!loader) {
    return;
  }

  loader()
    .then(() => {
      loadedTypes.add(type);
    })
    .catch(() => {
      // Ignore preload failures; components will lazy load when needed
    });
}

// Preload all question types upfront for better performance
export function preloadAllQuestionTypes() {
  const allTypes: Question["type"][] = ['choice', 'text', 'rating', 'satisfaction', 'multiple', 'slider'];
  allTypes.forEach(type => preloadQuestionType(type));
}

