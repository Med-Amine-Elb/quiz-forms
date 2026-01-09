/**
 * Script de Backup Fichiers Locaux
 * 
 * Sauvegarde les fichiers de cache locaux (fallback)
 * 
 * Usage: npm run backup:files
 */

import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), '.next', 'verification-codes.json');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

async function backupFiles() {
  // Créer le dossier backups s'il n'existe pas
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Vérifier si le fichier existe
  if (!fs.existsSync(CACHE_FILE)) {
    console.log('ℹ️  Aucun fichier de cache à sauvegarder');
    return;
  }

  try {
    // Lire le fichier
    const data = fs.readFileSync(CACHE_FILE, 'utf-8');
    const entries = JSON.parse(data);
    const entryCount = Object.keys(entries).length;

    if (entryCount === 0) {
      console.log('ℹ️  Le fichier de cache est vide');
      return;
    }

    // Copier le fichier avec timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `files-backup-${timestamp}.json`);

    const backupData = {
      timestamp: new Date().toISOString(),
      totalEntries: entryCount,
      data: entries,
    };

    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf-8');

    console.log('✅ Backup des fichiers créé avec succès!');
    console.log(`📂 Fichier: ${backupFile}`);
    console.log(`📊 Entrées sauvegardées: ${entryCount}`);
  } catch (error) {
    console.error('❌ Erreur lors du backup des fichiers:', error);
    process.exit(1);
  }
}

backupFiles();

