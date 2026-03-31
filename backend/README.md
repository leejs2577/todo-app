# TODO API 백엔드

## 개요
Node.js + Express + SQLite(better-sqlite3)로 구현한 RESTful TODO API

## 기술 스택
- **Node.js** - JavaScript 런타임
- **Express** - 웹 프레임워크
- **better-sqlite3** - 동기식 SQLite 드라이버
- **cors** - CORS 미들웨어

## 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/todos` | 전체 TODO 목록 조회 |
| GET | `/api/todos/:id` | 단일 TODO 조회 |
| POST | `/api/todos` | 새 TODO 생성 |
| PUT | `/api/todos/:id` | TODO 수정 |
| DELETE | `/api/todos/:id` | TODO 삭제 |

## 데이터 모델
```json
{
  "id": 1,
  "title": "제목",
  "description": "설명",
  "completed": false,
  "createdAt": "2026-03-30 12:00:00"
}
```

## 설치 및 실행

```bash
# 디렉토리 이동
cd workspace/developer/backend

# 의존성 설치
npm install

# 서버 실행
npm start

# 개발 모드 (파일 감지)
npm run dev
```

## 예시 요청

### 전체 목록 조회
```bash
curl http://localhost:3000/api/todos
```

### TODO 생성
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Claude 학습", "description": "Claude Code 사용법 익히기"}'
```

### TODO 수정 (완료 표시)
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### TODO 삭제
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```
