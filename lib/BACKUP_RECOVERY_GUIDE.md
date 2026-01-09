# 💾 Guide de Backup et Récupération

Ce guide documente la stratégie de backup et de récupération pour l'application Quiz Forms.

## 📋 Vue d'ensemble

L'application utilise plusieurs systèmes de stockage :
1. **Microsoft Dataverse** (via Power Automate) - Données principales (soumissions, réponses)
2. **Upstash Redis** - Codes de vérification, rate limiting
3. **Fichiers locaux** (fallback) - Codes de vérification en cas d'échec Redis

---

## 🔵 1. Backup Dataverse (Microsoft Power Platform)

### Stratégie de Backup

**Microsoft Dataverse inclut des backups automatiques :**
- ✅ Backups automatiques quotidiens (rétention 7 jours)
- ✅ Backups automatiques hebdomadaires (rétention 4 semaines)
- ✅ Backups automatiques mensuels (rétention 3 mois)
- ✅ Point-in-time restore disponible

### Vérification des Backups

#### Via Power Platform Admin Center

1. **Accéder au Power Platform Admin Center**
   - URL: https://admin.powerplatform.microsoft.com
   - Se connecter avec un compte administrateur

2. **Vérifier les backups**
   - Aller dans **Environments** → Sélectionner votre environnement
   - Section **Backups** → Voir l'historique des backups

3. **Configurer les backups automatiques**
   - Les backups sont activés par défaut
   - Vérifier la rétention selon vos besoins

### Backup Manuel (Recommandé pour données critiques)

#### Option 1: Export via Power Automate

Créer un flow Power Automate pour exporter les données :

```json
{
  "trigger": "Recurrence (tous les jours à 2h du matin)",
  "actions": [
    "List rows" - Récupérer toutes les soumissions
    "List rows" - Récupérer toutes les réponses
    "Create file" - Sauvegarder dans SharePoint/OneDrive
  ]
}
```

#### Option 2: Export via Power Apps

1. Créer une application Power Apps
2. Utiliser la fonction `ExportToExcel()` pour exporter les données
3. Programmer l'export régulier

#### Option 3: API Dataverse

Utiliser l'API Dataverse pour exporter les données :

```typescript
// Exemple de script d'export
const exportDataverseData = async () => {
  const submissions = await fetch(
    'https://your-org.crm.dynamics.com/api/data/v9.2/your_submissions_table',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  // Sauvegarder dans un fichier JSON
  fs.writeFileSync('backup-submissions.json', JSON.stringify(submissions));
};
```

### Restauration depuis Backup

#### Via Power Platform Admin Center

1. **Accéder au Power Platform Admin Center**
2. **Environments** → Sélectionner votre environnement
3. **Backups** → Sélectionner le backup à restaurer
4. **Restore** → Choisir la date/heure
5. **Confirmer** la restauration

⚠️ **Attention:** La restauration remplace l'environnement actuel. Effectuer un backup avant restauration.

#### Restauration Partielle (Données spécifiques)

Si vous avez exporté manuellement :

1. Importer les données via Power Automate
2. Utiliser l'action "Add a new row" pour chaque enregistrement
3. Vérifier l'intégrité des données

---

## 🔴 2. Backup Upstash Redis

### Stratégie de Backup

**Upstash Redis offre des backups automatiques :**
- ✅ Backups automatiques quotidiens (plan payant)
- ✅ Snapshots disponibles
- ⚠️ Plan gratuit : Pas de backups automatiques

### Backup Manuel Upstash Redis

#### Option 1: Export via Dashboard Upstash

1. **Accéder au Dashboard Upstash**
   - URL: https://console.upstash.com
   - Se connecter avec votre compte

2. **Créer un snapshot**
   - Sélectionner votre base de données Redis
   - Cliquer sur **"Backup"** ou **"Create Snapshot"**
   - Le snapshot sera sauvegardé

3. **Télécharger le snapshot**
   - Les snapshots peuvent être téléchargés
   - Format: RDB (Redis Database)

#### Option 2: Export via API

Créer un script pour exporter les données :

