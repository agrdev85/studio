import { app } from '@/backend/server';
import { NextRequest } from 'next/server';

function handler(req: NextRequest, { params }: { params: { route: string[] } }) {
    // This is a workaround for the fact that Next.js doesn't pass the body for GET requests to the handler
    // and Express needs to know the original method.
    // @ts-ignore
    req.originalMethod = req.method;
    
    return app(req, { params });
}


export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
