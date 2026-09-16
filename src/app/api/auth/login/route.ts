import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeDB } from '@/lib/db';



export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Vui lĂ²ng nháº­p Ä‘áº§y Ä‘á»§ tĂªn Ä‘Äƒng nháº­p vĂ  máº­t kháº©u' }, { status: 400 });
    }

    const db = getRuntimeDB();
    const user = db.validateLogin(username.trim(), password);

    if (!user) {
      // Check if user exists but is pending
      const pendingUser = db.getUserByUsername(username.trim());
      if (pendingUser && pendingUser.status === 'pending') {
        return NextResponse.json({ error: 'TĂ i khoáº£n cá»§a báº¡n Ä‘ang chá» Quáº£n trá»‹ viĂªn phĂª duyá»‡t. Vui lĂ²ng liĂªn há»‡ Admin!' }, { status: 403 });
      }
      if (pendingUser && pendingUser.status === 'disabled') {
        return NextResponse.json({ error: 'TĂ i khoáº£n cá»§a báº¡n Ä‘Ă£ bá»‹ táº¡m khĂ³a. Vui lĂ²ng liĂªn há»‡ Admin!' }, { status: 403 });
      }
      return NextResponse.json({ error: 'TĂªn Ä‘Äƒng nháº­p hoáº·c máº­t kháº©u khĂ´ng Ä‘Ăºng!' }, { status: 401 });
    }

    // Create simple session token
    const token = `session-${user.id}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    return NextResponse.json({
      success: true,
      user: {
        userId: user.id,
        username: user.username,
        role: user.role,
        fullname: user.fullname,
        token
      },
      message: `ChĂ o má»«ng ${user.fullname} Ä‘Ă£ Ä‘Äƒng nháº­p thĂ nh cĂ´ng!`
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lá»—i Ä‘Äƒng nháº­p' }, { status: 500 });
  }
}

