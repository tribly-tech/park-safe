'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Car } from 'lucide-react'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { VehicleData } from '@/types'

const defaultVehicle: VehicleData = {
  make: '',
  model: '',
  licensePlate: '',
  color: '',
  phone: '',
}

export default function EditVehiclePage() {
  const router = useRouter()
  const [vehicle, setVehicle] = useLocalStorage<VehicleData | null>(
    STORAGE_KEYS.VEHICLE,
    null
  )
  const [make, setMake] = useState(vehicle?.make ?? '')
  const [model, setModel] = useState(vehicle?.model ?? '')
  const [licensePlate, setLicensePlate] = useState(vehicle?.licensePlate ?? '')
  const [color, setColor] = useState(vehicle?.color ?? '')
  const [phone, setPhone] = useState(vehicle?.phone ?? '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setMake(vehicle?.make ?? '')
    setModel(vehicle?.model ?? '')
    setLicensePlate(vehicle?.licensePlate ?? '')
    setColor(vehicle?.color ?? '')
    setPhone(vehicle?.phone ?? '')
  }, [vehicle?.make, vehicle?.model, vehicle?.licensePlate, vehicle?.color, vehicle?.phone])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedMake = make.trim()
    const trimmedModel = model.trim()
    const trimmedPlate = licensePlate.trim().replace(/\s/g, '').toUpperCase()
    const trimmedColor = color.trim()
    const trimmedPhone = phone.replace(/\D/g, '').slice(0, 10)
    if (!trimmedMake || !trimmedModel) {
      toast.error('Make and model are required')
      return
    }
    setIsSaving(true)
    setVehicle({
      make: trimmedMake,
      model: trimmedModel,
      licensePlate: trimmedPlate || '',
      color: trimmedColor || '',
      phone: trimmedPhone || undefined,
    })
    toast.success('Vehicle details updated', {
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
          Edit vehicle details
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
              Vehicle information
            </h1>
            <p className="font-normal text-[15px] text-[#6b7280] leading-[1.5]">
              Update your vehicle details
            </p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-10 flex items-center justify-center bg-[#f0fdf4] rounded-xl">
                <Car className="size-5 text-[#1bb658]" />
              </div>
              <h2 className="font-semibold text-[18px] text-[#111827] tracking-[-0.36px]">
                Vehicle details
              </h2>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="make"
                className="font-medium text-[14px] text-[#64748b] tracking-[-0.28px]"
              >
                Make
              </Label>
              <Input
                id="make"
                type="text"
                placeholder="e.g. Toyota"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="h-[52px] text-[16px] font-medium tracking-[-0.32px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af] rounded-xl"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="model"
                className="font-medium text-[14px] text-[#64748b] tracking-[-0.28px]"
              >
                Model
              </Label>
              <Input
                id="model"
                type="text"
                placeholder="e.g. Camry"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="h-[52px] text-[16px] font-medium tracking-[-0.32px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af] rounded-xl"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="licensePlate"
                className="font-medium text-[14px] text-[#64748b] tracking-[-0.28px]"
              >
                License plate
              </Label>
              <Input
                id="licensePlate"
                type="text"
                placeholder="e.g. ABC 1234"
                value={licensePlate}
                onChange={(e) =>
                  setLicensePlate(e.target.value.toUpperCase().replace(/\s/g, '').slice(0, 12))
                }
                className="h-[52px] text-[16px] font-medium tracking-[-0.32px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af] rounded-xl uppercase"
                maxLength={12}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="color"
                className="font-medium text-[14px] text-[#64748b] tracking-[-0.28px]"
              >
                Color
              </Label>
              <Input
                id="color"
                type="text"
                placeholder="e.g. Silver"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-[52px] text-[16px] font-medium tracking-[-0.32px] border-[#d1d5db] focus:border-[#1bb658] text-[#111827] placeholder:text-[#9ca3af] rounded-xl"
                maxLength={30}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="font-medium text-[14px] text-[#64748b] tracking-[-0.28px]"
              >
                Phone number
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
