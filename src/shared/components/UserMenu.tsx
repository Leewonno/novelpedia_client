'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/client'

interface UserMenuProps {
  userId: string
  username: string | null
  avatarUrl: string | null
}

export function UserMenu({ userId, username, avatarUrl }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setOpen(false)
    router.refresh()
  }

  const initials = (username ?? userId)[0]?.toUpperCase() ?? '?'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="사용자 메뉴"
        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium overflow-hidden relative"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={username ?? '프로필'}
            fill
            className="object-cover"
            sizes="32px"
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1">
          <Link
            href="/my"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            내 활동
          </Link>
          <Link
            href="/my"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            내가 쓴 글
          </Link>
          <Link
            href="/my"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            내 리뷰
          </Link>
          <hr className="my-1 border-gray-200 dark:border-gray-700" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}
