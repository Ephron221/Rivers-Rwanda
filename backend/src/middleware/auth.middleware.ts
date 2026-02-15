import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.utils';
import { query } from '../database/connection';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication token is missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token) as TokenPayload;
    
    // Check if the user exists and is active
    const userResult = await query<any[]>('SELECT id, status FROM users WHERE id = ?', [decoded.userId]);
    
    if (userResult.length === 0) {
        return res.status(401).json({ success: false, message: 'User not found.' });
    }

    const user = userResult[0];
    if (user.status !== 'active') {
        return res.status(403).json({ success: false, message: `User account is ${user.status}.` });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action.' });
    }
    next();
  };
};
