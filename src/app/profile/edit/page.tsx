'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, User, Mail, Phone } from 'lucide-react'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export type ProfileData = {
  displayName?: string
  email?: string
  phone?: string
}

const defaultProfile: ProfileData = {
  displayName: '',
  email: '',
  phone: '',
}

export default function EditProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useLocalStorage<ProfileData>(
    STORAGE_KEYS.PROFILE,
    defaultProfile
  )
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '')
  const [email, setEmail] = useState(profile?.email ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setDisplayName(profile?.displayName ?? '')
    setEmail(profile?.email ?? '')
    setPhone(profile?.phone ?? '')
  }, [profile?.displayName, profile?.email, profile?.phone])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setProfile({
      displayName: displayName.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
    })
    toast.success('Profile updated', {
      description: 'Your changes have been saved.',
      duration: 2000,
    })
    setIsSaving(false)
    router.push(ROUTES.PROFILE)
  }

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
          Edit profile
        </span>
        <div className="size-10" aria-hidden />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto px-6 py-8 max-w-[440px] mx-auto w-full"
      >
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-bold text-[24px] text-[#111827] tracking-[-0.48px] mb-1">
              Your details
            </h1>
            <p className="font-normal text-[15px] text-[#6b7280] leading-[1.5]">
              Update your name and contact info
            </p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-10 flex items-center justify-center bg-[#f0fdf4] rounded-xl">
                <User className="size-5 text-[#1bb658]" />
              </div>
              <h2 className="font-semibold text-[18px] text-[#111827] tracking-[-0.36px]">
                Personal
              </h2>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="displayName"
                className="font-medium text-[14px] text-[#64748b] tracking-[-0.28px]"
              >
                Display name
              </Label>
              <Input
                id="displayName"
                type="text"
                placeholder="e.g. John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-[52px] text-[16px] font-medium tracking-[-0.32px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af] rounded-xl"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-medium text-[14px] text-[#64748b] tracking-[-0.28px]"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[52px] text-[16px] font-medium tracking-[-0.32px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af] rounded-xl"
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="font-medium text-[14px] text-[#64748b] tracking-[-0.28px]"
              >
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setPhone(v)
                }}
                className="h-[52px] text-[16px] font-medium tracking-[-0.32px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af] rounded-xl"
                maxLength={10}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full h-[54px] bg-[#1bb658] text-white font-semibold text-[16px] rounded-2xl hover:bg-[#16a34a] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0px_4px_0px_0px_#16a34a] hover:shadow-[0px_6px_0px_0px_#16a34a]"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'Save changes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
