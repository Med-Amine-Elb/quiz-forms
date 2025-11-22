# Structure des Questions

Cette structure permet de gérer toutes les questions du sondage de manière modulaire et réutilisable.

## Structure des fichiers

### Composants principaux

- **`QuestionPage.tsx`** : Composant de base qui gère le background, logo et layout commun à toutes les questions
- **`QuestionRenderer.tsx`** : Composant qui rend le bon type de question selon la configuration
- **`ChoiceQuestion.tsx`** : Composant pour les questions à choix multiples
- **`TextQuestion.tsx`** : Composant pour les questions texte/libre
- **`RatingQuestion.tsx`** : Composant pour les questions de notation (étoiles)

### Configuration

- **`data/questions.ts`** : Fichier centralisé contenant toutes les 23 questions avec leur configuration

### Hook

- **`hooks/useQuestionNavigation.ts`** : Hook pour gérer la navigation entre les questions et stocker les réponses

## Utilisation

```tsx
import { useQuestionNavigation } from "@/hooks/useQuestionNavigation";
import QuestionPage from "@/components/questions/QuestionPage";
import QuestionRenderer from "@/components/questions/QuestionRenderer";

function MyQuestionPage() {
  const { currentQuestion, goToNextQuestion } = useQuestionNavigation();
  
  return (
    <QuestionPage
      questionNumber={currentQuestion.id}
      questionText={currentQuestion.question}
    >
      <QuestionRenderer
        question={currentQuestion}
        onAnswer={goToNextQuestion}
      />
    </QuestionPage>
  );
}
```

## Ajouter une nouvelle question

Éditez `data/questions.ts` et ajoutez votre question dans le tableau `questions` :

```ts
{
  id: 24,
  type: 'choice', // ou 'text', 'rating', 'multiple'
  question: 'Votre question ici ?',
  choices: [...], // si type = 'choice'
  placeholder: '...', // si type = 'text'
  required: true,
}
```

## Types de questions supportés

- **`choice`** : Choix unique parmi plusieurs options
- **`text`** : Réponse texte libre
- **`rating`** : Notation avec étoiles (1-5)
- **`multiple`** : Choix multiples (à implémenter)

