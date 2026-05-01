"use client"
import { MailboxIcon, MapPinIcon } from "@phosphor-icons/react"
import { ContactInfoProps } from "./contactInfoProps"

export function ContactInfo({ email, location }: ContactInfoProps) {
  return (
    <div className="space-y-2">
      <p className="font-medium flex items-center gap-2">
        <MailboxIcon size={20} weight="duotone" />
        {email}
      </p>
      <p className="text-muted-foreground flex items-center gap-2">
        <MapPinIcon size={20} weight="duotone" />
        {location}
      </p>
    </div>
  )
}