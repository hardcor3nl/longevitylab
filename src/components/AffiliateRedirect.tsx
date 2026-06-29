'use client'
import { useEffect } from 'react'

export function AffiliateRedirect({ url }: { url: string }) {
  useEffect(() => {
    window.location.replace(url)
  }, [url])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted font-mono text-sm">Redirecting…</p>
    </div>
  )
}
