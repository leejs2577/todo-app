/**
 * TODO 앱 메인 JavaScript
 * 백엔드 API와 통신하여 CRUD 기능 구현
 */

// API 기본 URL
const API_BASE = 'http://localhost:3001/api/todos';

// ============================================
// 테마 관리
// ============================================

function initTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // 시스템 설정 따르기
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// 테마 초기화
initTheme();

// 상태 관리
let todos = [];
let currentFilter = 'all';

// DOM 요소 참조
const elements = {
  form: document.getElementById('todo-form'),
  titleInput: document.getElementById('title-input'),
  descInput: document.getElementById('desc-input'),
  todoList: document.getElementById('todo-list'),
  loading: document.getElementById('loading'),
  error: document.getElementById('error'),
  filterBtns: document.querySelectorAll('.filter-btn'),
  statTotal: document.getElementById('stat-total'),
  statActive: document.getElementById('stat-active'),
  statCompleted: document.getElementById('stat-completed')
};

/**
 * API 호출 헬퍼 함수
 */
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: '요청 실패' }));
      throw new Error(error.error || '요청 실패');
    }

    return response.status === 204 ? null : await response.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인하세요.');
    }
    throw err;
  }
}

/**
 * 전체 TODO 목록 조회
 */
async function fetchTodos() {
  showLoading(true);
  hideError();

  try {
    todos = await apiCall(API_BASE);
    renderTodos();
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

/**
 * 새 TODO 생성
 */
async function createTodo(title, description) {
  showLoading(true);
  hideError();

  try {
    const newTodo = await apiCall(API_BASE, {
      method: 'POST',
      body: JSON.stringify({ title, description })
    });
    todos.unshift(newTodo);
    updateStats();
    renderTodos();
    elements.form.reset();
    elements.titleInput.focus();
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

/**
 * TODO 완료 상태 토글
 */
async function toggleTodo(id, completed) {
  hideError();

  try {
    const updated = await apiCall(`${API_BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed })
    });

    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
      todos[index] = updated;
      renderTodos();
    }
  } catch (err) {
    showError(err.message);
    // 실패 시 UI 되돌리기
    renderTodos();
  }
}

/**
 * TODO 삭제
 */
async function deleteTodo(id) {
  if (!confirm('이 할 일을 삭제하시겠습니까?')) {
    return;
  }

  hideError();

  try {
    await apiCall(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    todos = todos.filter(t => t.id !== id);
    renderTodos();
  } catch (err) {
    showError(err.message);
  }
}

/**
 * 통계 업데이트
 */
function updateStats() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;

  elements.statTotal.textContent = total;
  elements.statActive.textContent = active;
  elements.statCompleted.textContent = completed;
}

/**
 * TODO 목록 렌더링
 */
function renderTodos() {
  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    elements.todoList.innerHTML = `
      <li class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p>${getEmptyMessage()}</p>
      </li>
    `;
  } else {
    elements.todoList.innerHTML = filteredTodos.map(todo => `
      <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <input
          type="checkbox"
          class="todo-checkbox"
          ${todo.completed ? 'checked' : ''}
          onchange="handleToggle(${todo.id}, this.checked)"
        >
        <div class="todo-content">
          <div class="todo-title">${escapeHtml(todo.title)}</div>
          ${todo.description ? `<div class="todo-desc">${escapeHtml(todo.description)}</div>` : ''}
          <div class="todo-meta">${formatDate(todo.createdAt)}</div>
        </div>
        <button class="btn-delete" onclick="handleDelete(${todo.id})" title="삭제">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </li>
    `).join('');
  }

  updateStats();
}

/**
 * 빈 상태 메시지
 */
function getEmptyMessage() {
  switch (currentFilter) {
    case 'active': return '진행 중인 할 일이 없습니다';
    case 'completed': return '완료된 할 일이 없습니다';
    default: return '할 일을 추가해보세요!';
  }
}

/**
 * 날짜 포맷팅
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return '방금 전';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;

  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * HTML 이스케이프 (XSS 방지)
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 로딩 표시
 */
function showLoading(show) {
  elements.loading.classList.toggle('hidden', !show);
}

/**
 * 에러 표시
 */
function showError(message) {
  elements.error.textContent = message;
  elements.error.classList.remove('hidden');
}

function hideError() {
  elements.error.classList.add('hidden');
}

/**
 * 필터 변경
 */
function setFilter(filter) {
  currentFilter = filter;
  elements.filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTodos();
}

/**
 * 이벤트 핸들러
 */

// 폼 제출
elements.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = elements.titleInput.value.trim();
  const description = elements.descInput.value.trim();
  await createTodo(title, description);
});

// 필터 버튼
elements.filterBtns.forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// 전역 핸들러 (HTML onclick 속성에서 호출)
window.handleToggle = (id, completed) => toggleTodo(id, completed);
window.handleDelete = (id) => deleteTodo(id);

// 테마 토글 버튼
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

// 초기 로드
fetchTodos();
