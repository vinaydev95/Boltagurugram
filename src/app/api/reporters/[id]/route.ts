import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET /api/reporters/[id] — Fetch single reporter
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM reporters WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Reporter not found' }, { status: 404 });
    }

    return NextResponse.json({ reporter: rows[0] });
  } catch (error) {
    console.error('GET /api/reporters/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch reporter' }, { status: 500 });
  }
}

// PUT /api/reporters/[id] — Update reporter
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const body = await request.json();
    const { name, email, password, role, avatar_url, bio } = body;

    // Fetch existing reporter to get their current name
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM reporters WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Reporter not found' }, { status: 404 });
    }

    const currentReporter = existing[0];
    const updates: string[] = [];
    const updateParams: (string | number | null)[] = [];

    if (name !== undefined && name !== currentReporter.name) {
      // Check if new name is already taken
      const [nameConflict] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM reporters WHERE name = ? AND id != ?',
        [name, id]
      );
      if (nameConflict.length > 0) {
        return NextResponse.json({ error: 'Reporter name is already taken' }, { status: 409 });
      }
      updates.push('name = ?');
      updateParams.push(name);
    }

    if (email !== undefined && email !== currentReporter.email) {
      // Check if new email is already taken
      const [emailConflict] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM reporters WHERE email = ? AND id != ?',
        [email, id]
      );
      if (emailConflict.length > 0) {
        return NextResponse.json({ error: 'Reporter email is already taken' }, { status: 409 });
      }
      updates.push('email = ?');
      updateParams.push(email);
    }

    if (password !== undefined) {
      updates.push('password = ?');
      updateParams.push(password);
    }
    if (role !== undefined) {
      updates.push('role = ?');
      updateParams.push(role);
    }
    if (avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      updateParams.push(avatar_url);
    }
    if (bio !== undefined) {
      updates.push('bio = ?');
      updateParams.push(bio);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: true, reporter: currentReporter, message: 'No fields to update' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // If name changed, update all articles author from old name to new name
      if (name !== undefined && name !== currentReporter.name) {
        await connection.query(
          'UPDATE articles SET author = ? WHERE author = ?',
          [name, currentReporter.name]
        );
      }

      updateParams.push(id);
      await connection.query(
        `UPDATE reporters SET ${updates.join(', ')} WHERE id = ?`,
        updateParams
      );

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    const [updated] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM reporters WHERE id = ?',
      [id]
    );

    return NextResponse.json({ success: true, reporter: updated[0] });
  } catch (error: any) {
    console.error('PUT /api/reporters/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update reporter' }, { status: 500 });
  }
}

// DELETE /api/reporters/[id] — Delete reporter
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Fetch reporter to get their name
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT name FROM reporters WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Reporter not found' }, { status: 404 });
    }

    const reporterName = existing[0].name;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Reset articles author to 'Admin'
      await connection.query(
        "UPDATE articles SET author = 'Admin' WHERE author = ?",
        [reporterName]
      );

      await connection.query('DELETE FROM reporters WHERE id = ?', [id]);

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    return NextResponse.json({ success: true, message: 'Reporter deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /api/reporters/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete reporter' }, { status: 500 });
  }
}
