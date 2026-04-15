import Link from "next/link";
import Image from "next/image";
import { createServerSupabaseClient } from "@/shared/lib/supabase/server";
import { ThemeToggle } from "./ThemeToggle";
import { SearchButton } from "./SearchButton";
import { UserMenu } from "./UserMenu";
import logo from "@/assets/logo/logo.png";

export async function Header() {
  let user: { id: string } | null = null;
  let profile: { username: string | null; avatar_url: string | null } | null =
    null;

  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;

    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();
      profile = profileData as {
        username: string | null;
        avatar_url: string | null;
      } | null;
    }
  } catch {
    // Supabase 연결 실패 시 비로그인 UI 표시
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-100 bg-white dark:bg-gray-950">
      <div className="mx-auto w-full max-w-237.5 px-5 h-14 flex items-center justify-between">
        <Link href="/">
          <Image src={logo} alt="Novelpedia" height={22} priority />
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/board"
            className="text-sm px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                className="text-sm px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:opacity-90 transition-opacity"
              >
                회원가입
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