```typescript
// scripts/backup-upstash.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function backupUpstash() {
  // Récupérer toutes les clés de vérification
  const keys = await redis.keys('quiz-forms:verification:*');
  
  const data: Record<string, any> = {};
  
  for (const key of keys) {
    const value = await redis.get(key);
    data[key] = value;
  }
  
  // Sauvegarder dans un fichier JSON
  const fs = require('fs');
  fs.writeFileSync(
    `backup-upstash-${Date.now()}.json`,
    JSON.stringify(data, null, 2)
  );
  
  console.log(`Backup créé: ${keys.length} entrées sauvegardées`);
}

backupUpstash();
```

**Utilisation:**
```bash
npm run backup:upstash
```

### Restauration Upstash Redis

#### Via Dashboard

1. **Accéder au Dashboard Upstash**
2. **Sélectionner votre base de données**
3. **Backups** → Sélectionner le snapshot
4. **Restore** → Confirmer la restauration

#### Restauration Partielle (via Script)

```typescript
// scripts/restore-upstash.ts
import { Redis } from '@upstash/redis';
import fs from 'fs';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function restoreUpstash(backupFile: string) {
  const backup = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));
  
  for (const [key, value] of Object.entries(backup)) {
    // Calculer le TTL restant (approximatif)
    const ttl = 300; // 5 minutes par défaut
    await redis.set(key, value, { ex: ttl });
  }
  
  console.log(`Restauration terminée: ${Object.keys(backup).length} entrées restaurées`);
}

restoreUpstash(process.argv[2]);
```

---

## 📁 3. Backup Fichiers Locaux (Fallback)

### Fichiers à Sauvegarder

