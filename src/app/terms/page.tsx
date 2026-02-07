'use client'

import Link from 'next/link'
import { ChevronLeft, FileText } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export default function TermsPage() {
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
          Terms of Service
        </span>
        <div className="size-10" aria-hidden />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-[640px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 flex items-center justify-center bg-[#f0fdf4] rounded-xl">
            <FileText className="size-6 text-[#1bb658]" />
          </div>
          <div>
            <h1 className="font-bold text-[24px] text-[#111827] tracking-[-0.48px]">
              Terms of Service
            </h1>
            <p className="font-normal text-[14px] text-[#6b7280] mt-0.5">
              Last updated: February 2026
            </p>
          </div>
        </div>

        <div className="prose prose-neutral max-w-none space-y-6 text-[15px] text-[#374151] leading-[1.6]">
          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Park Safe (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              2. Description of Service
            </h2>
            <p>
              Park Safe provides a QR code–based solution to help vehicle owners and others communicate about parking-related issues while preserving privacy. The Service includes registration of vehicles, generation of QR codes, and contact flows between parties.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              3. User Responsibilities
            </h2>
            <p>
              You are responsible for the accuracy of information you provide, for keeping your account and contact details secure, and for using the Service in compliance with applicable laws. You must not use the Service for harassment, spam, or any unlawful purpose.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              4. Privacy and Data
            </h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy. We collect and process data as described there, including to provide the Service, improve it, and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              5. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Park Safe and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              6. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. We will notify you of material changes via the app or by email where appropriate. Continued use of the Service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              7. Contact
            </h2>
            <p>
              For questions about these Terms, contact us at parksafe@tribly.ai or through the Help & Contact section in the app.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
