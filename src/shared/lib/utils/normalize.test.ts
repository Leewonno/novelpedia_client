import { describe, expect, it } from 'vitest'
import { normalizePrimary } from './normalize'

describe('normalizePrimary', () => {
  it('소문자로 변환한다', () => {
    expect(normalizePrimary('Solo Leveling')).toBe('sololeveling')
  })

  it('공백을 모두 제거한다', () => {
    expect(normalizePrimary('나 혼자만 레벨업')).toBe('나혼자만레벨업')
  })

  it('특수문자를 제거한다', () => {
    expect(normalizePrimary('나 혼자만 레벨업!')).toBe('나혼자만레벨업')
  })

  it('탭과 줄바꿈도 제거한다', () => {
    expect(normalizePrimary('Solo\tLeveling\n')).toBe('sololeveling')
  })

  it('여러 특수문자를 모두 제거한다', () => {
    expect(normalizePrimary('Re:Zero ~Starting Life~')).toBe('rezerostartinglife')
  })

  it('빈 문자열을 반환한다 (입력이 빈 문자열인 경우)', () => {
    expect(normalizePrimary('')).toBe('')
  })

  it('이미 정규화된 문자열은 그대로 반환한다', () => {
    expect(normalizePrimary('sololeveling')).toBe('sololeveling')
  })

  it('숫자는 유지한다', () => {
    expect(normalizePrimary('86 - Eighty Six')).toBe('86eightysix')
  })
})
