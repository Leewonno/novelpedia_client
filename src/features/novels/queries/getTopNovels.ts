import { createServerSupabaseClient } from '@/shared/lib/supabase/server'

export type NovelCardData = {
  id: string
  primary_title: string
  thumbnail_url: string | null
  stars: number
  stars_count: number
  genre: string
  author_primary_name: string
}

type RawNovel = {
  id: string
  primary_title: string
  thumbnail_url: string | null
  stars: number
  stars_count: number
  genre: string
  authors: { primary_name: string } | null
}

export async function getTopNovels(): Promise<NovelCardData[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('novels')
    .select('id, primary_title, thumbnail_url, stars, stars_count, genre, authors(primary_name)')
    .eq('is_delete', false)
    .eq('is_block', false)
    .gt('stars_count', 0)
    .order('stars_count', { ascending: false })
    .limit(4)
    .returns<RawNovel[]>()

  if (error) throw new Error(error.message)
  if (!data) return []

  return data.map(novel => ({
    id: novel.id,
    primary_title: novel.primary_title,
    thumbnail_url: novel.thumbnail_url,
    stars: novel.stars,
    stars_count: novel.stars_count,
    genre: novel.genre,
    author_primary_name: novel.authors?.primary_name ?? '미상',
  }))
}
