'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  UserCircle,
  QrCode,
  LogIn,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  Settings,
  Edit3,
  Tag,
  ShoppingCart,
  ChevronRight,
  Truck,
} from 'lucide-react'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { ProfileData } from './edit/page'
import type { VehicleData } from '@/types'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export default function ProfilePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn, removeIsLoggedIn] = useLocalStorage<boolean>(
    STORAGE_KEYS.USER,
    false
  )
  const [profile] = useLocalStorage<ProfileData | null>(STORAGE_KEYS.PROFILE, null)
  const [vehicle] = useLocalStorage<VehicleData | null>(STORAGE_KEYS.VEHICLE, null)
  const [isRegisterQRModalOpen, setIsRegisterQRModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Use stored values only after mount to avoid hydration mismatch (server has no localStorage)
  const isLoggedInSafe = mounted ? isLoggedIn : false
  const profileSafe = mounted ? profile : null
  const vehicleSafe = mounted ? vehicle : null

  const hasRegisteredVehicle =
    !!vehicleSafe &&
    !!vehicleSafe.make?.trim() &&
    !!vehicleSafe.model?.trim()
  const licensePlateDisplay =
    vehicleSafe?.licensePlate?.replace(/([A-Z]{2})([0-9]{2})([A-Z]{1,2})([0-9]{4})/, '$1 $2 $3 $4') ??
    vehicleSafe?.licensePlate ??
    '—'
  const displayName =
    profileSafe?.displayName?.trim() ||
    (hasRegisteredVehicle ? 'John Doe' : 'Hey guest')

  const handleLogin = () => {
    router.push(ROUTES.LOGIN)
  }

  const handleLogout = () => {
    removeIsLoggedIn()
    setIsLoggedIn(false)
    toast.success('Signed out successfully', {
      description: 'You have been logged out of your account',
      duration: 3000,
    })
    router.push(ROUTES.HOME)
  }

  const handleSupport = () => {
    router.push(ROUTES.SUPPORT)
  }

  const handleTerms = () => {
    router.push(ROUTES.TERMS)
  }

  const handlePolicies = () => {
    router.push(ROUTES.PRIVACY)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#fafafa]">
      {/* Sticky Back Button */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-white via-white/95 to-transparent backdrop-blur-sm border-b border-[#e5e7eb]">
        <Link
          href={ROUTES.HOME}
          className="group shrink-0 size-10 flex items-center justify-center rounded-full bg-white border border-[#e5e7eb] hover:border-[#1bb658] hover:bg-[#f1fff7] transition-all duration-200 active:scale-95"
          aria-label="Back to home"
        >
          <ChevronLeft className="size-5 text-[#6b7280] group-hover:text-[#1bb658] transition-colors" />
        </Link>
        <span className="font-semibold text-[16px] text-[#111827]">
          {isLoggedInSafe ? 'Account' : 'Profile'}
        </span>
        <div className="size-10" aria-hidden />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header Section with Gradient */}
        <div className="px-6 pt-4 pb-8 bg-gradient-to-br from-[#1bb658]/5 via-white to-white">
          {isLoggedInSafe ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="size-20 rounded-3xl bg-gradient-to-br from-[#1bb658] to-[#16a34a] flex items-center justify-center shadow-lg shadow-[#1bb658]/20">
                  <UserCircle className="size-12 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-white border-2 border-white flex items-center justify-center">
                  <div className="size-3 rounded-full bg-[#1bb658]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[20px] text-[#111827] tracking-[-0.4px] truncate">
                  {displayName}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-2.5 py-1 rounded-full bg-[#dcfce7]">
                    <p className="font-medium text-[11px] text-[#16a34a] uppercase tracking-wide">
                      Active
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href={ROUTES.PROFILE_EDIT}
                className="shrink-0 size-10 flex items-center justify-center rounded-full bg-white border border-[#e5e7eb] hover:border-[#1bb658] hover:bg-[#f1fff7] transition-all duration-200 active:scale-95"
                aria-label="Edit profile"
              >
                <Edit3 className="size-4 text-[#1bb658]" />
              </Link>
            </div>
          ) : (
            <div>
              <div className="size-16 rounded-2xl bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 flex items-center justify-center mb-4">
                <UserCircle className="size-8 text-[#1bb658]" />
              </div>
              <h2 className="font-bold text-[24px] text-[#111827] tracking-[-0.48px] mb-2">
                Welcome to Park Safe
              </h2>
              <p className="font-normal text-[15px] text-[#6b7280] leading-[1.6]">
                Sign in to manage your QR codes and vehicle settings
              </p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="px-6 py-6">
          <div className="flex flex-col gap-2">
            {isLoggedInSafe ? (
              <>
                {/* Vehicle details card – when vehicle is registered */}
                {hasRegisteredVehicle && vehicleSafe && (
                  <div className="mb-4">
                    <Link
                      href={ROUTES.VEHICLE_EDIT}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.99] text-left"
                    >
                      <div className="shrink-0 size-12 flex items-center justify-center rounded-xl bg-[#f4f4f5] group-hover:bg-[#f0fdf4] transition-colors">
                        <Truck className="size-6 text-[#52525b]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1.5">
                          Vehicle information
                        </p>
                        <p className="font-bold text-[17px] text-[#111827] tracking-[-0.34px] truncate">
                          {vehicleSafe.make} {vehicleSafe.model}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#f4f4f5] font-semibold text-[13px] text-[#111827]">
                            {licensePlateDisplay}
                          </span>
{vehicleSafe.color && (
                              <>
                                <span className="size-1 rounded-full bg-[#9ca3af]" aria-hidden />
                                <span className="font-normal text-[13px] text-[#6b7280]">
                                  {vehicleSafe.color}
                                </span>
                              </>
                            )}
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-[#d1d5db] group-hover:text-[#1bb658] transition-colors shrink-0" />
                    </Link>
                  </div>
                )}

                {/* Activate parksafe tag card – always shown */}
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setIsRegisterQRModalOpen(true)}
                    className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#f0fdf4] to-white border border-[#1bb658] shadow-[0px_4px_0px_0px_#1bb658] hover:shadow-[0px_6px_0px_0px_#1bb658] hover:translate-y-[-1px] transition-all duration-200 active:scale-[0.99] text-left"
                  >
                    <div className="shrink-0 size-11 flex items-center justify-center rounded-xl bg-white shadow-sm group-hover:bg-[#f0fdf4] transition-colors">
                      <QrCode className="size-5 text-[#1bb658]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[16px] text-[#111827] tracking-[-0.32px]">
                        Activate parksafe tag
                      </p>
                      <p className="font-normal text-[13px] text-[#6b7280] mt-0.5 leading-[1.5]">
                        Link your tag to your account
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-[#d1d5db] group-hover:text-[#1bb658] transition-colors shrink-0" />
                  </button>
                </div>

                {/* Quick Actions Section */}
                <div className="mb-4">
                  <p className="font-semibold text-[12px] text-[#9ca3af] uppercase tracking-wider mb-3 px-1">
                    Quick Actions
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={ROUTES.SETTINGS}
                      className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.98]"
                    >
                      <div className="shrink-0 size-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 group-hover:from-[#1bb658]/20 group-hover:to-[#16a34a]/10 transition-all">
                        <Settings className="size-5 text-[#1bb658]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px]">
                          Settings
                        </p>
                        <p className="font-normal text-[13px] text-[#6b7280] mt-0.5 truncate">
                          App preferences
                        </p>
                      </div>
                      <ChevronRight className="size-4 text-[#d1d5db] group-hover:text-[#1bb658] transition-colors" />
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="group relative w-full flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#1bb658] to-[#16a34a] text-white hover:shadow-xl hover:shadow-[#1bb658]/25 transition-all duration-200 active:scale-[0.98] mb-4"
              >
                <div className="shrink-0 size-12 flex items-center justify-center bg-white/20 rounded-xl group-hover:bg-white/30 transition-all">
                  <LogIn className="size-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-[17px] tracking-[-0.34px]">
                    Sign In
                  </p>
                  <p className="font-normal text-[13px] text-white/90 mt-0.5">
                    Access your account
                  </p>
                </div>
                <ChevronRight className="size-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            )}

            {/* Support Section */}
            <div className="mb-4">
              <p className="font-semibold text-[12px] text-[#9ca3af] uppercase tracking-wider mb-3 px-1 text-left">
                Support
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSupport}
                  className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.98] text-left w-full"
                >
                  <div className="shrink-0 size-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 group-hover:from-[#1bb658]/20 group-hover:to-[#16a34a]/10 transition-all">
                    <HelpCircle className="size-5 text-[#1bb658]" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px] text-left">
                      Help & Contact
                    </p>
                    <p className="font-normal text-[13px] text-[#6b7280] mt-0.5 text-left">
                      Get help and contact support
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-[#d1d5db] group-hover:text-[#1bb658] transition-colors shrink-0" />
                </button>
              </div>
            </div>

            {/* Legal Section */}
            <div>
              <p className="font-semibold text-[12px] text-[#9ca3af] uppercase tracking-wider mb-3 px-1 text-left">
                Legal
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleTerms}
                  className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.98] text-left w-full"
                >
                  <div className="shrink-0 size-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 group-hover:from-[#1bb658]/20 group-hover:to-[#16a34a]/10 transition-all">
                    <FileText className="size-5 text-[#1bb658]" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px] text-left">
                      Terms of Service
                    </p>
                    <p className="font-normal text-[13px] text-[#6b7280] mt-0.5 text-left">
                      Read our terms and conditions
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-[#d1d5db] group-hover:text-[#1bb658] transition-colors shrink-0" />
                </button>

                <button
                  onClick={handlePolicies}
                  className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.98] text-left w-full"
                >
                  <div className="shrink-0 size-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 group-hover:from-[#1bb658]/20 group-hover:to-[#16a34a]/10 transition-all">
                    <Shield className="size-5 text-[#1bb658]" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px] text-left">
                      Privacy Policy
                    </p>
                    <p className="font-normal text-[13px] text-[#6b7280] mt-0.5 text-left">
                      How we protect your data
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-[#d1d5db] group-hover:text-[#1bb658] transition-colors shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="px-6 py-5 border-t border-[#e5e7eb] bg-white/50 backdrop-blur-sm">
          {isLoggedInSafe ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 p-4 rounded bg-gradient-to-r from-[#f3f4f6] to-[#e5e7eb] hover:from-[#e5e7eb] hover:to-[#d1d5db] active:scale-[0.98] transition-all duration-200 group border border-[#e5e7eb]"
            >
              <LogOut className="size-5 text-[#6b7280] group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-[16px] text-[#6b7280] tracking-[-0.32px]">
                Sign Out
              </p>
            </button>
          ) : (
            <div className="text-center">
              <p className="font-normal text-[12px] text-[#9ca3af]">
                Park Safe v1.0.0
              </p>
            </div>
          )}
          {isLoggedInSafe && (
            <p className="text-center font-normal text-[11px] text-[#d1d5db] mt-2">
              Park Safe v1.0.0
            </p>
          )}
        </div>
      </div>

      {/* Register Park Safe QR modal – choose tag path */}
      <Dialog open={isRegisterQRModalOpen} onOpenChange={setIsRegisterQRModalOpen}>
        <DialogContent className="rounded-2xl border-[#e5e7eb] p-6 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center text-[20px] font-bold text-[#111827] tracking-[-0.4px]">
              Register Park Safe QR
            </DialogTitle>
            <DialogDescription className="text-center text-[14px] text-[#6b7280] mt-2">
              Choose how you want to get started
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsRegisterQRModalOpen(false)
                router.push(ROUTES.REGISTER_VEHICLE)
              }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.98] text-left group w-full"
            >
              <div className="shrink-0 size-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 group-hover:from-[#1bb658]/20 group-hover:to-[#16a34a]/10 transition-all">
                <Tag className="size-5 text-[#1bb658]" />
              </div>
              <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px]">
                I have parksafe tag with me
              </p>
              <ChevronRight className="size-4 text-[#d1d5db] group-hover:text-[#1bb658] transition-colors shrink-0 ml-auto" />
            </button>
            <Link
              href={ROUTES.SUPPORT}
              onClick={() => setIsRegisterQRModalOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e7eb] hover:border-[#1bb658]/30 hover:shadow-md hover:shadow-[#1bb658]/5 transition-all duration-200 active:scale-[0.98] text-left group"
            >
              <div className="shrink-0 size-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1bb658]/10 to-[#16a34a]/5 group-hover:from-[#1bb658]/20 group-hover:to-[#16a34a]/10 transition-all">
                <ShoppingCart className="size-5 text-[#1bb658]" />
              </div>
              <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.32px]">
                I want to buy parksafe tag
              </p>
              <ChevronRight className="size-4 text-[#d1d5db] group-hover:text-[#1bb658] transition-colors shrink-0 ml-auto" />
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
