/**
 * primary_name / primary_title 정규화 함수
 * 규칙: 소문자 변환 → 공백 전체 제거 → 특수문자 전체 제거
 * 목적: DB UNIQUE 제약으로 중복을 방지하기 위한 정규화 키 생성
 */
export function normalizePrimary(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '')           // 공백(탭, 줄바꿈 포함) 제거
    .replace(/[^\p{L}\p{N}]/gu, '') // 문자(유니코드)와 숫자 외 모두 제거
}
