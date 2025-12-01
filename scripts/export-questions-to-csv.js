/**
 * Script pour exporter les questions vers CSV pour import dans Dataverse
 * 
 * Usage: node scripts/export-questions-to-csv.js
 */

const fs = require('fs');
const path = require('path');

// Import des questions (simulation - on va les copier manuellement)
const questions = [
  {
    id: 1,
    type: 'choice',
    question: 'A quelle direction êtes-vous rattaché(e) ?',
    ordre: 1,
    required: true,
    choices: [
      { id: 'direction-1', label: 'Direction Générale' },
      { id: 'direction-2', label: 'Direction des Ressources Humaines' },
      { id: 'direction-3', label: 'Direction Financière et SI' },
      { id: 'direction-4', label: 'Direction Commerciale et Marketing' },
      { id: 'direction-5', label: 'Direction Industrielle' },
      { id: 'direction-6', label: 'Direction Juridique et RSE' },
      { id: 'direction-7', label: 'Direction Audit interne' },
      { id: 'direction-8', label: 'Direction Sureté' },
      { id: 'direction-9', label: 'Direction Logistique' },
      { id: 'direction-10', label: 'Direction Qualité' },
      { id: 'direction-11', label: 'Direction des Achats' },
      { id: 'direction-12', label: 'Direction CDC' },
    ]
  },
  {
    id: 2,
    type: 'choice',
    question: 'Depuis combien de temps avez-vous intégré GBM ?',
    ordre: 2,
    required: true,
    choices: [
      { id: 'time-1', label: 'Moins d\'un an', emoji: '🌟' },
      { id: 'time-2', label: 'Entre 1 an et 5 ans', emoji: '💼' },
      { id: 'time-3', label: 'Entre 5 ans et 10 ans', emoji: '🎯' },
      { id: 'time-4', label: 'Plus de 10 ans', emoji: '👑' },
    ]
  },
  // ... Ajoutez toutes les autres questions ici
];

// Fonction pour échapper les guillemets dans le CSV
function escapeCsv(text) {
  if (!text) return '';
  return `"${String(text).replace(/"/g, '""')}"`;
}

// Générer CSV pour la table Question
function generateQuestionsCSV() {
  let csv = 'ordre,titre,type,required\n';
  
  questions.forEach(q => {
    csv += `${q.ordre},${escapeCsv(q.question)},${q.type},${q.required ? 'Oui' : 'Non'}\n`;
  });
  
  return csv;
}

// Générer CSV pour la table QuestionChoice
function generateChoicesCSV() {
  let csv = 'question_ordre,choicekey,label,emoji,ordre\n';
  
  questions.forEach(q => {
    if (q.choices && q.choices.length > 0) {
      q.choices.forEach((choice, index) => {
        csv += `${q.ordre},${escapeCsv(choice.id)},${escapeCsv(choice.label)},${escapeCsv(choice.emoji || '')},${index + 1}\n`;
      });
    }
  });
  
  return csv;
}

// Créer le dossier exports s'il n'existe pas
const exportsDir = path.join(__dirname, '..', 'exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir);
}

// Écrire les fichiers CSV
fs.writeFileSync(path.join(exportsDir, 'questions.csv'), generateQuestionsCSV());
fs.writeFileSync(path.join(exportsDir, 'choices.csv'), generateChoicesCSV());

console.log('✅ Fichiers CSV générés avec succès!');
console.log('📁 Emplacement: exports/questions.csv et exports/choices.csv');
console.log('\nProchaines étapes:');
console.log('1. Ouvrez ces fichiers dans Excel');
console.log('2. Importez-les dans Dataverse via Power Apps');
console.log('3. Créez les relations entre les tables');

