/**
 * Script pour identifier les logs sensibles à nettoyer avant production
 * 
 * Usage: node scripts/clean-production-logs.js
 */

const fs = require('fs');
const path = require('path');

const sensitivePatterns = [
  /console\.log.*code/i,
  /console\.log.*email/i,
  /console\.log.*password/i,
  /console\.log.*api.*key/i,
  /console\.log.*secret/i,
  /console\.log.*token/i,
];

const filesToCheck = [
  'lib/emailVerification.ts',
  'app/api/auth/request-code/route.ts',
  'app/api/auth/verify-code/route.ts',
  'app/api/submit/route.ts',
  'app/api/questions/route.ts',
];

console.log('🔍 Recherche de logs sensibles...\n');

let foundIssues = false;

filesToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    sensitivePatterns.forEach(pattern => {
      if (pattern.test(line) && !line.includes('NODE_ENV')) {
        console.log(`⚠️  ${file}:${index + 1}`);
        console.log(`   ${line.trim()}\n`);
        foundIssues = true;
      }
    });
  });
});

if (!foundIssues) {
  console.log('✅ Aucun log sensible trouvé (ou déjà protégé par NODE_ENV)');
} else {
  console.log('\n💡 Recommandation:');
  console.log('   Ajoutez des conditions NODE_ENV pour ces logs:');
  console.log('   if (process.env.NODE_ENV !== \'production\') {');
  console.log('     console.log(...);');
  console.log('   }');
}

