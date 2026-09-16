import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeDB } from '@/lib/db';



export async function GET() {
  const db = getRuntimeDB();
  return NextResponse.json({
    success: true,
    knowledge: db.getKnowledge()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, answer, category = 'Chung', keywords = '' } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: 'Vui lĂ²ng Ä‘iá»n Ä‘á»§ cĂ¢u há»i vĂ  cĂ¢u tráº£ lá»i' }, { status: 400 });
    }

    const db = getRuntimeDB();
    const newItem = {
      id: `kb-${Date.now()}`,
      category,
      question,
      answer,
      keywords,
      created_at: new Date().toISOString()
    };
    db.addKnowledge(newItem);

    return NextResponse.json({
      success: true,
      item: newItem,
      message: 'ÄĂ£ náº¡p kiáº¿n thá»©c má»›i vĂ o bá»™ nhá»› AI thĂ nh cĂ´ng!'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

