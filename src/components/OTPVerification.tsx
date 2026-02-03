'use client'

import { useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react'

interface OTPVerificationProps {
  mobile: string
  otp: string[]
  onOtpChange: (otp: string[]) => void
  onVerify: (otp: string[]) => void
  onResend: () => void
  onBack?: () => void
  otpError?: string
  isLoading?: boolean
  isVerifying?: boolean
  resendCooldown?: number
  backLabel?: string
}

export function OTPVerification({
  mobile,
  otp,
  onOtpChange,
  onVerify,
  onResend,
  onBack,
  otpError = '',
  isLoading = false,
  isVerifying = false,
  resendCooldown = 0,
  backLabel = 'Change number',
}: OTPVerificationProps) {
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    onOtpChange(newOtp)

    if (value && index < 3) otpInputRefs[index + 1].current?.focus()
    if (value && index === 3 && newOtp.every((d) => d !== '')) onVerify(newOtp)
  }

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus()
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => otpInputRefs[0].current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 4).split('')
    if (digits.length > 0) {
      const newOtp = [digits[0] ?? '', digits[1] ?? '', digits[2] ?? '', digits[3] ?? '']
      onOtpChange(newOtp)
      const focusIndex = Math.min(digits.length, 3)
      otpInputRefs[focusIndex].current?.focus()
      if (digits.length === 4) {
        setTimeout(() => onVerify(newOtp), 100)
      }
    }
  }

  return (
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
          Verify OTP
        </h1>
        <p className="font-normal text-[15px] text-[#64748b] leading-[1.5] mb-1">
          OTP sent to +91 {mobile}
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="text-[14px] text-[#1bb658] hover:text-[#16a34a] font-medium transition-colors mb-10 text-left w-fit"
          >
            {backLabel}
          </button>
        )}

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
                className="size-[64px] text-center text-[24px] font-bold border-2 border-[#e5e7eb] focus:outline-none focus:border-[#1bb658] rounded-[12px] bg-white text-[#111827] transition-colors"
              />
            ))}
          </div>
          {otpError && (
            <p className="text-center text-[13px] text-[#e61d1c] font-medium">{otpError}</p>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={() => onVerify(otp)}
          disabled={isLoading || isVerifying || otp.some((d) => d === '')}
          className="w-full h-[54px] bg-[#1bb658] text-white font-semibold text-[16px] rounded-[99px] hover:bg-[#16a34a] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed mb-6"
        >
          {isLoading || isVerifying ? (
            <span className="flex items-center justify-center gap-2">
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            'Verify OTP'
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          <button
            onClick={onResend}
            disabled={resendCooldown > 0}
            className="text-[14px] text-[#6b7280] hover:text-[#1bb658] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-[#6b7280]"
          >
            Didn&apos;t receive?{' '}
            <span className="text-[#1bb658] font-semibold">
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
