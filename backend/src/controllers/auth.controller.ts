import { Request, Response, NextFunction } from 'express';
import { findUserByEmail, createUser, createClientProfile, createAgentProfile } from '../models/User.model';
import { hashPassword, comparePassword } from '../utils/bcrypt.utils';
import { generateToken } from '../utils/jwt.utils';

// ... (register functions are unchanged)

export const registerClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const userId = await createUser({
      email,
      password_hash: hashedPassword,
      role: 'client'
    });

    await createClientProfile(userId, { firstName, lastName, phoneNumber });

    const token = generateToken({ userId, email, role: 'client' });

    res.status(201).json({
      success: true,
      data: { token, user: { id: userId, email, role: 'client' } }
    });
  } catch (error) {
    next(error);
  }
};

export const registerAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const userId = await createUser({
      email,
      password_hash: hashedPassword,
      role: 'agent'
    });

    await createAgentProfile(userId, { firstName, lastName, phoneNumber });

    res.status(201).json({
      success: true,
      message: 'Agent registration submitted for approval'
    });
  } catch (error) {
    next(error);
  }
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    console.log(`[LOGIN ATTEMPT] Email: ${email}`);

    const user = await findUserByEmail(email);
    if (!user) {
      console.log(`[LOGIN FAILED] User not found for email: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    console.log(`[LOGIN INFO] User found: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
    console.log(`[LOGIN INFO] Stored password hash: ${user.password_hash}`);

    if (user.status === 'pending') {
        console.log(`[LOGIN FAILED] Account is pending approval.`);
        return res.status(403).json({ success: false, message: 'Account pending approval' });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    console.log(`[LOGIN INFO] Password comparison result (isMatch): ${isMatch}`);

    if (!isMatch) {
      console.log(`[LOGIN FAILED] Password does not match.`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log(`[LOGIN SUCCESS] Credentials valid for ${email}`);
    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    res.status(200).json({
      success: true,
      data: { token, user: { id: user.id, email: user.email, role: user.role } }
    });
  } catch (error) {
    next(error);
  }
};
