# 🌍 Trip Chronicles — AI-Powered Travel Planner

> **Amazon Nova AI Hackathon 2026** · Freestyle Category  
> Powered by **Amazon Nova** via **Amazon Bedrock** · Auth by **AWS Cognito** · Storage by **DynamoDB**

---

## 🚀 Overview

Trip Chronicles is a full-stack AI travel planner that uses **Amazon Nova Lite** (via Amazon Bedrock) to generate hyper-personalized itineraries, smart packing lists, budget estimates, and an interactive AI concierge — all secured with **AWS Cognito** authentication and stored in **DynamoDB**.

### Architecture
```
Frontend (React + Vite)  ←→  Backend (FastAPI/Python)  ←→  Amazon Bedrock (Nova)
    localhost:3000                localhost:8000              us-east-1
         │                             │
   AWS Amplify Auth            JWT Verification
         │                             │
    AWS Cognito ◄──────────────────────┘
                                       │
                                  DynamoDB
                              (saved itineraries)
```

### Key Features
- **🗺️ Full Itinerary Generation** — Day-by-day plans with activities, meals, accommodation
- **💼 Smart Packing Lists** — Context-aware, interactive checklist
- **💰 Budget Estimator** — Detailed cost breakdowns with money-saving tips
- **🤖 AI Chat Concierge** — Multi-turn conversation with travel expertise
- **🔐 Real Authentication** — Google, GitHub, & email/password via AWS Cognito
- **💾 Persistent Storage** — Saved itineraries stored in DynamoDB (per-user)
- **⚡ Powered by Amazon Nova Lite** — `amazon.nova-lite-v1:0` on Bedrock

### AWS Services Used
| Service | Purpose |
|---|---|
| **Amazon Bedrock** | AI model inference (Nova Lite) |
| **Amazon Nova Lite** | Travel itinerary, packing, budget, chat generation |
| **AWS Cognito** | User authentication (email/password + Google + GitHub) |
| **DynamoDB** | Persistent per-user saved itineraries |

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
travel-planner/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
└── README.md
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (see AWS Configuration below)
# Edit .env with your AWS credentials

# Start the backend server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure Cognito (optional — see Auth Setup below)
# Edit .env with your Cognito settings

# Start development server
npm run dev
```

### 4. Open the App
Visit **http://localhost:3000** 🎉

---

## 🔑 AWS Configuration

### Backend Environment (`backend/.env`)
```bash
# AWS Credentials (for Bedrock + DynamoDB)
AWS_ACCESS_KEY_ID=your_key_id
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1

# AWS Cognito (leave empty for local/demo auth)
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_APP_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# DynamoDB table (auto-created on startup)
DYNAMODB_TABLE=tripchronicles-trips
```

### Frontend Environment (`frontend/.env`)
```bash
# AWS Cognito (leave empty for local/demo auth)
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_DOMAIN=your-app.auth.us-east-1.amazoncognito.com
```

### Required IAM Permissions
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
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:DeleteItem",
        "dynamodb:CreateTable",
        "dynamodb:DescribeTable",
        "dynamodb:ListTables"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/tripchronicles-trips"
    }
  ]
}
```

---

## 🔐 Auth Setup — AWS Cognito

The app works in **two modes**:

### Demo Mode (no setup needed)
Leave Cognito env vars empty → auth uses localStorage. Great for development.

### Production Mode — AWS Cognito
1. **Create a Cognito User Pool** in [AWS Console](https://console.aws.amazon.com/cognito)
   - Choose "Email" as sign-in option
   - Enable self-registration
   - Set password policy (default: 8+ chars, upper/lower/number/special)

2. **Create an App Client**
   - Type: Public client
   - Auth flows: `ALLOW_USER_SRP_AUTH`, `ALLOW_REFRESH_TOKEN_AUTH`
   - No client secret

3. **Enable Social Login (Optional)**
   - **Google**: Add Google as identity provider in Cognito → provide Client ID + Secret from Google Cloud Console
   - **GitHub**: Add as Custom OIDC provider → use GitHub OAuth App credentials
   - Set up Hosted UI domain in Cognito
   - Configure callback URLs: `http://localhost:3000/`

4. **Configure Environment**
   - Copy the User Pool ID, Client ID, and Hosted UI domain into both `backend/.env` and `frontend/.env`

5. **Start the app** — DynamoDB table is auto-created on backend startup!

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

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | Health check + model info |
| POST | `/api/plan/full` | — | Generate full itinerary |
| POST | `/api/plan/packing-list` | — | Generate packing list |
| POST | `/api/plan/budget` | — | Budget estimation |
| POST | `/api/chat` | — | Multi-turn AI chat |
| POST | `/api/plan/quick-tips` | — | Quick destination tips |
| GET | `/api/itineraries` | JWT | List saved itineraries |
| POST | `/api/itineraries` | JWT | Save an itinerary |
| DELETE | `/api/itineraries/{id}` | JWT | Delete saved itinerary |

---

## 📁 Project Structure

```
backend/
├── main.py              # FastAPI app + Bedrock/Nova + Cognito JWT + DynamoDB
├── requirements.txt
└── .env

frontend/
├── index.html
├── vite.config.js
├── package.json
├── .env                 # Cognito configuration
└── src/
    ├── main.jsx              # React entry + Amplify init
    ├── App.jsx               # Router
    ├── index.css             # Global styles (tech-savvy dark/light themes)
    ├── config/
    │   └── amplify.js        # AWS Amplify v6 configuration
    ├── context/
    │   └── AppContext.jsx     # Auth state (Cognito/local), saved trips, theme
    ├── components/
    │   ├── Navbar.jsx         # Glassmorphism nav with auth menu
    │   ├── AuthModal.jsx      # Sign-in/sign-up/verify (Cognito flows)
    │   └── DestinationPhotos.jsx  # Photo carousel (Unsplash CDN)
    ├── pages/
    │   ├── HomePage.jsx       # Landing page with tech aesthetic
    │   ├── PlannerPage.jsx    # Trip planning form
    │   ├── ItineraryPage.jsx  # Day-by-day itinerary display
    │   ├── PackingPage.jsx    # Packing list generator
    │   ├── BudgetPage.jsx     # Budget estimator
    │   ├── ChatPage.jsx       # AI chat interface
    │   └── SavedPage.jsx      # Saved itineraries (DynamoDB-backed)
    └── services/
        └── api.js             # Axios client + auth token injection
```

---

## 🏆 Hackathon Details

- **Hackathon**: Amazon Nova AI Hackathon 2026
- **Category**: Freestyle
- **Required Service**: Amazon Bedrock (Amazon Nova models)
- **Model Used**: `amazon.nova-lite-v1:0`
- **AWS Services**: Bedrock, Cognito, DynamoDB

### Judging Criteria
| Criteria | Weight | How We Deliver |
|---|---|---|
| Technical Implementation | 60% | Full-stack AWS integration: Nova AI + Cognito auth + DynamoDB persistence + JWT verification |
| Enterprise/Community Impact | 20% | Production-ready auth, scalable storage, multi-user support |
| Creativity & Innovation | 20% | AI-powered travel planning with real-time chat, glassmorphism UI, tech-forward design |

---

## 📝 License

MIT License — built for the Amazon Nova AI Hackathon 2026.
