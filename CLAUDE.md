# CLAUDE.md — MBTI 테스트 웹사이트 개발 가이드

## 프로젝트 개요

Next.js 14 기반의 MBTI 성격 유형 테스트 웹 서비스.
12문항 테스트 → 결과 확인 → 이미지 저장/공유 → 통계 조회 흐름으로 구성된다.

---

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 14.x |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS | 3.x |
| 상태 관리 | Zustand | 4.x |
| DB / 실시간 | Firebase Firestore | 10.x |
| 이미지 생성 | html2canvas | 1.x |
| 공유 | Kakao SDK v2, Clipboard API | — |
| 배포 | Vercel | — |
| 분석 | Google Analytics 4 | — |

---

## 디렉터리 구조

```
mbti-test/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx            # 랜딩 페이지 (/)
│   ├── test/page.tsx       # 테스트 화면 (/test)
│   ├── result/page.tsx     # 결과 페이지 (/result?type=INFP)
│   ├── stats/page.tsx      # 통계 페이지 (/stats)
│   └── api/
│       ├── questions/route.ts
│       ├── types/[code]/route.ts
│       └── stats/
│           ├── route.ts           # GET 통계
│           └── increment/route.ts # POST 카운트 증가
├── components/             # 재사용 UI 컴포넌트
│   ├── ProgressBar.tsx
│   ├── QuestionCard.tsx
│   ├── ResultCard.tsx      # 이미지 저장용 카드
│   └── StatsChart.tsx
├── data/                   # 정적 JSON 데이터
│   ├── questions.json      # 12문항
│   └── mbti-types.json     # 16가지 유형 콘텐츠
├── lib/
│   ├── firebase.ts         # Firestore 초기화
│   ├── calculateMBTI.ts    # 결과 계산 로직
│   └── shareImage.ts       # html2canvas 이미지 생성
├── store/
│   └── testStore.ts        # Zustand 테스트 진행 상태
└── types/
    └── index.ts            # 공유 TypeScript 타입
```

---

## 핵심 타입 정의

```typescript
// types/index.ts

type MBTIDimension = 'EI' | 'SN' | 'TF' | 'JP';

interface Question {
  id: number;
  category: MBTIDimension;
  text: string;
  optionA: { text: string; value: 'E' | 'S' | 'T' | 'J' };
  optionB: { text: string; value: 'I' | 'N' | 'F' | 'P' };
}

interface MBTIType {
  code: string;
  nickname: string;
  tagline: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  compatibleTypes: string[];
  conflictTypes: string[];
  color: string;
}

interface TestProgress {
  currentQuestion: number;
  answers: Record<number, 'A' | 'B'>;
  startedAt: string;
}
```

---

## 결과 계산 알고리즘

```typescript
// lib/calculateMBTI.ts
function calculateMBTI(answers: Record<number, 'A' | 'B'>): string {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  questions.forEach((q) => {
    const answer = answers[q.id];
    if (answer === 'A') scores[q.optionA.value]++;
    else scores[q.optionB.value]++;
  });

  return [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P',
  ].join('');
}
```

척도별 퍼센트(결과 페이지 시각화용):
```typescript
const iPercent = Math.round((scores.I / 3) * 100); // 예: 67%
```

---

## 상태 관리 (Zustand)

테스트 진행 상태는 Zustand store + localStorage 동기화로 관리한다.
페이지 이탈 후 재접속 시 진행 상황을 복원한다.

```typescript
// store/testStore.ts
interface TestStore {
  answers: Record<number, 'A' | 'B'>;
  currentQuestion: number;
  setAnswer: (id: number, value: 'A' | 'B') => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
}
```

---

## 라우팅 규칙

| 경로 | 설명 | 렌더링 방식 |
|------|------|------------|
| `/` | 랜딩 페이지 | SSG |
| `/test` | 테스트 화면 | CSR (상태 기반) |
| `/result` | 결과 페이지 (`?type=INFP`) | SSG (16개 유형 정적 생성) |
| `/stats` | 통계 페이지 | CSR (실시간 Firestore) |
| `/api/*` | API Route | Edge Runtime 권장 |

- 유효하지 않은 `type` 파라미터는 `/`로 `redirect()`
- `/result`는 `generateStaticParams()`로 16개 유형 사전 생성

---

## 코드 스타일

