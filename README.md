# 🏃 Fit Again 웹앱 (React + Vite + TypeScript)

Fit Again Front-end 레포지토리입니다. Vite 기반의 React + TypeScript 프로젝트이며, 폼 검증, 상태 관리, 스타일링과 코드 품질 관리를 위한 기본 스택으로 구성되어 있습니다.

## 📍 프로젝트 현황

Fit Again v1.0.0 정식 배포 버전입니다. 사용자가 등록한 제품 사진과 불편
정보를 AI가 분석하고, 리폼·리셀·업사이클링 활용 방법을 추천합니다.

- React + Vite + TypeScript 개발 환경
- React Hook Form + Zod 폼 검증 환경
- Zustand 전역 상태 관리 환경
- React Router 기반 라우팅 환경
- Axios 기반 API 통신 환경
- Tailwind CSS 스타일링 환경
- ESLint + Prettier 코드 품질 관리
- Husky + lint-staged 커밋 전 자동 검사
- Vitest + React Testing Library 테스트 환경
- GitHub Actions CI 자동 검증
- Vercel Production 및 Preview 배포 환경
- `@/` 절대 경로 별칭
- 환경변수 기반 로컬 API 프록시
- 이미지 분석·AI 추천 비동기 작업 및 단계별 폴링
- 리폼 시뮬레이션, 리셀·업사이클링 미리보기
- 공식 상담 신청 API 및 리폼 리포트 PDF 저장
- Open Graph, 검색 엔진 메타데이터와 사이트맵

### 주요 사용자 흐름

| 경로                  | 화면                             |
| --------------------- | -------------------------------- |
| `/`                   | 서비스 소개 및 시작              |
| `/product-register`   | 제품 유형과 제품 사진 등록       |
| `/pain-point`         | 불편 키워드와 추가 설명 입력     |
| `/ai-analysis`        | AI 제품 분석 결과 및 추천 요청   |
| `/solution-recommend` | 리폼·리셀·업사이클링 추천 결과   |
| `/reform-simulation`  | 단계별 리폼 시뮬레이션           |
| `/upcycle-preview`    | 업사이클링 후보 미리보기         |
| `/result-confirm`     | 최종 결과, PDF 저장 및 상담 신청 |

## 🛠️ 기술 스택

- **Main**: React + Vite (TypeScript)
- **State Management**: Zustand
- **Routing**: react-router-dom
- **Styling**: Tailwind CSS
- **Forms**: react-hook-form, Zod, @hookform/resolvers
- **HTTP Client**: axios
- **Testing**: Vitest, React Testing Library
- **CI**: GitHub Actions
- **Deployment**: Vercel
- **Linting & Formatting**: ESLint, Prettier, Husky, lint-staged

인증 방식과 추가 UI 라이브러리는 실제 기능 구현 시 프로젝트 요구사항에 맞춰 도입합니다.

## 🏃 빠른 시작

**사전 요구사항**

- Node.js 24 (`.nvmrc`, `.node-version` 기준)
- npm 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# TypeScript 타입 체크 + 프로덕션 빌드
npm run build

# TypeScript 타입 검사
npm run typecheck

# ESLint로 코드 검사
npm run lint

# Prettier로 코드 포맷팅
npm run format

# Prettier 포맷 검사
npm run format:check

# 테스트 실행
npm test

# 테스트 감시 모드
npm run test:watch

