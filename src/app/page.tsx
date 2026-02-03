'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { 
  ChevronRight, 
  ChevronLeft,
  UserCircle, 
  QrCode, 
  ScanLine, 
  ShieldCheck, 
  ToggleLeft,
  Youtube,
  LogIn,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  Settings,
  Mail,
  Edit3,
  X as XIcon,
  Zap,
  Heart,
  Gift,
} from 'lucide-react'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import QRScanner from '@/components/QRScanner'
import { toast } from 'sonner'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Banner images - max 3 banners
const banners = [
  {
    id: 1,
    image: '/banner-1.png',
    alt: 'Sale - Special promotional offer with shopping bags',
  },
  {
    id: 2,
    image: '/banner-2.png',
    alt: 'Black Friday Sale - 30% off promotional banner',
  },
  {
    id: 3,
    image: 'https://www.figma.com/api/mcp/asset/ede30a57-196d-4c58-8333-5fc6eccfba16',
    alt: 'Park Safe - Anonymous vehicle communication via QR code',
  },
]

const faqItems = [
  {
    question: 'How does Park Safe protect my privacy?',
    answer: 'Your phone number is never shared. All communication happens through our system, keeping both parties anonymous until you choose otherwise.'
  },
  {
    question: 'Do I need to install an app to contact a vehicle owner?',
    answer: 'No! Just scan the QR code and you can instantly send a message or initiate a call without any app installation.'
  },
  {
    question: 'What happens when someone scans my QR code?',
    answer: 'You\'ll receive a notification via your preferred method (SMS, call, or app notification) with the issue details. You stay in control.'
  },
  {
    question: 'Can I deactivate my QR code temporarily?',
    answer: 'Yes! You can activate or deactivate your QR code anytime from your profile dashboard.'
  },
  {
    question: 'Is this service free to use?',
    answer: 'Basic features are free. Premium features include call masking and advanced notification options.'
  },
]

