export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  updated_at: string
}

export type Genre = 'novel' | 'webnovel' | 'manga' | 'webtoon'
export type Status = 'ongoing' | 'completed' | 'hiatus'

export interface Author {
  id: string
  name: string
  primary_name: string
  bio: string | null
  profile_image_url: string | null
  content: string | null
  is_delete: boolean
  is_block: boolean
  stars: number
  stars_count: number
  version: number
  views: number
  created_at: string
  updated_at: string
}

export interface Novel {
  id: string
  title: string
  primary_title: string
  author_id: string | null
  genre: Genre
  synopsis: string | null
  publisher: string | null
  status: Status
  thumbnail_url: string | null
  tags: string[]
  content: string | null
  is_delete: boolean
  is_block: boolean
  stars: number
  stars_count: number
  version: number
  views: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  novel_id: string
  user_id: string
  rating: number
  body: string
  created_at: string
  updated_at: string
}

export interface AuthorHistory {
  id: string
  author_id: string
  name: string
  primary_name: string
  bio: string | null
  profile_image_url: string | null
  content: string | null
  changed_by: string | null
  changed_at: string
}

export interface NovelHistory {
  id: string
  novel_id: string
  title: string
  primary_title: string
  author_id: string | null
  genre: Genre
  synopsis: string | null
  publisher: string | null
  status: Status
  thumbnail_url: string | null
  tags: string[]
  content: string | null
  changed_by: string | null
  changed_at: string
}

/** 평균 별점 계산 (stars는 rating*10 합산값) */
export function calcAverageRating(
  stars: number,
  starsCount: number
): number {
  if (starsCount === 0) return 0
  return Math.round((stars / starsCount / 10) * 10) / 10
}

export interface Database {
  public: {
    Tables: {
      authors: {
        Row: Author
        Insert: Omit<
          Author,
          | 'id'
          | 'created_at'
          | 'updated_at'
          | 'stars'
          | 'stars_count'
          | 'version'
          | 'views'
          | 'is_delete'
          | 'is_block'
        >
        Update: Partial<Omit<Author, 'id' | 'created_at'>>
      }
      novels: {
        Row: Novel
        Insert: Omit<
          Novel,
          | 'id'
          | 'created_at'
          | 'updated_at'
          | 'stars'
          | 'stars_count'
          | 'version'
          | 'views'
          | 'is_delete'
          | 'is_block'
        >
        Update: Partial<Omit<Novel, 'id' | 'created_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Pick<Review, 'rating' | 'body'>>
      }
      authors_history: {
        Row: AuthorHistory
        Insert: never // 트리거만 INSERT
        Update: never
      }
      novels_history: {
        Row: NovelHistory
        Insert: never // 트리거만 INSERT
        Update: never
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'updated_at'> & { updated_at?: string }
        Update: Partial<Omit<Profile, 'id'>>
      }
    }
  }
}
