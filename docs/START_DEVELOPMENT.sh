#!/bin/bash

echo "🚀 Starting Advising App Development Environment"
echo "================================================"
echo ""

# Check if backend is running
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ Backend server is already running on port 3000"
else
    echo "📦 Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    echo "✅ Backend server started (PID: $BACKEND_PID)"
    cd ..
fi

echo ""
echo "📱 To start mobile app, run in a new terminal:"
echo "   cd mobile"
echo "   expo start"
echo ""
echo "🌐 Backend API: http://localhost:3000"
echo "📖 API Docs: http://localhost:3000/health"
echo ""
echo "✅ Development environment is ready!"
echo ""
echo "Press Ctrl+C to stop backend server"
wait $BACKEND_PID 2>/dev/null
