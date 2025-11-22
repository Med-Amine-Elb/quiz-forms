# 📋 Architecture Explanation: Question Pages System

## 🎯 Overview

Your survey application uses a **single page template** (`QuestionPage`) that displays **different question types** dynamically. There are **5 question types** supported, not just 3!

---

## 🏗️ Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    app/page.tsx                              │
│  (Main Landing Page + Question Container)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              useQuestionNavigation Hook                       │
│  - Tracks current question index (0-22)                     │
│  - Manages answers array                                     │
│  - Provides goToNextQuestion() function                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              data/questions.ts                               │
│  - Array of 23 questions                                     │
│  - Each question has: id, type, question text, etc.           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              QuestionPage Component                          │
│  - Common layout for ALL questions                          │
│  - Shows: Logo, Question Header, 3D Avatar, Content Area    │
│  - This is the SAME page structure for every question!      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              QuestionRenderer Component                      │
│  - Acts as a "Router" - decides which component to show    │
│  - Checks question.type and renders appropriate component   │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
   ┌─────────┐   ┌──────────┐   ┌─────────┐   ┌──────────┐
   │ Choice  │   │Satisfaction│  │ Rating  │   │  Text    │
   └─────────┘   └──────────┘   └─────────┘   └──────────┘
```

---

## 📝 Question Types (5 Types, Not 3!)

### 1. **`choice`** - Multiple Choice Questions
- **Used for:** Questions with predefined options
- **Components:** 
  - `ModernChoiceList` (if ≤4 choices) - Modern card design
  - `ChoiceQuestion` (if >4 choices) - List design
- **Example:** Question 1 (Direction), Question 4 (Frequency)
- **Data needed:** `choices` array with `id`, `label`, optional `icon`

```typescript
{
  id: 1,
  type: 'choice',
  question: 'A quelle direction êtes-vous rattaché(e) ?',
  choices: [
    { id: 'direction-1', label: 'Direction Générale', icon: Building2 },
    // ... more choices
  ],
  required: true,
}
```

---

### 2. **`satisfaction`** - Interactive Slider Satisfaction
- **Used for:** Satisfaction ratings with interactive slider
- **Component:** `SatisfactionRating` (NEW - with slider!)
- **Example:** Question 2
- **Features:**
  - Interactive slider (0-100%)
  - 5 satisfaction levels with emojis
  - Real-time feedback
  - Dynamic colors

```typescript
{
  id: 2,
  type: 'satisfaction',
  question: 'Comment évaluez-vous votre niveau de satisfaction...',
  required: true,
}
```

---

### 3. **`rating`** - Star Rating
- **Used for:** 1-5 star ratings
- **Component:** `RatingQuestion`
- **Example:** Question 3
- **Features:** Clickable stars (1-5)

```typescript
{
  id: 3,
  type: 'rating',
  question: 'Comment évaluez-vous la qualité...',
  required: true,
}
```

---

### 4. **`text`** - Text Input
- **Used for:** Free text responses
- **Component:** `TextQuestion`
- **Example:** Question 5, Questions 6-23 (placeholders)
- **Data needed:** Optional `placeholder`

```typescript
{
  id: 5,
  type: 'text',
  question: 'Quelles améliorations souhaiteriez-vous...',
  placeholder: 'Vos suggestions...',
  required: false,
}
```

---

### 5. **`multiple`** - Multiple Selection (Defined but not implemented yet)
- **Type exists in the interface but no component yet**
- Would allow selecting multiple options

---

## 🔄 How It Works Step by Step

### Step 1: User Lands on Page
```
app/page.tsx renders:
  - Landing form (name, surname)
  - When submitted → showNextPage = true
```

### Step 2: Question Navigation Hook Initializes
```typescript
useQuestionNavigation() returns:
  - currentQuestionIndex: 0 (first question)
  - currentQuestion: questions[0] (Question 1)
  - goToNextQuestion: function to move forward
```

### Step 3: QuestionPage Renders
```typescript
<QuestionPage>
  - Shows question number and text (AnimatedQuestionHeader)
  - Shows 3D avatar on the right
  - Contains QuestionRenderer as children
</QuestionPage>
```

### Step 4: QuestionRenderer Routes
```typescript
QuestionRenderer checks question.type:
  switch (question.type) {
    case 'choice': → Render ChoiceQuestion or ModernChoiceList
    case 'satisfaction': → Render SatisfactionRating
    case 'rating': → Render RatingQuestion
    case 'text': → Render TextQuestion
  }
```

### Step 5: User Answers
```typescript
User interacts with question component
  → Component calls onAnswer(answer)
  → This triggers goToNextQuestion(answer)
  → Answer saved to answers array
  → currentQuestionIndex increments
  → Next question renders
```

---

## 📁 File Structure

```
components/questions/
├── QuestionPage.tsx          # Common page layout (SAME for all questions)
├── QuestionRenderer.tsx      # Router - decides which component to show
├── AnimatedQuestionHeader.tsx # Question number + text header
│
├── ChoiceQuestion.tsx        # For choice questions (>4 options)
├── ModernChoiceList.tsx       # For choice questions (≤4 options)
├── ModernChoiceCard.tsx       # Individual choice card
│
├── SatisfactionRating.tsx    # NEW! Interactive slider satisfaction
│
├── RatingQuestion.tsx        # Star rating (1-5)
│
└── TextQuestion.tsx          # Text input field

data/
└── questions.ts              # All 23 questions defined here

hooks/
└── useQuestionNavigation.ts  # Manages question flow and answers
```

---

## 🎨 Key Design Pattern: **Single Page, Multiple Components**

**Important:** There is **ONE** `QuestionPage` component that provides the common layout (background, logo, avatar, header). The **content** changes based on the question type.

Think of it like this:
- **QuestionPage** = The frame (same for all)
- **QuestionRenderer** = The picture selector (chooses which picture)
- **Specific Components** = The actual pictures (Choice, Satisfaction, Rating, Text)

---

## 🔢 Question Flow Example

```
Question 1 (index 0)
  Type: 'choice'
  → QuestionRenderer → ModernChoiceList
  → User selects "Direction IT"
  → goToNextQuestion('direction-9')
  → Answer saved: { questionId: 1, answer: 'direction-9' }
  → Index becomes 1

Question 2 (index 1)
  Type: 'satisfaction'
  → QuestionRenderer → SatisfactionRating
  → User slides to 75%
  → goToNextQuestion('satisfaction-2')
  → Answer saved: { questionId: 2, answer: 'satisfaction-2' }
  → Index becomes 2

Question 3 (index 2)
  Type: 'rating'
  → QuestionRenderer → RatingQuestion
  → User clicks 4 stars
  → goToNextQuestion(4)
  → Answer saved: { questionId: 3, answer: 4 }
  → Index becomes 3

... and so on for all 23 questions
```

---

## 💡 Summary

1. **One Page Template**: `QuestionPage` is the same structure for all questions
2. **Five Question Types**: choice, satisfaction, rating, text, multiple
3. **Smart Router**: `QuestionRenderer` automatically shows the right component
4. **Centralized Data**: All 23 questions in `data/questions.ts`
5. **Navigation Hook**: `useQuestionNavigation` manages the flow
6. **Answer Storage**: All answers saved in the `answers` array

The beauty of this system is that you can add new question types by:
1. Adding the type to `Question` interface
2. Adding a case in `QuestionRenderer`
3. Creating the component
4. Adding questions in `questions.ts`

No need to create new page files! 🎉

