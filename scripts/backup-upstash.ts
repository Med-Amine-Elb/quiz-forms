/**
 * Script de Backup Upstash Redis
 * 
 * Exporte toutes les données de vérification depuis Upstash Redis
 * vers un fichier JSON local.
 * 
 * Usage: npm run backup:upstash
 */

import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY_PREFIX = 'quiz-forms:verification:';

async function backupUpstash() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.error('❌ Variables d\'environnement Upstash non configurées');
    console.error('   UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN sont requis');
    process.exit(1);
  }

  const redis = new Redis({
    url: UPSTASH_URL,
    token: UPSTASH_TOKEN,
  });

  try {
    console.log('🔄 Connexion à Upstash Redis...');
    
    // Récupérer toutes les clés de vérification
    const keys = await redis.keys(`${REDIS_KEY_PREFIX}*`);
    
    if (keys.length === 0) {
      console.log('ℹ️  Aucune donnée à sauvegarder');
      return;
    }

    console.log(`📦 Récupération de ${keys.length} entrées...`);
    
    const data: Record<string, any> = {};
    let successCount = 0;
    let errorCount = 0;

    for (const key of keys) {
      try {
        const value = await redis.get(key);
        if (value) {
          data[key] = value;
          successCount++;
        }
      } catch (error) {
        console.warn(`⚠️  Erreur lors de la récupération de ${key}:`, error);
        errorCount++;
      }
    }

    // Créer le dossier backups s'il n'existe pas
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Sauvegarder dans un fichier JSON avec timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `upstash-backup-${timestamp}.json`);
    
    const backupData = {
      timestamp: new Date().toISOString(),
      totalEntries: keys.length,
      successfulEntries: successCount,
      failedEntries: errorCount,
      data: data,
    };

    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf-8');

    console.log('✅ Backup créé avec succès!');
    console.log(`📂 Fichier: ${backupFile}`);
    console.log(`📊 Statistiques:`);
    console.log(`   - Total: ${keys.length} entrées`);
    console.log(`   - Réussies: ${successCount}`);
    if (errorCount > 0) {
      console.log(`   - Échouées: ${errorCount}`);
    }
  } catch (error) {
    console.error('❌ Erreur lors du backup:', error);
    process.exit(1);
  }
}

backupUpstash();

