'use client'

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Check, ArrowLeft, Car, User, Phone, Shield, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

// Validation schema
const vehicleSchema = z.object({
  // Vehicle Details
  vehicleNumber: z
    .string()
    .min(1, 'Vehicle number is required')
    .transform((val) => val.trim())
    .refine(
      (val) => {
        const cleanVal = val.replace(/\s/g, '')
        // Pattern: 2 letters, 2 digits, 1-2 letters, 4 digits (e.g., AP01AB1234 or AP01A1234)
        return /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(cleanVal)
      },
      {
        message: 'Invalid format. Use: AP 01 AB 1234 (State, District, Series, Number)',
      }
    ),
  vehicleBrand: z.string().trim().min(1, 'Vehicle brand is required'),
  vehicleModel: z.string().trim().min(1, 'Vehicle model is required'),
  vehicleColor: z.string().trim().min(1, 'Vehicle color is required'),
  vehicleType: z.enum(['car', 'bike', 'auto', 'other'], 'Vehicle type is required'),

  // Owner Details
  ownerName: z
    .string()
    .trim()
    .min(1, 'Owner name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  ownerMobile: z
    .string()
    .trim()
    .min(1, 'Owner mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number (10 digits, starting with 6-9)'),

  // Emergency Contact
  emergencyName: z
    .string()
    .trim()
    .min(1, 'Emergency contact name is required')
    .max(100, 'Name must be less than 100 characters'),
  emergencyMobile: z
    .string()
    .trim()
    .min(1, 'Emergency mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number (10 digits, starting with 6-9)'),
  whatsappEnabled: z.boolean(),

  // Consent
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

type Step = 'form' | 'otp'

export default function RegisterVehiclePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [isLoading, setIsLoading] = useState(false)
  const [ownerMobile, setOwnerMobile] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)

  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]
  const resendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (resendIntervalRef.current) clearInterval(resendIntervalRef.current)
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    mode: 'onBlur', // Validate on blur (after user finishes entering)
    defaultValues: {
      whatsappEnabled: true,
      consent: true,
    },
  })

  const vehicleType = watch('vehicleType')
  const whatsappEnabled = watch('whatsappEnabled')
  const consent = watch('consent')

  const onSubmit = async (data: VehicleFormData) => {
    setIsLoading(true)

    // Simulate sending OTP to owner's mobile number
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log('Form submitted, sending OTP to:', data.ownerMobile)
    setOwnerMobile(data.ownerMobile)
    setIsLoading(false)
    setStep('otp')

    // Auto-focus first OTP input
    setTimeout(() => otpInputRefs[0].current?.focus(), 100)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setOtpError('')

    if (value && index < 3) otpInputRefs[index + 1].current?.focus()
    if (value && index === 3 && newOtp.every((d) => d !== '')) handleVerifyOTP(newOtp)
  }

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus()
    }
  }

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 4).split('')
    if (digits.length > 0) {
      const newOtp = [digits[0] ?? '', digits[1] ?? '', digits[2] ?? '', digits[3] ?? '']
      setOtp(newOtp)
      setOtpError('')
      const focusIndex = Math.min(digits.length, 3)
      otpInputRefs[focusIndex].current?.focus()
      if (digits.length === 4) {
        setTimeout(() => handleVerifyOTP(newOtp), 100)
      }
    }
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
      router.push(ROUTES.REGISTER_VEHICLE_SUCCESS)
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
    otpInputRefs[0].current?.focus()

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

  const handleBackToForm = () => {
    if (resendIntervalRef.current) {
      clearInterval(resendIntervalRef.current)
      resendIntervalRef.current = null
    }
    setStep('form')
    setOtp(['', '', '', ''])
    setOtpError('')
    setResendCooldown(0)
  }

  const handleReset = () => {
    reset()
  }

  // OTP Verification Screen
  if (step === 'otp') {
    return (
      <div className="relative min-h-screen w-full max-w-[440px] mx-auto bg-gradient-to-b from-white via-white to-[#f1fff7] overflow-x-hidden">
        <div className="absolute left-0 top-0 w-full z-40 flex justify-end p-6">
          <Link
            href={ROUTES.HOME}
            className="flex items-center justify-center size-11 rounded-full bg-white/80 backdrop-blur-sm border border-[#e5e7eb] hover:bg-white transition-all duration-200 active:scale-95"
          >
            <svg className="size-5 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20 animate-in fade-in duration-500">
          {/* Branding */}
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
              OTP sent to +91 {ownerMobile}
            </p>
            <button
              onClick={handleBackToForm}
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
              onClick={() => handleVerifyOTP()}
              disabled={isLoading || isVerifying || otp.some((d) => d === '')}
              className="w-full h-[54px] bg-[#1bb658] text-white font-semibold text-[16px] rounded-[99px] hover:bg-[#16a34a] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed mb-6"
            >
              {isLoading ? (
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
                onClick={handleResendOTP}
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
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full max-w-[440px] mx-auto bg-gradient-to-b from-white via-white to-[#f1fff7] overflow-x-hidden">
      {/* Header */}
      <div className="absolute left-0 top-0 w-full z-40 flex justify-end p-6">
        <Link
          href={ROUTES.HOME}
          className="flex items-center justify-center size-11 rounded-full bg-white/80 backdrop-blur-sm border border-[#e5e7eb] hover:bg-white transition-all duration-200 active:scale-95"
        >
          <svg className="size-5 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 items-start px-6 pt-[100px] pb-32">
        {/* Branding & Title */}
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="flex flex-col gap-3">
            <p className="font-medium text-[32px] text-[#1bb658] tracking-[-0.64px] leading-[1.2]">
              park safe
            </p>
            <div className="bg-gradient-to-r from-[#1bb658] to-transparent h-[2px] w-24" />
            <div className="flex flex-col gap-1.5">
              <p className="font-normal text-[15px] text-[#475569] tracking-[-0.3px] leading-[1.5]">
                ✓ Stay Protected, Stay Anonymous
              </p>
              <p className="font-normal text-[15px] text-[#475569] tracking-[-0.3px] leading-[1.5]">
                ✓ Setup Once, Protected Forever
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="font-bold text-[28px] text-black tracking-[-0.56px] leading-[1.3]">
              Register Your Vehicle
            </h1>
            <p className="font-normal text-[16px] text-[#64748b] tracking-[-0.32px] leading-[1.6]">
              Fill in your vehicle details to get your unique QR code
            </p>
          </div>
        </div>

        {/* Vehicle Details Section */}
        <div className="w-full">
          <div className="bg-white border border-[#a1a1aa] rounded-[24px] p-6 shadow-[0px_4px_0px_0px_#cbcbcb]">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 flex items-center justify-center bg-[#f0fdf4] rounded-xl">
                <Car className="size-5 text-[#1bb658]" />
              </div>
              <h2 className="font-semibold text-[18px] text-black tracking-[-0.36px]">
                Vehicle Details
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Vehicle Number */}
              <div>
                <Label htmlFor="vehicleNumber" className="font-medium text-[14px] text-[#64748b] mb-2 block tracking-[-0.28px]">
                  Vehicle Number <span className="text-[#e61d1c]">*</span>
                </Label>
                <Input
                  id="vehicleNumber"
                  placeholder="AP 01 AB 1234"
                  {...register('vehicleNumber')}
                  className={`h-[52px] text-[16px] font-medium uppercase tracking-[-0.32px] border-[0.5px] text-[#111827] placeholder:text-[#9ca3af] ${
                    errors.vehicleNumber 
                      ? 'border-[#e61d1c] focus:border-[#e61d1c]' 
                      : 'border-[#d1d5db] focus:border-[#1bb658]'
                  }`}
                  onChange={(e) => {
                    let cleanValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                    if (cleanValue.length === 0) {
                      setValue('vehicleNumber', '', { shouldValidate: false })
                      return
                    }
                    // Format: AP 01 AB 1234 (state + district + series 1-2 letters + 4 digits)
                    let formattedValue = cleanValue.slice(0, 2) // State
                    if (cleanValue.length > 2) {
                      formattedValue += ' ' + cleanValue.slice(2, 4) // District
                    }
                    if (cleanValue.length > 4) {
                      // Series: 1-2 letters, then 4 digits - extract letters until digit
                      let i = 4
                      while (i < cleanValue.length && /[A-Z]/.test(cleanValue[i])) {
                        i++
                      }
                      const series = cleanValue.slice(4, i)
                      const number = cleanValue.slice(i, i + 4)
                      formattedValue += ' ' + series
                      if (number) formattedValue += ' ' + number
                    }
                    setValue('vehicleNumber', formattedValue.trim(), { shouldValidate: false })
                  }}
                />
                {errors.vehicleNumber && (
                  <p className="mt-2 text-[13px] text-[#e61d1c] font-medium">
                    {errors.vehicleNumber.message}
                  </p>
                )}
              </div>

              {/* Vehicle Brand */}
              <div>
                <Label htmlFor="vehicleBrand" className="font-medium text-[14px] text-[#64748b] mb-2 block tracking-[-0.28px]">
                  Vehicle Brand <span className="text-[#e61d1c]">*</span>
                </Label>
                <Input
                  id="vehicleBrand"
                  placeholder="Honda, Toyota, Hero"
                  {...register('vehicleBrand')}
                  className="h-[52px] text-[16px] font-medium tracking-[-0.32px] border-[0.5px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af]"
                />
                {errors.vehicleBrand && (
                  <p className="mt-2 text-[13px] text-[#e61d1c] font-medium">
                    {errors.vehicleBrand.message}
                  </p>
                )}
              </div>

              {/* Vehicle Model */}
              <div>
                <Label htmlFor="vehicleModel" className="font-medium text-[14px] text-[#64748b] mb-2 block tracking-[-0.28px]">
                  Vehicle Model <span className="text-[#e61d1c]">*</span>
                </Label>
                <Input
                  id="vehicleModel"
                  placeholder="City, Fortuner, Splendor"
                  {...register('vehicleModel')}
                  className="h-[52px] text-[16px] font-medium tracking-[-0.32px] border-[0.5px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af]"
                />
                {errors.vehicleModel && (
                  <p className="mt-2 text-[13px] text-[#e61d1c] font-medium">
                    {errors.vehicleModel.message}
                  </p>
                )}
              </div>

              {/* Vehicle Color */}
              <div>
                <Label htmlFor="vehicleColor" className="font-medium text-[14px] text-[#64748b] mb-2 block tracking-[-0.28px]">
                  Vehicle Color <span className="text-[#e61d1c]">*</span>
                </Label>
                <Input
                  id="vehicleColor"
                  placeholder="White, Black, Red"
                  {...register('vehicleColor')}
                  className="h-[52px] text-[16px] font-medium tracking-[-0.32px] border-[0.5px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af]"
                />
                {errors.vehicleColor && (
                  <p className="mt-2 text-[13px] text-[#e61d1c] font-medium">
                    {errors.vehicleColor.message}
                  </p>
                )}
              </div>

              {/* Vehicle Type */}
              <div>
                <Label htmlFor="vehicleType" className="font-medium text-[14px] text-[#64748b] mb-2 block tracking-[-0.28px]">
                  Vehicle Type <span className="text-[#e61d1c]">*</span>
                </Label>
                <Select
                  value={vehicleType ?? ''}
                  onValueChange={(value) => setValue('vehicleType', value as 'car' | 'bike' | 'auto' | 'other')}
                >
                  <SelectTrigger className="!h-[52px] text-[16px] w-full font-medium tracking-[-0.32px] border-[0.5px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] data-[placeholder]:text-[#9ca3af]">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">🚗 Car</SelectItem>
                    <SelectItem value="bike">🏍️ Bike</SelectItem>
                    <SelectItem value="auto">🛺 Auto</SelectItem>
                    <SelectItem value="other">🚙 Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.vehicleType && (
                  <p className="mt-2 text-[13px] text-[#e61d1c] font-medium">
                    {errors.vehicleType.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Owner Details Section */}
        <div className="w-full">
          <div className="bg-white border border-[#a1a1aa] rounded-[24px] p-6 shadow-[0px_4px_0px_0px_#cbcbcb]">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 flex items-center justify-center bg-[#f0fdf4] rounded-xl">
                <User className="size-5 text-[#1bb658]" />
              </div>
              <h2 className="font-semibold text-[18px] text-black tracking-[-0.36px]">
                Owner Details
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Owner Name */}
              <div>
                <Label htmlFor="ownerName" className="font-medium text-[14px] text-[#64748b] mb-2 block tracking-[-0.28px]">
                  Full Name <span className="text-[#e61d1c]">*</span>
                </Label>
                <Input
                  id="ownerName"
                  placeholder="Enter your full name"
                  {...register('ownerName')}
                  className="h-[52px] text-[16px] font-medium tracking-[-0.32px] border-[0.5px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af]"
                />
                {errors.ownerName && (
                  <p className="mt-2 text-[13px] text-[#e61d1c] font-medium">
                    {errors.ownerName.message}
                  </p>
                )}
              </div>

              {/* Owner Mobile */}
              <div>
                <Label htmlFor="ownerMobile" className="font-medium text-[14px] text-[#64748b] mb-2 block tracking-[-0.28px]">
                  Mobile Number <span className="text-[#e61d1c]">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-[16px] text-[#64748b] tracking-[-0.32px]">
                    +91
                  </span>
                  <Input
                    id="ownerMobile"
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    {...register('ownerMobile')}
                    className="h-[52px] pl-14 text-[16px] font-medium tracking-[-0.32px] border-[0.5px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af]"
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setValue('ownerMobile', value)
                    }}
                  />
                </div>
                {errors.ownerMobile && (
                  <p className="mt-2 text-[13px] text-[#e61d1c] font-medium">
                    {errors.ownerMobile.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="w-full">
          <div className="bg-white border border-[#a1a1aa] rounded-[24px] p-6 shadow-[0px_4px_0px_0px_#cbcbcb]">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 flex items-center justify-center bg-[#f0fdf4] rounded-xl">
                <Phone className="size-5 text-[#1bb658]" />
              </div>
              <h2 className="font-semibold text-[18px] text-black tracking-[-0.36px]">
                Emergency Contact
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Emergency Contact Name */}
              <div>
                <Label htmlFor="emergencyName" className="font-medium text-[14px] text-[#64748b] mb-2 block tracking-[-0.28px]">
                  Full Name <span className="text-[#e61d1c]">*</span>
                </Label>
                <Input
                  id="emergencyName"
                  placeholder="Enter emergency contact name"
                  {...register('emergencyName')}
                  className="h-[52px] text-[16px] font-medium tracking-[-0.32px] border-[0.5px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af]"
                />
                {errors.emergencyName && (
                  <p className="mt-2 text-[13px] text-[#e61d1c] font-medium">
                    {errors.emergencyName.message}
                  </p>
                )}
              </div>

              {/* Emergency Contact Mobile */}
              <div>
                <Label htmlFor="emergencyMobile" className="font-medium text-[14px] text-[#64748b] mb-2 block tracking-[-0.28px]">
                  Mobile Number <span className="text-[#e61d1c]">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-[16px] text-[#64748b] tracking-[-0.32px]">
                    +91
                  </span>
                  <Input
                    id="emergencyMobile"
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    {...register('emergencyMobile')}
                    className="h-[52px] pl-14 text-[16px] font-medium tracking-[-0.32px] border-[0.5px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af]"
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setValue('emergencyMobile', value)
                    }}
                  />
                </div>
                {errors.emergencyMobile && (
                  <p className="mt-2 text-[13px] text-[#e61d1c] font-medium">
                    {errors.emergencyMobile.message}
                  </p>
                )}
              </div>

              {/* WhatsApp Enabled */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="whatsappEnabled"
                  checked={whatsappEnabled}
                  onCheckedChange={(checked) => setValue('whatsappEnabled', checked as boolean)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="whatsappEnabled"
                  className="font-medium text-[15px] text-[#111827] tracking-[-0.3px] cursor-pointer leading-[1.5] flex-1"
                >
                  WhatsApp notifications enabled
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Consent Section */}
        <div className="w-full">
          <div className="bg-white border border-[#1bb658] rounded-[24px] p-6 shadow-[0px_4px_0px_0px_#1bb658]">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 flex items-center justify-center bg-[#f0fdf4] rounded-xl">
                <Shield className="size-5 text-[#1bb658]" />
              </div>
              <h2 className="font-semibold text-[18px] text-black tracking-[-0.36px]">
                Consent
              </h2>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setValue('consent', checked as boolean)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label
                  htmlFor="consent"
                  className="font-normal text-[15px] text-[#475569] tracking-[-0.3px] cursor-pointer leading-[1.6]"
                >
                  I agree to be contacted only for vehicle-related issues{' '}
                  <span className="text-[#e61d1c]">*</span>
                </Label>
                {errors.consent && (
                  <p className="mt-2 text-[13px] text-[#e61d1c] font-medium">
                    {errors.consent.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-4 items-stretch">
          <button
            type="button"
            onClick={handleReset}
            className="bg-white border border-[#a1a1aa] flex-1 h-[54px] rounded-[99px] shadow-[0px_4px_0px_0px_#cbcbcb] hover:shadow-[0px_6px_0px_0px_#cbcbcb] hover:-translate-y-0.5 active:shadow-[0px_2px_0px_0px_#cbcbcb] active:translate-y-0.5 transition-all duration-200"
          >
            <p className="font-semibold text-[16px] text-[#64748b] tracking-[-0.32px]">
              Reset
            </p>
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-white border border-[#1bb658] flex-1 h-[54px] rounded-[99px] shadow-[0px_4px_0px_0px_#1bb658] hover:shadow-[0px_6px_0px_0px_#1bb658] hover:-translate-y-0.5 active:shadow-[0px_2px_0px_0px_#1bb658] active:translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0px_4px_0px_0px_#1bb658] disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="size-4 border-2 border-[#1bb658]/30 border-t-[#1bb658] rounded-full animate-spin" />
                <p className="font-semibold text-[16px] text-[#1bb658] tracking-[-0.32px]">
                  Sending OTP...
                </p>
              </span>
            ) : (
              <p className="font-semibold text-[16px] text-[#1bb658] tracking-[-0.32px]">
                Register Vehicle
              </p>
            )}
          </button>
        </div>

        {/* Trust Footer */}
        <div className="w-full mt-8 pt-6 border-t border-[#e5e7eb]">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="flex items-center justify-center">
              <ShieldCheck className="size-5 text-[#1bb658]" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[15px] text-[#111827] tracking-[-0.3px]">
                Your Privacy is Our Priority
              </p>
              <p className="font-normal text-[13px] text-[#6b7280] leading-[1.6] max-w-[320px]">
                Your personal information is encrypted and secure. We never share your contact details with anyone. Only vehicle-related issues will reach you.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-[#1bb658]" />
                <span className="font-normal text-[12px] text-[#6b7280]">100% Anonymous</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-[#1bb658]" />
                <span className="font-normal text-[12px] text-[#6b7280]">Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-[#1bb658]" />
                <span className="font-normal text-[12px] text-[#6b7280]">No Spam</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
