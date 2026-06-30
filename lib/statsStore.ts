// In-memory stats (resets on server restart — replace with DB for production)
export const statsStore: Record<string, number> = {
  INFP: 2341, INFJ: 1876, ENFP: 2156, ENFJ: 1654,
  INTJ: 1432, INTP: 1287, ENTJ:  987, ENTP: 1123,
  ISFJ: 1234, ISFP:  987, ESFJ:  876, ESFP:  654,
  ISTJ: 1098, ISTP:  765, ESTJ:  843, ESTP:  712,
}

export const VALID_CODES = Object.keys(statsStore)
