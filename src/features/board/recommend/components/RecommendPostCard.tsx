import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import type { RecommendPostCardData } from '../queries/getLatestRecommendPosts'

export function RecommendPostCard({ post }: { post: RecommendPostCardData }) {
  const initials = post.username[0]?.toUpperCase() ?? '?'

  return (
    <Link
      href={`/board/recommend/${post.id}`}
      className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium shrink-0 overflow-hidden relative">
        {post.avatar_url ? (
          <Image
            src={post.avatar_url}
            alt={post.username}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          initials
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium line-clamp-2">{post.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {post.username}
          </span>
          <span className="flex items-center gap-0.5 text-xs text-gray-400 shrink-0">
            <Heart size={12} />
            {post.likes_count}
          </span>
        </div>
      </div>
    </Link>
  )
}
