import { redirect } from 'next/navigation'
import { DEFAULT_CONTACT_OWNER_SLUG } from '@/lib/constants'

/** Redirect /contact-owner to the default vehicle URL so each vehicle can have a unique /contact-owner/[id]. */
export default function ContactOwnerPage() {
  redirect(`/contact-owner/${DEFAULT_CONTACT_OWNER_SLUG}`)
}
