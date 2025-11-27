import type { Question } from "@/data/questions";

type Loader = () => Promise<unknown>;

const componentLoaders: Partial<Record<Question["type"], Loader>> = {
  choice: () =>
    Promise.all([
      import("@/components/questions/ChoiceQuestion"),
      import("@/components/questions/ModernChoiceList"),
    ]),
  text: () => import("@/components/questions/TextQuestion"),
  rating: () => import("@/components/questions/RatingQuestion"),
  satisfaction: () => import("@/components/questions/SatisfactionRating"),
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

