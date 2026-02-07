'use client'

import { Info, ShieldCheck, Check } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { getContactOwnerRoutes } from '@/lib/constants'
import { issues, type IssueType } from '@/lib/contact-owner-data'

export default function ContactOwnerVehiclePage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = (params?.vehicleId as string) ?? ''
  const routes = getContactOwnerRoutes(vehicleId)

  const handleIssueSelect = (issueId: IssueType) => {
    router.push(`${routes.verify}?issue=${issueId}`)
  }

  return (
    <div className="relative min-h-screen w-full max-w-[440px] mx-auto bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40">
        {/* Main Header Bar */}
        <div className="bg-white border-b border-[#e5e7eb]">
          <div className="flex items-center px-6 py-5">
            <div className="flex flex-col">
              <h1 className="font-bold text-[20px] text-[#111827] tracking-[-0.4px] leading-[1.2]">
                Contact Owner
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-6 rounded-full bg-[#1bb658]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#e5e7eb]" />
                </div>
                <span className="text-[11px] font-medium text-[#9ca3af] uppercase tracking-wider">
                  Step 1 of 2
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#f8fafb] h-1">
          <div
            className="bg-gradient-to-r from-[#1bb658] to-[#16a34a] h-full transition-all duration-500 ease-out"
            style={{ width: '50%' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-white to-[#fafafa] px-6 py-8 pb-20">
        <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Vehicle Details Card */}
          <div className="bg-white rounded-[20px] p-5 border-2 border-[#e5e7eb] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="shrink-0 size-16 flex items-center justify-center bg-gradient-to-br from-[#f8fafb] to-[#f1f3f5] rounded-2xl border border-[#e5e7eb]">
                <svg className="size-8 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">
                  Vehicle Information
                </p>
                <p className="font-bold text-[18px] text-[#111827] tracking-[-0.36px] leading-[1.3]">
                  Volkswagen Virtus GT Line
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-2.5 py-1 bg-[#f8fafb] rounded-md border border-[#e5e7eb]">
                    <p className="text-[12px] font-semibold text-[#111827] tracking-wide">
                      PY 01 DD 0069
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="size-1 bg-[#9ca3af] rounded-full" />
                    <p className="text-[12px] text-[#6b7280]">White</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-[24px] text-[#111827] tracking-[-0.48px] leading-[1.2]">
              What&apos;s the issue?
            </h2>
            <p className="font-normal text-[14px] text-[#6b7280] leading-[1.5]">
              Select the reason you need to contact this vehicle owner
            </p>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-br from-[#f0fdf4] via-white to-[#eff6ff] rounded-[4px] p-4 border-2 border-[#1bb658]/20 shadow-sm">
            <div className="flex gap-3">
              <div className="shrink-0 size-9 flex items-center justify-center bg-white rounded-[4px] border border-[#1bb658]/30">
                <Info className="size-4 text-[#1bb658]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[13px] text-[#111827] leading-[1.3]">
                  🔒 Anonymous & Secure
                </p>
                <p className="font-normal text-[12px] text-[#6b7280] mt-1 leading-[1.4]">
                  Your info stays private and is never shared
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {issues.map((issue) => (
              <button
                key={issue.id}
                onClick={() => handleIssueSelect(issue.id)}
                className="group bg-white flex flex-col items-center gap-3 p-4 rounded-[20px] border-2 border-[#e5e7eb] hover:border-[#1bb658] hover:shadow-lg hover:shadow-[#1bb658]/10 transition-all duration-200 active:scale-[0.98] min-h-[120px]"
              >
                <div className="shrink-0 size-14 flex items-center justify-center text-[32px] bg-gradient-to-br from-[#f8fafb] to-[#f1f3f5] group-hover:from-[#f0fdf4] group-hover:to-[#dcfce7] rounded-2xl transition-all">
                  {issue.emoji}
                </div>
                <div className="flex flex-col items-center text-center w-full">
                  <p className="font-semibold text-[14px] text-[#111827] tracking-[-0.28px] leading-[1.3]">
                    {issue.title}
                  </p>
                  <p className="font-normal text-[11px] text-[#9ca3af] mt-1 leading-[1.3] line-clamp-2">
                    {issue.description}
                  </p>
                </div>
              </button>
            ))}
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
