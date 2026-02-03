'use client'

import { Check, Car } from 'lucide-react'

export default function RegisterVehicleSuccessPage() {
  return (
    <div className="relative min-h-screen w-full max-w-[440px] mx-auto bg-gradient-to-b from-white from-[32.232%] to-[#f1fff7] to-[129.26%] overflow-x-hidden">
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 animate-in fade-in zoom-in-95 duration-500">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="size-28 flex items-center justify-center bg-white border border-[#1bb658] rounded-full shadow-[0px_6px_0px_0px_#1bb658]">
            <Check className="size-16 text-[#1bb658]" strokeWidth={3} />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-10">
          <h1 className="font-bold text-[28px] text-black tracking-[-0.56px] mb-3 leading-[1.3]">
            QR Activated Successfully
          </h1>
          <p className="font-normal text-[16px] text-[#64748b] tracking-[-0.32px] leading-[1.6] max-w-[320px] mx-auto">
            Your vehicle has been registered. Get your QR code from your profile.
          </p>
        </div>

        {/* Info Card */}
        <div className="w-full max-w-[340px] mb-8">
          <div className="bg-white border border-[#1bb658] rounded-[24px] p-6 shadow-[0px_4px_0px_0px_#1bb658]">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 flex items-center justify-center bg-[#f0fdf4] rounded-2xl">
                <Car className="size-6 text-[#1bb658]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[16px] text-black tracking-[-0.32px]">
                  Next Steps
                </p>
                <p className="font-normal text-[13px] text-[#64748b] tracking-[-0.26px] leading-[1.5]">
                  Place your tag & verify
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-2 h-2 bg-[#1bb658] rounded-full mt-1.5" />
                <p className="font-normal text-[14px] text-[#475569] leading-[1.5]">
                  Stick the safe park tag in windshield from inside
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-2 h-2 bg-[#1bb658] rounded-full mt-1.5" />
                <p className="font-normal text-[14px] text-[#475569] leading-[1.5]">
                  Scan the safe park tag and test it
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
