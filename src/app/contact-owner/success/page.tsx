'use client'

import { Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { issues, VALID_ISSUE_IDS, VALID_ACTION_IDS, type IssueType, type ActionType } from '@/lib/contact-owner-data'

function SuccessContent() {
  const searchParams = useSearchParams()
  const actionParam = searchParams.get('action') as ActionType | null
  const issueParam = searchParams.get('issue') as IssueType | null

  const action = VALID_ACTION_IDS.includes(actionParam as ActionType) ? actionParam : null
  const selectedIssue = VALID_ISSUE_IDS.includes(issueParam as IssueType) ? issueParam : null
  const selectedIssueData = issues.find((issue) => issue.id === selectedIssue)

  if (!action || !selectedIssueData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6">
        <p className="text-[#6b7280] text-center">
          Invalid or missing data. Please complete the contact flow first.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-[280px]">
          <Link href={ROUTES.CONTACT_OWNER}>
            <Button className="w-full bg-[#1bb658] hover:bg-[#16a34a] text-white">
              Contact Owner
            </Button>
          </Link>
          <Link href={ROUTES.HOME}>
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const successTitles: Record<ActionType, string> = {
    message: '✓ Message Delivered',
    call: '✓ Call Connected',
  }

  const successDescriptions: Record<ActionType, string> = {
    message: 'The vehicle owner has been notified via SMS.',
    call: 'Your anonymous call is connected. Number protected.',
  }

  return (
    <div className="relative min-h-screen w-full max-w-[440px] mx-auto bg-white">
      {/* Header */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="flex items-center justify-between px-6 py-5">
          <Link
            href={`${ROUTES.CONTACT_OWNER_CHOOSE_ACTION}?issue=${selectedIssue}`}
            className="size-9 flex items-center justify-center rounded-full bg-[#f8fafb] hover:bg-[#f3f4f6] transition-colors group"
          >
            <ArrowLeft className="size-4 text-[#6b7280] group-hover:text-[#111827] transition-colors" />
          </Link>
          <h1 className="font-bold text-[20px] text-[#111827] tracking-[-0.4px] leading-[1.2]">
            Contact Owner
          </h1>
          <div className="size-9" />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-white to-[#fafafa] px-6 py-8 pb-20">
        <div className="flex flex-col items-center gap-6 py-12 animate-in fade-in zoom-in-95 duration-500">
          {/* Success Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#1bb658] rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative size-24 flex items-center justify-center bg-gradient-to-br from-[#1bb658] to-[#16a34a] rounded-full shadow-xl shadow-[#1bb658]/40 border-4 border-white">
              <Check className="size-12 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center">
            <h2 className="font-bold text-[26px] text-[#111827] tracking-[-0.52px] mb-3 leading-[1.2]">
              {successTitles[action]}
            </h2>
            <p className="text-[15px] text-[#6b7280] leading-[1.6] max-w-[300px] mx-auto">
              {successDescriptions[action]}
            </p>
          </div>

          {/* Issue Summary Card */}
          <div className="w-full bg-gradient-to-br from-white to-[#f8fafb] rounded-[24px] p-6 border-2 border-[#e5e7eb] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                Issue Reported
              </p>
              <div className="px-2.5 py-1 bg-[#dcfce7] rounded-full">
                <p className="text-[10px] font-bold text-[#16a34a] uppercase tracking-wider">
                  Sent
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-14 flex items-center justify-center text-[32px] bg-gradient-to-br from-[#f8fafb] to-[#f1f3f5] rounded-2xl border border-[#e5e7eb]">
                {selectedIssueData.emoji}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[17px] text-[#111827] tracking-[-0.34px] leading-[1.3]">
                  {selectedIssueData.title}
                </p>
                <p className="text-[13px] text-[#6b7280] mt-1 flex items-center gap-1.5">
                  <span className="size-1 bg-[#6b7280] rounded-full" />
                  {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full mt-2">
            <Link href={ROUTES.HOME} className="w-full">
              <Button
                variant="outline"
                className="w-full py-7 rounded-[20px] font-bold border-2 border-[#e5e7eb] hover:bg-[#f8fafb] hover:border-[#d1d5db] text-[16px] tracking-[-0.32px] transition-all"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContactOwnerSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="size-6 border-2 border-[#1bb658]/30 border-t-[#1bb658] rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
