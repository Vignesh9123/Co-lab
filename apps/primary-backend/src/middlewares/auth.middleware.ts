import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { User } from '@repo/types';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
   try {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token;
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return
    }
    const decoded = jwt.verify(token, config.JWT_SECRET) as User;
    req.user = decoded;
    next();
} catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
   }
}
