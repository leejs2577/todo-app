/**
 * 인메모리 데이터베이스 (SQLite 대체)
 * 파일 기반 DB 대신 메모리 배열 사용
 */

// 메모리 저장소
let todos = [];
let nextId = 1;

/**
 * 데이터베이스 인스턴스를 반환 (SQLite와 호환되는 인터페이스)
 */
export function getDb() {
  return {
    prepare: (sql) => {
      return {
        all: () => {
          if (sql.includes('ORDER BY createdAt DESC')) {
            return [...todos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          }
          return [...todos];
        },
        get: (param) => {
          if (sql.includes('WHERE id = ?')) {
            // 타입 변환: 문자열을 숫자로 변환하여 비교
            const numId = typeof param === 'string' ? parseInt(param, 10) : param;
            return todos.find(t => t.id === numId) || null;
          }
          return null;
        },
        run: (...args) => {
          // INSERT
          if (sql.includes('INSERT INTO todos')) {
            const newTodo = {
              id: nextId++,
              title: args[0],
              description: args[1] || '',
              completed: 0,
              createdAt: new Date().toISOString()
            };
            todos.push(newTodo);
            return { lastInsertRowid: newTodo.id };
          }

          // UPDATE
          if (sql.includes('UPDATE todos')) {
            const id = args[args.length - 1];
            const numId = typeof id === 'string' ? parseInt(id, 10) : id;

            const index = todos.findIndex(t => t.id === numId);
            if (index === -1) {
              return { changes: 0 };
            }

            // SQL에 포함된 필드 순서대로 인자 처리
            let argIndex = 0;

            if (sql.includes('title = ?')) {
              todos[index].title = args[argIndex++];
            }
            if (sql.includes('description = ?')) {
              todos[index].description = args[argIndex++];
            }
            if (sql.includes('completed = ?')) {
              todos[index].completed = args[argIndex] ? 1 : 0;
            }

            return { changes: 1 };
          }

          // DELETE
          if (sql.includes('DELETE FROM todos WHERE id = ?')) {
            const id = args[0];
            const numId = typeof id === 'string' ? parseInt(id, 10) : id;
            const initialLength = todos.length;
            todos = todos.filter(t => t.id !== numId);
            return { changes: initialLength - todos.length };
          }

          return { changes: 0 };
        }
      };
    },
    exec: () => {},
    pragma: () => {}
  };
}

/**
 * 데이터베이스 연결 종료
 */
export function closeDb() {
  console.log('인메모리 DB 정리 완료');
}
