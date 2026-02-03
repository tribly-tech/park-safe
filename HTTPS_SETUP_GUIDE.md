# HTTPS Setup Guide for QR Scanner

## 🚨 Problem

The QR scanner works on `localhost` but **not in production** at `http://192.168.29.223:3001/`.

**Root Cause**: Modern browsers require **HTTPS** for camera access (getUserMedia API). HTTP connections are blocked for security reasons.

---

## ✅ Solutions

### Option 1: Quick Testing with ngrok (Recommended for Testing)

**Best for**: Quick testing without certificate setup

```bash
# 1. Install ngrok globally
npm install -g ngrok

# 2. Build and start your app
npm run build
npm run start

# 3. In a NEW terminal, create HTTPS tunnel
ngrok http 3001
```

ngrok will provide an HTTPS URL like `https://abc123.ngrok.io`. Use this URL to test the QR scanner on any device!

**Pros**:
- ✅ No certificate setup needed
- ✅ Works instantly
- ✅ Access from any device anywhere
- ✅ Real HTTPS certificates

**Cons**:
- ❌ URL changes each time (unless paid plan)
- ❌ Requires internet connection
- ❌ Adds slight latency

---

### Option 2: Local HTTPS with mkcert (Recommended for Production)

**Best for**: Permanent local network deployment with HTTPS

#### Step 1: Install mkcert

**macOS:**
```bash
brew install mkcert
```

**Linux:**
```bash
# For Debian/Ubuntu
sudo apt install libnss3-tools
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert
```

**Windows:**
```bash
# Using Chocolatey
choco install mkcert

# Or download from: https://github.com/FiloSottile/mkcert/releases
```

#### Step 2: Run Setup Script

```bash
# Make the setup script executable and run it
npm run setup:https
```

This will:
1. Install local Certificate Authority
2. Generate SSL certificates for your local network
3. Create `certificates/` folder with cert files

#### Step 3: Build and Start with HTTPS

```bash
# Build the app
npm run build

# Start with HTTPS
npm run start:https
```

#### Step 4: Access on Any Device

Your server will show:
```
🚀 Park Safe is running with HTTPS!

   Local:            https://localhost:3001
   Network:          https://192.168.29.223:3001

✅ Camera access enabled (HTTPS active)
```

---

## 🔧 Troubleshooting

### Certificate Warning on Mobile Devices

When accessing from mobile devices, you may see a security warning:

**iOS Safari:**
1. Tap "Advanced"
2. Tap "Visit this website"
3. Enter your passcode if prompted

**Android Chrome:**
1. Tap "Advanced"
2. Tap "Proceed to 192.168.29.223 (unsafe)"

**Why this happens**: The certificate is self-signed for local development. It's completely safe - you generated it yourself!

### "mkcert: command not found"

Install mkcert using the instructions in Step 1 above.

### Certificates Not Working

```bash
# Remove old certificates and regenerate
rm -rf certificates/
npm run setup:https
```

### Port Already in Use

```bash
# Change port in server.js or set environment variable
PORT=3002 npm run start:https
```

### Can't Access from Other Devices

1. Check firewall settings - port 3001 must be open
2. Ensure both devices are on the same network
3. Try accessing with your IP: `https://192.168.29.223:3001`

---

## 📱 Testing the QR Scanner

### Step 1: Generate a Test QR Code

Visit: https://www.qr-code-generator.com/

Create a QR code with text: `https://park-safe-test.com/vehicle/ABC123`

### Step 2: Test on Mobile

1. Open your HTTPS URL on mobile device
2. Click "Scan QR" button
3. Allow camera permission
4. Point camera at the QR code
5. Should scan successfully! ✅

---

## 🌐 Deployment Options

### For Production Deployment

1. **Cloud Hosting (Vercel/Netlify)**
   - Automatic HTTPS
   - No certificate management needed
   - Recommended for public apps

2. **VPS/Server with Domain**
   - Use Let's Encrypt for free certificates
   - Certbot makes it easy
   - Recommended for custom domains

3. **Local Network Only**
   - Use the mkcert solution (Option 2)
   - Perfect for internal/private networks

---

## 🔐 Security Notes

- **mkcert certificates**: Only trusted on devices where you installed the local CA
- **Self-signed certs**: Safe for development, not for public production
- **Camera access**: Only granted over HTTPS (browser security feature)
- **localhost exception**: Browsers allow camera on `localhost` even without HTTPS

---

## 📊 Quick Comparison

| Method | Setup Time | Permanent | Internet Required | Best For |
|--------|-----------|-----------|-------------------|----------|
| ngrok | 2 min | No | Yes | Quick testing |
| mkcert | 5 min | Yes | No | Local network production |
| Let's Encrypt | 15 min | Yes | Yes | Public production |

---

## 🎯 Recommended Solution

**For your case** (local network at `192.168.29.223:3001`):

👉 **Use Option 2 (mkcert)** - it's permanent and works offline

```bash
# One-time setup
npm run setup:https

# Every time you start the server
npm run build
npm run start:https
```

---

## 💡 Why HTTPS is Required

Modern browsers restrict camera and microphone access to secure contexts (HTTPS) to prevent:

1. **Man-in-the-middle attacks**: Attacker intercepting camera feed
2. **Privacy breaches**: Malicious sites accessing camera over HTTP
3. **Data leaks**: Sensitive information captured over insecure connections

**Exceptions**: 
- `localhost` (127.0.0.1) - allowed for development
- `*.localhost` subdomains - allowed for development

---

## 📞 Need Help?

If you're still having issues:

1. Check browser console for specific errors
2. Verify certificates exist: `ls -la certificates/`
3. Test on localhost first: `https://localhost:3001`
4. Ensure firewall allows connections on port 3001

---

## ✅ Success Checklist

- [ ] mkcert installed
- [ ] Certificates generated (`npm run setup:https`)
- [ ] App built (`npm run build`)
- [ ] Server running with HTTPS (`npm run start:https`)
- [ ] Accessible at `https://192.168.29.223:3001`
- [ ] Camera permission granted
- [ ] QR scanner working! 🎉

---

**Created**: January 28, 2026  
**Status**: ✅ Ready to use
