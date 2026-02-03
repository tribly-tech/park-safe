#!/bin/bash

echo "🔐 Setting up HTTPS for Park Safe"
echo "=================================="
echo ""

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert is not installed."
    echo ""
    echo "Please install mkcert first:"
    echo ""
    echo "  macOS:    brew install mkcert"
    echo "  Linux:    https://github.com/FiloSottile/mkcert#linux"
    echo "  Windows:  https://github.com/FiloSottile/mkcert#windows"
    echo ""
    exit 1
fi

# Install local CA
echo "📝 Installing local Certificate Authority..."
mkcert -install

# Create certificates directory
mkdir -p certificates

# Get local IP address
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}')

if [ -z "$LOCAL_IP" ]; then
    echo "⚠️  Could not detect local IP. Using localhost only."
    LOCAL_IP="localhost"
fi

echo ""
echo "🌐 Detected local IP: $LOCAL_IP"
echo ""

# Generate certificates for localhost and local IP
echo "🔑 Generating SSL certificates..."
cd certificates
mkcert localhost 127.0.0.1 ::1 "$LOCAL_IP" 192.168.*.* 10.*.*.* 172.16.*.*

# Rename certificates to expected names
mv localhost+*-key.pem localhost-key.pem 2>/dev/null || true
mv localhost+*.pem localhost.pem 2>/dev/null || true

cd ..

echo ""
echo "✅ HTTPS setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Run: npm run build"
echo "  2. Run: npm run start:https"
echo "  3. Access: https://$LOCAL_IP:3001"
echo ""
echo "⚠️  Note: You may see a certificate warning on other devices."
echo "   This is normal for local development. Click 'Advanced' → 'Proceed'"
echo ""
