'use client'

import Link from 'next/link'
import {
  ChevronLeft,
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#fafafa]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-white via-white/95 to-transparent backdrop-blur-sm border-b border-[#e5e7eb]">
        <Link
          href={ROUTES.PROFILE}
          className="group shrink-0 size-10 flex items-center justify-center rounded-full bg-white border border-[#e5e7eb] hover:border-[#1bb658] hover:bg-[#f1fff7] transition-all duration-200 active:scale-95"
          aria-label="Back to profile"
        >
          <ChevronLeft className="size-5 text-[#6b7280] group-hover:text-[#1bb658] transition-colors" />
        </Link>
        <span className="font-semibold text-[16px] text-[#111827]">
          Help & Contact
        </span>
        <div className="size-10" aria-hidden />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-[440px] mx-auto w-full">
        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-[#1bb658]/15 to-[#16a34a]/10 flex items-center justify-center mb-4 shadow-sm">
            <HelpCircle className="size-8 text-[#1bb658]" />
          </div>
          <h1 className="font-bold text-[24px] text-[#111827] tracking-[-0.48px] mb-2">
            How can we help?
          </h1>
          <p className="font-normal text-[15px] text-[#6b7280] leading-[1.5] max-w-[320px]">
            Get in touch for support, feedback, or questions about Park Safe.
          </p>
        </div>

        {/* Contact cards */}
        <div className="flex flex-col gap-4 mb-8">
          <a
            href="mailto:parksafe@tribly.ai"
            className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.99] text-left"
          >
            <div className="shrink-0 size-12 flex items-center justify-center rounded-xl bg-[#f0fdf4] group-hover:bg-[#dcfce7] transition-colors">
              <Mail className="size-6 text-[#1bb658]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px]">
                Email us
              </p>
              <p className="font-normal text-[14px] text-[#6b7280] mt-0.5 truncate">
                parksafe@tribly.ai
              </p>
            </div>
            <ExternalLink className="size-4 text-[#9ca3af] group-hover:text-[#1bb658] transition-colors shrink-0" />
          </a>

          <a
            href="https://wa.me/919010640909"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.99] text-left"
          >
            <div className="shrink-0 size-12 flex items-center justify-center rounded-xl bg-[#f0fdf4] group-hover:bg-[#dcfce7] transition-colors">
              <MessageCircle className="size-6 text-[#1bb658]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px]">
                WhatsApp
              </p>
              <p className="font-normal text-[14px] text-[#6b7280] mt-0.5">
                +91 90106 40909
              </p>
            </div>
            <ExternalLink className="size-4 text-[#9ca3af] group-hover:text-[#1bb658] transition-colors shrink-0" />
          </a>

          <a
            href="tel:+918977719997"
            className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.99] text-left"
          >
            <div className="shrink-0 size-12 flex items-center justify-center rounded-xl bg-[#f0fdf4] group-hover:bg-[#dcfce7] transition-colors">
              <Phone className="size-6 text-[#1bb658]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px]">
                Call us
              </p>
              <p className="font-normal text-[14px] text-[#6b7280] mt-0.5">
                +91 89777 19997
              </p>
            </div>
            <ExternalLink className="size-4 text-[#9ca3af] group-hover:text-[#1bb658] transition-colors shrink-0" />
          </a>
        </div>

        {/* Response time */}
        <div className="rounded-2xl bg-[#f0fdf4]/80 border border-[#1bb658]/20 p-4 mb-8">
          <div className="flex items-start gap-3">
            <MessageCircle className="size-5 text-[#1bb658] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[14px] text-[#111827]">
                Typical response time
              </p>
              <p className="font-normal text-[13px] text-[#6b7280] mt-0.5 leading-[1.5]">
                We usually reply within 24 hours. For urgent issues, call us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
