import { app } from '@/backend/server';
import { NextRequest } from 'next/server';

const handle = app;

export async function GET(request: NextRequest, { params }: { params: { route: string[] } }) {
  return handle(request, { params });
}

export async function POST(request: NextRequest, { params }: { params: { route: string[] } }) {
  return handle(request, { params });
}

export async function PUT(request: NextRequest, { params }: { params: { route: string[] } }) {
    return handle(request, { params });
}

export async function DELETE(request: NextRequest, { params }: { params: { route: string[] } }) {
    return handle(request, { params });
}
