# QR Scanner Implementation Guide

## Overview

The QR scanner feature has been successfully implemented in the Park Safe application using the `html5-qrcode` library. This provides a reliable, cross-platform QR code scanning solution that works on both mobile and desktop devices.

## Features

✅ **Reliable Scanning**: Uses the industry-standard `html5-qrcode` library
✅ **Mobile-First Design**: Optimized for mobile devices with back camera support
✅ **Beautiful UI**: Modern, animated interface with corner markers and status indicators
✅ **Error Handling**: Comprehensive error handling for camera permissions and device issues
✅ **Toast Notifications**: Success and error feedback using Sonner toast library
✅ **Responsive**: Works on all screen sizes and devices

## Implementation Details

### Files Created/Modified

1. **`src/components/QRScanner.tsx`** (NEW)
   - Main QR scanner component
   - Handles camera initialization and scanning logic
   - Provides success, error, and loading states
   - Beautiful UI with animations and feedback

2. **`src/app/page.tsx`** (MODIFIED)
   - Added QR scanner integration
   - Connected to "Register park safe QR" card
   - Connected to floating "Scan QR" button
   - Added success/error handlers

3. **`src/app/globals.css`** (MODIFIED)
   - Added custom styles for html5-qrcode
   - Hides default UI elements for cleaner look

4. **`src/types/html5-qrcode.d.ts`** (NEW)
   - TypeScript type definitions for html5-qrcode
   - Ensures type safety throughout the codebase

## How It Works

### User Flow

1. **User clicks** on either:
   - "Register park safe QR" card (top section)
   - "Scan QR" floating button (bottom)

2. **Camera opens** in a modal dialog:
   - Requests camera permission (if not already granted)
   - Shows loading state while initializing
   - Displays live camera feed with scanning frame

3. **User scans QR code**:
   - Aligns QR code within the scanning frame
   - Scanner automatically detects and reads the code
   - Shows success animation and the scanned data

4. **Result handling**:
   - Success toast notification appears
   - Scanned data is logged to console
   - Modal closes automatically
   - Data can be processed for vehicle registration

### Technical Implementation

```typescript
// Scanner initialization with optimal settings
await html5QrCode.start(
  { facingMode: 'environment' }, // Use back camera on mobile
  {
    fps: 10,                      // 10 frames per second
    qrbox: { width: 250, height: 250 }, // Scanning area
    aspectRatio: 1.0,
  },
  onSuccessCallback,
  onErrorCallback
)
```

## Usage in Your Code

### Basic Usage

```tsx
import QRScanner from '@/components/QRScanner'

function MyComponent() {
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  const handleScanSuccess = (decodedText: string, decodedResult: any) => {
    console.log('QR Code:', decodedText)
    // Process the scanned data
  }

  return (
    <>
      <button onClick={() => setIsScannerOpen(true)}>
        Open Scanner
      </button>

      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        onScanError={(error) => console.error(error)}
      />
    </>
  )
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls scanner visibility |
| `onClose` | `() => void` | Yes | Called when scanner closes |
| `onScanSuccess` | `(decodedText: string, decodedResult: any) => void` | Yes | Called on successful scan |
| `onScanError` | `(error: string) => void` | No | Called on scanner errors |

## Camera Permissions

The scanner requires camera access. Different browsers and devices handle this differently:

### Desktop Browsers
- Chrome/Edge: Permission prompt on first use
- Firefox: Permission prompt on first use
- Safari: Permission prompt on first use

### Mobile Browsers
- iOS Safari: Permission prompt, must be initiated by user action
- Android Chrome: Permission prompt, works seamlessly
- Android Firefox: Permission prompt, works seamlessly

### Permission Errors

The component handles common permission errors:

- **NotAllowedError**: User denied camera permission
- **NotFoundError**: No camera found on device
- **NotReadableError**: Camera is in use by another app

## Testing

### Testing on Development Server

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access on mobile device**:
   - Use your local network IP (e.g., `http://192.168.1.xxx:3000`)
   - OR use ngrok/localtunnel for HTTPS (required for camera on some browsers)

3. **Generate test QR codes**:
   - Use online QR generators: https://www.qr-code-generator.com/
   - Or use: https://www.the-qrcode-generator.com/
   - Create codes with test data like "PARK-SAFE-TEST-123"

### HTTPS Requirement

Most browsers require HTTPS for camera access. For local testing:

**Option 1: Use ngrok (Recommended)**
```bash
npm install -g ngrok
npm run dev
# In another terminal
ngrok http 3000
```

**Option 2: Use mkcert for local HTTPS**
```bash
brew install mkcert
mkcert -install
mkcert localhost
# Configure Next.js to use HTTPS
```

## Browser Compatibility

| Browser | Mobile | Desktop | Notes |
|---------|--------|---------|-------|
| Chrome | ✅ | ✅ | Full support |
| Safari | ✅ | ✅ | Requires user gesture |
| Firefox | ✅ | ✅ | Full support |
| Edge | ✅ | ✅ | Full support |
| Samsung Internet | ✅ | N/A | Full support |

## Troubleshooting

### Camera Not Starting

1. **Check HTTPS**: Ensure you're using HTTPS or localhost
2. **Check Permissions**: Browser may have blocked camera access
3. **Check Device**: Ensure camera is not in use by another app
4. **Try Different Browser**: Some browsers have better camera support

### Scanner Not Detecting QR Code

1. **Lighting**: Ensure good lighting conditions
2. **Distance**: Hold camera 10-30cm from QR code
3. **Focus**: Wait for camera to focus
4. **Quality**: Use high-quality printed or high-resolution QR codes

### Performance Issues

1. **Lower FPS**: Reduce fps in config (currently 10)
2. **Smaller Scan Box**: Reduce qrbox size
3. **Close Other Apps**: Free up device resources

## Future Enhancements

Potential improvements for the QR scanner:

- [ ] Switch between front/back camera
- [ ] Flashlight toggle for low-light conditions
- [ ] Image upload option for scanning from gallery
- [ ] Multiple QR code detection
- [ ] Barcode support (1D codes)
- [ ] Scan history with timestamps
- [ ] Offline scanning capability

## Dependencies

- **html5-qrcode** (v2.3.8): Core scanning library
- **lucide-react**: Icons
- **sonner**: Toast notifications
- **@radix-ui/react-dialog**: Modal component

## Resources

- [html5-qrcode Documentation](https://github.com/mebjas/html5-qrcode)
- [MDN: MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [Camera Permissions Best Practices](https://web.dev/media-capturing-images/)

## Support

For issues or questions:
- Check browser console for detailed error messages
- Ensure camera permissions are granted
- Test with different QR codes and lighting conditions
- Review the troubleshooting section above

---

**Status**: ✅ Implementation Complete
**Last Updated**: January 28, 2026
**Version**: 1.0.0
