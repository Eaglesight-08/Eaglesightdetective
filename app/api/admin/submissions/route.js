import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/server-auth';
import {
  readSubmissionsFromMd,
  updateSubmissionInMd,
  deleteSubmissionFromMd,
} from '@/lib/markdown-db';
import fs from 'fs/promises';
import path from 'path';

function checkAuth(request) {
  const token = request.cookies.get('eagle_admin_session')?.value;
  return verifySessionToken(token);
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const submissions = await readSubmissionsFromMd();

    // Also read the raw submissions.md content
    let rawMarkdown = '';
    try {
      const dbPath = path.join(process.cwd(), 'submissions.md');
      rawMarkdown = await fs.readFile(dbPath, 'utf-8');
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, submissions, rawMarkdown });
  } catch (err) {
    console.error('Error getting submissions from markdown db:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve submissions.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status, notes } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const updated = await updateSubmissionInMd(id, { status, notes });
    return NextResponse.json({ success: true, submission: updated });
  } catch (err) {
    console.error('Error updating submission in markdown db:', err);
    return NextResponse.json(
      { error: 'Failed to update submission in file.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const ok = await deleteSubmissionFromMd(id);
    if (!ok) {
      return NextResponse.json({ error: 'Could not delete.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Deleted ${id}` });
  } catch (err) {
    console.error('Error deleting submission from markdown db:', err);
    return NextResponse.json(
      { error: 'Failed to delete submission from file.' },
      { status: 500 }
    );
  }
}
