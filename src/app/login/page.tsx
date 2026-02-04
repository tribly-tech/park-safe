'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import { sanitizeIndianPhone, getIndianPhoneError, isValidIndianPhone } from '@/lib/phone-utils'
import { OTPVerification } from '@/components/OTPVerification'

type LoginStep = 'phone' | 'otp'

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [phoneError, setPhoneError] = useState('')
  const [otpError, setOtpError] = useState('')

  const resendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (resendIntervalRef.current) clearInterval(resendIntervalRef.current)
    }
  }, [])

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

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep('otp')
    }, 1500)
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

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsVerifying(false)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(true))
      }
      window.location.href = `${ROUTES.HOME}?drawer=open&loggedIn=true`
    }, 1500)
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

  return (
    <div className="relative min-h-screen w-full max-w-[440px] mx-auto bg-gradient-to-b from-white via-white to-[#f1fff7] overflow-x-hidden">
      {/* Header */}
      <div className="absolute left-0 top-0 w-full z-40 p-6">
        <Link
          href={ROUTES.HOME}
          className="flex items-center justify-center size-11 rounded bg-white/80 backdrop-blur-sm border border-[#e5e7eb] hover:bg-white transition-all duration-200 active:scale-95"
        >
          <ArrowLeft className="size-5 text-[#111827]" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {step === 'phone' ? (
          <div className="w-full max-w-[340px] flex flex-col animate-in fade-in duration-500">
            {/* Title */}
            <h1 className="font-bold text-[28px] text-[#111827] tracking-[-0.56px] leading-[1.2] mb-2">
              Welcome Back
            </h1>
            <p className="font-normal text-[15px] text-[#6b7280] leading-[1.5] mb-10">
              Enter your phone number to continue
            </p>

            {/* Phone Input – matches contact-owner verify page */}
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
                  Sending...
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        ) : (
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
        )}
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center px-6">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-[#1bb658]" />
          <p className="font-medium text-[12px] text-[#6b7280]">
            Secured by <span className="text-[#1bb658] font-semibold">Park Safe</span>
          </p>
        </div>
      </div>
    </div>
  )
}
