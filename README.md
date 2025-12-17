# 🎯 Quiz Forms - Interactive Survey Application

A modern, interactive survey application built with Next.js and integrated with Microsoft Dataverse through Power Automate.

## ✨ Features

- 📊 **Dynamic Questions** - Questions loaded from Dataverse
- 🎨 **Beautiful UI** - Modern, responsive design with animations
- 🔐 **Secure** - API key authentication
- 💾 **Dataverse Integration** - Automatic data persistence
- ⚡ **Fast** - Optimized performance with Next.js
- 📱 **Responsive** - Works on all devices

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Dataverse integration

Copy the example environment file and fill in your Power Automate URLs:

```bash
# Create .env.local manually (cannot be created automatically)
# Copy contents from .env.local.example
```

See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[DATAVERSE_INTEGRATION_GUIDE.md](./DATAVERSE_INTEGRATION_GUIDE.md)** - Complete integration guide
- **[QUESTIONS_SUMMARY.md](./QUESTIONS_SUMMARY.md)** - Question types and structure
- **[ARCHITECTURE_EXPLANATION.md](./ARCHITECTURE_EXPLANATION.md)** - Application architecture

---

## 🔧 Configuration

This app requires environment variables in `.env.local`:

### Required Variables:
```bash
POWER_AUTOMATE_QUESTIONS_URL=<your-get-questions-flow-url>
POWER_AUTOMATE_SUBMIT_URL=<your-save-answers-flow-url>
POWER_AUTOMATE_API_KEY=<your-api-key>
```

### Optional Variables (Security):
```bash
# CORS: Comma-separated list of allowed origins (production only)
# In development, localhost is automatically allowed
ALLOWED_ORIGINS=https://votreapp.com,https://www.votreapp.com
```

**Note:** See [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) for complete security configuration.

---

## 🏗️ Project Structure

```
quiz-forms/
├── app/
│   ├── api/
│   │   ├── questions/     # GET questions from Dataverse
│   │   └── submit/        # POST answers to Dataverse
│   ├── page.tsx           # Landing page
│   └── questions/         # Survey page
├── components/
│   ├── questions/         # Question components
│   └── ui/                # UI components
├── data/
│   └── questions.ts       # Question types/interfaces
└── hooks/                 # Custom React hooks
```

---

## 🔌 API Endpoints

### GET `/api/questions`
Fetches active questions from Dataverse, sorted by order.

**Response:**
```json
{
  "questions": [...],
  "success": true
}
```

### POST `/api/submit`
Saves user information and survey answers to Dataverse.

**Request:**
```json
{
  "nom": "Dupont",
  "prenom": "Marie",
  "answers": [...]
}
```

---

## 🛠️ Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Power Automate** - Workflow automation
- **Microsoft Dataverse** - Data storage
- **Lucide Icons** - Beautiful icons

---

## 📝 Question Types

This app supports multiple question types:

- `choice` - Multiple choice questions
- `text` - Free text input
- `rating` - Star ratings
- `satisfaction` - Satisfaction slider
- `multiple` - Multiple selections

See [QUESTIONS_SUMMARY.md](./QUESTIONS_SUMMARY.md) for details.

## 🔒 Security

- API keys are stored in `.env.local` (never committed to git)
- All requests to Power Automate are authenticated
- Input validation on both client and server
- HTTPS required in production

---

## 🧪 Testing

### Test the API endpoints:

```bash
# Test GET questions
curl http://localhost:3000/api/questions

# Test POST submission
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","prenom":"User","answers":[...]}'
```

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `POWER_AUTOMATE_QUESTIONS_URL`
   - `POWER_AUTOMATE_SUBMIT_URL`
   - `POWER_AUTOMATE_API_KEY`
4. Deploy!

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🐛 Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| "Power Automate URL not configured" | Create `.env.local` with your URLs |
| "API key not configured" | Add `POWER_AUTOMATE_API_KEY` to `.env.local` |
| Questions not loading | Check Power Automate flow is enabled |
| Submission fails | Verify Dataverse table relationships |

See [DATAVERSE_INTEGRATION_GUIDE.md](./DATAVERSE_INTEGRATION_GUIDE.md) for detailed troubleshooting.

---

## 📦 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Power Automate Documentation](https://docs.microsoft.com/en-us/power-automate/)
- [Dataverse Documentation](https://docs.microsoft.com/en-us/powerapps/maker/data-platform/)

---

## 🤝 Contributing

Contributions are welcome! Please read the documentation before making changes.

---

## 📄 License

This project is proprietary and confidential.

---

**Built with ❤️ using Next.js and Microsoft Power Platform**
