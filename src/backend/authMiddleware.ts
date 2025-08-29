import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        username: string;
        isAdmin: boolean;
    }
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = bearer.split('Bearer ')[1].trim();
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: number; username: string; isAdmin: boolean; iat: number; exp: number };
        req.user = payload;
        next();
    } catch (e) {
        console.error('Token verification error:', e);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    next();
};
