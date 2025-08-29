import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = '7d';

// POST /api/auth/register
// Corresponds to Unity's register call
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password, wallet } = req.body;

  if (!username || !email || !password || !wallet) {
    return res.status(400).send('error: Missing required fields');
  }

  try {
    const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUserByUsername) return res.status(409).send('error: Username already exists');

    const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingUserByEmail) return res.status(409).send('error: Email already exists');
    
    const existingUserByWallet = await prisma.user.findUnique({ where: { usdtWallet: wallet } });
    if (existingUserByWallet) return res.status(409).send('error: Wallet already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        usdtWallet: wallet,
      },
    });

    res.status(201).send('ok');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('error: Internal server error');
  }
});

// POST /api/auth/login
// Corresponds to Unity's login call
router.post('/login', async (req: Request, res: Response) => {
    // For Unity client
    const { name, password } = req.body;
    // For Web client
    const { email, password: webPassword } = req.body;

    const loginIdentifier = name || email;
    const loginPassword = password || webPassword;

    if (!loginIdentifier || !loginPassword) {
        return res.status(400).send('error: Missing credentials');
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: loginIdentifier },
                    { email: loginIdentifier }
                ]
            }
        });

        if (!user) {
            return res.status(401).send('error: Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('error: Invalid credentials');
        }

        // Handle different responses for Unity and Web
        if (name) { // Request is from Unity
             res.status(200).send('ok');
        } else { // Request is from Web client
            const token = jwt.sign(
                { userId: user.id, username: user.username, isAdmin: user.isAdmin },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.status(200).json({ 
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
             });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('error: Internal server error');
    }
});

export default router;
