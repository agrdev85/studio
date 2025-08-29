import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { NextRequest, NextResponse } from 'next/server';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import tournamentRoutes from './routes/tournaments';
import scoreRoutes from './routes/scores';
import paymentRoutes from './routes/payments';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Unity sends urlencoded data
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/payments', paymentRoutes);


// Simple test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the CUFIRE backend!' });
});


// This is the adapter to run Express app inside Next.js API routes
const handler = (req: NextRequest, { params }: { params: { route: string[] } }) => {
  return new Promise(async (resolve) => {
    // Convert NextRequest to a format Express can understand
    const url = new URL(req.url);
    const expressReq = {
        ...req,
        // @ts-ignore
        originalUrl: url.pathname + url.search,
        // @ts-ignore
        url: url.pathname + url.search,
        // @ts-ignore
        headers: Object.fromEntries(req.headers),
        // @ts-ignore
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.json().catch(() => req.body || {}),
         // @ts-ignore
        query: Object.fromEntries(url.searchParams),
        // @ts-ignore
        params,
    };

    // Create a mock response object
    const expressRes = {
        _status: 200,
        _headers: {},
        _body: null,
        status(code: number) {
            this._status = code;
            return this;
        },
        json(body: any) {
            this._body = JSON.stringify(body);
            this.setHeader('Content-Type', 'application/json');
            this.end();
        },
        send(body: any) {
            this._body = body;
            this.end();
        },
        setHeader(name: string, value: string) {
            this._headers[name.toLowerCase()] = value;
        },
        getHeader(name: string) {
            return this._headers[name.toLowerCase()];
        },
        end() {
            const headers = new Headers(this._headers);
            const response = new NextResponse(this._body, { status: this._status, headers });
            resolve(response);
        }
    };
    
    // @ts-ignore
    app(expressReq, expressRes, (err) => {
        if (err) {
            console.error(err);
            resolve(NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }));
        }
    });
  });
};


export { handler as app };
