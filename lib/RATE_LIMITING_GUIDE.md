# 🛡️ Rate Limiting Implementation Guide

## ✅ What Was Implemented

### **In-Memory Rate Limiting** (Current Solution)

**File:** `lib/ratelimit.ts`

- ✅ **No external dependencies** - Works out of the box
- ✅ **IP-based limiting** - Tracks requests per IP address
- ✅ **Configurable per endpoint** - Different limits for different routes
- ✅ **Automatic cleanup** - Old entries removed every 5 minutes
- ✅ **Standard HTTP headers** - Returns rate limit info in response headers

---

## 📊 Current Rate Limits

### **Submit Endpoint** (`/api/submit`)
- **Limit:** 3 requests per minute
- **Why:** Prevents spam submissions, protects Power Automate costs
- **Window:** 60 seconds

### **Questions Endpoint** (`/api/questions`)
- **Limit:** 10 requests per minute
- **Why:** Users might refresh, but prevents abuse
- **Window:** 60 seconds

### **Default** (Other endpoints)
- **Limit:** 20 requests per minute
- **Window:** 60 seconds

---

## 🎯 How It Works

### **Request Flow:**
```
1. User makes request → Extract IP address
2. Check rate limit store → Is IP already tracked?
3. If new IP → Create entry (count: 1)
4. If existing IP → Increment count
5. If count > limit → Return 429 (Too Many Requests)
6. If count ≤ limit → Process request + return remaining count
```

### **Response Headers:**
```
X-RateLimit-Remaining: 2    // How many requests left
X-RateLimit-Reset: 1234567890  // When limit resets (timestamp)
Retry-After: 45              // Seconds to wait (only on 429)
```

---

## 💡 My Recommendations

### **Option 1: Current (In-Memory) - ✅ RECOMMENDED for Start**

**Pros:**
- ✅ No setup required
- ✅ No external services
- ✅ Works immediately
- ✅ Good for single-instance deployments

**Cons:**
- ⚠️ Resets on server restart
- ⚠️ Not shared across multiple instances (if you scale horizontally)

**Best for:**
- Development/Staging
- Single-instance production
- Small to medium traffic

---

### **Option 2: Redis/Upstash (Production-Ready)**

**When to use:**
- Multiple server instances
- High traffic
- Need persistent rate limiting across restarts

**Setup:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Implementation:**
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
});
```

**Cost:** Free tier available (10,000 requests/day)

---

### **Option 3: Vercel Edge Rate Limiting** (If using Vercel)

**When to use:**
- Deployed on Vercel
- Want edge-level rate limiting

**Implementation:**
```typescript
import { Ratelimit } from "@vercel/edge-rate-limit";

const ratelimit = new Ratelimit({
  limit: 3,
  window: "1m",
});
```

---

## 🔧 Adjusting Rate Limits

### **Current Limits (in `lib/ratelimit.ts`):**

```typescript
submit: {
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 3,        // 3 submissions per minute
}
```

### **Recommended Adjustments:**

#### **For Stricter Protection:**
```typescript
submit: {
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 1,        // Only 1 submission per minute (very strict)
}
```

#### **For More Lenient (Internal Use):**
```typescript
submit: {
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 5,        // 5 submissions per minute
}
```

#### **For Different Time Windows:**
```typescript
submit: {
  windowMs: 5 * 60 * 1000,  // 5 minutes
  maxRequests: 3,            // 3 submissions per 5 minutes
}
```

---

## 📈 Rate Limit Strategies

### **1. Fixed Window** (Current Implementation)
- Simple counting per time window
- Resets at window end
- **Pros:** Simple, predictable
- **Cons:** Burst at window reset

### **2. Sliding Window** (Better for Production)
- Tracks requests in rolling window
- More accurate, prevents bursts
- **Implementation:** Use Redis/Upstash for this

### **3. Token Bucket**
- Allows bursts up to bucket size
- Refills at constant rate
- **Best for:** APIs with variable traffic

---

## 🎯 Recommended Limits by Use Case

### **Internal Company Survey:**
```typescript
submit: {
  windowMs: 60 * 1000,
  maxRequests: 5,  // More lenient for employees
}
```

### **Public Survey:**
```typescript
submit: {
  windowMs: 60 * 1000,
  maxRequests: 2,  // Stricter to prevent abuse
}
```

### **High-Value Survey (with rewards):**
```typescript
submit: {
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 1,             // One submission per hour
}
```

---

## 🚨 What Happens When Limit Exceeded?

### **Response:**
```json
{
  "error": "Trop de tentatives. Veuillez patienter avant de réessayer.",
  "message": "Too many requests. Please try again later."
}
```

### **Status Code:** `429 Too Many Requests`

### **Headers:**
```
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1234567890
Retry-After: 45  // Seconds to wait
```

---

## 🔍 Monitoring Rate Limits

### **Check Rate Limit Status:**
The response headers include:
- `X-RateLimit-Remaining` - How many requests left
- `X-RateLimit-Reset` - When the limit resets

### **Logging (Optional):**
Add to `lib/ratelimit.ts`:
```typescript
if (!success) {
  console.warn(`Rate limit exceeded for IP: ${identifier}`);
}
```

---

## 🎯 My Recommendation

### **For Your Quiz Form:**

**Current Implementation (In-Memory) is PERFECT if:**
- ✅ Single server instance
- ✅ Moderate traffic (< 1000 users/day)
- ✅ Internal/company use
- ✅ Want simple, no-dependency solution

**Upgrade to Redis/Upstash if:**
- ⚠️ Multiple server instances
- ⚠️ High traffic (> 10,000 users/day)
- ⚠️ Need persistent rate limiting
- ⚠️ Production with scaling

---

## 📝 Current Limits Summary

| Endpoint | Limit | Window | Reason |
|----------|-------|--------|--------|
| `/api/submit` | 3 req | 1 min | Prevent spam submissions |
| `/api/questions` | 10 req | 1 min | Allow refreshes, prevent abuse |
| Default | 20 req | 1 min | General protection |

---

## ✅ What's Protected Now

1. ✅ **Submit endpoint** - Max 3 submissions per minute per IP
2. ✅ **Questions endpoint** - Max 10 requests per minute per IP
3. ✅ **Automatic cleanup** - Old entries removed
4. ✅ **Standard headers** - Rate limit info in responses
5. ✅ **User-friendly errors** - Clear messages in French/English

---

## 🚀 Next Steps (Optional)

1. **Monitor usage** - Check if limits are too strict/lenient
2. **Adjust limits** - Based on actual traffic patterns
3. **Add logging** - Track rate limit hits
4. **Upgrade to Redis** - If scaling horizontally

---

**Your rate limiting is now active! 🎉**

