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
  Mail,
  Zap,
  Heart,
  Gift,
  ClipboardList,
  LayoutDashboard,
  Bell,
  ImagePlus,
  Tag,
  ShoppingCart,
} from 'lucide-react'
import Link from 'next/link'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import QRScanner from '@/components/QRScanner'
import { toast } from 'sonner'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Common situations section – uses same images as hero carousel (public/images/)
const commonSituationImages = [
  { src: '/images/common-situation-1.png', alt: 'Car blocking your driveway' },
  { src: '/images/common-situation-2.png', alt: 'Double-parked vehicle on busy street' },
  { src: '/images/common-situation-3.png', alt: 'Headlights left on in parking garage' },
  { src: '/images/common-situation-4.png', alt: 'Reserved spot taken' },
]

// Hero problem images carousel – images in public/images/
const problemImages = [
  { id: 1, image: '/images/problem-car-blocking.png', alt: 'Car blocking your spot' },
  { id: 2, image: '/images/problem-double-parked.png', alt: 'Double-parked vehicle' },
  { id: 3, image: '/images/problem-no-contact.png', alt: 'No way to reach the owner' },
  { id: 4, image: '/images/problem-stuck-waiting.png', alt: 'Stuck waiting' },
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
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>(STORAGE_KEYS.USER, false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [heroProblemIndex, setHeroProblemIndex] = useState(0)

  // Check for query parameters on mount (for backward compatibility and initial login)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('drawer') === 'open') {
      window.location.href = ROUTES.PROFILE
      return
    }
    if (params.get('loggedIn') === 'true') {
      setIsLoggedIn(true)
    }
    // Clean up URL
    if (params.has('drawer') || params.has('loggedIn')) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [setIsLoggedIn])

  // Auto-play hero problem images carousel
  useEffect(() => {
    if (problemImages.length <= 1) return
    const interval = setInterval(() => {
      setHeroProblemIndex((prev) => (prev + 1) % problemImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const goToHeroProblem = (index: number) => setHeroProblemIndex(index)
  const nextHeroProblem = () => setHeroProblemIndex((prev) => (prev + 1) % problemImages.length)
  const prevHeroProblem = () => setHeroProblemIndex((prev) => (prev - 1 + problemImages.length) % problemImages.length)

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

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-[#f8fffb] to-[#f1fff7]">
      {/* Navigation Bar - sticky, glass/blur, glossy */}
      <header className="sticky top-0 z-50 w-full shrink-0 bg-white/50 backdrop-blur-md supports-[backdrop-filter]:bg-white/40">
        <div className="mx-auto flex w-full max-w-[330px] md:max-w-2xl lg:max-w-4xl items-center justify-center overflow-clip p-3 md:p-4">
          <div className="w-full bg-white/70 backdrop-blur-2xl border border-[#1bb658]/40 flex flex-1 items-center justify-between min-h-px min-w-px overflow-clip px-4 md:px-5 py-3 md:py-3.5 rounded-[99px] shadow-[0px_4px_0px_0px_rgba(27,182,88,0.4),inset_0_1px_0_0_rgba(255,255,255,0.8)] ring-1 ring-white/60">
            <Link href="/" className="flex items-center justify-center px-2 md:px-4">
              <p className="font-medium text-[28px] md:text-[36px] lg:text-[40px] text-[#1bb658] tracking-[-0.8px] leading-[1.2]">
                park safe
              </p>
            </Link>
            {/* Desktop nav links - hidden on mobile */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <a href="#how-it-works" className="px-3 py-2 rounded-xl text-[14px] font-medium text-[#475569] hover:text-[#1bb658] hover:bg-[#f0fdf4] transition-colors">
                How it works
              </a>
              <a href="#advantages" className="px-3 py-2 rounded-xl text-[14px] font-medium text-[#475569] hover:text-[#1bb658] hover:bg-[#f0fdf4] transition-colors">
                Advantages
              </a>
              <a href="#faq" className="px-3 py-2 rounded-xl text-[14px] font-medium text-[#475569] hover:text-[#1bb658] hover:bg-[#f0fdf4] transition-colors">
                FAQ
              </a>
              <Link href={ROUTES.SUPPORT} className="px-3 py-2 rounded-xl text-[14px] font-medium text-[#475569] hover:text-[#1bb658] hover:bg-[#f0fdf4] transition-colors">
                Support
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href={ROUTES.PROFILE}
                className="overflow-clip shrink-0 size-9 md:size-10 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity rounded-full hover:bg-[#f0fdf4]"
                aria-label="Account / Profile"
              >
                <UserCircle className="size-9 md:size-10 text-[#4ade80]" strokeWidth={1.25} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="overflow-x-hidden">
      {/* Main Content - responsive container */}
      <main className="mx-auto w-full max-w-[440px] md:max-w-none lg:max-w-6xl px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-10 flex flex-col gap-8 md:gap-12 lg:gap-14">
        {/* Alert Section – hugs content, center-aligned */}
        <div className="flex justify-center w-full">
          <div className="w-fit inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#fffbeb] border border-[#d97706] shadow-[0px_4px_0px_0px_#d97706]">
            <span className="text-[#b45309]" aria-hidden>🚨</span>
            <p className="font-normal leading-[1.4] text-[#b45309] text-[14px] md:text-[16px] tracking-[-0.32px]">
              New: Anonymous calling now available!
            </p>
          </div>
        </div>

        {/* Hero – problem statement first, then solution (engaging, objective: communicate the problem) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-stretch w-full bg-gradient-to-b from-white to-[#f1fff7] rounded-2xl md:rounded-3xl px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
          {/* Left: Problem statement – lead with the pain, then payoff */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-5 order-2 lg:order-1 lg:justify-center">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-[#64748b]">
              The problem
            </span>
            <h1 className="font-bold text-[24px] sm:text-[28px] lg:text-[32px] xl:text-[36px] text-black tracking-[-0.03em] leading-[1.2] max-w-[14ch]">
              Sound familiar?
            </h1>
            <ul className="flex flex-col gap-2.5 md:gap-3" role="list">
              <li className="flex items-center gap-3">
                <span className="shrink-0 size-1.5 rounded-full bg-[#1bb658]" aria-hidden />
                <span className="font-medium text-[15px] md:text-[16px] text-[#334155]">Car blocking your spot—no way to reach the owner.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 size-1.5 rounded-full bg-[#1bb658]" aria-hidden />
                <span className="font-medium text-[15px] md:text-[16px] text-[#334155]">Double-parked, and you're stuck waiting.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 size-1.5 rounded-full bg-[#1bb658]" aria-hidden />
                <span className="font-medium text-[15px] md:text-[16px] text-[#334155]">You need to reach them—without a confrontation.</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-[#e2e8f0]">
              <p className="font-bold text-[17px] md:text-[18px] text-[#1bb658] tracking-[-0.02em] mb-1">
                Park Safe fixes that.
              </p>
              <p className="font-normal text-[14px] md:text-[15px] text-[#64748b] leading-[1.5]">
                Scan their tag. Message or call. Anonymous. No app.
              </p>
            </div>
          </div>

          {/* Right: Problem images carousel – add real image paths in problemImages array */}
          <div className="lg:col-span-7 flex flex-col items-center w-full order-1 lg:order-2 gap-3 md:gap-4">
            <div className="relative w-full aspect-[4/3] md:aspect-[16/10] lg:min-h-[280px] rounded-[1.75rem] lg:rounded-[2rem] overflow-hidden bg-[#f1f5f9] border border-[#e2e8f0] shadow-[0_24px_48px_-12px_rgba(15,23,42,0.08)] group">
              {/* Slides – absolute inset-0 so fill images have a sized parent */}
              <div className="absolute inset-0 w-full h-full">
                {problemImages.map((item, index) => (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === heroProblemIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
                    }`}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 50vw"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#94a3b8] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] p-6">
                        <ImagePlus className="size-14 md:size-16" strokeWidth={1.25} />
                        <span className="text-[13px] md:text-[14px] font-semibold text-center uppercase tracking-wider">
                          Problem image {index + 1}
                        </span>
                        <span className="text-[12px] text-center max-w-[200px]">
                          Add image in <code className="text-[11px] bg-white/80 px-1.5 py-0.5 rounded">problemImages</code> array
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Prev / Next */}
              {problemImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevHeroProblem}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-9 md:size-10 rounded-full bg-black/40 hover:bg-black/55 backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous problem image"
                  >
                    <ChevronLeft className="size-5 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={nextHeroProblem}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 size-9 md:size-10 rounded-full bg-black/40 hover:bg-black/55 backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next problem image"
                  >
                    <ChevronRight className="size-5 text-white" />
                  </button>
                </>
              )}
            </div>
            {/* Dots */}
            {problemImages.length > 1 && (
              <div className="flex gap-2 items-center justify-center">
                {problemImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToHeroProblem(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === heroProblemIndex
                        ? 'bg-[#1bb658] w-6'
                        : 'bg-[#e2e8f0] w-2 hover:bg-[#cbd5e1]'
                    }`}
                    aria-label={`Go to problem image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* How the Safe Park Tag helps – artistic section */}
        <section className="relative w-full mt-12 md:mt-16 lg:mt-20 overflow-hidden rounded-3xl md:rounded-[2rem] bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfdf5] border border-[#bbf7d0]/50 shadow-[0_4px_24px_-4px_rgba(27,182,88,0.12)]" aria-labelledby="tag-helps-heading">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full bg-[#1bb658]/[0.06] blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden />
          <div className="absolute bottom-0 left-0 w-48 h-48 md:w-72 md:h-72 rounded-full bg-[#16a34a]/[0.05] blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" aria-hidden />

          <div className="relative mx-auto w-full max-w-[440px] md:max-w-none lg:max-w-6xl px-4 md:px-6 lg:px-8 py-10 md:py-14 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
              {/* How the Safe Park Tag helps – image (fit full inside placeholder) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end order-2 lg:order-1">
                <div className="relative w-full max-w-[280px] md:max-w-[320px] lg:max-w-none mx-auto lg:mx-0">
                  <div className="relative aspect-square rounded-[1.75rem] lg:rounded-[2rem] overflow-hidden bg-white ring-2 ring-[#1bb658]/20 ring-offset-4 ring-offset-white shadow-[0_25px_50px_-12px_rgba(27,182,88,0.15)]">
                    <Image
                      src="/images/safe-park-tag-helps.png"
                      alt="Park Safe – scan QR to contact owner for no parking, blocking, or emergency"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 280px, 320px"
                      unoptimized
                    />
                  </div>
                  {/* Accent corner */}
                  <div className="absolute -bottom-2 -right-2 w-24 h-24 rounded-2xl bg-[#1bb658]/10 border border-[#1bb658]/20 -z-10" aria-hidden />
                </div>
              </div>

              {/* Copy */}
              <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2 lg:pl-4">
                <span className="inline-block text-[12px] font-bold uppercase tracking-[0.2em] text-[#1bb658] mb-4">
                  The tag
                </span>
                <h2 id="tag-helps-heading" className="font-bold text-[26px] md:text-[32px] lg:text-[36px] text-black tracking-[-0.03em] leading-[1.15] mb-4 md:mb-5 max-w-[16ch]">
                  How the Safe Park Tag helps
                </h2>
                <p className="font-normal text-[15px] md:text-[16px] text-[#475569] leading-[1.65] mb-6 md:mb-8 max-w-[480px]">
                  One durable tag on your dashboard. Anyone can scan the QR, message or call you—anonymously. No app, no sharing your number, no awkward confrontations.
                </p>
                <ul className="flex flex-col gap-3 md:gap-4" role="list">
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 size-5 rounded-full bg-[#1bb658] flex items-center justify-center" aria-hidden>
                      <span className="size-2 rounded-full bg-white" />
                    </span>
                    <span className="font-medium text-[15px] md:text-[16px] text-[#111827]">Privacy first — your number stays hidden until you choose to share</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 size-5 rounded-full bg-[#1bb658] flex items-center justify-center" aria-hidden>
                      <span className="size-2 rounded-full bg-white" />
                    </span>
                    <span className="font-medium text-[15px] md:text-[16px] text-[#111827]">No app required — they scan with their camera and reach you instantly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 size-5 rounded-full bg-[#1bb658] flex items-center justify-center" aria-hidden>
                      <span className="size-2 rounded-full bg-white" />
                    </span>
                    <span className="font-medium text-[15px] md:text-[16px] text-[#111827]">Durable & weather-resistant — designed for the dashboard, built to last</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Safe Park Tags – product cards with pricing (soft colors, Buy now, 4px radius) */}
        <div id="pricing" className="flex flex-col sm:flex-row gap-4 items-stretch w-full mt-8 md:mt-10 scroll-mt-24">
          {/* Card 1: Single tag – soft green */}
          <div className="bg-white flex flex-1 flex-col gap-4 items-start min-w-px p-6 rounded-[24px] border border-[#a7f3d0] shadow-[0px_4px_0px_0px_rgba(134,239,172,0.5)] transition-all duration-200 group hover:shadow-[0px_6px_0px_0px_rgba(134,239,172,0.5)] hover:-translate-y-0.5">
            <div className="relative shrink-0 size-14 flex items-center justify-center bg-[#ecfdf5] rounded-2xl p-3 group-hover:bg-[#d1fae5] transition-colors">
              <Tag className="size-6 text-[#22c55e]" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-1.5 items-start w-full">
              <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px] w-full text-left">
                Safe Park Tag – Single
              </p>
              <p className="font-normal text-[#6b7280] text-[13px] tracking-[-0.26px] w-full leading-[1.5] text-left">
                1 durable QR tag for your vehicle
              </p>
              <div className="flex items-baseline gap-2 flex-wrap mt-1">
                <span className="font-bold text-[18px] text-[#22c55e]">₹399</span>
                <span className="font-normal text-[14px] text-[#9ca3af] line-through">₹449</span>
              </div>
              <p className="font-medium text-[12px] text-[#22c55e] mt-1">Lifetime validity</p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#22c55e] text-white font-semibold text-[14px] hover:bg-[#16a34a] active:scale-[0.98] transition-all"
              >
                <ShoppingCart className="size-4" />
                Buy now
              </button>
            </div>
          </div>

          {/* Card 2: Pack of 2 – best value (soft purple) */}
          <div className="bg-white flex flex-1 flex-col gap-4 items-start min-w-px p-6 rounded-[24px] border-2 border-[#c4b5fd] shadow-[0px_4px_0px_0px_rgba(196,181,253,0.5)] transition-all duration-200 group hover:shadow-[0px_6px_0px_0px_rgba(196,181,253,0.5)] hover:-translate-y-0.5 relative">
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#a78bfa] text-white text-[11px] font-semibold uppercase tracking-wide">
              Best value
            </span>
            <div className="relative shrink-0 size-14 flex items-center justify-center bg-[#f5f3ff] rounded-2xl p-3 group-hover:bg-[#ede9fe] transition-colors">
              <Tag className="size-6 text-[#8b5cf6]" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-1.5 items-start w-full">
              <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px] w-full text-left">
                Safe Park Tags – Pack of 2
              </p>
              <p className="font-normal text-[#6b7280] text-[13px] tracking-[-0.26px] w-full leading-[1.5] text-left">
                2 QR tags · Save more
              </p>
              <div className="flex items-baseline gap-2 flex-wrap mt-1">
                <span className="font-bold text-[18px] text-[#8b5cf6]">₹499</span>
                <span className="font-normal text-[14px] text-[#9ca3af] line-through">₹599</span>
              </div>
              <p className="font-medium text-[12px] text-[#8b5cf6] mt-1">Lifetime validity</p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#a78bfa] text-white font-semibold text-[14px] hover:bg-[#8b5cf6] active:scale-[0.98] transition-all"
              >
                <ShoppingCart className="size-4" />
                Buy now
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Common Situations - modern zigzag layout with image placeholders */}
      <section className="px-4 md:px-6 lg:px-8 py-12 md:py-20 bg-white w-full" aria-labelledby="common-situations-heading">
        <div className="mx-auto w-full max-w-[440px] md:max-w-none lg:max-w-5xl">
          <div className="mb-10 md:mb-16">
            <span className="inline-block text-[13px] font-semibold uppercase tracking-widest text-[#1bb658] mb-3">
              Use cases
            </span>
            <h2 id="common-situations-heading" className="font-bold text-[24px] md:text-[28px] lg:text-[32px] text-black tracking-[-0.02em] leading-[1.2] mb-2 max-w-[20ch]">
              Common situations
            </h2>
            <p className="font-normal text-[15px] md:text-[16px] text-[#64748b] leading-[1.6] max-w-[360px]">
              When Park Safe helps—scan, message, resolve.
            </p>
          </div>

          <div className="flex flex-col gap-12 md:gap-16 lg:gap-20">
            {/* Row 1: Image left, content right */}
            <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center lg:min-h-[240px]">
              <div className="relative aspect-[4/3] lg:aspect-[3/2] rounded-2xl overflow-hidden bg-white ring-1 ring-[#e2e8f0]">
                <Image src={commonSituationImages[0].src} alt={commonSituationImages[0].alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" unoptimized />
              </div>
              <div className="flex flex-col justify-center lg:py-4 gap-0">
                <span className="text-[14px] font-semibold text-[#1bb658] uppercase tracking-wider mb-2">01</span>
                <h3 className="font-bold text-[22px] md:text-[24px] lg:text-[28px] text-black tracking-[-0.02em] leading-snug mb-3">
                  Car blocking your driveway?
                </h3>
                <p className="font-normal text-[16px] md:text-[17px] text-[#64748b] leading-[1.55]">
                  Reach the owner instantly without confrontation.
                </p>
              </div>
            </article>

            {/* Row 2: Content left, image right */}
            <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center lg:min-h-[240px]">
              <div className="flex flex-col justify-center lg:py-4 order-2 lg:order-1 gap-0">
                <span className="text-[14px] font-semibold text-[#1bb658] uppercase tracking-wider mb-2">02</span>
                <h3 className="font-bold text-[22px] md:text-[24px] lg:text-[28px] text-black tracking-[-0.02em] leading-snug mb-3">
                  Double-parked vehicle?
                </h3>
                <p className="font-normal text-[16px] md:text-[17px] text-[#64748b] leading-[1.55]">
                  Send a quick message to resolve it peacefully.
                </p>
              </div>
              <div className="relative aspect-[4/3] lg:aspect-[3/2] rounded-2xl overflow-hidden bg-white ring-1 ring-[#e2e8f0] order-1 lg:order-2">
                <Image src={commonSituationImages[1].src} alt={commonSituationImages[1].alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" unoptimized />
              </div>
            </article>

            {/* Row 3: Image left, content right */}
            <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center lg:min-h-[240px]">
              <div className="relative aspect-[4/3] lg:aspect-[3/2] rounded-2xl overflow-hidden bg-white ring-1 ring-[#e2e8f0]">
                <Image src={commonSituationImages[2].src} alt={commonSituationImages[2].alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" unoptimized />
              </div>
              <div className="flex flex-col justify-center lg:py-4 gap-0">
                <span className="text-[14px] font-semibold text-[#1bb658] uppercase tracking-wider mb-2">03</span>
                <h3 className="font-bold text-[22px] md:text-[24px] lg:text-[28px] text-black tracking-[-0.02em] leading-snug mb-3">
                  Headlights left on?
                </h3>
                <p className="font-normal text-[16px] md:text-[17px] text-[#64748b] leading-[1.55]">
                  Help a stranger avoid a dead battery.
                </p>
              </div>
            </article>

            {/* Row 4: Content left, image right */}
            <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center lg:min-h-[240px]">
              <div className="flex flex-col justify-center lg:py-4 order-2 lg:order-1 gap-0">
                <span className="text-[14px] font-semibold text-[#1bb658] uppercase tracking-wider mb-2">04</span>
                <h3 className="font-bold text-[22px] md:text-[24px] lg:text-[28px] text-black tracking-[-0.02em] leading-snug mb-3">
                  Reserved spot taken?
                </h3>
                <p className="font-normal text-[16px] md:text-[17px] text-[#64748b] leading-[1.55]">
                  Reach the owner and resolve it without confrontation.
                </p>
              </div>
              <div className="relative aspect-[4/3] lg:aspect-[3/2] rounded-2xl overflow-hidden bg-white ring-1 ring-[#e2e8f0] order-1 lg:order-2">
                <Image src={commonSituationImages[3].src} alt={commonSituationImages[3].alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" unoptimized />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* How It Works Section - Journey */}
      <section id="how-it-works" className="flex flex-col items-center justify-center py-12 md:py-20 px-4 md:px-6 lg:px-8 scroll-mt-24 bg-gradient-to-b from-white to-[#f8fafb]">
        <div className="mx-auto w-full max-w-[440px] md:max-w-none lg:max-w-6xl">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="font-bold text-[22px] md:text-[26px] lg:text-[28px] text-black tracking-[-0.48px] leading-[1.3] mb-2">
              How It Works
            </h2>
            <p className="font-normal text-[15px] md:text-[16px] text-[#64748b] max-w-[320px] mx-auto">
              Your journey in 3 simple steps
            </p>
          </div>

          {/* Journey steps - vertical on mobile, horizontal on desktop with connector */}
          <div className="relative">
            {/* Desktop: horizontal connecting line */}
            <div className="hidden lg:block absolute top-[72px] left-[16.666%] right-[16.666%] h-0.5 border-t-2 border-dashed border-[#1bb658]/30" aria-hidden />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 items-stretch">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center lg:items-center text-center lg:max-w-[280px] mx-auto lg:mx-0">
                <div className="flex flex-col items-center w-full">
                  <div className="relative mb-4">
                    <div className="size-24 md:size-28 rounded-2xl bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border border-[#1bb658]/20 flex items-center justify-center shadow-sm">
                      <ClipboardList className="size-12 md:size-14 text-[#1bb658]" strokeWidth={1.5} />
                    </div>
                    <span className="absolute -top-1 -right-1 size-8 rounded-full bg-[#1bb658] text-white font-bold text-[14px] flex items-center justify-center shadow-md">
                      1
                    </span>
                  </div>
                  <h3 className="font-semibold text-[17px] md:text-[18px] text-black tracking-[-0.34px] mb-1.5">
                    Register Your Vehicle
                  </h3>
                  <p className="font-normal text-[14px] text-[#64748b] leading-[1.5]">
                    Add your vehicle details and get a unique QR code
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center lg:items-center text-center lg:max-w-[280px] mx-auto lg:mx-0">
                <div className="flex flex-col items-center w-full">
                  <div className="relative mb-4">
                    <div className="size-24 md:size-28 rounded-2xl bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border border-[#1bb658]/20 flex items-center justify-center shadow-sm">
                      <LayoutDashboard className="size-12 md:size-14 text-[#1bb658]" strokeWidth={1.5} />
                    </div>
                    <span className="absolute -top-1 -right-1 size-8 rounded-full bg-[#1bb658] text-white font-bold text-[14px] flex items-center justify-center shadow-md">
                      2
                    </span>
                  </div>
                  <h3 className="font-semibold text-[17px] md:text-[18px] text-black tracking-[-0.34px] mb-1.5">
                    Place QR on Dashboard
                  </h3>
                  <p className="font-normal text-[14px] text-[#64748b] leading-[1.5]">
                    Print and display it where it's easily visible
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center lg:items-center text-center lg:max-w-[280px] mx-auto lg:mx-0">
                <div className="flex flex-col items-center w-full">
                  <div className="relative mb-4">
                    <div className="size-24 md:size-28 rounded-2xl bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border border-[#1bb658]/20 flex items-center justify-center shadow-sm">
                      <Bell className="size-12 md:size-14 text-[#1bb658]" strokeWidth={1.5} />
                    </div>
                    <span className="absolute -top-1 -right-1 size-8 rounded-full bg-[#1bb658] text-white font-bold text-[14px] flex items-center justify-center shadow-md">
                      3
                    </span>
                  </div>
                  <h3 className="font-semibold text-[17px] md:text-[18px] text-black tracking-[-0.34px] mb-1.5">
                    Get Notified Instantly
                  </h3>
                  <p className="font-normal text-[14px] text-[#64748b] leading-[1.5]">
                    Receive messages or calls when someone needs to reach you
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile: vertical timeline connector - centered through step icons */}
            <div className="lg:hidden absolute left-1/2 top-14 bottom-14 -translate-x-px w-0.5 bg-gradient-to-b from-[#1bb658]/40 via-[#1bb658]/30 to-[#1bb658]/40 -z-10" aria-hidden />
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="advantages" className="flex flex-col gap-8 items-center justify-center py-12 md:py-16 px-4 md:px-6 lg:px-8 w-full bg-gradient-to-b from-white via-[#fafafa] to-white scroll-mt-24">
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
        <div className="mx-auto w-full max-w-[440px] md:max-w-none lg:max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full min-w-0">
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
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-gradient-to-b from-white from-[32.232%] to-[#f1fff7] to-[129.26%] flex flex-col gap-10 items-center justify-center py-16 md:py-20 px-4 md:px-6 lg:px-8 w-full scroll-mt-24">
        <div className="mx-auto w-full max-w-[440px] md:max-w-none lg:max-w-6xl flex flex-col gap-10 items-center">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col justify-center leading-[0] text-[22px] md:text-[24px] text-black text-center">
              <p className="font-bold leading-tight">Frequently asked questions</p>
            </div>
          </div>

          <div className="flex flex-col items-start w-full max-w-[392px] md:max-w-2xl lg:max-w-3xl">
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
      </section>

      {/* Footer */}
      <footer className="bg-[#f1fff7] flex flex-col items-center justify-center py-10 pb-24 md:pb-10 w-full">
        <div className="relative shrink-0 size-12 flex items-center justify-center">
          <ShieldCheck className="size-12 text-[#1bb658]" />
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col justify-center text-[#1bb658] text-[48px] md:text-[56px] lg:text-[64px] w-full items-center">
              <p className="font-bold leading-[1.4] text-center">park safe</p>
            </div>
            <div className="flex flex-col justify-center text-[#16a34a] text-[14px] mt-2 w-full items-center">
              <p className="font-medium leading-[20px] text-center">Connect. Resolve. Move on.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center max-w-[1280px] px-4 md:px-6 w-full">
          <div className="border-[#d4edde] border-t flex items-center pt-8">
            <div className="bg-clip-padding border-0 border-transparent flex flex-col items-center justify-center">
              <div className="flex flex-col justify-center leading-[0] text-[#9ca3af] text-[14px] text-center w-full">
                <p className="font-medium leading-[20px]">
                  © 2025, tribly tech pvt ltd.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Scan QR Button - hidden on all viewports */}
      <div className="hidden fixed bottom-0 left-1/2 -translate-x-1/2 backdrop-blur-[5px] bg-gradient-to-t from-white/80 via-white/60 to-white/40 h-[110px] w-full max-w-[440px] items-start justify-center pt-4 z-50 border-t border-white/30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
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

      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
      />

      </div>
  )
}
