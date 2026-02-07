'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { Suspense } from 'react'
import { ROUTES, getContactOwnerRoutes } from '@/lib/constants'
import { sanitizeIndianPhone, getIndianPhoneError, isValidIndianPhone } from '@/lib/phone-utils'
import { OTPVerification } from '@/components/OTPVerification'
import { issues, VALID_ISSUE_IDS, type IssueType } from '@/lib/contact-owner-data'

function VerifyContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const vehicleId = (params?.vehicleId as string) ?? ''
  const routes = getContactOwnerRoutes(vehicleId)
  const issueParam = searchParams.get('issue') as IssueType | null

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [phoneError, setPhoneError] = useState('')

  const resendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const selectedIssue = VALID_ISSUE_IDS.includes(issueParam as IssueType) ? issueParam : null
  const selectedIssueData = issues.find((issue) => issue.id === selectedIssue)

  useEffect(() => {
    return () => {
      if (resendIntervalRef.current) clearInterval(resendIntervalRef.current)
    }
  }, [])

  if (!selectedIssue || !selectedIssueData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6">
        <p className="text-[#6b7280] text-center">
          Invalid or missing issue. Please select an issue first.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-[280px]">
          <Link href={routes.base}>
            <button className="w-full h-[54px] bg-[#1bb658] text-white font-semibold rounded-[99px] hover:bg-[#16a34a]">
              Select Issue
            </button>
          </Link>
          <Link href={ROUTES.HOME}>
            <button className="w-full h-[54px] border-2 border-[#e5e7eb] rounded-[99px] font-semibold text-[#6b7280] hover:bg-[#f8fafb]">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(sanitizeIndianPhone(value))
    setPhoneError('')
  }

  const handleSendOTP = async () => {
    const error = getIndianPhoneError(phoneNumber)
    if (error) {
      setPhoneError(error)
      return
    }

    setIsLoading(true)
    setPhoneError('')

    // Simulate sending OTP
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setStep('otp')
  }

  const handleVerifyOTP = async (otpToVerify: string[] = otp) => {
    if (otpToVerify.some((d) => d === '')) {
      setOtpError('Please enter all 4 digits')
      return
    }
    if (isVerifying) return

    setIsVerifying(true)
    setIsLoading(true)
    setOtpError('')

    try {
      // Simulate OTP verification API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push(`${routes.chooseAction}?issue=${selectedIssue}`)
    } finally {
      setIsLoading(false)
      setIsVerifying(false)
    }
  }

  const handleResendOTP = () => {
    if (resendCooldown > 0) return

    if (resendIntervalRef.current) clearInterval(resendIntervalRef.current)

    setOtp(['', '', '', ''])
    setOtpError('')
    setResendCooldown(60)

    resendIntervalRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (resendIntervalRef.current) {
            clearInterval(resendIntervalRef.current)
            resendIntervalRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleBackToPhone = () => {
    if (resendIntervalRef.current) {
      clearInterval(resendIntervalRef.current)
      resendIntervalRef.current = null
    }
    setStep('phone')
    setOtp(['', '', '', ''])
    setOtpError('')
    setResendCooldown(0)
  }

  // OTP Verification Screen - reuses register-vehicle design
  if (step === 'otp') {
    return (
      <div className="relative min-h-screen w-full max-w-[440px] mx-auto bg-gradient-to-b from-white via-white to-[#f1fff7] overflow-x-hidden">
        <OTPVerification
          mobile={phoneNumber}
          otp={otp}
          onOtpChange={setOtp}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          onBack={handleBackToPhone}
          otpError={otpError}
          isLoading={isLoading}
          isVerifying={isVerifying}
          resendCooldown={resendCooldown}
          backLabel="Change number"
        />
      </div>
    )
  }

  // Phone Input Screen
  return (
    <div className="relative min-h-screen w-full max-w-[440px] mx-auto bg-gradient-to-b from-white via-white to-[#f1fff7] overflow-x-hidden">
      <div className="absolute left-0 top-0 w-full z-40 flex items-center p-6">
        <Link
          href={routes.base}
          className="flex items-center justify-center size-11 rounded-full bg-white/80 backdrop-blur-sm border border-[#e5e7eb] hover:bg-white transition-all duration-200 active:scale-95"
        >
          <ArrowLeft className="size-5 text-[#111827]" />
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20 animate-in fade-in duration-500">
        {/* Branding - matches register-vehicle */}
        <div className="w-full max-w-[340px] mb-10">
          <p className="font-medium text-[28px] text-[#1bb658] tracking-[-0.56px] leading-[1.2] mb-2">
            park safe
          </p>
          <div className="bg-gradient-to-r from-[#1bb658] to-transparent h-[2px] w-20" />
        </div>

        <div className="w-full max-w-[340px] flex flex-col">
          <h1 className="font-bold text-[28px] text-black tracking-[-0.56px] leading-[1.2] mb-2">
            Verify Your Number
          </h1>
          <p className="font-normal text-[15px] text-[#64748b] leading-[1.5] mb-10">
            Enter your phone number to continue. We&apos;ll send you an OTP to verify.
          </p>

          {/* Phone Input */}
          <div className="w-full mb-6">
            <label className="block font-medium text-[13px] text-[#64748b] mb-2">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-[16px] text-[#111827]">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="0000000000"
                className="w-full h-[54px] pl-14 pr-4 bg-white border-2 border-[#e5e7eb] rounded-[12px] font-medium text-[16px] text-[#111827] placeholder:text-[#cbd5e1] focus:outline-none focus:border-[#1bb658] transition-all duration-200"
                maxLength={10}
                autoFocus
              />
            </div>
            {phoneError && (
              <p className="mt-2 text-[13px] text-[#e61d1c] font-medium">{phoneError}</p>
            )}
          </div>

          {/* Send OTP Button */}
          <button
            onClick={handleSendOTP}
            disabled={isLoading || !isValidIndianPhone(phoneNumber)}
            className="w-full h-[54px] bg-[#1bb658] text-white font-semibold text-[16px] rounded-[99px] hover:bg-[#16a34a] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending OTP...
              </span>
            ) : (
              'Send OTP'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ContactOwnerVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="size-6 border-2 border-[#1bb658]/30 border-t-[#1bb658] rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
