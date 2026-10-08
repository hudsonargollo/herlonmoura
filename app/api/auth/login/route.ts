import { NextRequest, NextResponse } from 'next/server';

const DEMO_USER = { email: 'admin@herlonmoura.com.br', password: 'admin2026!', name: 'Administrador', role: 'admin' };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.email === DEMO_USER.email && body.password === DEMO_USER.password) {
      const token = Buffer.from(JSON.stringify({ email: body.email, role: DEMO_USER.role })).toString('base64');
      const user = { name: DEMO_USER.name, email: DEMO_USER.email, role: DEMO_USER.role };
      return NextResponse.json({ token, user }, {
        headers: {
          'Set-Cookie': `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
        },
      });
    }
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}