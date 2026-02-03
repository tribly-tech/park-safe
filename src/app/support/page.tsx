'use client'

import { ArrowLeft, HelpCircle, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export default function SupportPage() {

  return (
    <div className="relative min-h-screen w-full max-w-[440px] mx-auto bg-white overflow-x-hidden">
      {/* Main Content */}
      <div className="flex flex-col gap-6 items-start px-6 pt-6 pb-6">
        {/* Navigation */}
        <div className="flex items-center gap-3 w-full">
          <Link
            href={ROUTES.HOME}
            className="size-10 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] transition-colors"
          >
            <ArrowLeft className="size-5 text-[#111827]" />
          </Link>
          <h1 className="font-bold text-[24px] text-[#111827] tracking-[-0.48px]">
            Support
          </h1>
        </div>

        {/* Need Help? Section */}
        <div className="w-full bg-gradient-to-br from-[#f0fdf4] to-white border border-[#1bb658] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 size-12 flex items-center justify-center bg-white rounded-full border border-[#1bb658]/20">
              <HelpCircle className="size-6 text-[#1bb658]" />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div>
                <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
                  Need Help?
                </h2>
                <p className="font-normal text-[14px] text-[#6b7280] leading-[1.5]">
                  Our support team is available 24/7 to assist you
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:support@safepark.com"
                  className="flex items-center gap-2 text-[#1bb658] font-medium text-[14px] hover:underline"
                >
                  <Mail className="size-4" />
                  support@safepark.com
                </a>
                <a
                  href="tel:+15551234567"
                  className="flex items-center gap-2 text-[#1bb658] font-medium text-[14px] hover:underline"
                >
                  <Phone className="size-4" />
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
