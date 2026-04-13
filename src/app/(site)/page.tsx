import Link from 'next/link'
import { NovelCard } from '@/features/novels/components/NovelCard'
import { RecommendPostCard } from '@/features/board/recommend/components/RecommendPostCard'
import type { NovelCardData } from '@/features/novels/queries/getTopNovels'
import type { RecommendPostCardData } from '@/features/board/recommend/queries/getLatestRecommendPosts'

// TODO: Supabase 연결 후 실제 쿼리로 교체
const MOCK_NOVELS: NovelCardData[] = [
  { id: '1', primary_title: '나 혼자만 레벨업', thumbnail_url: null, stars: 450, stars_count: 100, genre: 'webnovel', author_primary_name: '추공' },
  { id: '2', primary_title: '전지적 독자 시점', thumbnail_url: null, stars: 480, stars_count: 100, genre: 'webnovel', author_primary_name: '싱숑' },
  { id: '3', primary_title: '사냥꾼의 별자리', thumbnail_url: null, stars: 420, stars_count: 100, genre: 'webnovel', author_primary_name: '별밤작가' },
  { id: '4', primary_title: '오버로드', thumbnail_url: null, stars: 400, stars_count: 100, genre: 'novel', author_primary_name: '마루야마 카가부' },
]

const MOCK_LATEST: NovelCardData[] = [
  { id: '5', primary_title: '달빛조각사', thumbnail_url: null, stars: 0, stars_count: 0, genre: 'webnovel', author_primary_name: '남희성' },
  { id: '6', primary_title: '아르카나 카드', thumbnail_url: null, stars: 0, stars_count: 0, genre: 'manga', author_primary_name: '이지은' },
  { id: '7', primary_title: '드래곤 라자', thumbnail_url: null, stars: 390, stars_count: 90, genre: 'novel', author_primary_name: '이영도' },
  { id: '8', primary_title: '눈물을 마시는 새', thumbnail_url: null, stars: 470, stars_count: 95, genre: 'novel', author_primary_name: '이영도' },
]

const MOCK_RECOMMEND: RecommendPostCardData[] = [
  { id: '1', title: '나혼렙 보고 입문한 분들께 추천하는 웹소설 리스트', username: 'novelfan', avatar_url: null, likes_count: 42 },
  { id: '2', title: '전독시 완결 후 허전한 분들을 위한 추천', username: 'readingaddict', avatar_url: null, likes_count: 38 },
  { id: '3', title: '라이트노벨 입문자를 위한 가이드', username: 'lightnovel_kr', avatar_url: null, likes_count: 27 },
  { id: '4', title: '2025년 상반기 완결 작품 모음', username: 'bookworm99', avatar_url: null, likes_count: 21 },
]

export default function HomePage() {
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {MOCK_NOVELS.map(novel => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {MOCK_LATEST.map(novel => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {MOCK_RECOMMEND.map(post => (
            <RecommendPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
