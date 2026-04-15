import type { ReactNode } from 'react'
import { Container } from '@/shared/components/Container'
import { Header } from '@/shared/components/Header'
import { Footer } from '@/shared/components/Footer'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Container>{children}</Container>
      </main>
      <Footer />
    </div>
  )
}
