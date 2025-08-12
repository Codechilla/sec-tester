#!/bin/bash
set -e

# SEC-TESTER Startup Script
# BMAD Method Implementation

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║     ███████╗███████╗ ██████╗    ████████╗███████╗███████╗     ║"
echo "║     ██╔════╝██╔════╝██╔════╝    ╚══██╔══╝██╔════╝██╔════╝     ║"
echo "║     ███████╗█████╗  ██║            ██║   █████╗  ███████╗     ║"
echo "║     ╚════██║██╔══╝  ██║            ██║   ██╔══╝  ╚════██║     ║"
echo "║     ███████║███████╗╚██████╗       ██║   ███████╗███████║     ║"
echo "║     ╚══════╝╚══════╝ ╚═════╝       ╚═╝   ╚══════╝╚══════╝     ║"
echo "║                                                               ║"
echo "║           CYBERPUNK SECURITY ASSESSMENT PLATFORM             ║"
echo "║                    BMAD METHOD COMPLIANT                     ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in SEC-TESTER directory. Please cd to SEC-TESTER first."
    exit 1
fi

echo "🔧 Installing dependencies..."

# Install Node.js dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing React dependencies..."
    npm install
fi

# Install Python dependencies
if [ ! -d "backend/venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r ../requirements.txt
    pip install uvicorn
    deactivate
    cd ..
fi

echo "🚀 Starting SEC-TESTER..."

# Start backend
echo "🔥 Starting FastAPI backend on port 8001..."
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!
deactivate
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "⚡ Starting Vite frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ SEC-TESTER is now running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8001"
echo "📖 API Docs: http://localhost:8001/docs"
echo ""
echo "Press Ctrl+C to stop all services..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down SEC-TESTER..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to call cleanup on script exit
trap cleanup INT TERM

# Wait for processes
wait


# Troubleshooting
# If you encounter issues, check logs in dev-server.log and dev.log.
# Ensure .env is configured correctly and all dependencies are installed.
