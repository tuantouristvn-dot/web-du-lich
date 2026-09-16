import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeDB } from '@/lib/db';



export async function GET() {
  const db = getRuntimeDB();
  return NextResponse.json({
    success: true,
    settings: db.getSettings()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getRuntimeDB();
    const updated = db.updateSettings(body);

    return NextResponse.json({
      success: true,
      settings: updated,
      message: 'Cáº­p nháº­t cĂ i Ä‘áº·t thÆ°Æ¡ng hiá»‡u thĂ nh cĂ´ng!'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

