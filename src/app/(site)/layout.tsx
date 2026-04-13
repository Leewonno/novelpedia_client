import type { ReactNode } from 'react'
import { Container } from '@/shared/components/Container'

export default function SiteLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen">
      <main>
        <Container>{children}</Container>
      </main>
    </div>
  )
}
