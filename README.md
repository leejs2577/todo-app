# Todo App

할 일 관리를 위한 풀스택 웹 애플리케이션입니다.  
Node.js + Express 백엔드 REST API와 바닐라 JavaScript 프론트엔드로 구성되어 있습니다.

## 주요 기능

- 할 일 추가 — 제목과 선택적 설명을 입력하여 등록
- 완료 체크 — 체크박스로 완료 상태 토글
- 삭제 — 불필요한 항목 제거
- 필터링 — 전체 / 진행 중 / 완료 항목 별도 조회
- 통계 — 전체 / 진행 중 / 완료 개수 실시간 표시
- 다크 모드 — 라이트/다크 테마 전환 (시스템 설정 자동 감지 및 로컬 저장)
- 반응형 디자인 — 모바일, 태블릿, 데스크톱 대응

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | HTML5, CSS3, Vanilla JavaScript |
| 백엔드 | Node.js 18+, Express 4 |
| 데이터 저장 | 인메모리 저장소 (서버 재시작 시 초기화) |
| 통신 | REST API (JSON) |

## 프로젝트 구조

```
todo-app/
├── frontend/
│   ├── index.html      # 메인 HTML
│   ├── styles.css      # 스타일 (다크 모드 포함)
│   └── app.js          # API 통신 및 UI 로직
└── backend/
    ├── src/
    │   ├── index.js    # Express 서버 및 API 라우터
    │   └── database.js # 인메모리 데이터 저장소
    └── package.json
```

## 설치 및 실행

### 사전 요구사항

- [Node.js](https://nodejs.org/) 18 이상

### 1. 저장소 클론

```bash
git clone https://github.com/leejs2577/todo-app.git
cd todo-app
```

### 2. 백엔드 실행

```bash
cd backend
npm install
npm start
```

서버가 `http://localhost:3001` 에서 실행됩니다.

개발 모드(파일 변경 시 자동 재시작)로 실행하려면:

```bash
npm run dev
```

### 3. 프론트엔드 열기

별도의 빌드 과정 없이 `frontend/index.html` 을 브라우저에서 직접 열면 됩니다.

```bash
# macOS
open frontend/index.html

# Windows
start frontend/index.html

# Linux
xdg-open frontend/index.html
```

또는 간단한 정적 서버를 사용할 수도 있습니다.

```bash
cd frontend
npx serve .
# http://localhost:3000 에서 접속
```

> **주의:** 프론트엔드는 `http://localhost:3001` 의 백엔드 API에 연결합니다.  
> 반드시 백엔드를 먼저 실행한 후 프론트엔드를 여세요.

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/api/todos` | 전체 할 일 목록 조회 |
| `GET` | `/api/todos/:id` | 특정 할 일 조회 |
| `POST` | `/api/todos` | 새 할 일 생성 |
| `PUT` | `/api/todos/:id` | 할 일 수정 (제목, 설명, 완료 상태) |
| `DELETE` | `/api/todos/:id` | 할 일 삭제 |

### 요청/응답 예시

**할 일 생성 (`POST /api/todos`)**

```json
// Request Body
{
  "title": "장보기",
  "description": "우유, 계란, 빵"
}

// Response 201 Created
{
  "id": 1,
  "title": "장보기",
  "description": "우유, 계란, 빵",
  "completed": false,
  "createdAt": "2024-01-01T09:00:00.000Z"
}
```

**완료 상태 변경 (`PUT /api/todos/1`)**

```json
// Request Body
{
  "completed": true
}
```

**할 일 삭제 (`DELETE /api/todos/1`)**

```
Response: 204 No Content
```

## 라이선스

MIT
