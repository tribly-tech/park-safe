'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Settings as SettingsIcon, Bell, Globe } from 'lucide-react'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [notifications, setNotifications] = useLocalStorage<boolean>(
    `${STORAGE_KEYS.PROFILE}_notifications`,
    true
  )
  const [language, setLanguage] = useState('en')

  const handleNotificationsToggle = () => {
    setNotifications(!notifications)
    toast.success(notifications ? 'Notifications off' : 'Notifications on', {
      duration: 2000,
    })
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
          Settings
        </span>
        <div className="size-10" aria-hidden />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-[440px] mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-bold text-[24px] text-[#111827] tracking-[-0.48px] mb-1">
              App preferences
            </h1>
            <p className="font-normal text-[15px] text-[#6b7280] leading-[1.5]">
              Customize how Park Safe works for you
            </p>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-10 flex items-center justify-center bg-[#f0fdf4] rounded-xl">
                <Bell className="size-5 text-[#1bb658]" />
              </div>
              <h2 className="font-semibold text-[18px] text-[#111827] tracking-[-0.36px]">
                Notifications
              </h2>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label className="font-medium text-[15px] text-[#111827]">
                  Push notifications
                </Label>
                <p className="font-normal text-[13px] text-[#6b7280] mt-0.5">
                  Get alerts when someone scans your QR code
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifications}
                onClick={handleNotificationsToggle}
                className={`shrink-0 size-12 rounded-full border-2 transition-all duration-200 ${
                  notifications
                    ? 'bg-[#1bb658] border-[#1bb658]'
                    : 'bg-[#e5e7eb] border-[#d1d5db]'
                }`}
              >
                <span
                  className={`block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ml-0.5 ${
                    notifications ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 flex items-center justify-center bg-[#f0fdf4] rounded-xl">
                <Globe className="size-5 text-[#1bb658]" />
              </div>
              <h2 className="font-semibold text-[18px] text-[#111827] tracking-[-0.36px]">
                Language
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-[14px] text-[#64748b]">
                App language
              </Label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-[52px] w-full px-4 rounded-xl border border-[#d1d5db] focus:border-[#1bb658] focus:ring-2 focus:ring-[#1bb658]/20 outline-none text-[16px] font-medium text-[#111827] bg-white"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
          </div>

          {/* About */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 flex items-center justify-center bg-[#f0fdf4] rounded-xl">
                <SettingsIcon className="size-5 text-[#1bb658]" />
              </div>
              <h2 className="font-semibold text-[18px] text-[#111827] tracking-[-0.36px]">
                About
              </h2>
            </div>
            <p className="font-normal text-[14px] text-[#6b7280] leading-[1.5]">
              Park Safe v1.0.0 — Stay protected, stay anonymous.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
