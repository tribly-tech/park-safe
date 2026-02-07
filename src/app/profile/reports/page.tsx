'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  Flag,
  Send,
  AlertCircle,
} from 'lucide-react'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { ReportActivity } from '@/types'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

function random6DigitId(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

const DEFAULT_REPORTS: ReportActivity[] = [
  {
    id: 'r1',
    reportId: random6DigitId(),
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    issueType: 'blocking',
    issueTitle: 'Blocking my vehicle',
    reporterLabel: 'Anonymous user',
    message: 'Vehicle was blocking the driveway for over an hour.',
    status: 'under_review',
  },
  {
    id: 'r2',
    reportId: random6DigitId(),
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    issueType: 'lights',
    issueTitle: 'Lights are ON',
    reporterLabel: 'Anonymous user',
    message: 'Headlights left on in parking lot.',
    status: 'resolved',
  },
]

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString()
}

function displayReportId(report: ReportActivity): string {
  if (report.reportId) return report.reportId
  // Derive a stable 6-digit ID from report.id for older records
  let n = 0
  for (let i = 0; i < report.id.length; i++) n = (n * 31 + report.id.charCodeAt(i)) >>> 0
  return String(100000 + (n % 900000))
}

export default function ProfileReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useLocalStorage<ReportActivity[]>(
    STORAGE_KEYS.REPORT_ACTIVITY,
    DEFAULT_REPORTS
  )
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn] = useLocalStorage<boolean>(STORAGE_KEYS.USER, false)
  const [disputeModalReportId, setDisputeModalReportId] = useState<string | null>(null)
  const [disputeReason, setDisputeReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.replace(ROUTES.PROFILE)
    }
  }, [mounted, isLoggedIn, router])

  const reportsSafe = mounted ? reports : []

  const handleOpenDispute = (reportId: string) => {
    setDisputeModalReportId(reportId)
    setDisputeReason('')
  }

  const handleCloseDisputeModal = () => {
    setDisputeModalReportId(null)
    setDisputeReason('')
  }

  const handleSubmitDispute = () => {
    const reason = disputeReason.trim()
    if (!reason) {
      toast.error('Please enter a reason for your dispute')
      return
    }
    if (!disputeModalReportId) return

    setIsSubmitting(true)
    setReports((prev) =>
      prev.map((r) =>
        r.id === disputeModalReportId
          ? {
              ...r,
              status: 'disputed' as const,
              dispute: {
                submittedAt: new Date().toISOString(),
                reason,
              },
            }
          : r
      )
    )
    setIsSubmitting(false)
    handleCloseDisputeModal()
    toast.success('Dispute submitted', {
      description: 'We will review your claim and get back to you.',
      duration: 4000,
    })
  }

  const reportForModal = reportsSafe.find((r) => r.id === disputeModalReportId)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#fafafa]">
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-white via-white/95 to-transparent backdrop-blur-sm border-b border-[#e5e7eb]">
        <Link
          href={ROUTES.PROFILE}
          className="group shrink-0 size-10 flex items-center justify-center rounded-full bg-white border border-[#e5e7eb] hover:border-[#1bb658] hover:bg-[#f1fff7] transition-all duration-200 active:scale-95"
          aria-label="Back to profile"
        >
          <ChevronLeft className="size-5 text-[#6b7280] group-hover:text-[#1bb658] transition-colors" />
        </Link>
        <span className="font-semibold text-[16px] text-[#111827]">
          Report activity
        </span>
        <div className="size-10" aria-hidden />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-[440px] mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-[#1bb658]/15 to-[#16a34a]/10 flex items-center justify-center mb-4 shadow-sm border border-[#1bb658]/20">
            <Flag className="size-8 text-[#1bb658]" />
          </div>
          <h1 className="font-bold text-[24px] text-[#111827] tracking-[-0.48px] mb-2">
            Reports against you
          </h1>
          <p className="font-normal text-[15px] text-[#6b7280] leading-[1.5] max-w-[320px]">
            When someone reports your vehicle, it appears here. You can dispute wrong or abusive claims.
          </p>
        </div>

        {reportsSafe.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#e5e7eb] p-8 text-center">
            <div className="size-14 rounded-xl bg-[#f0fdf4] flex items-center justify-center mx-auto mb-3">
              <Flag className="size-7 text-[#1bb658]" />
            </div>
            <p className="font-medium text-[#111827] mb-1">No reports yet</p>
            <p className="text-[14px] text-[#6b7280]">
              Reports from others about your vehicle will show up here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reportsSafe.map((report) => (
              <div
                key={report.id}
                className="relative flex items-center gap-4 rounded-2xl bg-white border border-[#e5e7eb] p-4"
              >
                {report.status !== 'disputed' && (
                  <button
                    type="button"
                    onClick={() => handleOpenDispute(report.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-[#6b7280] hover:text-[#1bb658] hover:bg-[#f0fdf4] transition-colors"
                    aria-label="Report abuse or wrong claim"
                  >
                    <AlertCircle className="size-5" />
                  </button>
                )}
                <div className="shrink-0 size-11 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
                  <Flag className="size-5 text-[#1bb658]" />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <p className="font-semibold text-[15px] text-[#111827] truncate">
                    {report.issueTitle}
                  </p>
                  <p className="text-[13px] text-[#6b7280] mt-1">
                    ID {displayReportId(report)}
                    <span className="mx-1.5">·</span>
                    {formatDate(report.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!disputeModalReportId} onOpenChange={(open) => !open && handleCloseDisputeModal()}>
        <DialogContent className="rounded-2xl border-[#e5e7eb] p-6 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold text-[#111827]">
              Report abuse or wrong claim
            </DialogTitle>
            <DialogDescription className="text-[14px] text-[#6b7280] mt-1">
              {reportForModal && (
                <>Dispute: &ldquo;{reportForModal.issueTitle}&rdquo;</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <label htmlFor="dispute-reason" className="block font-medium text-[13px] text-[#64748b] mb-2">
              Why is this report wrong or abusive?
            </label>
            <textarea
              id="dispute-reason"
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Explain why this claim is incorrect or abusive..."
              rows={4}
              className="w-full rounded-xl border-2 border-[#e5e7eb] px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1bb658] transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleCloseDisputeModal}
              className="flex-1 py-3 rounded-xl border-2 border-[#e5e7eb] font-semibold text-[#6b7280] hover:bg-[#f8fafb] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitDispute}
              disabled={isSubmitting || !disputeReason.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1bb658] text-white font-semibold hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="size-4" />
              Submit dispute
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
