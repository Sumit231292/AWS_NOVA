#!/bin/bash

echo "🌍 Nova Travel — AI Travel Planner Setup"
echo "========================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required. Install from https://python.org"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Install from https://nodejs.org"
    exit 1
fi

echo "✅ Python $(python3 --version)"
echo "✅ Node $(node --version)"
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Created backend/.env — please add your AWS credentials!"
fi

python3 -m venv venv 2>/dev/null || true
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

pip install -r requirements.txt -q
echo "✅ Backend dependencies installed"

cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend
npm install --silent
echo "✅ Frontend dependencies installed"
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the app, run TWO terminals:"
echo ""
echo "  Terminal 1 (Backend):"
echo "  cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo ""
echo "  Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "  Then open: http://localhost:3000"
echo ""
echo "⚠️  Make sure to:"
echo "  1. Add AWS credentials to backend/.env"
echo "  2. Enable Amazon Nova Lite in AWS Bedrock console"
