# 🔧 Quick Fix: QR Scanner Not Working in Production

## The Problem
QR scanner works on `localhost` but **NOT** at `http://192.168.29.223:3001/`

## The Cause
❌ **HTTP is blocked** - Browsers require HTTPS for camera access

## The Solution (Choose One)

### ⚡ FASTEST: Use ngrok (2 minutes)

```bash
# Install ngrok
npm install -g ngrok

# Start your app
npm run build && npm run start

# In new terminal, create HTTPS tunnel
ngrok http 3001

# Use the HTTPS URL provided (e.g., https://abc123.ngrok.io)
```

✅ **Done!** QR scanner now works!

---

### 🏠 BEST: Local HTTPS Setup (5 minutes)

```bash
# 1. Install mkcert
brew install mkcert  # macOS
# OR follow HTTPS_SETUP_GUIDE.md for other OS

# 2. Setup certificates
npm run setup:https

# 3. Build and start with HTTPS
npm run build
npm run start:https

# 4. Access at: https://192.168.29.223:3001
```

✅ **Done!** Permanent HTTPS setup complete!

---

## Why This Happens

Modern browsers block camera access over HTTP for security:
- ✅ `https://` - Camera allowed
- ✅ `http://localhost` - Camera allowed (dev exception)
- ❌ `http://192.168.x.x` - Camera blocked

## Quick Test

After setting up HTTPS:
1. Visit your HTTPS URL on mobile
2. Click "Scan QR" button
3. Allow camera permission
4. Test with any QR code
5. Should work! 🎉

## Need Help?

See `HTTPS_SETUP_GUIDE.md` for detailed instructions and troubleshooting.