Si vous utilisez le fallback fichier (quand Upstash n'est pas configuré) :

- `.next/verification-codes.json` - Codes de vérification

### Script de Backup

```typescript
// scripts/backup-files.ts
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), '.next', 'verification-codes.json');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Créer le dossier backups s'il n'existe pas
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Copier le fichier avec timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(BACKUP_DIR, `verification-codes-${timestamp}.json`);

if (fs.existsSync(CACHE_FILE)) {
  fs.copyFileSync(CACHE_FILE, backupFile);
  console.log(`Backup créé: ${backupFile}`);
} else {
  console.log('Aucun fichier à sauvegarder');
}
```

---

## 🚨 4. Plan de Récupération en Cas d'Incident

### Scénario 1: Perte de Données Dataverse

**Symptômes:**
- Les soumissions ne sont plus visibles
- Erreurs lors de l'accès aux données

**Actions:**
1. ✅ Vérifier l'état de l'environnement Power Platform
2. ✅ Contacter l'administrateur Power Platform
3. ✅ Restaurer depuis le dernier backup automatique
4. ✅ Vérifier l'intégrité des données restaurées
5. ✅ Tester les fonctionnalités

**Temps de récupération estimé:** 1-4 heures

### Scénario 2: Perte de Données Upstash Redis

**Symptômes:**
- Les codes de vérification ne fonctionnent plus
- Rate limiting ne fonctionne plus

**Actions:**
1. ✅ Vérifier l'état du service Upstash
2. ✅ Vérifier si le fallback fichier fonctionne
3. ✅ Restaurer depuis snapshot si disponible
4. ✅ Si pas de snapshot, les codes expireront naturellement (5 min)
5. ✅ Les utilisateurs peuvent redemander des codes

**Temps de récupération estimé:** 5-30 minutes

### Scénario 3: Perte Complète de l'Application

**Symptômes:**
- Application inaccessible
- Toutes les données perdues

**Actions:**
1. ✅ Restaurer l'application depuis Git
2. ✅ Restaurer les variables d'environnement
3. ✅ Restaurer Dataverse depuis backup
4. ✅ Restaurer Upstash Redis depuis snapshot
5. ✅ Vérifier que tout fonctionne

**Temps de récupération estimé:** 2-8 heures

### Scénario 4: Corruption de Données

**Symptômes:**
- Données incohérentes
- Erreurs lors de l'affichage

**Actions:**
1. ✅ Identifier les données corrompues
2. ✅ Restaurer depuis backup le plus récent avant corruption
3. ✅ Vérifier l'intégrité
4. ✅ Analyser la cause de la corruption

**Temps de récupération estimé:** 1-6 heures

---

## 📅 5. Plan de Backup Régulier

### Backups Automatiques

#### Dataverse
- ✅ **Automatique** - Géré par Microsoft (quotidien, hebdomadaire, mensuel)
- ✅ **Vérification** - Vérifier mensuellement que les backups fonctionnent

#### Upstash Redis
- ⚠️ **Plan gratuit** - Backups manuels recommandés (hebdomadaire)
- ✅ **Plan payant** - Backups automatiques quotidiens

### Backups Manuels Recommandés

#### Hebdomadaire
- [ ] Export Dataverse (si données critiques)
- [ ] Snapshot Upstash Redis (plan gratuit)
- [ ] Vérification des backups automatiques

#### Mensuel
- [ ] Test de restauration depuis backup
- [ ] Vérification de l'intégrité des données
- [ ] Documentation des procédures

#### Avant Déploiements Majeurs
- [ ] Backup complet Dataverse
- [ ] Snapshot Upstash Redis
- [ ] Backup fichiers locaux
- [ ] Documentation de l'état avant déploiement

---

## 🛠️ 6. Scripts Utiles

### Script de Backup Complet

Créer `scripts/backup-all.ts` :

```typescript
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'backups', new Date().toISOString().split('T')[0]);

// Créer le dossier de backup
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log('🔄 Démarrage du backup complet...');

// 1. Backup Upstash Redis
console.log('📦 Backup Upstash Redis...');
execSync('npm run backup:upstash', { stdio: 'inherit' });

// 2. Backup fichiers locaux
console.log('📁 Backup fichiers locaux...');
execSync('npm run backup:files', { stdio: 'inherit' });

// 3. Export variables d'environnement (sans secrets)
console.log('🔐 Export configuration...');
const envBackup: Record<string, string> = {};
const envVars = [
  'NODE_ENV',
  'NEXT_PUBLIC_BASE_URL',
  'ALLOWED_ORIGINS',
  // Ne pas inclure les secrets (API keys, tokens, etc.)
];

envVars.forEach(key => {
  if (process.env[key]) {
    envBackup[key] = process.env[key];
  }
});

fs.writeFileSync(
  path.join(BACKUP_DIR, 'env-config.json'),
  JSON.stringify(envBackup, null, 2)
);

console.log('✅ Backup complet terminé!');
console.log(`📂 Dossier: ${BACKUP_DIR}`);
```

### Ajouter aux scripts package.json

```json
{
  "scripts": {
    "backup:upstash": "tsx scripts/backup-upstash.ts",
    "backup:files": "tsx scripts/backup-files.ts",
    "backup:all": "tsx scripts/backup-all.ts",
    "restore:upstash": "tsx scripts/restore-upstash.ts <backup-file>"
  }
}
```

---

## ✅ 7. Checklist de Backup

### Avant Production
- [ ] Vérifier que les backups Dataverse sont activés
- [ ] Configurer les backups Upstash Redis (plan payant ou manuels)
- [ ] Créer un script de backup automatique
- [ ] Tester la restauration depuis backup
- [ ] Documenter les procédures

### Maintenance Régulière
- [ ] Vérifier les backups automatiques (mensuel)
- [ ] Tester la restauration (trimestriel)
- [ ] Mettre à jour la documentation si nécessaire
- [ ] Vérifier l'espace de stockage des backups

### En Cas d'Incident
- [ ] Identifier le type d'incident
- [ ] Suivre le plan de récupération approprié
- [ ] Documenter l'incident et la résolution
- [ ] Améliorer les procédures si nécessaire

---

## 📚 8. Ressources

### Documentation Microsoft
- [Power Platform Backup and Restore](https://learn.microsoft.com/en-us/power-platform/admin/backup-restore-environments)
- [Dataverse Data Export](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/export-data)

### Documentation Upstash
- [Upstash Redis Backups](https://docs.upstash.com/redis/features/backup)
- [Upstash Redis API](https://docs.upstash.com/redis/features/restapi)

### Outils Utiles
- Power Platform Admin Center
- Upstash Console
- Azure Storage (pour stocker les backups)

---

## 🎯 Résumé

**Backups Automatiques:**
- ✅ Dataverse: Géré par Microsoft (quotidien, hebdomadaire, mensuel)
- ⚠️ Upstash Redis: Automatique sur plan payant, manuel sur plan gratuit

**Backups Manuels Recommandés:**
- 📅 Hebdomadaire: Snapshot Upstash Redis (plan gratuit)
- 📅 Mensuel: Test de restauration
- 📅 Avant déploiements: Backup complet

**Temps de Récupération:**
- Dataverse: 1-4 heures
- Upstash Redis: 5-30 minutes
- Application complète: 2-8 heures

**Priorité:** 🔴 **HAUTE** - Mettre en place avant production

