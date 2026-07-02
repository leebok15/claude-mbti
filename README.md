# MyMBTI

12개의 질문으로 알아보는 MBTI 성격 유형 테스트 웹 서비스.

**[라이브 데모 →](https://leebok15.github.io/claude-mbti/)**

---

## 목차

- [개요](#개요)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [주요 기능](#주요-기능)
- [API 문서](#api-문서)
- [배포](#배포)

---

## 개요

MyMBTI는 Next.js 14 App Router 기반의 MBTI 성격 유형 테스트 서비스입니다.  
12문항 응답 → 유형 계산 → 결과 확인 → 이미지 저장/공유 → 통계 조회의 흐름으로 구성됩니다.

```
랜딩(/) → 테스트(/test) → 결과(/result?type=INFP) → 통계(/stats)
```

---

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 14.x |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS | 3.x |
| 상태 관리 | Zustand | 4.x |
| 이미지 생성 | html2canvas | 1.x |
| 배포 | GitHub Pages (GitHub Actions) | — |

---

## 프로젝트 구조

```
mbti-test/
├── app/
│   ├── page.tsx                    # 랜딩 페이지 (/)
│   ├── layout.tsx                  # 전역 레이아웃 및 메타데이터
│   ├── globals.css                 # Tailwind + 커스텀 애니메이션
│   ├── test/
│   │   └── page.tsx                # 테스트 화면 (/test)
│   ├── result/
│   │   ├── page.tsx                # 결과 페이지 (/result?type=INFP)
│   │   └── ResultClient.tsx        # 탭 UI + 공유 기능 (클라이언트)
│   ├── stats/
│   │   └── page.tsx                # 통계 페이지 (/stats)
│   └── api/
│       ├── questions/route.ts      # GET /api/questions
│       ├── types/[code]/route.ts   # GET /api/types/:code
│       └── stats/
│           ├── route.ts            # GET /api/stats
│           └── increment/route.ts  # POST /api/stats/increment
├── components/
│   ├── ProgressBar.tsx             # 테스트 진행률 바
│   ├── QuestionCard.tsx            # 질문 + 선택지 카드
│   ├── DimensionBar.tsx            # 성격 척도 시각화 바
│   └── ShareButtons.tsx            # 이미지 저장 / 링크 복사
├── data/
│   ├── questions.json              # 12개 문항 데이터
│   └── mbti-types.json             # 16가지 유형 상세 데이터
├── lib/
│   ├── calculateMBTI.ts            # MBTI 계산 로직
│   ├── statsStore.ts               # 인메모리 통계 카운터
│   └── cn.ts                       # Tailwind 클래스 유틸
├── store/
│   └── testStore.ts                # Zustand 테스트 상태 스토어
└── types/
    └── index.ts                    # 공유 TypeScript 타입 정의
```

---

## 시작하기

### 요구사항

- Node.js 18 이상
- npm 9 이상

### 설치

```bash
# 저장소 클론
git clone git@github.com:leebok15/claude-mbti.git
cd claude-mbti

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

### 빌드

```bash
# 프로덕션 빌드 (정적 내보내기)
npm run build

# 빌드 결과물 미리보기
npm run start
```

빌드 결과물은 `out/` 디렉터리에 생성됩니다.

---

## 주요 기능

### 1. MBTI 테스트

12개의 문항에 순서대로 응답하며 E/I, S/N, T/F, J/P 4개 척도를 측정합니다.

- 문항당 A/B 2지선다 선택
- 이전 문항으로 돌아가 답변 수정 가능
- Zustand로 진행 상태를 유지하여 새로고침 후에도 이어서 진행 가능

**계산 로직** (`lib/calculateMBTI.ts`)

```typescript
// 각 척도별 점수 합산 → 우세 방향 결정
scores.E >= scores.I ? 'E' : 'I'
scores.S >= scores.N ? 'S' : 'N'
scores.T >= scores.F ? 'T' : 'F'
scores.J >= scores.P ? 'J' : 'P'
```

척도별 백분율은 결과 페이지의 시각화 바에 사용됩니다.

---

### 2. 결과 페이지

테스트 완료 후 URL 쿼리 파라미터로 결과를 전달합니다.

```
/result?type=INFP&ei=2&sn=1&tf=0&jp=3
```

| 파라미터 | 의미 |
|---------|------|
| `type` | MBTI 유형 코드 (예: INFP) |
| `ei` | E↔I 척도 점수 (0–3, E 방향 점수) |
| `sn` | S↔N 척도 점수 (0–3, S 방향 점수) |
| `tf` | T↔F 척도 점수 (0–3, T 방향 점수) |
| `jp` | J↔P 척도 점수 (0–3, J 방향 점수) |

결과 페이지에서 확인할 수 있는 정보:

- 유형 코드 및 닉네임, 태그라인
- 성격 척도 시각화 (E↔I 등 4개 바)
- 탭별 상세 정보: 요약 / 강점 / 약점 / 추천 직업 / 궁합 유형

---

### 3. 이미지 저장

결과를 540×540 이미지(실제 저장은 1080×1080, scale:2 적용)로 저장합니다.

- DOM에 숨겨진 공유 카드(`-left-[9999px]`)를 `html2canvas`로 캡처
- `mbti-{TYPE}.png` 파일명으로 자동 다운로드
- `html2canvas`는 클릭 시점에 동적 import되어 초기 번들에서 분리

---

### 4. 링크 복사

```
https://도메인/result?type=INFP
```

Clipboard API(`navigator.clipboard.writeText`)로 결과 링크를 클립보드에 복사합니다.  
HTTPS 또는 localhost 환경에서만 동작합니다.

---

### 5. 통계 페이지

전체 유형 분포를 바 차트로 시각화합니다.

- 상위 3개 유형 강조 표시
- 전체 16개 유형 상대 비율 막대 차트
- `/api/stats`를 클라이언트에서 fetch하여 렌더링

> **참고:** 현재 통계 데이터는 서버 인메모리(`statsStore`)에 저장됩니다. 서버 재시작 시 초기화되며, 정적 배포(GitHub Pages) 환경에서는 동작하지 않습니다.

---

## API 문서

### `GET /api/questions`

전체 문항 목록을 반환합니다.

**응답 예시**

```json
[
  {
    "id": 1,
    "category": "EI",
    "text": "새로운 사람들을 만날 때 나는",
    "optionA": { "text": "먼저 말을 걸고 대화를 이끈다", "value": "E" },
    "optionB": { "text": "상대방이 먼저 말을 걸기를 기다린다", "value": "I" }
  }
]
```

---

### `GET /api/types/:code`

특정 MBTI 유형의 상세 정보를 반환합니다.

**파라미터**

| 이름 | 위치 | 설명 |
|------|------|------|
| `code` | path | MBTI 유형 코드 (예: `INFP`) |

**응답 예시**

```json
{
  "code": "INFP",
  "nickname": "열정적인 중재자",
  "tagline": "이상을 꿈꾸는 따뜻한 영혼",
  "summary": "...",
  "strengths": ["공감 능력", "창의성", "..."],
  "weaknesses": ["우유부단함", "..."],
  "careers": ["작가", "심리상담사", "..."],
  "compatibleTypes": ["ENFJ", "ENTJ"],
  "conflictTypes": ["ESTJ", "ESTP"],
  "color": "#7C6BE0"
}
```

**에러 응답**

```json
{ "error": "Invalid type" }   // 400
```

---

### `GET /api/stats`

유형별 참여 횟수를 내림차순으로 반환합니다.

**응답 예시**

```json
[
  { "type": "INFP", "count": 42 },
  { "type": "ENFP", "count": 38 },
  ...
]
```

---

### `POST /api/stats/increment`

특정 유형의 참여 횟수를 1 증가시킵니다.

**쿼리 파라미터**

| 이름 | 설명 |
|------|------|
| `type` | MBTI 유형 코드 (예: `INFP`) |

**요청 예시**

```bash
curl -X POST "http://localhost:3000/api/stats/increment?type=INFP"
```

**응답 예시**

```json
{ "type": "INFP", "count": 43 }
```

**에러 응답**

```json
{ "error": "Invalid type" }   // 400
```

---

## 배포

GitHub Actions를 통해 `main` 브랜치 push 시 GitHub Pages에 자동 배포됩니다.

**워크플로 파일:** `.github/workflows/deploy.yml`

```
main 브랜치 push
  ↓
ubuntu-latest에서 Node.js 20 설치
  ↓
npm ci → npm run build (output: export)
  ↓
out/ 디렉터리를 GitHub Pages artifact로 업로드
  ↓
https://leebok15.github.io/claude-mbti/ 에 배포
```

**로컬 vs 프로덕션 설정 분기** (`next.config.mjs`)

| 환경 | `output` | `basePath` |
|------|----------|-----------|
| 개발 (`npm run dev`) | 없음 (서버 모드) | 없음 |
| 프로덕션 (`npm run build`) | `export` | `/claude-mbti` |

> GitHub Pages에서는 API 라우트와 인메모리 통계 기능이 동작하지 않습니다.  
> 통계 기능을 프로덕션에서 사용하려면 Firebase Firestore 등 외부 DB 연동이 필요합니다.

---

## 라이선스

MIT
