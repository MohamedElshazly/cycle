'use client'

import { Star } from 'lucide-react'
import { CycleStatus } from '@/types/Cycle'

type CycleStatusBadgeProps = {
  status: CycleStatus
}

export function CycleStatusBadge({ status }: CycleStatusBadgeProps) {
  if (status === 'closed') {
    return null
  }

  if (status === 'graduated') {
    return (
      <Star
        size={12}
        style={{ color: 'var(--accent)', fill: 'var(--accent)' }}
        aria-label="graduated"
      />
    )
  }

  if (status === 'active') {
    return (
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{ backgroundColor: 'var(--accent)' }}
        aria-label="active"
      />
    )
  }

  return (
    <span
      className="w-2 h-2 rounded-full inline-block"
      style={{ backgroundColor: 'var(--text-secondary)' }}
      aria-label="paused"
    />
  )
}
