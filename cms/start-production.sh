#!/bin/bash
# =============================================================
# Doctor CMS — Production Startup Script
# =============================================================
# Usage: ./start-production.sh
# 
# This script:
# 1. Sets NODE_ENV=production
# 2. Clears old session files (cache cleanup)
# 3. Starts Express server with PM2 (or node directly)
# 4. Displays health status
# =============================================================

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CMS_DIR="$SCRIPT_DIR"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🚀 Starting Doctor CMS in Production Mode"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "   Please install Node.js 18+ LTS"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✓ Node.js $NODE_VERSION found"

# Check .env exists
if [ ! -f "$CMS_DIR/.env" ]; then
    echo "❌ Error: .env file not found at $CMS_DIR/.env"
    echo "   Please create .env using:"
    echo "   cp .env.example .env"
    echo "   Then edit with your configuration"
    exit 1
fi

echo "✓ .env configuration found"

# Clear old session files (optional but recommended)
echo ""
echo "🧹 Cleaning old session files..."
SESSIONS_DIR="$CMS_DIR/sessions"
if [ -d "$SESSIONS_DIR" ]; then
    # Find and delete session files older than 8 hours
    find "$SESSIONS_DIR" -type f -mmin +480 -delete 2>/dev/null || true
    SESSION_COUNT=$(find "$SESSIONS_DIR" -type f 2>/dev/null | wc -l)
    echo "✓ Cleaned old sessions ($(( SESSION_COUNT )) active sessions)"
else
    mkdir -p "$SESSIONS_DIR"
    echo "✓ Created sessions directory"
fi

# Create required directories if they don't exist
echo ""
echo "📁 Ensuring required directories exist..."
mkdir -p "$PROJECT_ROOT/backups"
echo "✓ backups/ directory ready"
mkdir -p "$PROJECT_ROOT/uploads"
echo "✓ uploads/ directory ready"
mkdir -p "$CMS_DIR/sessions"
echo "✓ sessions/ directory ready"

# Set production environment
export NODE_ENV=production

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    echo ""
    echo "🔧 Using PM2 for process management"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Start with PM2
    cd "$CMS_DIR"
    pm2 delete doctor-cms 2>/dev/null || true  # Remove old instance if exists
    pm2 start server.js \
        --name "doctor-cms" \
        --env production \
        --interpreter node \
        --log "$PROJECT_ROOT/cms/logs/doctor-cms.log" \
        --error "$PROJECT_ROOT/cms/logs/doctor-cms.error.log" \
        --min-memory-restart 100M
    
    # Save PM2 configuration for auto-restart on reboot
    pm2 save
    
    echo ""
    echo "✅ Doctor CMS started with PM2"
    echo ""
    echo "📊 Process Status:"
    pm2 list
    
    echo ""
    echo "📝 Monitor with:"
    echo "   pm2 logs doctor-cms           # View real-time logs"
    echo "   pm2 status                    # Check status"
    echo "   pm2 stop doctor-cms           # Stop service"
    echo "   pm2 restart doctor-cms        # Restart service"
    
else
    # Fallback: Start with node directly
    echo ""
    echo "⚠️  PM2 not installed, using node directly"
    echo "    (Install PM2 for auto-restart: sudo npm install -g pm2)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Create logs directory if needed
    mkdir -p "$CMS_DIR/logs"
    
    cd "$CMS_DIR"
    
    # Redirect output to log files
    nohup node server.js \
        > "$CMS_DIR/logs/doctor-cms.log" 2>&1 &
    
    PROCESS_PID=$!
    echo ""
    echo "✅ Doctor CMS started with Node.js (PID: $PROCESS_PID)"
    echo ""
    echo "📝 Monitor with:"
    echo "   tail -f $CMS_DIR/logs/doctor-cms.log"
    echo ""
    echo "⏹️  Stop with:"
    echo "   kill $PROCESS_PID"
fi

# Wait briefly and test health endpoint
echo ""
echo "🏥 Testing health endpoint..."
sleep 2

for i in {1..10}; do
    if curl -s http://localhost:5050/health | grep -q '"ok":true'; then
        echo "✅ Health check passed — CMS is running!"
        break
    elif [ $i -eq 10 ]; then
        echo "⚠️  Health check timeout — CMS may be starting. Check logs:"
        echo "   pm2 logs doctor-cms"
        exit 1
    else
        echo "⏳ Waiting for CMS to start... ($i/10)"
        sleep 1
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Doctor CMS is running!"
echo ""
echo "📍 Access at:"
echo "   https://yourdomain.com/admin/login"
echo "   (or http://localhost:5050/admin/login for local testing)"
echo ""
echo "📚 API docs at:"
echo "   https://yourdomain.com/api/"
echo ""
echo "💡 Tips:"
echo "   - Check Nginx proxy is configured correctly"
echo "   - Test login with configured username/password"
echo "   - Monitor logs for any errors"
echo ""
