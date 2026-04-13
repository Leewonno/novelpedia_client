import Link from 'next/link'
import Image from 'next/image'
import type { NovelCardData } from '../queries/getTopNovels'
import { calcAverageRating } from '@/shared/lib/supabase/types'

const GENRE_LABEL: Record<string, string> = {
  novel: '소설',
  webnovel: '웹소설',
  manga: '만화',
  webtoon: '웹툰',
}

export function NovelCard({ novel }: { novel: NovelCardData }) {
  const avg = novel.stars_count > 0
    ? calcAverageRating(novel.stars, novel.stars_count)
    : null

  return (
    <Link href={`/n/${novel.primary_title}`} className="block group">
      <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3 relative">
        {novel.thumbnail_url ? (
          <Image
            src={novel.thumbnail_url}
            alt={novel.primary_title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400 dark:text-gray-600">
            {GENRE_LABEL[novel.genre]?.[0] ?? '?'}
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium line-clamp-2 group-hover:underline">
        {novel.primary_title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {novel.author_primary_name}
      </p>
      {avg !== null && (
        <p className="text-xs text-amber-500 mt-0.5">★ {avg}</p>
      )}
    </Link>
  )
}
