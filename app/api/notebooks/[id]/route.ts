import { NextResponse } from 'next/server';
import { db, ensureDB } from '../../../../lib/db';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDB();
  const { id } = await params;

  await db.execute({
    sql: 'DELETE FROM notebooks WHERE id = ?',
    args: [id],
  });

  return NextResponse.json({ success: true });
}
