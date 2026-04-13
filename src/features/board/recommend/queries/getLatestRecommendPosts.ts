import { createServerSupabaseClient } from "@/shared/lib/supabase/client";
import type { Database } from "@/shared/lib/supabase/types";

export type RecommendPostCardData = {
  id: string;
  title: string;
  username: string;
  avatar_url: string | null;
  likes_count: number;
};

type RecommendPost = Database["public"]["Tables"]["recommend_posts"]["Row"];
type RecommendLike = Database["public"]["Tables"]["recommend_likes"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function getLatestRecommendPosts(): Promise<
  RecommendPostCardData[]
> {
  const supabase = await createServerSupabaseClient();

  // 1. 게시글 조회
  const { data: posts, error: postsError } = await supabase
    .from("recommend_posts")
    .select("id, title, user_id")
    .eq("is_delete", false)
    .eq("is_block", false)
    .order("created_at", { ascending: false })
    .limit(4)
    .returns<Pick<RecommendPost, "id" | "title" | "user_id">[]>();

  if (postsError) throw new Error(postsError.message);
  if (!posts || posts.length === 0) return [];

  const userIds = posts.map((p) => p.user_id);
  const postIds = posts.map((p) => p.id);

  // 2. 프로필 조회
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .in("id", userIds)
    .returns<Pick<Profile, "id" | "username" | "avatar_url">[]>();

  // 3. 좋아요 수 조회
  const { data: likes } = await supabase
    .from("recommend_likes")
    .select("post_id")
    .in("post_id", postIds)
    .returns<RecommendLike[]>();

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const likesCountMap = (likes ?? []).reduce<Record<string, number>>(
    (acc, like) => {
      acc[like.post_id] = (acc[like.post_id] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return posts.map((post) => {
    const profile = profileMap.get(post.user_id);
    return {
      id: post.id,
      title: post.title,
      username: profile?.username ?? "익명",
      avatar_url: profile?.avatar_url ?? null,
      likes_count: likesCountMap[post.id] ?? 0,
    };
  });
}
