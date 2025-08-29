import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { NextRequest, NextResponse } from 'next/server';
import authRoutes from './routes/auth';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);

// Simple test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});


// This is the adapter to run Express app inside Next.js API routes
const handler = (req: NextRequest, { params }: { params: { route: string[] } }) => {
  return new Promise((resolve) => {
    const originalUrl = req.nextUrl.pathname;
    // @ts-ignore
    req.url = originalUrl;

    const res = new (class extends NextResponse {
      _status = 200;
      _headers = new Headers();
      _body: any = null;

      constructor() {
        // @ts-ignore
        super(null, { status: 200, headers: {} });
      }

      status(code: number) {
        this._status = code;
        return this;
      }
      
      json(body: any) {
        this._body = JSON.stringify(body);
        this._headers.set('Content-Type', 'application/json');
        this.send(this._body);
      }

      send(body: any) {
        if (!this._headers.get('Content-Type')) {
            this._headers.set('Content-Type', 'text/plain');
        }
        
        let response;
        try {
             response = new NextResponse(body, { status: this._status, headers: this._headers });
        } catch (e: any) {
            // Handle cases where body might not be a valid Response body type
             response = new NextResponse(String(body), { status: this._status, headers: this._headers });
        }

        resolve(response);
      }
      
      end(body?: any) {
        this.send(body || this._body);
      }

    })();

    // @ts-ignore
    app(req, res);
  });
};


export { handler as app };
