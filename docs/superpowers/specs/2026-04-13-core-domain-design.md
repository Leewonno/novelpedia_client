# Novelpedia 핵심 도메인 설계

## 개요

Novelpedia의 핵심 데이터 모델. 소설/만화 작품 정보(novels), 작가(authors), 리뷰(reviews), 편집 이력(history)으로 구성된다. 사용자 인증은 Supabase Auth(`auth.users`)가 담당한다.

## 테이블 구성

### `authors` — 작가

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | |
| `name` | text | NOT NULL | 표시용 이름 |
| `primary_name` | text | NOT NULL, UNIQUE | 정규화 이름 (중복 체크용) |
| `bio` | text | | 작가 소개 |
| `profile_image_url` | text | | 프로필 이미지 URL |
| `content` | text | | 자유 마크다운 (작가 상세 페이지) |
| `is_delete` | boolean | NOT NULL, DEFAULT false | 소프트 삭제 |
| `is_block` | boolean | NOT NULL, DEFAULT false | 관리자 차단 |
| `stars` | integer | DEFAULT 0 | 별점 합산 캐시 (novels의 stars 합) |
| `stars_count` | integer | DEFAULT 0 | 별점 개수 캐시 |
| `version` | integer | NOT NULL, DEFAULT 1 | 편집 버전 (편집 시 +1) |
| `views` | integer | DEFAULT 0 | 조회수 |
| `created_at` | timestamptz | DEFAULT now() | |
| `updated_at` | timestamptz | DEFAULT now() | |

### `novels` — 작품

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | |
| `title` | text | NOT NULL | 표시용 제목 |
| `primary_title` | text | NOT NULL, UNIQUE | 정규화 제목 (중복 체크용) |
| `author_id` | uuid | FK → authors(id) | |
| `genre` | text | NOT NULL | 장르 (enum 참고) |
| `synopsis` | text | | 줄거리 |
| `publisher` | text | | 출판사/연재처 |
| `status` | text | NOT NULL | 연재 상태 (enum 참고) |
| `thumbnail_url` | text | | 썸네일 이미지 URL |
| `tags` | text[] | DEFAULT '{}' | 태그 배열 |
| `content` | text | | 자유 마크다운 (작품 상세 하단) |
| `is_delete` | boolean | NOT NULL, DEFAULT false | 소프트 삭제 |
| `is_block` | boolean | NOT NULL, DEFAULT false | 관리자 차단 |
| `stars` | integer | DEFAULT 0 | 별점 합산 캐시 |
| `stars_count` | integer | DEFAULT 0 | 별점 개수 캐시 |
| `version` | integer | NOT NULL, DEFAULT 1 | 편집 버전 |
| `views` | integer | DEFAULT 0 | 조회수 |
| `created_at` | timestamptz | DEFAULT now() | |
| `updated_at` | timestamptz | DEFAULT now() | |

#### genre enum 값
- `novel` — 소설
- `webnovel` — 웹소설
- `manga` — 만화
- `webtoon` — 웹툰

#### status enum 값
- `ongoing` — 연재중
- `completed` — 완결
- `hiatus` — 휴재

### `reviews` — 리뷰

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | |
| `novel_id` | uuid | FK → novels(id) ON DELETE CASCADE | |
| `user_id` | uuid | FK → auth.users(id) ON DELETE CASCADE | |
| `rating` | numeric(2,1) | NOT NULL, CHECK (rating BETWEEN 1.0 AND 5.0) | 별점 (0.5 단위) |
| `body` | text | NOT NULL | 리뷰 본문 |
| `created_at` | timestamptz | DEFAULT now() | |
| `updated_at` | timestamptz | DEFAULT now() | |
| UNIQUE | | (novel_id, user_id) | 1인 1리뷰 |

### `authors_history` — 작가 편집 이력

novels/authors의 캐시·상태 필드(is_delete, is_block, stars, stars_count, version, views)는 포함하지 않는다. 이력 조회 시 최신 상태는 부모 테이블에서 참조한다.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid PK | 이력 고유 ID |
| `author_id` | uuid FK → authors(id) | 원본 작가 |
| `name` | text | |
| `primary_name` | text | |
| `bio` | text | |
| `profile_image_url` | text | |
| `content` | text | |
| `changed_by` | uuid FK → auth.users(id) | 편집자 |
| `changed_at` | timestamptz DEFAULT now() | 편집 시각 |

### `novels_history` — 작품 편집 이력

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid PK | 이력 고유 ID |
| `novel_id` | uuid FK → novels(id) | 원본 작품 |
| `title` | text | |
| `primary_title` | text | |
| `author_id` | uuid | |
| `genre` | text | |
| `synopsis` | text | |
| `publisher` | text | |
| `status` | text | |
| `thumbnail_url` | text | |
| `tags` | text[] | |
| `content` | text | |
| `changed_by` | uuid FK → auth.users(id) | 편집자 |
| `changed_at` | timestamptz DEFAULT now() | 편집 시각 |

## 정규화 규칙 (primary_title / primary_name)

`primary_title`과 `primary_name`은 중복 체크를 위한 정규화 값이다.

변환 규칙: **소문자 변환 → 공백 전체 제거 → 특수문자 전체 제거**

예시:
- `"나 혼자만 레벨업!"` → `"나혼자만레벨업"`
- `"Solo Leveling"` → `"soloLeveling"` → `"sololeveling"`

애플리케이션 레이어에서 저장 전 변환하며, DB UNIQUE 제약으로 중복을 방지한다.

## 별점 집계 방식

`stars`는 모든 리뷰 별점의 **합산값**이다. 평균은 표시 시 계산한다.

```
평균 별점 = stars / stars_count
```

리뷰 추가/수정/삭제 시 DB 트리거로 `novels.stars`와 `novels.stars_count`를 자동 갱신한다.

`authors.stars`와 `authors.stars_count`는 해당 작가의 모든 novels의 stars/stars_count 합계다.

## 히스토리 기록 방식

`novels` 또는 `authors`가 UPDATE될 때 DB 트리거가 **변경 전 상태**를 각각 `novels_history`, `authors_history`에 INSERT한다. 버전 번호(`version`)는 업데이트 시 자동으로 +1된다.

## RLS 정책

### 읽기
- `is_delete = false AND is_block = false`인 레코드만 일반 사용자에게 공개
- `is_delete = true` 또는 `is_block = true`인 레코드는 관리자만 조회 가능

### 쓰기

| 테이블 | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|
| `authors` | 로그인 사용자 | 로그인 사용자 | 불가 (is_delete 소프트 삭제) |
| `novels` | 로그인 사용자 | 로그인 사용자 | 불가 (is_delete 소프트 삭제) |
| `reviews` | 로그인 사용자 | 본인만 | 본인만 |
| `authors_history` | 트리거만 | 불가 | 불가 |
| `novels_history` | 트리거만 | 불가 | 불가 |

- `is_block` 변경: 관리자 역할을 가진 사용자만 가능