### 기본 원칙
- 컴포넌트 파일명: PascalCase (`QuestionCard.tsx`)
- 유틸/훅 파일명: camelCase (`calculateMBTI.ts`)
- 상수: UPPER_SNAKE_CASE (`TOTAL_QUESTIONS = 12`)

### 컴포넌트 작성
- 모든 컴포넌트에 명시적 Props 타입 선언
- `export default` 사용 (named export는 유틸 함수에만)
- 클라이언트 컴포넌트는 파일 상단에 `'use client'` 명시

### Tailwind 사용
- 인라인 className이 길어지면 `cn()` 유틸로 분리
- 유형별 동적 색상은 Tailwind safelist 또는 인라인 style로 처리
  (동적 클래스명은 Tailwind purge에서 제거될 수 있으므로 주의)

### 금지 사항
- `any` 타입 사용 금지 — `unknown` 또는 명시적 타입 사용
- `console.log` 커밋 금지
- 클라이언트 컴포넌트에서 직접 Firestore 쓰기 금지 — 반드시 API Route 경유

---

## API Route 작성 규칙

- 통계 쓰기(`/api/stats/increment`)는 POST만 허용, GET 요청은 405 반환
- MBTI 유형 코드 유효성 검증 필수:
  ```typescript
  const VALID_TYPES = ['INFP','INFJ','INTP','INTJ','ISFP','ISFJ','ISTP','ISTJ',
                       'ENFP','ENFJ','ENTP','ENTJ','ESFP','ESFJ','ESTP','ESTJ'];
  if (!VALID_TYPES.includes(code)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  ```
- Rate limiting: 동일 IP 분당 30회 초과 시 429 반환

---

## Firebase 사용 규칙

- Firestore는 `statistics` 컬렉션만 사용 (문서 ID = MBTI 유형 코드)
- 클라이언트에서 직접 Firestore write 금지 — API Route(`/api/stats/increment`)를 통해서만 카운트 증가
- 읽기(실시간 구독)는 `/stats` 페이지 컴포넌트에서만 허용
- Firebase 환경변수는 `NEXT_PUBLIC_` 접두사 사용 (클라이언트 노출 필요)

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

---

## 이미지 저장 (`html2canvas`)

- `ResultCard` 컴포넌트를 캡처 대상으로 사용
- 캡처 전 폰트 로드 완료 확인 (`document.fonts.ready`)
- 저장 파일명: `mbti-{TYPE}-result.png`
- 캡처 크기 목표: 1080×1080px (CSS scale 조정으로 구현)

---

## 공유 기능

### 카카오톡
- Kakao SDK는 `<Script>` 태그로 로드 (next/script, `strategy="afterInteractive"`)
- 공유 시 포함 정보: 유형명, 요약 1문장, 썸네일 이미지, 결과 URL

### 링크 복사
- `navigator.clipboard.writeText()` 사용
- HTTPS 환경에서만 동작 — 로컬 개발 시 `localhost`는 허용됨

---

## 예외 처리 기준

| 상황 | 처리 |
|------|------|
| 질문 미선택 후 다음 클릭 | 토스트 메시지 표시, 이동 차단 |
| 잘못된 type 파라미터 | `/`로 redirect |
| Firebase 연결 실패 | 통계 UI 숨김, 나머지 기능 정상 동작 |
| 이미지 생성 실패 | 에러 토스트 표시, 앱 크래시 없음 |
| 클립보드 API 미지원 | "URL을 직접 복사하세요" 폴백 UI |

---

## 성능 목표

- FCP(First Contentful Paint): 1.5초 이하
- CLS(Cumulative Layout Shift): 0.1 이하
- Lighthouse 점수: Performance / Accessibility / SEO 각 90점 이상
- 테스트 화면 전환 애니메이션: 300ms 이하

---

## 접근성 체크리스트

- [ ] 모든 버튼에 `aria-label` 또는 텍스트 콘텐츠 제공
- [ ] 색상 대비 비율 4.5:1 이상
- [ ] 키보드(Tab/Enter/Space)만으로 전체 테스트 완료 가능
- [ ] 선택지 카드는 `role="radio"` + `aria-checked` 적용

---

## 환경변수 목록

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Kakao
NEXT_PUBLIC_KAKAO_JS_KEY=

# GA4
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

`.env.local`에 보관, `.gitignore`에 반드시 포함.
