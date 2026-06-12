import { NextResponse } from 'next/server';
import { db, ensureDB } from '../../../lib/db';

export async function GET(request: Request) {
  await ensureDB();
  const { searchParams } = new URL(request.url);
  const notebookId = searchParams.get('notebook_id');

  let result;
  if (notebookId) {
    result = await db.execute({
      sql: 'SELECT * FROM notes WHERE notebook_id = ? ORDER BY updated_at DESC',
      args: [notebookId],
    });
  } else {
    result = await db.execute('SELECT * FROM notes ORDER BY updated_at DESC');
  }

  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  await ensureDB();
  const { title, content, notebook_id } = await request.json();

  const result = await db.execute({
    sql: 'INSERT INTO notes (title, content, notebook_id) VALUES (?, ?, ?) RETURNING *',
    args: [title || '제목 없음', content || '', notebook_id ?? null],
  });

  return NextResponse.json(result.rows[0]);
}
