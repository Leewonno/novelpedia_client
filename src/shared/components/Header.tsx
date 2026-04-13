import Link from 'next/link'
import { createServerSupabaseClient } from '@/shared/lib/supabase/client'
import { ThemeToggle } from './ThemeToggle'
import { SearchButton } from './SearchButton'
import { UserMenu } from './UserMenu'

export async function Header() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: { username: string | null; avatar_url: string | null } | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single()
    profile = data as { username: string | null; avatar_url: string | null } | null
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto w-full max-w-237.5 px-5 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          Novelpedia
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/board"
            className="text-sm px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            게시판
          </Link>
          <SearchButton />
          <ThemeToggle />
          {user && profile ? (
            <UserMenu
              userId={user.id}
              username={profile.username}
              avatarUrl={profile.avatar_url}
            />
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link
                href="/login"
                className="text-sm px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:opacity-90 transition-opacity"
              >
                회원가입
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