# 프로덕션 빌드 미리보기
npm run preview
```

> Husky는 `npm install` 시 `prepare` 스크립트를 통해 자동 설정됩니다.

## 🔐 환경변수 설정

루트의 `.env.example`을 복사해 `.env`를 만들고 로컬 값을 설정합니다.

- 클라이언트에서 사용할 환경변수 이름은 `VITE_`로 시작합니다.
- `.env`와 실제 비밀 값은 Git에 커밋하지 않습니다.
- `VITE_API_URL`에는 `/api` 경로를 제외한 백엔드 서버 Origin을 입력합니다.
- 로컬에서는 `VITE_API_URL`을 대상으로 Vite의 `/api` 프록시를 사용합니다.
- 배포 환경에서는 Vercel의 `/api` rewrite 또는 `VITE_API_URL`을 통해 HTTPS
  백엔드에 연결합니다.

## 💻 개발 환경 설정 (필수!)

프로젝트의 코드 품질과 일관성을 위해 모든 팀원은 아래 개발 환경을 설정합니다.

1. **VS Code 확장 프로그램 설치**

    VS Code의 Extensions 탭에서 아래 확장 프로그램을 설치합니다.

    - ESLint (게시자: Microsoft)
    - Prettier - Code formatter (게시자: Prettier)

2. **설정 파일 확인**

    - `.prettierrc`: 들여쓰기, 따옴표 등 팀 코드 스타일 규칙
    - `eslint.config.js`: TypeScript, React Hooks, 접근성 등 코드 품질 규칙
    - `.husky/pre-commit`: 커밋 전 lint-staged 실행
    - `.husky/pre-push`: push 전 테스트, 타입 검사와 ESLint 실행
    - `.vscode/settings.json`: 저장 시 Prettier 포맷과 ESLint 수정 적용
    - `.vscode/extensions.json`: 팀 공통 VS Code 확장 프로그램 추천
    - `.editorconfig`: 에디터 공통 인코딩, 줄바꿈과 들여쓰기 설정
    - `.nvmrc`, `.node-version`: 팀 공통 Node.js 버전

## ✅ 자동 검증

`main` 또는 `develop` 브랜치로 push하거나 해당 브랜치를 대상으로 Pull Request를 생성하면 GitHub Actions CI가 실행됩니다.

CI는 다음 항목을 순서대로 검사합니다.

1. 의존성 설치
2. ESLint
3. Prettier
4. Vitest 단위 테스트
5. TypeScript 타입 검사
6. 프로덕션 빌드

## 🚀 배포 환경

Vercel을 통해 Production 및 Preview 환경을 배포합니다.

- Production: <https://fit-again-fe.vercel.app>
- API: <https://api.smu-likelion14th-be.shop>

- `main` 브랜치는 Production 환경으로 배포합니다.
- `develop`과 기능 브랜치는 Preview 환경으로 배포합니다.
- Pull Request에서는 Vercel이 제공하는 Preview URL로 변경 사항을 확인합니다.
- React Router 경로에서 직접 접근하거나 새로고침해도 정상적으로 화면을 표시하도록 `vercel.json`에 SPA rewrite를 설정합니다.
- 배포 환경변수는 Vercel 프로젝트 설정에서 Production, Preview, Development 환경별로 등록합니다.
- 실제 환경변수 값과 비밀 정보는 저장소에 커밋하지 않습니다.

## 📜 프로젝트 규약 (Conventions)

### Git 협업 전략

```text
main: 배포용 브랜치 (안정 버전)
develop: 개발 메인 브랜치 (다음 배포 버전)
feat/[기능이름]: 기능 개발 브랜치 (예: feat/login)
fix/[수정내용]: 버그 수정 브랜치 (예: fix/button-layout)
chore/[작업내용]: 설정 및 환경 구성 브랜치 (예: chore/setup-eslint)
```

### 작업 순서

1. `develop` 브랜치에서 `feat/[기능이름]` 브랜치를 생성합니다.
2. 기능 개발 완료 후 `develop` 브랜치로 Pull Request(PR)를 생성합니다.
3. 코드 리뷰 후 `develop` 브랜치에 병합합니다.

### 배포 및 릴리스 규칙

1. 배포할 기능이 `develop`에서 검증되면 `develop`에서 `main`으로 릴리스 PR을 생성합니다.
2. 릴리스 PR 제목은 `chore(release): Fit Again v1.0.0 배포` 형식을 사용합니다.
3. 장기 브랜치의 커밋 관계를 유지하기 위해 `develop`에서 `main`으로 병합할 때는 **Create a merge commit**을 사용합니다.
4. Production 배포가 완료되면 같은 버전으로 Git 태그를 생성합니다. (예: `v1.0.0`)
5. Vercel에서 `main`은 Production, `develop`과 기능 브랜치는 Preview 환경으로 배포합니다.

### 버전 규칙

1. [Semantic Versioning](https://semver.org/)의 `MAJOR.MINOR.PATCH` 형식을 사용합니다.
2. 최초 정식 배포 버전은 `v1.0.0`입니다.
3. 하위 호환 기능 추가는 MINOR, 버그 수정은 PATCH 버전을 올립니다.
4. 시험 배포가 필요하면 `v1.1.0-beta.1`처럼 pre-release 식별자를 사용합니다.

### 커밋 메시지 컨벤션

커밋 메시지는 Conventional Commits 규칙을 따릅니다. 태그는 영어로, 제목은 한글로 작성합니다.

```text
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정 (README 등)
style: 코드 스타일 수정 (포맷팅, 세미콜론 등 로직 변경 없음)
refactor: 코드 리팩토링
chore: 빌드 설정, 패키지 매니저 설정 등 (코드 로직 변경 없음)

