# 🌍 Trip Chronicles — AI-Powered Travel Planner

> **Amazon Nova AI Hackathon Submission** · Freestyle Category  
> Powered by **Amazon Nova** via **Amazon Bedrock**

---

## 🚀 Overview

Trip Chronicles is an AI-powered travel planning application that uses **Amazon Nova** (via Amazon Bedrock) to generate personalized travel itineraries, smart packing lists, budget estimates, and provides an interactive AI travel concierge chatbot.

### Architecture
```
Frontend (React + Vite)  ←→  Backend (FastAPI/Python)  ←→  Amazon Bedrock (Nova)
    localhost:3000                localhost:8000              us-east-1
```

### Key Features
- **🗺️ Full Itinerary Generation** — Day-by-day plans with activities, meals, accommodation
- **💼 Smart Packing Lists** — Context-aware, interactive checklist
- **💰 Budget Estimator** — Detailed cost breakdowns with money-saving tips  
- **🤖 AI Chat Concierge** — Multi-turn conversation with travel expertise
- **⚡ Real-time AI** — Powered by `amazon.nova-lite-v1:0` on Bedrock

---

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- AWS Account with Bedrock access
- Amazon Nova model enabled in your AWS region (us-east-1 recommended)

### Enable Amazon Nova on Bedrock
1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock)
2. Navigate to "Model access"
3. Enable **Amazon Nova Lite** (and optionally Nova Pro)

---

## ⚙️ Setup & Installation

### 1. Clone / Download the project
```bash
# Your project directory should look like:
travel-planner/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

### 2. Backend Setup
```bash
cd backend

# Copy and configure environment
cp .env.example .env
# Edit .env with your AWS credentials

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Open the App
Visit **http://localhost:3000** 🎉

---

## 🔑 AWS Configuration

### Option A: Environment Variables
```bash
# backend/.env
AWS_ACCESS_KEY_ID=your_key_id
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1
```

### Option B: AWS CLI Profile
```bash
aws configure
# Then no .env needed — boto3 will pick up the profile automatically
```

### Option C: IAM Role (EC2/Lambda)
No configuration needed — boto3 uses the instance role automatically.

### Required IAM Permissions
Your AWS credentials need the following permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/amazon.nova-*"
    }
  ]
}
```

---

## 🎯 How It Uses Amazon Nova

| Feature | Nova Prompt Design | Max Tokens |
|---|---|---|
| Full Itinerary | JSON-structured output, multi-day planning | 4096 |
| Packing List | Category-based structured response | 2048 |
| Budget Estimate | Numerical breakdown with ranges | 1500 |
| AI Chat | Multi-turn conversation history | 1024 |
| Quick Tips | Compact JSON response | 800 |

### Model Selection
Default: `amazon.nova-lite-v1:0` (fast, cost-effective)  
Upgrade to: `amazon.nova-pro-v1:0` (in `backend/main.py`, change `MODEL_ID`)

---

## 🛣️ API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check + model info |
| POST | `/api/plan/full` | Generate full itinerary |
| POST | `/api/plan/packing-list` | Generate packing list |
| POST | `/api/plan/budget` | Budget estimation |
| POST | `/api/chat` | Multi-turn AI chat |
| POST | `/api/plan/quick-tips` | Quick destination tips |

### Example: Generate Itinerary
```bash
curl -X POST http://localhost:8000/api/plan/full \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Tokyo, Japan",
    "origin": "New York, USA",
    "start_date": "2025-06-01",
    "end_date": "2025-06-07",
    "budget": "moderate",
    "travelers": 2,
    "interests": ["food", "culture", "photography"]
  }'
```

---

## 📁 Project Structure

```
backend/
├── main.py           # FastAPI app + all Bedrock/Nova integrations
├── requirements.txt
└── .env.example

frontend/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx          # React entry point
    ├── App.jsx           # Router
    ├── index.css         # Global styles (luxury travel aesthetic)
    ├── components/
    │   └── Navbar.jsx
    ├── pages/
    │   ├── HomePage.jsx      # Landing page
    │   ├── PlannerPage.jsx   # Trip planning form
    │   ├── ItineraryPage.jsx # Itinerary display
    │   ├── PackingPage.jsx   # Packing list
    │   ├── BudgetPage.jsx    # Budget estimator
    │   └── ChatPage.jsx      # AI chat interface
    └── services/
        └── api.js            # Axios API client
```

---

## 🏆 Hackathon Details

- **Hackathon**: Amazon Nova AI Hackathon
- **Category**: Freestyle
- **Required Service**: Amazon Bedrock (Amazon Nova models)
- **Model Used**: `amazon.nova-lite-v1:0`

---

## 🚀 Deployment (Optional)

### Deploy Backend to AWS Lambda
```bash
# Install Mangum for Lambda support
pip install mangum

# In main.py, add at the bottom:
# from mangum import Mangum
# handler = Mangum(app)
```

### Deploy Frontend to AWS Amplify or S3
```bash
cd frontend
npm run build
# Deploy the /dist folder to S3 + CloudFront
```

---

## 📝 License

MIT License — built for the Amazon Nova AI Hackathon 2026.
