# ✅ Validation Guide - Strict Data Validation

## 🎯 What Was Implemented

### **Zod-Based Validation** (Production-Ready)

**File:** `lib/validation.ts`

- ✅ **Type-safe validation** - TypeScript types inferred from schemas
- ✅ **French character support** - Handles À-ÿ, accents, special characters
- ✅ **Comprehensive rules** - Length, format, required fields
- ✅ **Automatic sanitization** - Trims whitespace, normalizes data
- ✅ **User-friendly errors** - Clear messages in French/English
- ✅ **Security protection** - Prevents injection, malformed data

---

## 📋 Validation Rules

### **Name Fields (`nom`, `prenom`)**

```typescript
✅ Minimum: 2 characters
✅ Maximum: 50 characters
✅ Allowed: Letters (a-z, A-Z, À-ÿ), spaces, hyphens (-), apostrophes (')
❌ Blocked: Numbers, special symbols, HTML tags, null bytes
✅ Auto-trim: Removes leading/trailing whitespace
```

**Examples:**
- ✅ `"Jean-Pierre"` - Valid
- ✅ `"Marie-Claire"` - Valid
- ✅ `"François"` - Valid (accented)
- ✅ `"O'Brien"` - Valid (apostrophe)
- ❌ `"J"` - Too short (min 2 chars)
- ❌ `"Jean123"` - Contains numbers
- ❌ `"Jean<script>"` - Contains HTML

---

### **Answers Array**

```typescript
✅ Minimum: 1 answer required
✅ Maximum: 100 answers
✅ Each answer must have:
   - questionId: String or number (converted to string)
   - questionText: 1-500 characters
   - answer: 1-1000 characters (string or number)
```

**Examples:**
- ✅ `[{ questionId: 1, questionText: "Age?", answer: "25" }]` - Valid
- ✅ `[{ questionId: "1", questionText: "Name?", answer: 42 }]` - Valid (auto-converted)
- ❌ `[]` - Empty array (min 1 required)
- ❌ `[{ questionId: 1 }]` - Missing answer field
- ❌ `Array(101).fill({...})` - Too many answers (max 100)

---

## 🔒 Security Features

### **1. Input Sanitization**
- Removes HTML brackets (`<`, `>`)
- Removes null bytes (`\0`)
- Trims whitespace
- Normalizes data types

### **2. Type Safety**
- Validates data types before processing
- Prevents type coercion attacks
- Ensures consistent data format

### **3. Length Limits**
- Prevents buffer overflow attacks
- Limits data size for database
- Protects against DoS

### **4. Format Validation**
- Regex patterns for names
- Prevents SQL injection patterns
- Blocks malicious strings

---

## 📊 Validation Flow

```
1. Request received
   ↓
2. Parse JSON body
   ↓
3. Validate with Zod schema
   ↓
4. If invalid → Return 400 with error details
   ↓
5. If valid → Transform & sanitize data
   ↓
6. Process request
```

---

## 🚨 Error Responses

### **Invalid JSON:**
```json
{
  "error": "Invalid JSON format",
  "message": "Le format de la requête est invalide"
}
```
**Status:** `400 Bad Request`

---

### **Validation Failed:**
```json
{
  "error": "Validation failed",
  "message": "Les données soumises sont invalides",
  "details": [
    "Nom: Le nom doit contenir au moins 2 caractères",
    "Prénom: Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes",
    "Réponse #1 (answer): Answer is required"
  ]
}
```
**Status:** `400 Bad Request`

---

## 🎯 What's Protected

### **Before (Basic Validation):**
```typescript
if (!nom || !prenom) {
  return error;
}
```
❌ No length checks
❌ No format validation
❌ No type safety
❌ No sanitization
❌ Vulnerable to injection

### **After (Zod Validation):**
```typescript
const validation = validateSubmitRequest(body);
if (!validation.success) {
  return error with details;
}
```
✅ Length validation (2-50 chars)
✅ Format validation (regex)
✅ Type safety (TypeScript)
✅ Auto-sanitization (trim, normalize)
✅ Injection protection

---

## 🔧 Customizing Validation

### **Adjust Name Length:**
```typescript
// In lib/validation.ts
nom: z
  .string()
  .min(1, '...')  // Change from 2 to 1
  .max(100, '...') // Change from 50 to 100
```

### **Change Name Pattern:**
```typescript
// Allow numbers in names
const nameRegex = /^[a-zA-ZÀ-ÿ0-9\s'-]+$/;
```

### **Adjust Answer Limits:**
```typescript
answers: z
  .array(answerSchema)
  .min(5, '...')   // Require at least 5 answers
  .max(200, '...') // Allow up to 200 answers
```

### **Change Answer Length:**
```typescript
answer: z
  .string()
  .min(1)
  .max(2000, 'Answer too long') // Increase from 1000 to 2000
```

---

## 📝 Validation Examples

### **Valid Request:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean-Pierre",
  "answers": [
    {
      "questionId": 1,
      "questionText": "Quel est votre âge?",
      "answer": "25"
    },
    {
      "questionId": 2,
      "questionText": "Votre nom?",
      "answer": "Jean"
    }
  ]
}
```
✅ **Result:** Valid, processed successfully

---

### **Invalid Request (Multiple Errors):**
```json
{
  "nom": "A",
  "prenom": "Jean123",
  "answers": []
}
```
❌ **Errors:**
- `Nom: Le nom doit contenir au moins 2 caractères`
- `Prénom: Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes`
- `answers: Au moins une réponse est requise`

---

### **Edge Cases Handled:**
```json
// Numbers converted to strings
{ "questionId": 1, "answer": 42 }
→ { "questionId": "1", "answer": "42" }

// Whitespace trimmed
{ "nom": "  Jean  ", "prenom": "Pierre" }
→ { "nom": "Jean", "prenom": "Pierre" }

// Mixed types normalized
{ "questionId": "1", "answer": 25 }
→ { "questionId": "1", "answer": "25" }
```

---

## 🚀 Benefits

### **1. Security**
- ✅ Prevents injection attacks
- ✅ Blocks malformed data
- ✅ Type-safe processing

### **2. Data Quality**
- ✅ Consistent data format
- ✅ Clean, normalized values
- ✅ No unexpected types

### **3. User Experience**
- ✅ Clear error messages
- ✅ French/English support
- ✅ Specific field errors

### **4. Maintainability**
- ✅ Type-safe code
- ✅ Centralized validation
- ✅ Easy to extend

---

## 📊 Comparison

| Feature | Before | After |
|---------|--------|-------|
| **Type Safety** | ❌ | ✅ |
| **Length Validation** | ❌ | ✅ |
| **Format Validation** | ❌ | ✅ |
| **Sanitization** | ❌ | ✅ |
| **Error Messages** | Basic | Detailed |
| **French Support** | ❌ | ✅ |
| **Security** | ⚠️ Basic | ✅ Strong |

---

## ✅ What's Validated Now

1. ✅ **Names** - Length, format, characters
2. ✅ **Answers** - Count, structure, content
3. ✅ **Data Types** - Automatic conversion & validation
4. ✅ **JSON Format** - Valid JSON required
5. ✅ **Security** - Injection prevention
6. ✅ **Sanitization** - Clean, normalized data

---

## 🎯 Next Steps (Optional)

1. **Add more validation rules** - Custom business logic
2. **Add logging** - Track validation failures
3. **Add rate limiting per field** - Prevent specific field abuse
4. **Add validation for questions endpoint** - If needed

---

**Your validation is now production-ready! 🎉**

