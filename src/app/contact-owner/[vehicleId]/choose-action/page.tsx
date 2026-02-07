'use client'

import { MessageSquare, Phone, ChevronRight, ArrowLeft, ShieldCheck, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { Suspense } from 'react'
import { ROUTES, getContactOwnerRoutes } from '@/lib/constants'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { issues, VALID_ISSUE_IDS, type IssueType } from '@/lib/contact-owner-data'

function ChooseActionContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const vehicleId = (params?.vehicleId as string) ?? ''
  const routes = getContactOwnerRoutes(vehicleId)
  const issueParam = searchParams.get('issue') as IssueType | null

  const selectedIssue = VALID_ISSUE_IDS.includes(issueParam as IssueType) ? issueParam : null
  const selectedIssueData = issues.find((issue) => issue.id === selectedIssue)

  if (!selectedIssue || !selectedIssueData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6">
        <p className="text-[#6b7280] text-center">
          Invalid or missing issue. Please select an issue first.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-[280px]">
          <Link href={routes.base}>
            <Button className="w-full bg-[#1bb658] hover:bg-[#16a34a] text-white">
              Select Issue
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

  const handleSendMessage = () => {
    toast.success('Sending message...', {
      duration: 2000,
    })

    setTimeout(() => {
      router.push(`${routes.success}?action=message&issue=${selectedIssue}`)
      toast.success('Message delivered!', {
        description: 'The vehicle owner has been notified.',
        duration: 4000,
      })
    }, 2000)
  }

  const handleCallOwner = () => {
    toast.success('Connecting call...', {
      duration: 2000,
    })

    setTimeout(() => {
      router.push(`${routes.success}?action=call&issue=${selectedIssue}`)
      toast.success('Call connected!', {
        description: 'Your number is protected.',
        duration: 4000,
      })
    }, 2000)
  }

  return (
    <div className="relative min-h-screen w-full max-w-[440px] mx-auto bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <div className="bg-white border-b border-[#e5e7eb]">
          <div className="flex items-center px-6 py-5">
            <div className="flex flex-col">
              <h1 className="font-bold text-[20px] text-[#111827] tracking-[-0.4px] leading-[1.2]">
                Contact Owner
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#1bb658]" />
                  <div className="h-1.5 w-6 rounded-full bg-[#1bb658]" />
                </div>
                <span className="text-[11px] font-medium text-[#9ca3af] uppercase tracking-wider">
                  Step 2 of 2
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f8fafb] h-1">
          <div className="bg-gradient-to-r from-[#1bb658] to-[#16a34a] h-full w-full transition-all duration-500 ease-out" />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-white to-[#fafafa] px-6 py-8 pb-20">
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
          {/* Back Button */}
          <Link
            href={routes.base}
            className="flex items-center gap-2 text-[#6b7280] hover:text-[#111827] transition-colors group w-fit"
          >
            <div className="size-8 flex items-center justify-center rounded-full bg-[#f8fafb] group-hover:bg-[#f3f4f6] transition-colors">
              <ArrowLeft className="size-4" />
            </div>
            <span className="font-medium text-[14px]">Back to issues</span>
          </Link>

          {/* Selected Issue Summary */}
          <div className="bg-[#f8fafb] rounded-[20px] p-5 border-2 border-[#e5e7eb] shadow-sm">
            <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">
              Selected Issue
            </p>
            <div className="flex items-center gap-3">
              <div className="size-14 flex items-center justify-center text-[32px] bg-gradient-to-br from-[#f8fafb] to-[#f1f3f5] rounded-2xl border border-[#e5e7eb]">
                {selectedIssueData.emoji}
              </div>
              <div>
                <p className="font-bold text-[17px] text-[#111827] tracking-[-0.34px] leading-[1.3]">
                  {selectedIssueData.title}
                </p>
                <p className="text-[13px] text-[#6b7280] mt-1">
                  {selectedIssueData.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[22px] text-[#111827] tracking-[-0.44px]">
              How to contact?
            </h3>

            {/* Send Message */}
            <button
              onClick={handleSendMessage}
              className="group bg-white border-2 border-[#e5e7eb] rounded-[20px] p-5 hover:border-[#1bb658] hover:shadow-lg hover:shadow-[#1bb658]/10 transition-all duration-200 active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0 size-12 flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] group-hover:from-[#dcfce7] group-hover:to-[#bbf7d0] rounded-xl border border-[#1bb658]/20 transition-all">
                  <MessageSquare className="size-5 text-[#1bb658]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-[16px] text-[#111827] tracking-[-0.32px]">
                    Send Message
                  </p>
                  <p className="text-[13px] text-[#6b7280] mt-0.5">
                    Instant notification via SMS
                  </p>
                </div>
                <ChevronRight className="size-5 text-[#d1d5db] group-hover:text-[#1bb658] group-hover:translate-x-1 transition-all" />
              </div>
            </button>

            {/* Call Owner */}
            <button
              onClick={handleCallOwner}
              className="group bg-white border-2 border-[#e5e7eb] rounded-[20px] p-5 hover:border-[#f59e0b] hover:shadow-lg hover:shadow-[#f59e0b]/10 transition-all duration-200 active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0 size-12 flex items-center justify-center bg-gradient-to-br from-[#fffbeb] to-[#fef3c7] group-hover:from-[#fef3c7] group-hover:to-[#fde68a] rounded-xl border border-[#f59e0b]/20 transition-all">
                  <Phone className="size-5 text-[#f59e0b]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-[16px] text-[#111827] tracking-[-0.32px]">
                    Call Owner
                  </p>
                  <p className="text-[13px] text-[#6b7280] mt-0.5">
                    Anonymous • Your number hidden
                  </p>
                </div>
                <ChevronRight className="size-5 text-[#d1d5db] group-hover:text-[#f59e0b] group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="w-full mt-8 pt-6 border-t border-[#e5e7eb]">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="flex items-center justify-center">
              <ShieldCheck className="size-5 text-[#1bb658]" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[15px] text-[#111827] tracking-[-0.3px]">
                Your Privacy is Protected
              </p>
              <p className="font-normal text-[13px] text-[#6b7280] leading-[1.6] max-w-[320px]">
                Your contact information remains completely anonymous. The vehicle owner will never see your number.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-[#1bb658]" />
                <span className="font-normal text-[12px] text-[#6b7280]">100% Anonymous</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-[#1bb658]" />
                <span className="font-normal text-[12px] text-[#6b7280]">Secure Communication</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-[#1bb658]" />
                <span className="font-normal text-[12px] text-[#6b7280]">No Spam</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChooseActionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="size-6 border-2 border-[#1bb658]/30 border-t-[#1bb658] rounded-full animate-spin" />
      </div>
    }>
      <ChooseActionContent />
    </Suspense>
  )
}
