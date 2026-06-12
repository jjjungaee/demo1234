import { NextResponse } from 'next/server';
import { db, ensureDB } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDB();
  const { id } = await params;
  const updates = await request.json();

  const allowed = ['title', 'content', 'notebook_id'];
  const fields = Object.keys(updates).filter((k) => allowed.includes(k));

  if (fields.length === 0) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 });
  }

  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => updates[f]);

  await db.execute({
    sql: `UPDATE notes SET ${setClause}, updated_at = datetime('now') WHERE id = ?`,
    args: [...values, id],
  });

  const result = await db.execute({
    sql: 'SELECT * FROM notes WHERE id = ?',
    args: [id],
  });

  return NextResponse.json(result.rows[0]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDB();
  const { id } = await params;

  await db.execute({ sql: 'DELETE FROM notes WHERE id = ?', args: [id] });

  return NextResponse.json({ success: true });
}
