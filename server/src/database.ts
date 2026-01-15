import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/taskboard',
});

export const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL,
        created_at BIGINT NOT NULL
      );
    `);
    console.log('✓ Database initialized');
  } finally {
    client.release();
  }
};

export const getTasks = async () => {
  const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
  return result.rows;
};

export const createTask = async (task: any) => {
  const { id, title, description, status, createdAt } = task;
  await pool.query(
    'INSERT INTO tasks (id, title, description, status, created_at) VALUES ($1, $2, $3, $4, $5)',
    [id, title, description, status, createdAt]
  );
  return task;
};

export const updateTask = async (task: any) => {
  const { id, title, description, status } = task;
  await pool.query(
    'UPDATE tasks SET title = $2, description = $3, status = $4 WHERE id = $1',
    [id, title, description, status]
  );
  return task;
};

export const deleteTask = async (taskId: string) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
};

export default pool;
