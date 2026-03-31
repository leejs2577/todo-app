/**
 * TODO API 백엔드 서버
 * Node.js + Express + SQLite
 */
import express from 'express';
import cors from 'cors';
import { getDb, closeDb } from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors()); // CORS 활성화
app.use(express.json()); // JSON 파싱

/**
 * GET /api/todos - 전체 TODO 목록 조회
 */
app.get('/api/todos', (req, res) => {
  const db = getDb();
  const todos = db.prepare('SELECT * FROM todos ORDER BY createdAt DESC').all();

  // completed 필드를 정수에서 불리언으로 변환
  const result = todos.map(todo => ({
    ...todo,
    completed: Boolean(todo.completed)
  }));

  res.json(result);
});

/**
 * GET /api/todos/:id - 단일 TODO 조회
 */
app.get('/api/todos/:id', (req, res) => {
  const db = getDb();
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id);

  if (!todo) {
    return res.status(404).json({ error: 'TODO를 찾을 수 없습니다' });
  }

  res.json({
    ...todo,
    completed: Boolean(todo.completed)
  });
});

/**
 * POST /api/todos - 새 TODO 생성
 */
app.post('/api/todos', (req, res) => {
  const { title, description } = req.body;

  // 필수 필드 검증
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'title은 필수 항목입니다' });
  }

  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO todos (title, description, completed)
    VALUES (?, ?, 0)
  `);

  const result = stmt.run(title.trim(), description?.trim() || '');

  const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({
    ...newTodo,
    completed: Boolean(newTodo.completed)
  });
});

/**
 * PUT /api/todos/:id - TODO 수정
 */
app.put('/api/todos/:id', (req, res) => {
  const { title, description, completed } = req.body;
  const db = getDb();

  // 기존 TODO 확인
  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'TODO를 찾을 수 없습니다' });
  }

  // 업데이트할 필드 구성
  const updates = [];
  const values = [];

  if (title !== undefined) {
    if (title.trim() === '') {
      return res.status(400).json({ error: 'title은 비워둘 수 없습니다' });
    }
    updates.push('title = ?');
    values.push(title.trim());
  }

  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description.trim());
  }

  if (completed !== undefined) {
    updates.push('completed = ?');
    values.push(completed ? 1 : 0);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: '수정할 필드가 없습니다' });
  }

  values.push(req.params.id);

  const stmt = db.prepare(`
    UPDATE todos SET ${updates.join(', ')}
    WHERE id = ?
  `);

  stmt.run(...values);

  const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id);

  res.json({
    ...updated,
    completed: Boolean(updated.completed)
  });
});

/**
 * DELETE /api/todos/:id - TODO 삭제
 */
app.delete('/api/todos/:id', (req, res) => {
  const db = getDb();

  // 기존 TODO 확인
  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'TODO를 찾을 수 없습니다' });
  }

  const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
  stmt.run(req.params.id);

  res.status(204).send();
});

/**
 * 404 처리
 */
app.use((req, res) => {
  res.status(404).json({ error: '엔드포인트를 찾을 수 없습니다' });
});

/**
 * 서버 시작
 */
app.listen(PORT, () => {
  console.log(`TODO API 서버가 http://localhost:${PORT}에서 실행 중입니다`);
});

// 그레이스풀 셧다운
process.on('SIGINT', () => {
  console.log('\n서버를 종료합니다...');
  closeDb();
  process.exit(0);
});
