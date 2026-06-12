import { NextResponse } from 'next/server';
import { db, ensureDB } from '@/lib/db';

export async function GET() {
  await ensureDB();

  const result = await db.execute(`
    SELECT n.id, n.name, n.created_at, n.updated_at,
           COUNT(notes.id) as note_count
    FROM notebooks n
    LEFT JOIN notes ON notes.notebook_id = n.id
    GROUP BY n.id
    ORDER BY n.name ASC
  `);

  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  await ensureDB();
  const { name } = await request.json();

  const result = await db.execute({
    sql: 'INSERT INTO notebooks (name) VALUES (?) RETURNING *',
    args: [name],
  });

  return NextResponse.json(result.rows[0]);
}
