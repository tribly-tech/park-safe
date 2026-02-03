'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { X, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface QRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess: (decodedText: string) => void
  onScanError?: (error: string) => void
}

export default function QRScanner({
  isOpen,
  onClose,
  onScanSuccess,
  onScanError,
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isRunningRef = useRef(false)

  const cleanupScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        // Check if scanner is actually running before stopping
        const state = scannerRef.current.getState()
        if (state === 2) { // 2 = SCANNING state in Html5Qrcode
          // Stop the scanner first - this stops the video stream
          try {
            await scannerRef.current.stop()
          } catch (stopErr: any) {
            // Suppress stop errors - video might already be stopped
            if (!stopErr?.message?.includes('already stopped')) {
              console.debug('Stop error (ignored):', stopErr)
            }
          }
          
          // Stop any video elements directly
          const qrReaderElement = document.getElementById('qr-reader')
          if (qrReaderElement) {
            const videoElements = qrReaderElement.querySelectorAll('video')
            videoElements.forEach((video) => {
              try {
                video.pause()
                video.srcObject = null
                video.load()
              } catch (e) {
                // Ignore errors when stopping video
              }
            })
          }
          
          // Small delay to ensure video stream is fully stopped
          await new Promise(resolve => setTimeout(resolve, 200))
        }
        
        // Clear the scanner
        try {
          scannerRef.current.clear()
        } catch (clearErr) {
          // Ignore clear errors
          console.debug('Clear error (ignored):', clearErr)
        }
      } catch (err: any) {
        // Suppress play() interruption errors - these are expected when closing
        if (err?.name !== 'AbortError' && !err?.message?.includes('play() request was interrupted')) {
          console.debug('Scanner cleanup:', err)
        }
      } finally {
        scannerRef.current = null
        isRunningRef.current = false
      }
    }
  }, [])

  const initializeScanner = useCallback(async () => {
    try {
      setError(null)
      setIsScanning(true)

      // Wait for DOM element to be available
      const checkElement = () => {
        return new Promise<void>((resolve, reject) => {
          let attempts = 0
          const maxAttempts = 20 // 2 seconds max wait
          
          const interval = setInterval(() => {
            const element = document.getElementById('qr-reader')
            if (element) {
              clearInterval(interval)
              resolve()
            } else if (attempts >= maxAttempts) {
              clearInterval(interval)
              reject(new Error('HTML Element with id=qr-reader not found'))
            }
            attempts++
          }, 100)
        })
      }

      await checkElement()
      
      const html5QrCode = new Html5Qrcode('qr-reader')
      scannerRef.current = html5QrCode

      // Request camera permissions and start scanning
      await html5QrCode.start(
        { facingMode: 'environment' }, // Use back camera on mobile
        {
          fps: 10, // Frames per second for scanning
          qrbox: { width: 250, height: 250 }, // Scanning area
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Success callback - immediately call onScanSuccess and close
          setIsScanning(false)
          
          // Stop scanning
          html5QrCode
            .stop()
            .then(() => {
              isRunningRef.current = false
              onScanSuccess(decodedText)
            })
            .catch((err) => {
              console.error('Error stopping scanner:', err)
              isRunningRef.current = false
              onScanSuccess(decodedText)
            })
        },
        () => {
          // Error callback - called frequently for scanning errors
          // Intentionally empty to avoid console spam
        }
      )
      
      // Only set to running after start() succeeds
      isRunningRef.current = true
    } catch (err: any) {
      console.error('Scanner initialization error:', err)
      let errorMsg = 'Failed to start camera. Please check permissions.'
      
      if (err.name === 'NotAllowedError') {
        errorMsg = 'Camera permission denied. Please allow camera access.'
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device.'
      } else if (err.name === 'NotReadableError') {
        errorMsg = 'Camera is already in use by another application.'
      } else if (err.message && err.message.includes('qr-reader not found')) {
        errorMsg = 'Scanner failed to load. Please try again.'
      }
      
      setError(errorMsg)
      setIsScanning(false)
      isRunningRef.current = false
      
      if (onScanError) {
        onScanError(errorMsg)
      }
    }
  }, [onScanSuccess, onScanError])

  useEffect(() => {
    // Suppress play() interruption errors globally for this component
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      if (
        reason?.name === 'AbortError' ||
        reason?.message?.includes('play() request was interrupted') ||
        reason?.message?.includes('media was removed from the document') ||
        reason?.message?.includes('The play() request was interrupted')
      ) {
        event.preventDefault()
        // Silently handle - this is expected when closing scanner
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    if (isOpen && !isRunningRef.current) {
      // Reset state when opening
      setError(null)
      setIsScanning(false)
      initializeScanner()
    }

    if (!isOpen && isRunningRef.current) {
      // Cleanup when dialog closes
      cleanupScanner().catch(() => {
        // Ignore cleanup errors
      })
    }

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      // Cleanup on unmount
      if (scannerRef.current) {
        cleanupScanner().catch(() => {
          // Ignore errors during unmount cleanup
        })
      }
    }
  }, [isOpen, initializeScanner, cleanupScanner])

  const handleClose = async () => {
    // Stop scanning state immediately to prevent new operations
    setIsScanning(false)
    setError(null)
    
    // Ensure scanner is stopped before closing
    try {
      await cleanupScanner()
      
      // Additional delay to ensure video cleanup completes and DOM updates
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (err) {
      // Even if cleanup fails, proceed to close
      console.debug('Cleanup error during close (ignored):', err)
    }
    
    // Now close the dialog
    onClose()
  }

  const handleRetry = () => {
    setError(null)
    cleanupScanner()
    setTimeout(() => {
      initializeScanner()
    }, 100)
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogContent 
        className="w-screen h-screen max-w-none p-0 m-0 bg-black border-0 rounded-none"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Scan QR Code</DialogTitle>
        
        {/* Close Button - Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-50 size-12 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 flex items-center justify-center transition-all"
        >
          <X className="size-12 text-white" />
        </button>

        {/* QR Reader Container - Full Screen */}
        <div
          id="qr-reader"
          className="absolute inset-0 w-full h-full"
        />

        {/* Scanning Overlay */}
        {isScanning && !error && (
          <>
            {/* Title */}
            <div className="absolute top-6 left-6 right-20 z-40">
              <h2 className="text-white text-xl font-semibold">Scan QR Code</h2>
              <p className="text-white/60 text-sm mt-1">Position the code within the frame</p>
            </div>

            {/* Scanning Frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div className="relative w-72 h-72">
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#1bb658] rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#1bb658] rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#1bb658] rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#1bb658] rounded-br-lg" />
                
                {/* Scanning Line Animation */}
                <div className="absolute inset-x-0 top-0 h-1 bg-[#1bb658] animate-scan-line" />
              </div>
            </div>

            {/* Bottom Instruction */}
            <div className="absolute bottom-20 left-0 right-0 z-40 flex justify-center">
              <div className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="text-white/90 text-sm">Hold steady for automatic scan</p>
              </div>
            </div>
          </>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6 z-40">
            <div className="flex flex-col items-center gap-6 max-w-sm">
              <div className="size-20 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="size-10 text-red-500" />
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-2">
                  Camera Error
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {error}
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleRetry}
                  className="px-8 py-3 rounded-full bg-[#1bb658] text-white font-medium hover:bg-[#16a34a] transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
