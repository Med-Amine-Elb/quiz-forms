# 🚀 Quick Start: Dataverse Integration with Power Automate

## ✅ What's Been Set Up

1. **API Routes Created:**
   - `/api/questions` - Fetches questions from Dataverse via Power Automate
   - `/api/submit` - Submits user data and answers to Dataverse via Power Automate

2. **Automatic Submission:**
   - When the form is completed, answers are automatically submitted to Power Automate
   - User data (nom, prenom) is collected from the landing page form

3. **Setup Guide:**
   - See `POWER_AUTOMATE_SETUP.md` for detailed Power Automate flow configuration

---

## 📝 Next Steps

### 1. Set Up Power Automate Flows

Follow the detailed guide in `POWER_AUTOMATE_SETUP.md` to:
- Create Flow 1: Get Questions from Dataverse
- Create Flow 2: Save User and Answers to Dataverse

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
POWER_AUTOMATE_QUESTIONS_URL=your-flow-1-url-here
POWER_AUTOMATE_SUBMIT_URL=your-flow-2-url-here
```

### 3. Test the Integration

1. Start your Next.js app: `npm run dev`
2. Fill out the form and complete all questions
3. Check your Dataverse tables to verify data was saved

---

## 🔍 How It Works

```
User fills form → Completes all questions → 
Answers automatically submitted to /api/submit → 
Calls Power Automate Flow 2 → 
Saves to Dataverse (User + Answer tables)
```

---

## ⚠️ Important Notes

### Field Mapping in Power Automate

When setting up "Add a new row" in Power Automate:

1. **To see all fields:**
   - Click **"Show advanced options"** at the bottom of the action card
   - OR click **"+"** or **"Add new item"** to add fields manually

2. **Field names must match exactly:**
   - Use the exact logical names from your Dataverse table
   - Example: If your table has `cr123_userid`, use that exact name

3. **For lookup fields (userId in Answer table):**
   - You may need to format as a lookup reference
   - Use the User row ID from the previous "Add a new row" action

---

## 🐛 Troubleshooting

### Answers not submitting?

1. Check browser console for errors
2. Verify `.env.local` has the correct Power Automate URLs
3. Test your Power Automate flows manually first
4. Check Power Automate run history for errors

### Fields not showing in Power Automate?

1. Click **"Show advanced options"**
2. Verify field names exist in your Dataverse table
3. Check table permissions in Dataverse

---

## 📚 Files Created

- `app/api/questions/route.ts` - API endpoint to get questions
- `app/api/submit/route.ts` - API endpoint to submit answers
- `POWER_AUTOMATE_SETUP.md` - Detailed setup guide
- `DATAVERSE_INTEGRATION_QUICK_START.md` - This file

---

## 🎯 Your Dataverse Tables

Make sure these tables exist with these fields:

**User Table:**
- `nom` (text)
- `prenom` (text)
- `userID` (text or GUID)
- `createdOn` (date/time)

**Question Table:**
- `questionID` (text or GUID)
- `titre` (text)
- `ordre` (number)
- `type` (text)

**Answer Table:**
- `userId` (lookup to User table)
- `questionId` (text or lookup to Question table)
- `reponse` (text)
- `createdOn` (date/time)

---

## ✅ Ready to Go!

Once you've set up your Power Automate flows and added the URLs to `.env.local`, your integration is complete! The form will automatically save data to Dataverse when users complete the survey.