export default function Home() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn, removeIsLoggedIn] = useLocalStorage<boolean>(STORAGE_KEYS.USER, false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [hasRegisteredVehicle, setHasRegisteredVehicle] = useState(false)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  // Check for query parameters on mount (for backward compatibility and initial login)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('drawer') === 'open') {
      setIsDrawerOpen(true)
    }
    if (params.get('loggedIn') === 'true') {
      setIsLoggedIn(true)
      // By default, new users don't have a registered vehicle
      setHasRegisteredVehicle(false)
    }
    // Clean up URL
    if (params.has('drawer') || params.has('loggedIn')) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [setIsLoggedIn])

  // Auto-play banner carousel
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
    }, 5000) // Change banner every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const goToBanner = (index: number) => {
    setCurrentBannerIndex(index)
  }

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const handleLogin = () => {
    setIsDrawerOpen(false)
    window.location.href = ROUTES.LOGIN
  }

  const handleLogout = () => {
    removeIsLoggedIn()
    setIsLoggedIn(false)
    setIsDrawerOpen(false)
    toast.success('Signed out successfully', {
      description: 'You have been logged out of your account',
      duration: 3000,
    })
  }

  const handleSupport = () => {
    setIsDrawerOpen(false)
    window.location.href = ROUTES.SUPPORT
  }

  const handleTerms = () => {
    setIsDrawerOpen(false)
  }

  const handlePolicies = () => {
    setIsDrawerOpen(false)
  }

  const handleOpenScanner = () => {
    setIsScannerOpen(true)
  }

  const handleScanSuccess = (decodedText: string) => {
    setIsScannerOpen(false)
    
    // Check if the decoded text is a valid URL
    try {
      const url = new URL(decodedText)
      // If it's a valid URL, navigate to it
      window.location.href = url.href
    } catch {
      // If it's not a valid URL, treat it as relative path or show error
      if (decodedText.startsWith('/')) {
        // Relative path - navigate within the app
        window.location.href = decodedText
      } else {
        // Not a URL, show the data and let user decide
        toast.info('QR Code Scanned', {
          description: decodedText,
          duration: 5000,
        })
      }
    }
  }

  const handleScanError = (error: string) => {
    toast.error('Scanning Failed', {
      description: error,
      duration: 5000,
    })
  }

  const handleRegisterVehicle = () => {
    setIsDrawerOpen(false)
    // TODO: Navigate to vehicle registration page
    // For now, just show a toast
    toast.success('Opening vehicle registration', {
      description: 'Complete your profile to get your QR code',
      duration: 3000,
    })
  }

  return (
    <div className="relative min-h-screen w-full max-w-[440px] mx-auto bg-white overflow-x-hidden">
      {/* Navigation Bar */}
      <div className="absolute left-0 top-0 w-full z-40 flex items-center justify-center overflow-clip p-6">
        <div className="bg-white border border-[#1bb658] flex flex-1 items-center justify-between min-h-px min-w-px overflow-clip px-6 py-4 rounded-[99px] shadow-[0px_4px_0px_0px_#1bb658]">
          <div className="flex items-center justify-center px-4">
            <p className="font-medium text-[40px] text-[#1bb658] tracking-[-0.8px] leading-[1.2]">
              park safe
            </p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="overflow-clip shrink-0 size-[40px] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <UserCircle className="size-[40px] text-[#1bb658]" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-10 items-start px-6 pt-[152px]">
        {/* Alert Section */}
        <div className="h-[56px] relative w-full">
          <div className="absolute bg-[#fffbeb] border border-[#d97706] h-[56px] left-0 shadow-[0px_4px_0px_0px_#d97706] top-0 w-full" />
          <p className="absolute font-normal leading-[1.4] left-4 text-[#b45309] text-[16px] top-[18px] tracking-[-0.32px]">
            🚨 New: Anonymous calling now available!
          </p>
        </div>

        {/* Banner Section */}
        <div className="flex flex-col gap-4 items-center w-full relative">
          <div className="h-[146px] relative shadow-[0px_4px_0px_0px_#969696] w-full rounded-2xl overflow-hidden group">
            {/* Banner Images Container */}
            <div className="relative w-full h-full">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={banner.image}
                    alt={banner.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevBanner}
                  className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Previous banner"
                >
                  <ChevronLeft className="size-5 text-white" />
                </button>
                <button
                  onClick={nextBanner}
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Next banner"
                >
                  <ChevronRight className="size-5 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Banner Indicators */}
          {banners.length > 1 && (
            <div className="flex gap-1.5 items-center">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToBanner(index)}
                  className={`h-2 rounded-[8px] transition-all duration-300 ${
                    index === currentBannerIndex
                      ? 'bg-[#1bb658] w-6'
                      : 'bg-[#e2e8f0] w-2 hover:bg-[#cbd5e1]'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="flex gap-4 items-stretch w-full">
          <button
            onClick={handleOpenScanner}
            className="bg-white flex flex-1 flex-col gap-4 items-start min-w-px p-6 rounded-[24px] border border-[#1bb658] shadow-[0px_6px_0px_0px_#1bb658] transition-all duration-200 cursor-pointer group hover:shadow-[0px_8px_0px_0px_#1bb658] hover:-translate-y-0.5 active:shadow-[0px_4px_0px_0px_#1bb658] active:translate-y-0.5"
          >
            <div className="relative shrink-0 size-14 flex items-center justify-center bg-[#f0fdf4] rounded-2xl p-3 group-hover:bg-[#dcfce7] transition-colors">
              <QrCode className="size-6 text-[#1bb658]" />
            </div>
            <div className="flex flex-col gap-1 items-start leading-[1.4] w-full">
              <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px] w-full text-left">
                Register park safe QR
              </p>
              <p className="font-normal text-[#6b7280] text-[13px] tracking-[-0.26px] w-full leading-[1.5] text-left">
                Get your free QR code in 2 minutes
              </p>
            </div>
          </button>
          <div className="bg-white flex flex-1 flex-col gap-4 items-start min-w-px p-6 rounded-[24px] border border-[#dc2626] shadow-[0px_6px_0px_0px_#dc2626] transition-all duration-200 cursor-pointer group">
            <div className="relative shrink-0 size-14 flex items-center justify-center bg-[#fef2f2] rounded-2xl p-3 group-hover:bg-[#fee2e2] transition-colors">
              <Youtube className="size-6 text-[#dc2626]" />
            </div>
            <div className="flex flex-col gap-1 items-start leading-[1.4] w-full">
              <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px] w-full">
                View how it works
              </p>
              <p className="font-normal text-[#6b7280] text-[13px] tracking-[-0.26px] w-full leading-[1.5]">
                2-min demo video
              </p>
            </div>
          </div>
        </div>

        {/* Hero Description */}
        <div className="flex flex-col gap-3 items-start w-full mt-20">
          <h1 className="font-bold text-[28px] text-black tracking-[-0.56px] leading-[1.3]">
            Vehicle Blocking You?
          </h1>
          <p className="font-normal text-[16px] text-[#64748b] tracking-[-0.32px] leading-[1.6]">
            Scan the QR code on any vehicle to instantly message or call the owner—anonymously, 
            safely, and without sharing your number. No app needed.
          </p>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="flex flex-col gap-6 items-start px-6 py-10 bg-[#f8fafb] mt-10">
        <h2 className="font-bold text-[24px] text-black tracking-[-0.48px] leading-[1.3]">
          Common Situations
        </h2>
        <div className="flex flex-col gap-3 items-start w-full">
          <div className="flex gap-3 items-start">
            <div className="shrink-0 w-2 h-2 bg-[#1bb658] rounded-full mt-2" />
            <p className="font-normal text-[15px] text-[#475569] leading-[1.6]">
              <span className="font-semibold text-black">Car blocking your driveway?</span> Reach the owner instantly without confrontation.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="shrink-0 w-2 h-2 bg-[#1bb658] rounded-full mt-2" />
            <p className="font-normal text-[15px] text-[#475569] leading-[1.6]">
              <span className="font-semibold text-black">Double-parked vehicle?</span> Send a quick message to resolve it peacefully.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="shrink-0 w-2 h-2 bg-[#1bb658] rounded-full mt-2" />
            <p className="font-normal text-[15px] text-[#475569] leading-[1.6]">
              <span className="font-semibold text-black">Headlights left on?</span> Help a stranger avoid a dead battery.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="shrink-0 w-2 h-2 bg-[#1bb658] rounded-full mt-2" />
            <p className="font-normal text-[15px] text-[#475569] leading-[1.6]">
              <span className="font-semibold text-black">Minor scratch or damage?</span> Leave your contact info safely.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="flex flex-col gap-10 items-center justify-center py-10 px-6">
        <h2 className="font-bold text-[24px] text-black tracking-[-0.48px] leading-[1.3] text-center">
          How It Works
        </h2>
        <div className="flex flex-col gap-6 items-start w-full max-w-[392px]">
          <div className="flex gap-4 items-start w-full">
            <div className="shrink-0 bg-[#1bb658] text-white font-bold text-[20px] w-10 h-10 rounded-full flex items-center justify-center">
              1
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-[16px] text-black">Register Your Vehicle</p>
              <p className="font-normal text-[14px] text-[#64748b] leading-[1.5]">
                Add your vehicle details and get a unique QR code
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start w-full">
            <div className="shrink-0 bg-[#1bb658] text-white font-bold text-[20px] w-10 h-10 rounded-full flex items-center justify-center">
              2
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-[16px] text-black">Place QR on Dashboard</p>
              <p className="font-normal text-[14px] text-[#64748b] leading-[1.5]">
                Print and display it where it's easily visible
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start w-full">
            <div className="shrink-0 bg-[#1bb658] text-white font-bold text-[20px] w-10 h-10 rounded-full flex items-center justify-center">
              3
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-[16px] text-black">Get Notified Instantly</p>
              <p className="font-normal text-[14px] text-[#64748b] leading-[1.5]">
                Receive messages or calls when someone needs to reach you
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="flex flex-col gap-8 items-center justify-center py-12 mt-10 px-6 w-full bg-gradient-to-b from-white via-[#fafafa] to-white">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="size-16 flex items-center justify-center bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 rounded-2xl mb-2">
            <ShieldCheck className="size-8 text-[#1bb658]" />
          </div>
          <div className="flex flex-col justify-center text-[28px] text-black text-center">
            <p>
              <span className="font-bold tracking-[-0.56px]">Advantages of </span>
              <span className="font-bold tracking-[-0.56px] text-[#1bb658]">safe park</span>
            </p>
          </div>
          <p className="font-normal text-[15px] text-[#6b7280] text-center max-w-[320px] leading-[1.6]">
            Why thousands trust Park Safe for anonymous vehicle communication
          </p>
        </div>

        {/* Advantages Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-[520px] min-w-0">
          <div className="group bg-white border-[0.5px] border-[#e5e7eb] rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#1bb658]/30 transition-all duration-200 w-full min-w-0">
            <div className="flex flex-col gap-3 items-start">
              <div className="shrink-0 size-10 flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-lg border border-[#1bb658]/20 group-hover:from-[#dcfce7] group-hover:to-[#bbf7d0] transition-all">
                <ShieldCheck className="size-5 text-[#1bb658]" />
              </div>
              <div className="flex flex-col gap-1.5 items-start">
                <p className="font-semibold text-[17px] text-[#111827] tracking-[-0.34px]">
                  100% Privacy Protected
                </p>
                <p className="font-normal text-[14px] text-[#6b7280] leading-[1.5]">
                  Phone numbers never exposed. Your identity stays completely anonymous.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white border-[0.5px] border-[#e5e7eb] rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#1bb658]/30 transition-all duration-200 w-full min-w-0">
            <div className="flex flex-col gap-3 items-start">
              <div className="shrink-0 size-10 flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-lg border border-[#1bb658]/20 group-hover:from-[#dcfce7] group-hover:to-[#bbf7d0] transition-all">
                <ScanLine className="size-5 text-[#1bb658]" />
              </div>
              <div className="flex flex-col gap-1.5 items-start">
                <p className="font-semibold text-[17px] text-[#111827] tracking-[-0.34px]">
                  No App Required
                </p>
                <p className="font-normal text-[14px] text-[#6b7280] leading-[1.5]">
                  Scan and contact instantly. Works directly from your phone's camera.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white border-[0.5px] border-[#e5e7eb] rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#1bb658]/30 transition-all duration-200 w-full min-w-0">
            <div className="flex flex-col gap-3 items-start">
              <div className="shrink-0 size-10 flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-lg border border-[#1bb658]/20 group-hover:from-[#dcfce7] group-hover:to-[#bbf7d0] transition-all">
                <Zap className="size-5 text-[#1bb658]" />
              </div>
              <div className="flex flex-col gap-1.5 items-start">
                <p className="font-semibold text-[17px] text-[#111827] tracking-[-0.34px]">
                  Instant Resolution
                </p>
                <p className="font-normal text-[14px] text-[#6b7280] leading-[1.5]">
                  Get issues resolved in seconds. No waiting, no delays, just quick action.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white border-[0.5px] border-[#e5e7eb] rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#1bb658]/30 transition-all duration-200 w-full min-w-0">
            <div className="flex flex-col gap-3 items-start">
              <div className="shrink-0 size-10 flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-lg border border-[#1bb658]/20 group-hover:from-[#dcfce7] group-hover:to-[#bbf7d0] transition-all">
                <Heart className="size-5 text-[#1bb658]" />
              </div>
              <div className="flex flex-col gap-1.5 items-start">
                <p className="font-semibold text-[17px] text-[#111827] tracking-[-0.34px]">
                  Prevents Conflicts
                </p>
                <p className="font-normal text-[14px] text-[#6b7280] leading-[1.5]">
                  Avoid awkward confrontations. Resolve issues peacefully and anonymously.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white border-[0.5px] border-[#e5e7eb] rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#1bb658]/30 transition-all duration-200 w-full min-w-0">
            <div className="flex flex-col gap-3 items-start">
              <div className="shrink-0 size-10 flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-lg border border-[#1bb658]/20 group-hover:from-[#dcfce7] group-hover:to-[#bbf7d0] transition-all">
                <Gift className="size-5 text-[#1bb658]" />
              </div>
              <div className="flex flex-col gap-1.5 items-start">
                <p className="font-semibold text-[17px] text-[#111827] tracking-[-0.34px]">
                  One-Time Setup, Lifetime Free
                </p>
                <p className="font-normal text-[14px] text-[#6b7280] leading-[1.5]">
                  Register once and use forever. No subscription fees, no hidden costs.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white border-[0.5px] border-[#e5e7eb] rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#1bb658]/30 transition-all duration-200 w-full min-w-0">
            <div className="flex flex-col gap-3 items-start">
              <div className="shrink-0 size-10 flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-lg border border-[#1bb658]/20 group-hover:from-[#dcfce7] group-hover:to-[#bbf7d0] transition-all">
                <ToggleLeft className="size-5 text-[#1bb658]" />
              </div>
              <div className="flex flex-col gap-1.5 items-start">
                <p className="font-semibold text-[17px] text-[#111827] tracking-[-0.34px]">
                  Full Control
                </p>
                <p className="font-normal text-[14px] text-[#6b7280] leading-[1.5]">
                  Activate or deactivate your QR code anytime from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-b from-white from-[32.232%] to-[#f1fff7] to-[129.26%] flex flex-col gap-10 items-center justify-center py-20 px-6 w-full">
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col justify-center leading-[0] text-[24px] text-black text-center whitespace-nowrap">
              <p className="font-bold leading-[60px]">Frequently asked questions</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start w-full max-w-[392px]">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border-[#1bb658] border-b flex flex-col items-start w-full"
            >
              <div className="w-full">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="bg-clip-padding border-0 border-transparent flex items-center justify-between py-6 w-full text-left"
                >
                  <div className="flex flex-col justify-center leading-[0] text-[16px] text-black flex-1 pr-4">
                    <p className="font-normal leading-[28px] whitespace-pre-wrap">{item.question}</p>
                  </div>
                  <div className="flex items-center justify-center shrink-0 size-6">
                    <div className={`transition-transform ${expandedFaq === index ? 'rotate-90' : 'rotate-0'}`}>
                      <ChevronRight className="size-6 text-black" />
                    </div>
                  </div>
                </button>
                {expandedFaq === index && (
                  <div className="pb-6 px-0">
                    <p className="font-normal text-[14px] text-[#64748b] leading-[1.6]">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#f1fff7] flex flex-col items-center justify-center py-10 pb-[140px] w-full">
        <div className="relative shrink-0 size-12 flex items-center justify-center">
          <ShieldCheck className="size-12 text-[#1bb658]" />
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col h-[119px] justify-center text-[#d4edde] text-[64px] w-full items-center">
              <p className="font-bold leading-[1.4] whitespace-pre-wrap text-center">safe park</p>
            </div>
            <div className="flex flex-col justify-center text-[#1bb658] text-[14px] mt-2 w-full items-center">
              <p className="font-medium leading-[20px] text-center">Connect. Resolve. Move on.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center max-w-[1280px] px-6 w-full">
          <div className="border-[#f1fff7] border-t flex items-center pt-[33px]">
            <div className="bg-clip-padding border-0 border-transparent flex flex-col items-center justify-center">
              <div className="flex flex-col justify-center leading-[0] text-[#d4edde] text-[14px] text-center w-full">
                <p className="font-medium leading-[20px] whitespace-pre-wrap">
                  © 2025, tribly tech pvt ltd.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scan QR Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 backdrop-blur-[5px] bg-gradient-to-t from-white/80 via-white/60 to-white/40 h-[110px] w-[440px] flex items-start justify-center pt-4 z-50 border-t border-white/30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleOpenScanner}
          className="bg-white border-[#1bb658] border-[0.75px] flex gap-3 h-[54px] items-center justify-center px-[18px] py-3 rounded-[74.25px] shadow-[0px_3px_0px_0px_#1bb658] hover:shadow-[0px_5px_0px_0px_#1bb658] hover:-translate-y-0.5 active:shadow-[0px_2px_0px_0px_#1bb658] active:translate-y-0.5 transition-all duration-200"
        >
          <QrCode className="size-[18px] text-[#1bb658]" />
          <div className="flex flex-col justify-center leading-[0] text-[#1bb658] text-[15px] whitespace-nowrap">
            <p className="font-medium leading-[19.5px]">Scan QR</p>
          </div>
        </button>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
      />

      {/* Profile Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="!w-full max-w-[440px] p-0 flex flex-col bg-gradient-to-b from-white to-[#fafafa] overflow-hidden" showCloseButton={false}>
          <SheetHeader className="sr-only">
            <SheetTitle>
              {isLoggedIn ? 'Account Menu' : 'Welcome to Park Safe'}
            </SheetTitle>
          </SheetHeader>
          
          {/* Sticky Close Button */}
          <div className="sticky top-0 z-10 flex justify-end p-4 bg-gradient-to-b from-white via-white/95 to-transparent backdrop-blur-sm">
            <SheetPrimitive.Close className="group shrink-0 size-10 flex items-center justify-center rounded-full bg-white border border-[#e5e7eb] hover:border-[#dc2626] hover:bg-[#fef2f2] transition-all duration-200 active:scale-95 focus:outline-hidden shadow-sm">
              <XIcon className="size-5 text-[#6b7280] group-hover:text-[#dc2626] transition-colors" />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Header Section with Gradient */}
            <div className="px-6 pt-4 pb-8 bg-gradient-to-br from-[#1bb658]/5 via-white to-white">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="size-20 rounded-3xl bg-gradient-to-br from-[#1bb658] to-[#16a34a] flex items-center justify-center shadow-lg shadow-[#1bb658]/20">
                    <UserCircle className="size-12 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-white border-2 border-white flex items-center justify-center">
                    <div className="size-3 rounded-full bg-[#1bb658]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[20px] text-[#111827] tracking-[-0.4px] truncate">
                    {hasRegisteredVehicle ? 'John Doe' : 'Hey guest'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="px-2.5 py-1 rounded-full bg-[#dcfce7]">
                      <p className="font-medium text-[11px] text-[#16a34a] uppercase tracking-wide">
                        Active
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href={ROUTES.PROFILE}
                  onClick={() => setIsDrawerOpen(false)}
                  className="shrink-0 size-10 flex items-center justify-center rounded-full bg-white border border-[#e5e7eb] hover:border-[#1bb658] hover:bg-[#f1fff7] transition-all duration-200 active:scale-95"
                >
                  <Edit3 className="size-4 text-[#1bb658]" />
                </Link>
              </div>
            ) : (
              <div>
                <div className="size-16 rounded-2xl bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 flex items-center justify-center mb-4">
                  <UserCircle className="size-8 text-[#1bb658]" />
                </div>
                <h2 className="font-bold text-[24px] text-[#111827] tracking-[-0.48px] mb-2">
                  Welcome to Park Safe
                </h2>
                <p className="font-normal text-[15px] text-[#6b7280] leading-[1.6]">
                  Sign in to manage your QR codes and vehicle settings
                </p>
              </div>
            )}
          </div>

              {/* Menu Items */}
              <div className="px-6 py-6">
                <div className="flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  {/* Registration Card for Guest Users */}
                  {!hasRegisteredVehicle && (
                    <div className="mb-6">
                      <div className="bg-gradient-to-br from-[#f0fdf4] to-white border border-[#1bb658] rounded-[24px] p-6 shadow-[0px_4px_0px_0px_#1bb658]">
                        <div className="flex flex-col gap-4 items-center text-center">
                          <div className="relative shrink-0 size-16 flex items-center justify-center bg-white rounded-2xl shadow-sm">
                            <QrCode className="size-8 text-[#1bb658]" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="font-bold text-[18px] text-[#111827] tracking-[-0.36px]">
                              Register park safe QR
                            </p>
                            <p className="font-normal text-[14px] text-[#6b7280] leading-[1.5]">
                              Get your free QR code in 2 minutes
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions Section */}
                  <div className="mb-4">
                    <p className="font-semibold text-[12px] text-[#9ca3af] uppercase tracking-wider mb-3 px-1">
                      Quick Actions
                    </p>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={ROUTES.SETTINGS}
                        onClick={() => setIsDrawerOpen(false)}
                        className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.98]"
                      >
                        <div className="shrink-0 size-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 group-hover:from-[#1bb658]/20 group-hover:to-[#16a34a]/10 transition-all">
                          <Settings className="size-5 text-[#1bb658]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px]">
                            Settings
                          </p>
                          <p className="font-normal text-[13px] text-[#6b7280] mt-0.5 truncate">
                            App preferences
                          </p>
                        </div>
                        <ChevronRight className="size-4 text-[#d1d5db] group-hover:text-[#1bb658] transition-colors" />
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="group relative w-full flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#1bb658] to-[#16a34a] text-white hover:shadow-xl hover:shadow-[#1bb658]/25 transition-all duration-200 active:scale-[0.98] mb-4"
                >
                  <div className="shrink-0 size-12 flex items-center justify-center bg-white/20 rounded-xl group-hover:bg-white/30 transition-all">
                    <LogIn className="size-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-[17px] tracking-[-0.34px]">
                      Sign In
                    </p>
                    <p className="font-normal text-[13px] text-white/90 mt-0.5">
                      Access your account
                    </p>
                  </div>
                  <ChevronRight className="size-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              )}

              {/* Support Section */}
              <div className="mb-4">
                <p className="font-semibold text-[12px] text-[#9ca3af] uppercase tracking-wider mb-3 px-1 text-left">
                  Support
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleSupport}
                    className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.98] text-left"
                  >
                    <div className="shrink-0 size-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 group-hover:from-[#1bb658]/20 group-hover:to-[#16a34a]/10 transition-all">
                      <HelpCircle className="size-5 text-[#1bb658]" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px] text-left">
                        Help & Contact
                      </p>
                      <p className="font-normal text-[13px] text-[#6b7280] mt-0.5 text-left">
                        Get help and contact support
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-[#d1d5db] group-hover:text-[#1bb658] transition-colors shrink-0" />
                  </button>
                </div>
              </div>

              {/* Legal Section */}
              <div>
                <p className="font-semibold text-[12px] text-[#9ca3af] uppercase tracking-wider mb-3 px-1 text-left">
                  Legal
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleTerms}
                    className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.98] text-left"
                  >
                    <div className="shrink-0 size-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 group-hover:from-[#1bb658]/20 group-hover:to-[#16a34a]/10 transition-all">
                      <FileText className="size-5 text-[#1bb658]" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px] text-left">
                        Terms of Service
                      </p>
                      <p className="font-normal text-[13px] text-[#6b7280] mt-0.5 text-left">
                        Read our terms and conditions
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-[#d1d5db] group-hover:text-[#1bb658] transition-colors shrink-0" />
                  </button>

                  <button
                    onClick={handlePolicies}
                    className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.98] text-left"
                  >
                    <div className="shrink-0 size-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 group-hover:from-[#1bb658]/20 group-hover:to-[#16a34a]/10 transition-all">
                      <Shield className="size-5 text-[#1bb658]" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px] text-left">
                        Privacy Policy
                      </p>
                      <p className="font-normal text-[13px] text-[#6b7280] mt-0.5 text-left">
                        How we protect your data
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-[#d1d5db] group-hover:text-[#1bb658] transition-colors shrink-0" />
                  </button>
                </div>
              </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="px-6 py-5 border-t border-[#e5e7eb] bg-white/50 backdrop-blur-sm">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded bg-gradient-to-r from-[#f3f4f6] to-[#e5e7eb] hover:from-[#e5e7eb] hover:to-[#d1d5db] active:scale-[0.98] transition-all duration-200 group border border-[#e5e7eb]"
                  >
                    <LogOut className="size-5 text-[#6b7280] group-hover:scale-110 transition-transform" />
                    <p className="font-semibold text-[16px] text-[#6b7280] tracking-[-0.32px]">
                      Sign Out
                    </p>
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="font-normal text-[12px] text-[#9ca3af]">
                      Park Safe v1.0.0
                    </p>
                  </div>
                )}
                {isLoggedIn && (
                  <p className="text-center font-normal text-[11px] text-[#d1d5db] mt-2">
                    Park Safe v1.0.0
                  </p>
                )}
              </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