예시: feat: 로그인 페이지 UI 구현
예시: fix: 메인 페이지 레이아웃 깨짐 수정
```

### 디렉토리 구조

정비서 프론트엔드의 구조를 베이스로 삼아 Fit Again 서비스에 맞게 확장합니다.

```text
src/
├── api/          # API 요청 함수와 HTTP Client 설정
├── assets/       # 이미지, 폰트 등 정적 파일
├── components/
│   ├── common/   # 공통 컴포넌트 (Button, Input, Modal 등)
│   └── feature/  # 특정 기능 또는 도메인 컴포넌트
├── constants/    # 공통 상수 (API URL, 키 값 등)
├── hooks/        # 공통 커스텀 훅 (useToggle, useDebounce 등)
├── pages/        # 라우팅되는 페이지 컴포넌트
├── routes/       # React Router 라우팅 설정
├── schema/       # Zod 검증 스키마
├── stores/       # Zustand 스토어
├── styles/       # 전역 CSS와 Tailwind CSS 설정
├── types/        # 공통 TypeScript 타입
└── utils/        # 순수 유틸 함수 (formatDate, validators 등)
```

각 디렉토리의 실제 구현 파일은 관련 기능을 개발할 때 추가합니다.

### 네이밍 컨벤션

1. 컴포넌트: PascalCase (예: `MyButton.tsx`)
2. 그 외 훅, 유틸, 변수: camelCase (예: `useMyHook.ts`, `formatDate.ts`)

### 절대 경로

1. 상대 경로 중첩(`../../...`)을 방지하기 위해 절대 경로를 사용합니다.
2. `@/`는 `src/` 폴더를 가리킵니다.
3. 예시: `import Button from "@/components/common/Button";`

## 🔒 Git Hooks (자동 코드 검사)

이 프로젝트는 **Husky**와 **lint-staged**를 사용하여 커밋 전 자동으로 코드를 검사합니다.

### 작동 방식

`git commit` 실행 시 자동으로 다음 작업을 수행합니다.

1. 변경된 소스 파일에 ESLint 자동 수정 적용
2. Prettier로 코드 포맷팅
3. 에러가 있으면 커밋 중단

`git push` 실행 시 자동으로 다음 작업을 수행합니다.

1. Vitest 단위 테스트
2. TypeScript 타입 검사
3. ESLint 전체 검사
4. 하나라도 실패하면 push 중단

### 커밋이 실패한다면

1. 출력된 에러 메시지를 확인하고 수정합니다.
2. 변경 파일을 다시 스테이징합니다.
3. 커밋을 다시 실행합니다.

### 주의사항

- 처음 clone한 후 `npm install`을 실행하면 Husky가 자동 설치됩니다.
- 커밋 및 push 전 자동 검사는 코드 품질 유지를 위한 필수 과정입니다.
