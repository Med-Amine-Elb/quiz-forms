# 🔄 Power Automate Setup Guide for Dataverse Integration

This guide will help you set up Power Automate flows to connect your Next.js form with your Dataverse tables.

## 📋 Prerequisites

- Access to Power Automate
- Dataverse tables already created:
  - **User** table: `nom`, `prenom`, `userID`, `createdOn`
  - **Question** table: `questionID`, `titre`, `ordre`, `type`
  - **Answer** table: `userId`, `questionId`, `reponse`, `createdOn`

---

## 🔧 Flow 1: Get Questions from Dataverse

### Step 1: Create the Flow

1. Go to [Power Automate](https://make.powerautomate.com)
2. Click **"Create"** → **"Instant cloud flow"**
3. Name it: `Get Questions from Dataverse`
4. Choose trigger: **"When an HTTP request is received"**

### Step 2: Configure HTTP Trigger

1. In the trigger card, click **"Use sample payload to generate schema"**
2. Paste this JSON (or leave empty if no body needed):
   ```json
   {}
   ```
3. Click **"Done"**

### Step 3: Add Dataverse List Rows Action

1. Click **"New step"** → Search for **"Microsoft Dataverse"**
2. Select **"List rows"** action
3. Configure:
   - **Table name**: Select your `question` table
   - **Filter rows**: Leave empty (or add filters if needed)
   - **Order by**: Click **"Add new item"** → Select `ordre` → Choose **"Ascending"**

### Step 4: Format the Response (Optional)

1. Add **"Select"** action (Data Operations)
2. **From**: Click and select `value` from the "List rows" output
3. Click **"Map"** and configure:
   - `questionID` → `questionid` (or your exact Dataverse field name)
   - `titre` → `titre`
   - `ordre` → `ordre`
   - `type` → `type`

### Step 5: Add Response Action

1. Add **"Response"** action (HTTP)
2. Configure:
   - **Status code**: `200`
   - **Body**: 
     - If you used Select: Use the output from Select action
     - If not: Use `value` from "List rows" output
   - **Headers**: 
     - `Content-Type`: `application/json`

### Step 6: Save and Get URL

1. Click **"Save"**
2. Go back to the trigger card
3. Copy the **HTTP POST URL** (looks like: `https://prod-xx.westus.logic.azure.com:443/workflows/...`)
4. Add this URL to your `.env.local` file:
   ```
   POWER_AUTOMATE_QUESTIONS_URL=https://your-flow-url-here
   ```

---

## 🔧 Flow 2: Save User and Answers to Dataverse

### Step 1: Create the Flow

1. Create a new **"Instant cloud flow"**
2. Name it: `Save User Answers to Dataverse`
3. Choose trigger: **"When an HTTP request is received"**

### Step 2: Configure HTTP Trigger with Schema

1. Click **"Use sample payload to generate schema"**
2. Paste this JSON:
   ```json
   {
     "nom": "Doe",
     "prenom": "John",
     "userId": "user_123",
     "createdOn": "2024-01-15T10:30:00Z",
     "answers": [
       {
         "questionId": 1,
         "reponse": "Yes"
       },
       {
         "questionId": 2,
         "reponse": "No"
       }
     ]
   }
   ```
3. Click **"Done"** - This will auto-generate the schema

### Step 3: Add User Row to Dataverse

1. Add **"Microsoft Dataverse"** → **"Add a new row"** action
2. **Table name**: Select your `User` table

#### ⚠️ IMPORTANT: How to Add All Fields

**Option A: Show Advanced Options**
1. Scroll down in the "Add a new row" card
2. Click **"Show advanced options"** (blue link at bottom)
3. You should see more fields appear

**Option B: Add Fields Manually**
1. Look for a **"+"** icon or **"Add new item"** button next to the fields
2. Click it to add a new field
3. Select the field name from the dropdown (e.g., `prenom`, `userID`, `createdOn`)

#### Map the Fields:

1. **nom** field:
   - Click in the `nom` field box
   - From dynamic content, select: `nom` (from trigger body)

2. **prenom** field:
   - If not visible, click **"Show advanced options"** or **"Add new item"**
   - Select field: `prenom`
   - Value: `prenom` (from trigger body)

3. **userID** field:
   - Add field: `userID` (or your exact Dataverse field name)
   - Value: `userId` (from trigger body)

4. **createdOn** field:
   - Add field: `createdOn` (or your exact Dataverse field name)
   - Value: `createdOn` (from trigger body) OR use `utcNow()` function

5. **Save the User Row ID**:
   - After the "Add a new row" action, add a **"Compose"** action
   - Name it: `User Row ID`
   - Input: Click and select `id` from the "Add a new row" output
   - This ID will be used to link answers to the user

### Step 4: Loop Through Answers

1. Add **"Control"** → **"Apply to each"** action
2. **Select an output from previous steps**: 
   - Click in the field
   - Select `answers` from the trigger body

### Step 5: Add Answer Row Inside Loop

1. Inside the "Apply to each" loop, add **"Microsoft Dataverse"** → **"Add a new row"**
2. **Table name**: Select your `Answer` table

#### Map Answer Fields:

1. **userId** field (lookup to User):
   - Click in the `userId` field
   - Select: `User Row ID` (from Compose action) OR use the User row ID directly
   - **Note**: If this is a lookup field, you may need to format it as: `{ "id": "user-row-id-here" }`

2. **questionId** field:
   - Value: `questionId` (from current item in loop: `items('Apply_to_each')?['questionId']`)

3. **reponse** field:
   - Value: `reponse` (from current item: `items('Apply_to_each')?['reponse']`)

4. **createdOn** field:
   - Value: `utcNow()` function OR `createdOn` from trigger body

### Step 6: Add Response Action

1. After the "Apply to each" loop, add **"Response"** action
2. Configure:
   - **Status code**: `200`
   - **Body**:
     ```json
     {
       "status": "success",
       "message": "User and answers saved successfully"
     }
     ```

### Step 7: Save and Get URL

1. Click **"Save"**
2. Copy the **HTTP POST URL** from the trigger
3. Add to `.env.local`:
   ```
   POWER_AUTOMATE_SUBMIT_URL=https://your-flow-url-here
   ```

---

## 🔒 Security (Optional but Recommended)

### Add API Key Authentication

1. In your HTTP trigger, click **"..."** (three dots) → **"Settings"**
2. Under **"Authentication"**, you can:
   - Enable **"Azure AD"** authentication, OR
   - Add a custom header like `x-api-key` and validate it in a condition

3. In your Next.js API routes, add the header when calling Power Automate:
   ```typescript
   headers: {
     'Content-Type': 'application/json',
     'x-api-key': process.env.POWER_AUTOMATE_API_KEY, // Optional
   }
   ```

---

## 🧪 Testing Your Flows

### Test Flow 1 (Get Questions)

1. In Power Automate, click **"Test"** on your flow
2. Choose **"Manually"**
3. Click **"Run flow"**
4. Check the output - you should see your questions

### Test Flow 2 (Save Answers)

1. Test the flow manually
2. Use this sample payload:
   ```json
   {
     "nom": "Test",
     "prenom": "User",
     "userId": "test_123",
     "createdOn": "2024-01-15T10:30:00Z",
     "answers": [
       { "questionId": 1, "reponse": "Test answer" }
     ]
   }
   ```
3. Check Dataverse to verify the data was saved

---

## 📝 Environment Variables

Create a `.env.local` file in your project root:

```env
POWER_AUTOMATE_QUESTIONS_URL=https://prod-xx.westus.logic.azure.com:443/workflows/.../triggers/manual/paths/invoke
POWER_AUTOMATE_SUBMIT_URL=https://prod-xx.westus.logic.azure.com:443/workflows/.../triggers/manual/paths/invoke
POWER_AUTOMATE_API_KEY=your-optional-api-key-here
```

---

## 🐛 Troubleshooting

### Problem: Can't see all fields in "Add a new row"

**Solution:**
1. Click **"Show advanced options"** at the bottom of the action card
2. If still not visible, check your Dataverse table - make sure the fields exist and are not hidden
3. Try typing the field name manually in the dynamic content picker

### Problem: Field names don't match

**Solution:**
- Dataverse uses logical names (e.g., `cr123_userid` instead of `userID`)
- Check your Dataverse table schema to get exact field names
- Use the exact logical names in Power Automate

### Problem: Lookup fields not working

**Solution:**
- For lookup fields (like `userId` in Answer table), you may need to format as:
  ```json
  {
    "@odata.type": "#Microsoft.Dynamics.CRM.LookupValue",
    "id": "user-row-id-here",
    "logicalName": "user"
  }
  ```
- Or use the GUID format directly if your table uses GUIDs

### Problem: Flow returns error 401/403

**Solution:**
- Check your Power Automate connection to Dataverse
- Make sure you have proper permissions on the tables
- Verify the table names are correct

---

## ✅ Next Steps

1. Set up both flows following this guide
2. Add the URLs to `.env.local`
3. Test the flows manually
4. Your Next.js app will automatically use these APIs when you submit the form

---

## 📞 Need Help?

If you encounter issues:
1. Check the Power Automate run history for error details
2. Verify your Dataverse table field names match exactly
3. Test each flow step by step
4. Check the Next.js API route logs for errors


