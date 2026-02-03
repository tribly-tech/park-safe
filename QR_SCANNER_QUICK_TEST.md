# Quick Test Guide for QR Scanner

## 🚀 Get Started in 3 Steps

### Step 1: Start the Development Server

```bash
npm run dev
```

The app will run at `http://localhost:3000`

### Step 2: Access the Scanner

Click either of these buttons:
1. **"Register park safe QR"** card (green card in the main content area)
2. **"Scan QR"** floating button (at the bottom of the screen)

### Step 3: Test the Scanner

#### Option A: Use Your Phone's Camera
1. Open `http://localhost:3000` on your phone (ensure your phone is on the same network)
2. Click the "Scan QR" button
3. Grant camera permissions when prompted
4. Point your camera at any QR code

#### Option B: Generate a Test QR Code

Visit any of these sites to generate a test QR code:
- https://www.qr-code-generator.com/
- https://www.the-qrcode-generator.com/
- https://goqr.me/

Enter test data like:
```
PARK-SAFE-TEST-VEHICLE-12345
```

#### Option C: Use This Test QR Code

Print or display this test text as a QR code:
```
https://parksafe.app/vehicle/TEST123
```

## 📱 Expected Behavior

### When Scanner Opens:
- ✅ Camera permission dialog appears (first time only)
- ✅ Camera feed shows in a full-screen modal
- ✅ Green corner markers visible around scanning area
- ✅ Instructions displayed at the bottom

### When Scanning:
- ✅ QR code detected automatically (within 1-2 seconds)
- ✅ Success checkmark animation appears
- ✅ Green success toast notification shows
- ✅ Scanned data displayed in the toast
- ✅ Modal closes automatically

### If Errors Occur:
- ✅ Clear error message displayed
- ✅ "Try Again" and "Cancel" buttons appear
- ✅ Red error toast notification (if applicable)

## 🔍 What Gets Logged

Check your browser console (F12) to see:
```javascript
QR Code scanned: <decoded-text>
```

## ⚠️ Important Notes

### HTTPS Requirement
- **localhost**: Works without HTTPS ✅
- **Local IP (192.168.x.x)**: May require HTTPS ⚠️
- **Production**: Must use HTTPS ✅

### For Testing on Mobile Over Network:

If you need HTTPS for local network testing, use ngrok:

```bash
# Install ngrok
npm install -g ngrok

# In one terminal
npm run dev

# In another terminal
ngrok http 3000
```

Then use the HTTPS URL provided by ngrok (e.g., `https://abc123.ngrok.io`)

## 🎯 Success Criteria

The implementation is working correctly if:

- [x] Scanner opens when clicking either button
- [x] Camera permission prompt appears
- [x] Live camera feed is visible
- [x] QR codes are detected automatically
- [x] Success toast appears with scanned data
- [x] Scanner closes after successful scan
- [x] Error handling works for denied permissions
- [x] Retry button works after errors

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Camera permission denied" | Check browser settings, allow camera access |
| "No camera found" | Ensure device has a camera, try different browser |
| Black screen | Refresh page, check camera isn't in use elsewhere |
| QR not detected | Better lighting, hold steady, ensure QR is in frame |
| Scan too slow | Reduce QR code distance to camera |

## 📸 Screenshot Locations

When scanner is open, you should see:
1. **Top**: Header with "Scan QR Code" title and close button
2. **Middle**: Live camera feed with green corner markers
3. **Bottom**: Instructions for scanning

## 🎨 Visual Indicators

| State | Visual Feedback |
|-------|-----------------|
| Loading | Camera initializing... |
| Scanning | Green corner markers, pulsing animation |
| Success | Green checkmark, success message |
| Error | Red alert icon, error message |

## ✅ Next Steps After Testing

Once the scanner is working:

1. **Integrate with backend**: Send scanned data to your API
2. **Add validation**: Validate QR code format before processing
3. **Store scan history**: Save scanned codes locally or in database
4. **Add analytics**: Track scan success rates
5. **Implement deep linking**: Handle park safe:// URLs

## 📞 Test Data Examples

Try scanning QR codes with these data formats:

```
# Simple text
VEHICLE-ABC123

# URL format
https://parksafe.app/vehicle/ABC123

# JSON format
{"vehicleId":"ABC123","type":"parking"}

# Custom protocol
parksafe://vehicle/ABC123
```

---

**Ready to test?** Run `npm run dev` and click "Scan QR"! 🚀
