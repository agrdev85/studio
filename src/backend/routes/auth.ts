import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// POST /api/auth/register
// Corresponds to Unity's register call
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password, wallet } = req.body;

  if (!username || !email || !password || !wallet) {
    return res.status(400).send('error: Missing required fields');
  }

  try {
    // Check for uniqueness based on spec
    const existingUserByUsername = await db.users.findUnique({ where: { username } });
    if (existingUserByUsername) return res.status(409).send('error: Username already exists');

    const existingUserByEmail = await db.users.findUnique({ where: { email } });
    if (existingUserByEmail) return res.status(409).send('error: Email already exists');
    
    const existingUserByWallet = await db.users.findUnique({ where: { usdtWallet: wallet } });
    if (existingUserByWallet) return res.status(409).send('error: Wallet already in use');

    await db.users.create({
      data: {
        username,
        email,
        password, // In a real app, hash this password!
        usdtWallet: wallet,
      },
    });

    // Unity client expects "ok" on success
    res.status(201).send('ok');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('error: Internal server error');
  }
});


// POST /api/auth/login
// Corresponds to Unity's login call
router.post('/login', async (req: Request, res: Response) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).send('error: Missing name or password');
    }

    try {
        const user = await db.users.findFirst({
            where: {
                username: name,
                password: password, // In a real app, compare hashed passwords
            }
        });

        if (!user) {
            return res.status(401).send('error: Name o Password Invalid!');
        }
        
        // Unity client expects "ok" on success
        res.status(200).send('ok');

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('error: Internal server error');
    }
});


export default router;
