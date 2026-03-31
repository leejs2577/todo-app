# TODO 프론트엔드

## 개요
HTML + CSS + Vanilla JavaScript로 구현한 TODO 앱 프론트엔드

## 기능
- 할 일 목록 표시
- 새 할 일 추가 (제목, 설명)
- 완료 토글 (체크박스)
- 삭제 기능
- 필터링 (전체/진행중/완료)
- 반응형 디자인
- 백엔드 API 연동

## 실행 방법

### 1. 백엔드 서버 시작
```bash
cd workspace/developer/backend
npm install
npm start
```

### 2. 프론트엔드 열기
```bash
# 방법 1: 직접 브라우저에서 파일 열기
open workspace/developer/frontend/index.html

# 방법 2: 로컬 서버 사용 (권장)
npx serve workspace/developer/frontend
# 또는
python3 -m http.server 8080 --directory workspace/developer/frontend
```

브라우저에서 `http://localhost:8080` 접속

## 파일 구조
```
frontend/
├── index.html    # 메인 HTML
├── styles.css    # 스타일시트
├── app.js        # 메인 JavaScript
└── README.md     # 이 파일
```

## 기술 스택
- 순수 HTML5, CSS3, JavaScript (ES6+)
- Fetch API for HTTP requests
- CSS Grid & Flexbox (반응형)
- CSS Variables (테마)

## 보안
- HTML 이스케이프로 XSS 방지
- 입력 길이 제한
- 삭제 전 확인 다이얼로그
