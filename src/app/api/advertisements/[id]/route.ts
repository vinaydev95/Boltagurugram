import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
    // We can update specific fields or all fields
    const updates: string[] = [];
    const values: any[] = [];
    
    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.position !== undefined) {
      updates.push('position = ?');
      values.push(data.position);
    }
    if (data.image_url !== undefined) {
      updates.push('image_url = ?');
      values.push(data.image_url);
    }
    if (data.target_url !== undefined) {
      updates.push('target_url = ?');
      values.push(data.target_url);
    }
    if (data.active !== undefined) {
      updates.push('active = ?');
      values.push(data.active ? 1 : 0);
    }
    
    if (data.starts_at !== undefined) {
      updates.push('starts_at = ?');
      const startsAt = data.starts_at ? new Date(data.starts_at) : null;
      values.push(startsAt);
    }
    
    if (data.expires_at !== undefined) {
      updates.push('expires_at = ?');
      const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
      values.push(expiresAt);
    }
    
    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    values.push(id);
    
    const query = `UPDATE advertisements SET ${updates.join(', ')} WHERE id = ?`;
    
    await pool.query<ResultSetHeader>(query, values);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating advertisement:', error);
    return NextResponse.json({ error: 'Failed to update advertisement' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    await pool.query<ResultSetHeader>(
      'DELETE FROM advertisements WHERE id = ?',
      [id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    return NextResponse.json({ error: 'Failed to delete advertisement' }, { status: 500 });
  }
}
