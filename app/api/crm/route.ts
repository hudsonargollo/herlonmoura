import { NextRequest, NextResponse } from 'next/server';

const CRM_URL = process.env.CRM_API_URL || 'https://herlonmoura-crm.workers.dev';
const CRM_KEY = process.env.CRM_API_KEY || '';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api/crm', '');
  const query = url.searchParams.toString();
  const target = `${CRM_URL}/api${path}${query ? `?${query}` : ''}`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (CRM_KEY) headers['Authorization'] = `Bearer ${CRM_KEY}`;

  const res = await fetch(target, { method: 'GET', headers });
  const body = await res.json();
  return NextResponse.json(body, { status: res.status });
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api/crm', '');
  const target = `${CRM_URL}/api${path}`;

  const body = await req.json();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (CRM_KEY) headers['Authorization'] = `Bearer ${CRM_KEY}`;

  const res = await fetch(target, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api/crm', '');
  const target = `${CRM_URL}/api${path}`;

  const body = await req.json();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (CRM_KEY) headers['Authorization'] = `Bearer ${CRM_KEY}`;

  const res = await fetch(target, { method: 'PUT', headers, body: JSON.stringify(body) });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api/crm', '');
  const target = `${CRM_URL}/api${path}`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (CRM_KEY) headers['Authorization'] = `Bearer ${CRM_KEY}`;

  const res = await fetch(target, { method: 'DELETE', headers });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}