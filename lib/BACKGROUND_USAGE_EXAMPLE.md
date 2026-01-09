# 🎨 Exemple d'Utilisation - Enhanced Question Background

Ce document montre comment intégrer le nouveau composant de background amélioré.

## 📝 Intégration dans `app/page.tsx`

### Option 1: Remplacer le background actuel

```tsx
// Dans app/page.tsx, remplacer la section du background (lignes 987-1014)

import EnhancedQuestionBackground from '@/components/ui/EnhancedQuestionBackground'

// Dans le composant SurveyLanding, remplacer:
{/* Animated Background Layer */}
<motion.div
  className="absolute inset-0 -z-10"
  style={{
    backgroundImage: currentBackground,
    backgroundSize: '400% 400%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0% 50%',
  }}
  animate={showNextPage ? {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
  } : {}}
  transition={{
    duration: 20,
    repeat: Infinity,
    ease: "linear",
  }}
/>
{/* Subtle Dot Pattern Overlay for Depth (only on question pages) */}
{showNextPage && (
  <div 
    className="absolute inset-0 opacity-[0.03] pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
      backgroundSize: '32px 32px',
    }}
  />
)}

// Par:
<EnhancedQuestionBackground
  questionNumber={currentQuestion?.id || 1}
  showNextPage={showNextPage}
  prefersReducedMotion={prefersReducedMotion}
/>
```

### Option 2: Utiliser les deux (transition progressive)

```tsx
// Garder l'ancien pour la landing page, utiliser le nouveau pour les questions
{!showNextPage ? (
  // Ancien background pour landing
  <motion.div
    className="absolute inset-0 -z-10"
    style={{
      backgroundImage: sectionBackgrounds.landing,
      backgroundSize: 'cover',
    }}
  />
) : (
  // Nouveau background amélioré pour questions
  <EnhancedQuestionBackground
    questionNumber={currentQuestion?.id || 1}
    showNextPage={showNextPage}
    prefersReducedMotion={prefersReducedMotion}
  />
)}
```

## 🎨 Personnalisation

### Ajuster l'intensité des effets

Dans `EnhancedQuestionBackground.tsx`, vous pouvez modifier:

```tsx
// Nombre de particules (ligne ~60)
const particles = useMemo(() => {
  return Array.from({ length: 10 }, (_, i) => ({ // Changer 10 à 5-15
    // ...
  }))
}, [currentParticleColors])

// Opacité des formes glassmorphism (ligne ~100)
opacity: 30, // Changer à 20-40 pour plus/moins visible

// Opacité des particules (ligne ~130)
opacity: [0.2, 0.4, 0.2], // Changer à [0.1, 0.3, 0.1] pour plus subtil
```

### Ajuster les couleurs

Modifier les palettes dans le composant:

```tsx
// Pour des couleurs plus vives
const sectionBackgrounds = {
  informations: 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 25%, #2563eb 50%, #1d4ed8 75%, #1e40af 100%)',
  // ...
}

// Pour des couleurs plus douces
const sectionBackgrounds = {
  informations: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 25%, #bfdbfe 50%, #dbeafe 75%, #eff6ff 100%)',
  // ...
}
```

## ⚡ Performance

### Désactiver certains effets si nécessaire

```tsx
// Version légère (sans particules)
<EnhancedQuestionBackground
  questionNumber={currentQuestion?.id || 1}
  showNextPage={showNextPage}
  prefersReducedMotion={prefersReducedMotion}
  // Ajouter une prop pour désactiver les particules si besoin
/>
```

### Optimisations automatiques

Le composant inclut déjà:
- ✅ `prefersReducedMotion` support
- ✅ Utilisation de `useMemo` pour éviter les recalculs
- ✅ Limitation du nombre d'éléments animés
- ✅ Utilisation de `transform` et `opacity` uniquement

## 🎯 Résultat Attendu

Avec ce nouveau background, vous obtiendrez:

1. **Gradient animé amélioré** - Plus riche et fluide
2. **Formes glassmorphism** - 2-3 formes floues animées
3. **Particules flottantes** - 10 particules subtiles
4. **Pattern de points amélioré** - Avec masque radial pour effet de profondeur

## 📱 Test

Après intégration, tester:
- [ ] Performance (Lighthouse score)
- [ ] Lisibilité du contenu
- [ ] Transitions entre sections
- [ ] Accessibilité (prefers-reduced-motion)
- [ ] Mobile responsiveness

