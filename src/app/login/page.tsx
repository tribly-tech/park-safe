'use client'

import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react'
import { ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'

type LoginStep = 'phone' | 'otp'

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Refs for OTP inputs
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const handlePhoneChange = (value: string) => {
    // Only allow numbers and limit to 10 digits
    const cleaned = value.replace(/\D/g, '').slice(0, 10)
    setPhoneNumber(cleaned)
    setError('')
  }

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep('otp')
      // Auto-focus first OTP input
      setTimeout(() => otpInputRefs[0].current?.focus(), 100)
    }, 1500)
  }

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1)
    }

    if (!/^\d*$/.test(value)) {
      return // Only allow numbers
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 3) {
      otpInputRefs[index + 1].current?.focus()
    }

    // Auto-submit when all digits are entered
    if (value && index === 3 && newOtp.every(digit => digit !== '')) {
      handleVerifyOTP(newOtp)
    }
  }

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus()
    }
  }

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').trim()
    const digits = pastedData.replace(/\D/g, '').slice(0, 4).split('')
    
    if (digits.length === 4) {
      setOtp(digits)
      otpInputRefs[3].current?.focus()
      // Auto-submit after paste
      setTimeout(() => handleVerifyOTP(digits), 100)
    }
  }

  const handleVerifyOTP = async (otpToVerify: string[] = otp) => {
    if (otpToVerify.some(digit => digit === '')) {
      setError('Please enter all 4 digits')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      
      // Save login state to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(true))
      }
      
      // Redirect to home page and open drawer
      window.location.href = `${ROUTES.HOME}?drawer=open&loggedIn=true`
    }, 1500)
  }

  const handleResendOTP = () => {
    setOtp(['', '', '', ''])
    setError('')
    otpInputRefs[0].current?.focus()
    // Simulate resend
    setTimeout(() => {
      // Show toast or success message
    }, 500)
  }

  const handleBackToPhone = () => {
    setStep('phone')
    setOtp(['', '', '', ''])
    setError('')
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
                  className="w-full h-[54px] pl-14 pr-4 bg-white border-2 border-[#e5e7eb] rounded font-medium text-[16px] text-[#111827] placeholder:text-[#cbd5e1] focus:outline-none focus:border-[#1bb658] transition-all duration-200"
                  maxLength={10}
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-[13px] text-[#dc2626] font-medium">
                  {error}
                </p>
              )}
            </div>

            {/* Send OTP Button */}
            <button
              onClick={handleSendOTP}
              disabled={isLoading || phoneNumber.length !== 10}
              className="w-full h-[54px] bg-[#1bb658] text-white font-semibold text-[16px] rounded hover:bg-[#16a34a] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1bb658]"
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
          <div className="w-full max-w-[340px] flex flex-col animate-in fade-in duration-500">
            {/* Title */}
            <h1 className="font-bold text-[28px] text-[#111827] tracking-[-0.56px] leading-[1.2] mb-2">
              Enter OTP
            </h1>
            <p className="font-normal text-[15px] text-[#6b7280] leading-[1.5] mb-1">
              Sent to +91 {phoneNumber}
            </p>
            <button
              onClick={handleBackToPhone}
              className="text-[14px] text-[#1bb658] hover:text-[#16a34a] font-medium transition-colors mb-10 text-left w-fit"
            >
              Change number
            </button>

            {/* OTP Input */}
            <div className="w-full mb-6">
              <div className="flex gap-3 justify-center mb-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpInputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="size-[64px] bg-white border-2 border-[#e5e7eb] rounded font-bold text-[28px] text-[#111827] text-center focus:outline-none focus:border-[#1bb658] transition-all duration-200"
                  />
                ))}
              </div>
              {error && (
                <p className="text-center text-[13px] text-[#dc2626] font-medium">
                  {error}
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={() => handleVerifyOTP()}
              disabled={isLoading || otp.some(digit => digit === '')}
              className="w-full h-[54px] bg-[#1bb658] text-white font-semibold text-[16px] rounded hover:bg-[#16a34a] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1bb658] mb-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify'
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                onClick={handleResendOTP}
                className="text-[14px] text-[#6b7280] hover:text-[#1bb658] font-medium transition-colors"
              >
                Didn't receive? <span className="text-[#1bb658] font-semibold">Resend</span>
              </button>
            </div>
          </div>
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
