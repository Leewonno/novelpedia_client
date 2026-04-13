import Link from 'next/link'
import { getTopNovels } from '@/features/novels/queries/getTopNovels'
import { getLatestNovels } from '@/features/novels/queries/getLatestNovels'
import { getLatestRecommendPosts } from '@/features/board/recommend/queries/getLatestRecommendPosts'
import { NovelCard } from '@/features/novels/components/NovelCard'
import { RecommendPostCard } from '@/features/board/recommend/components/RecommendPostCard'

export default async function HomePage() {
  const [topNovels, latestNovels, recommendPosts] = await Promise.all([
    getTopNovels(),
    getLatestNovels(),
    getLatestRecommendPosts(),
  ])

  return (
    <div className="py-10 space-y-12">
      {/* 인기 작품 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">인기 작품</h2>
          <Link
            href="/n"
            className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            더보기 →
          </Link>
        </div>
        {topNovels.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {topNovels.map(novel => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">아직 등록된 작품이 없어요.</p>
        )}
      </section>

      {/* 최신 작품 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">최근 등록</h2>
          <Link
            href="/n"
            className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            더보기 →
          </Link>
        </div>
        {latestNovels.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {latestNovels.map(novel => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">아직 등록된 작품이 없어요.</p>
        )}
      </section>

      {/* 추천 게시판 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">추천 게시판</h2>
          <Link
            href="/board/recommend"
            className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            더보기 →
          </Link>
        </div>
        {recommendPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {recommendPosts.map(post => (
              <RecommendPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">아직 작성된 글이 없어요.</p>
        )}
      </section>
    </div>
  )
}
