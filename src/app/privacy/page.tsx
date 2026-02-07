'use client'

import Link from 'next/link'
import { ChevronLeft, Shield } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export default function PrivacyPage() {
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
          Privacy Policy
        </span>
        <div className="size-10" aria-hidden />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-[640px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 flex items-center justify-center bg-[#f0fdf4] rounded-xl">
            <Shield className="size-6 text-[#1bb658]" />
          </div>
          <div>
            <h1 className="font-bold text-[24px] text-[#111827] tracking-[-0.48px]">
              Privacy Policy
            </h1>
            <p className="font-normal text-[14px] text-[#6b7280] mt-0.5">
              Last updated: February 2026
            </p>
          </div>
        </div>

        <div className="prose prose-neutral max-w-none space-y-6 text-[15px] text-[#374151] leading-[1.6]">
          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              1. Introduction
            </h2>
            <p>
              Park Safe (&quot;we&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your data when you use our app and services.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              2. Data We Collect
            </h2>
            <p>
              We collect information you provide directly (e.g. name, email, phone, vehicle details), data generated when you use the Service (e.g. scan events, contact requests), and technical data (e.g. device type, app version) where necessary to operate and improve the Service.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              3. How We Use Your Data
            </h2>
            <p>
              We use your data to provide and improve the Service, to facilitate anonymous or identified contact between users as you choose, to send notifications you have requested, to comply with legal obligations, and to protect our rights and the safety of our users.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              4. Data Sharing and Anonymity
            </h2>
            <p>
              Your phone number and identity are not shared with other users unless you explicitly choose to reveal them. We may share data with service providers who assist us under strict confidentiality, and we may disclose data when required by law or to protect safety.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              5. Data Storage and Security
            </h2>
            <p>
              We store data on secure servers and use industry-standard measures to protect it. Some data may be stored on your device (e.g. preferences). You are responsible for keeping your device and account access secure.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              6. Your Rights
            </h2>
            <p>
              Depending on your location, you may have rights to access, correct, delete, or port your data, or to object to or restrict certain processing. You can update profile and contact details in the app; for other requests, contact us at parksafe@tribly.ai.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes via the app or by email. Continued use after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] mb-2">
              8. Contact
            </h2>
            <p>
              For privacy-related questions or requests, contact us at parksafe@tribly.ai or through the Help & Contact section in the app.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
