import { NextResponse } from 'next/server';
import { insertSubmission } from '@/lib/markdown-db';

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name && !data.phone && !data.email) {
      return NextResponse.json(
        { error: 'At least one contact method (name, phone, or email) is required.' },
        { status: 400 }
      );
    }

    // Insert directly into the markdown database (submissions.md)
    const item = await insertSubmission(data);

    return NextResponse.json({
      success: true,
      id: item.id,
      item,
      message: 'Inquiry saved successfully into submissions.md',
    });
  } catch (err) {
    console.error('Error saving submission to Markdown database:', err);
    return NextResponse.json(
      { error: 'Failed to save submission to file.', details: err.message },
      { status: 500 }
    );
  }
}
