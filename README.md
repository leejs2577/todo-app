# TODO 앱

모던하고 심플한 TODO 리스트 앱입니다. Claude Code Teams 기능을 활용하여 개발되었습니다.

## 기능

- ✅ 할 일 추가 (제목, 설명)
- ✅ 완료 상태 토글
- ✅ 할 일 삭제
- ✅ 필터링 (전체/진행 중/완료)
- ✅ 실시간 통계
- ✅ 다크/라이트 모드 지원
- ✅ 반응형 디자인

## 기술 스택

### 프론트엔드
- HTML5, CSS3, Vanilla JavaScript
- 커스텀 체크박스
- CSS 변수 테마 시스템

### 백엔드
- Node.js + Express
- 인메모리 데이터베이스

## 실행 방법

### 1. 백엔드 서버 시작

```bash
# 의존성 설치
npm install

# 서버 시작
npm start
```

API는 `http://localhost:3001`에서 실행됩니다.

### 2. 프론트엔드 실행

브라우저에서 `index.html` 파일을 직접 열거나, Python HTTP 서버를 사용하세요:

```bash
python3 -m http.server 8080
```

그 후 `http://localhost:8080` 접속

## API 명세

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/todos` | 전체 TODO 목록 조회 |
| POST | `/api/todos` | 새 TODO 생성 |
| PUT | `/api/todos/:id` | TODO 수정 (완료 토글) |
| DELETE | `/api/todos/:id` | TODO 삭제 |

## 데이터 모델

```json
{
  "id": 1,
  "title": "할 일 제목",
  "description": "설명",
  "completed": false,
  "createdAt": "2026-03-31T00:00:00.000Z"
}
```

## 개발 팀

이 프로젝트는 Claude Code Teams 기능을 활용하여 개발되었습니다:

- **백엔드 개발자**: Express API 구현
- **프론트엔드 개발자**: UI 구현
- **QA 엔지니어**: 테스트 계획 수립

## 라이선스

MIT
