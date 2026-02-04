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
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasScannedRef = useRef(false)
  const isOpenRef = useRef(isOpen)
  isOpenRef.current = isOpen

  const cleanupScanner = useCallback(async () => {
    const scanner = scannerRef.current
    if (!scanner) {
      isRunningRef.current = false
      return
    }

    try {
      // Always try stop() when we have a scanner instance (handles SCANNING and edge cases)
      try {
        await scanner.stop()
      } catch (stopErr: unknown) {
        const msg = (stopErr as Error)?.message ?? ''
        if (!msg.includes('already stopped') && !msg.includes('Not started')) {
          console.debug('Scanner stop (ignored):', stopErr)
        }
      }

      // Stop any video tracks so camera is released
      const qrReaderElement = document.getElementById('qr-reader')
      if (qrReaderElement) {
        qrReaderElement.querySelectorAll('video').forEach((video) => {
          try {
            const stream = video.srcObject as MediaStream | null
            stream?.getTracks?.()?.forEach((track) => track.stop())
            video.pause()
            video.srcObject = null
            video.load()
          } catch {
            // ignore
          }
        })
      }

      await new Promise((r) => setTimeout(r, 150))

      try {
        scanner.clear()
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      const e = err as Error
      if (e?.name !== 'AbortError' && !e?.message?.includes('play() request was interrupted')) {
        console.debug('Scanner cleanup:', err)
      }
    } finally {
      scannerRef.current = null
      isRunningRef.current = false
    }
  }, [])

  const initializeScanner = useCallback(async () => {
    if (scannerRef.current) return
    hasScannedRef.current = false

    try {
      setError(null)
      setIsScanning(true)

      // Wait for Dialog portal to mount – give DOM time to have #qr-reader
      await new Promise<void>((resolve, reject) => {
        let attempts = 0
        const maxAttempts = 50 // 5 seconds
        const check = () => {
          if (!isOpenRef.current) {
            reject(new Error('Dialog closed during init'))
            return
          }
          const el = document.getElementById('qr-reader')
          if (el) {
            resolve()
            return
          }
          attempts++
          if (attempts >= maxAttempts) {
            reject(new Error('Scanner container not found. Please try again.'))
            return
          }
          setTimeout(check, 100)
        }
        setTimeout(check, 300) // Initial delay so Dialog content is mounted
      })

      if (!isOpenRef.current || scannerRef.current) return

      const html5QrCode = new Html5Qrcode('qr-reader')
      scannerRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText: string) => {
          if (hasScannedRef.current) return
          hasScannedRef.current = true
          setIsScanning(false)

          html5QrCode
            .stop()
            .then(() => {
              isRunningRef.current = false
              scannerRef.current = null
              onScanSuccess(decodedText)
            })
            .catch(() => {
              isRunningRef.current = false
              scannerRef.current = null
              onScanSuccess(decodedText)
            })
        },
        () => {
          // Per-frame error callback – no-op to avoid spam
        }
      )

      isRunningRef.current = true
    } catch (err: unknown) {
      const e = err as Error
      console.error('QR Scanner init:', e)
      let errorMsg = 'Failed to start camera. Please check permissions.'

      if (e?.name === 'NotAllowedError') {
        errorMsg = 'Camera permission denied. Please allow camera access.'
      } else if (e?.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device.'
      } else if (e?.name === 'NotReadableError') {
        errorMsg = 'Camera is in use by another app.'
      } else if (e?.message?.includes('not found') || e?.message?.includes('Dialog closed')) {
        errorMsg = 'Scanner could not start. Please try again.'
      }

      setError(errorMsg)
      setIsScanning(false)
      scannerRef.current = null
      isRunningRef.current = false
      onScanError?.(errorMsg)
    }
  }, [onScanSuccess, onScanError, isOpen])

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as Error | undefined
      if (
        reason?.name === 'AbortError' ||
        reason?.message?.includes('play() request was interrupted') ||
        reason?.message?.includes('media was removed from the document')
      ) {
        event.preventDefault()
      }
    }
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    if (isOpen) {
      setError(null)
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
        initTimeoutRef.current = null
      }
      if (!isRunningRef.current && !scannerRef.current) {
        initTimeoutRef.current = setTimeout(() => {
          initTimeoutRef.current = null
          if (isOpen && !scannerRef.current) initializeScanner()
        }, 100)
      }
    } else {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
        initTimeoutRef.current = null
      }
      cleanupScanner().catch(() => {})
    }

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
        initTimeoutRef.current = null
      }
      if (scannerRef.current) {
        cleanupScanner().catch(() => {})
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

  const handleRetry = async () => {
    setError(null)
    await cleanupScanner()
    setTimeout(() => {
      if (isOpenRef.current && !scannerRef.current) initializeScanner()
    }, 200)
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
