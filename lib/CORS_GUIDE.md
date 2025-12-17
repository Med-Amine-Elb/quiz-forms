# 🛡️ CORS Middleware Guide

## ✅ What Was Implemented

### **CORS Protection Middleware** (`middleware.ts`)

- ✅ **Origin validation** - Only allows configured origins
- ✅ **Preflight handling** - Properly handles OPTIONS requests
- ✅ **Environment-based** - Different rules for dev/prod
- ✅ **Configurable** - Set allowed origins via environment variable
- ✅ **Security headers** - Proper CORS headers added to responses

---

## 🔧 Configuration

### **Environment Variable**

Add to `.env.local`:

```bash
# Production: List your allowed domains (comma-separated)
ALLOWED_ORIGINS=https://votreapp.com,https://www.votreapp.com,https://app.votreapp.com
```

### **Development Mode**

In development (`NODE_ENV=development`), automatically allows:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`

**No configuration needed for local development!**

---

## 📋 How It Works

### **Request Flow:**

```
1. Request arrives → Check if it's an API route
   ↓
2. Extract origin from headers
   ↓
3. Check if origin is in allowed list
   ↓
4. If OPTIONS (preflight) → Return CORS headers
   ↓
5. If actual request:
   - Origin allowed → Process request + add CORS headers
   - Origin blocked → Return 403 Forbidden
```

---

## 🚨 What Happens When Blocked

### **Unauthorized Origin Request:**

**Request from:** `https://malicious-site.com`

**Response:**
```json
{
  "error": "Forbidden",
  "message": "Origin not allowed",
  "details": "Cette origine n'est pas autorisée à accéder à cette API"
}
```

**Status:** `403 Forbidden`

---

## 🔒 Security Features

### **1. Origin Whitelist**
- Only configured origins can access API
- Blocks unauthorized domains
- Prevents CSRF attacks

### **2. Preflight Protection**
- Handles OPTIONS requests properly
- Validates origin before allowing preflight
- Returns proper CORS headers

### **3. Method Restrictions**
- Only allows: GET, POST, OPTIONS
- Blocks PUT, DELETE, PATCH (if not needed)

### **4. Header Restrictions**
- Only allows specific headers:
  - `Content-Type`
  - `x-api-key`
  - `Authorization`

---

## 📊 CORS Headers Added

### **Allowed Request:**
```
Access-Control-Allow-Origin: https://votreapp.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, x-api-key, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

### **Blocked Request:**
```
Status: 403 Forbidden
Content-Type: application/json
```

---

## 🎯 Configuration Examples

### **Single Domain:**
```bash
ALLOWED_ORIGINS=https://quiz.castelafrique.com
```

### **Multiple Domains:**
```bash
ALLOWED_ORIGINS=https://quiz.castelafrique.com,https://www.castelafrique.com,https://app.castelafrique.com
```

### **With Subdomains:**
```bash
ALLOWED_ORIGINS=https://quiz.castelafrique.com,https://staging.castelafrique.com,https://dev.castelafrique.com
```

### **Development (Automatic):**
```bash
# No need to set - automatically allows localhost
# NODE_ENV=development
```

---

## 🔍 Testing CORS

### **Test from Browser Console:**

```javascript
// This should work (if origin is allowed)
fetch('https://votreapp.com/api/questions', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));

// This should fail (unauthorized origin)
fetch('https://votreapp.com/api/questions', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error('Blocked:', err));
```

### **Test Preflight:**

```bash
curl -X OPTIONS https://votreapp.com/api/submit \
  -H "Origin: https://votreapp.com" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Expected:** `200 OK` with CORS headers

---

## ⚠️ Important Notes

### **1. Same-Origin Requests**
- Requests from the same domain (no `Origin` header) are **always allowed**
- This is normal browser behavior

### **2. Development vs Production**
- **Development:** Allows localhost automatically
- **Production:** Must configure `ALLOWED_ORIGINS`

### **3. Wildcards**
- **Not supported** - Must list exact origins
- For multiple subdomains, list each one

### **4. HTTPS Required (Production)**
- Production origins should use `https://`
- HTTP origins are less secure

---

## 🚀 Deployment Checklist

### **Before Production:**

- [ ] Set `ALLOWED_ORIGINS` in production environment
- [ ] Test from production domain
- [ ] Verify preflight requests work
- [ ] Check browser console for CORS errors
- [ ] Test from unauthorized origin (should be blocked)

### **Example Production Setup:**

```bash
# .env.production or Vercel/Azure environment variables
ALLOWED_ORIGINS=https://quiz.castelafrique.com,https://www.castelafrique.com
```

---

## 🔧 Customization

### **Add More Methods:**

In `middleware.ts`:
```typescript
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
```

### **Add More Headers:**

In `middleware.ts`:
```typescript
'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization, X-Custom-Header',
```

### **Change Max Age:**

In `middleware.ts`:
```typescript
'Access-Control-Max-Age': '3600', // 1 hour instead of 24 hours
```

---

## 📊 Comparison

| Feature | Before | After |
|---------|--------|-------|
| **Origin Check** | ❌ | ✅ |
| **Preflight Support** | ❌ | ✅ |
| **Configurable** | ❌ | ✅ |
| **Dev/Prod Modes** | ❌ | ✅ |
| **Security** | ⚠️ Open | ✅ Protected |

---

## ✅ What's Protected Now

1. ✅ **Unauthorized origins** - Blocked with 403
2. ✅ **CSRF attacks** - Prevented by origin check
3. ✅ **API abuse** - Only allowed domains can access
4. ✅ **Preflight requests** - Properly handled
5. ✅ **CORS headers** - Correctly set for allowed origins

---

## 🎯 Next Steps (Optional)

1. **Add IP whitelisting** - Additional layer of security
2. **Add logging** - Track blocked origins
3. **Add rate limiting per origin** - Different limits per domain
4. **Add CORS for specific routes** - Different rules per endpoint

---

**Your CORS protection is now active! 🎉**

