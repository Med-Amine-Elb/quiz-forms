# 📦 Scripts de Backup

Ce dossier contient les scripts utilitaires pour le backup et la récupération.

## 📋 Prérequis

Installer `tsx` pour exécuter les scripts TypeScript :

```bash
npm install --save-dev tsx
```

## 🚀 Scripts Disponibles

### Backup Upstash Redis

Sauvegarde toutes les données de vérification depuis Upstash Redis.

```bash
npm run backup:upstash
```

**Résultat:** Fichier JSON dans `backups/upstash-backup-YYYY-MM-DDTHH-MM-SS.json`

### Backup Fichiers Locaux

Sauvegarde les fichiers de cache locaux (fallback).

```bash
npm run backup:files
```

**Résultat:** Fichier JSON dans `backups/files-backup-YYYY-MM-DDTHH-MM-SS.json`

### Backup Complet

Exécute tous les backups.

```bash
npm run backup:all
```

## 📂 Structure des Backups

Les backups sont sauvegardés dans le dossier `backups/` à la racine du projet :

```
backups/
├── upstash-backup-2024-01-15T10-30-00.json
├── upstash-backup-2024-01-16T10-30-00.json
├── files-backup-2024-01-15T10-30-00.json
└── files-backup-2024-01-16T10-30-00.json
```

## ⚙️ Configuration

Les scripts utilisent les variables d'environnement suivantes :

- `UPSTASH_REDIS_REST_URL` - URL de votre base Upstash Redis
- `UPSTASH_REDIS_REST_TOKEN` - Token d'authentification Upstash

Assurez-vous que ces variables sont configurées dans votre `.env.local`.

## 🔄 Automatisation

### Option 1: Cron Job (Linux/Mac)

Ajouter dans votre crontab :

```bash
# Backup quotidien à 2h du matin
0 2 * * * cd /path/to/quiz-forms && npm run backup:all
```

### Option 2: GitHub Actions

Créer `.github/workflows/backup.yml` :

```yaml
name: Daily Backup

on:
  schedule:
    - cron: '0 2 * * *' # Tous les jours à 2h
  workflow_dispatch: # Permet de déclencher manuellement

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run backup:all
        env:
          UPSTASH_REDIS_REST_URL: ${{ secrets.UPSTASH_REDIS_REST_URL }}
          UPSTASH_REDIS_REST_TOKEN: ${{ secrets.UPSTASH_REDIS_REST_TOKEN }}
      - uses: actions/upload-artifact@v3
        with:
          name: backups
          path: backups/
```

### Option 3: Vercel Cron (si déployé sur Vercel)

Créer `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/cron/backup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Créer `app/api/cron/backup/route.ts` :

```typescript
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  // Vérifier le secret pour sécuriser l'endpoint
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await execAsync('npm run backup:all');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
```

## 📚 Documentation Complète

Pour plus de détails, consultez `lib/BACKUP_RECOVERY_GUIDE.md`.

