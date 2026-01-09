# 🚀 Configuration Upstash Redis pour Rate Limiting

Ce guide explique comment configurer Upstash Redis pour le rate limiting distribué.

## 📋 Prérequis

1. Un compte Upstash (gratuit jusqu'à 10K requêtes/jour)
2. Les packages installés: `@upstash/ratelimit` et `@upstash/redis`

## 🔧 Étapes de Configuration

### 1. Créer un compte Upstash

1. Allez sur [https://upstash.com](https://upstash.com)
2. Créez un compte (gratuit)
3. Connectez-vous au dashboard

### 2. Créer une base de données Redis

1. Dans le dashboard, cliquez sur **"Create Database"**
2. Choisissez:
   - **Type:** Redis
   - **Region:** Choisissez la région la plus proche de votre serveur
   - **Name:** `quiz-forms-ratelimit` (ou un nom de votre choix)
3. Cliquez sur **"Create"**

### 3. Récupérer les credentials

1. Une fois la base créée, cliquez dessus
2. Dans l'onglet **"REST API"**, vous trouverez:
   - **UPSTASH_REDIS_REST_URL:** `https://xxxxx.upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN:** `xxxxx...`

### 4. Configurer les variables d'environnement

#### Pour le développement local (`.env.local`):

```bash
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx...
```

#### Pour la production (Vercel/Azure/etc.):

1. **Vercel:**
   - Allez dans votre projet → Settings → Environment Variables
   - Ajoutez `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`
   - Sélectionnez les environnements (Production, Preview, Development)

2. **Azure:**
   - Allez dans Configuration → Application settings
   - Ajoutez les deux variables

3. **Autres plateformes:**
   - Consultez la documentation de votre plateforme pour ajouter des variables d'environnement

## ✅ Vérification

Une fois configuré, le système utilisera automatiquement Upstash Redis. Vous pouvez vérifier dans les logs (dev mode):

```
[ratelimit] Using Upstash Redis for distributed rate limiting
```

Si les variables ne sont pas configurées, vous verrez:

```
[ratelimit] Upstash not configured, using in-memory rate limiting (dev mode)
```

## 🔄 Fallback Automatique

Le système a un **fallback automatique**:
- Si Upstash est configuré → Utilise Upstash Redis (distribué, production-ready)
- Si Upstash n'est pas configuré → Utilise in-memory (OK pour dev ou single-instance)

## 💰 Coûts

**Plan Gratuit Upstash:**
- 10,000 requêtes/jour
- Parfait pour commencer

**Plan Payant:**
- À partir de $0.20/100K requêtes
- Nécessaire si vous avez beaucoup de trafic

## 🛠️ Dépannage

### Problème: "Failed to initialize Upstash Redis"

**Solutions:**
1. Vérifiez que les variables d'environnement sont correctement configurées
2. Vérifiez que l'URL et le token sont valides dans le dashboard Upstash
3. Vérifiez votre connexion internet
4. Le système utilisera automatiquement le fallback in-memory

### Problème: Rate limiting ne fonctionne pas

**Solutions:**
1. Vérifiez les logs pour voir si Upstash est utilisé
2. Testez avec plusieurs requêtes rapides
3. Vérifiez que les headers `X-RateLimit-Remaining` sont présents dans les réponses

## 📊 Monitoring

Vous pouvez monitorer l'utilisation dans le dashboard Upstash:
- Nombre de requêtes
- Latence
- Erreurs éventuelles

## 🔐 Sécurité

- **Ne commitez JAMAIS** les credentials Upstash dans Git
- Utilisez toujours des variables d'environnement
- Le token Upstash est sensible, gardez-le secret

## 📚 Ressources

- [Documentation Upstash](https://docs.upstash.com/)
- [Documentation @upstash/ratelimit](https://github.com/upstash/ratelimit)
- [Documentation @upstash/redis](https://github.com/upstash/redis-js)

