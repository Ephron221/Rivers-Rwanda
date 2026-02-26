import { Request, Response, NextFunction } from 'express';
import * as SellerModel from '../models/Seller.model';
import * as UserModel from '../models/User.model';
import { query } from '../database/connection';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '../services/email.service';
import { generateOtp } from '../utils/otpGenerator';
import { User } from '../models/User.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const registerSeller = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName, phoneNumber, nationalId } = req.body;

    if (!email || !password || !firstName || !lastName || !phoneNumber || !nationalId) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const existingUser = await UserModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            email,
            password_hash: hashedPassword,
            role: 'seller' as const,
        };

        const userId = await UserModel.createUser(newUser);

        const newSeller = {
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            national_id: nationalId,
        };

        const sellerId = await SellerModel.createSeller(newSeller);

        const otpCode = generateOtp();
        await UserModel.storeOtp(userId, otpCode, 'email_verification');
        await sendOtpEmail(email, otpCode);

        res.status(201).json({ 
            success: true, 
            message: 'Seller registration successful. Please check your email for OTP to verify your account.',
            sellerId: sellerId 
        });

    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    try {
        const user = await UserModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isValidOtp = await UserModel.verifyOtp(user.id, otpCode);

        if (!isValidOtp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        await UserModel.updateUser(user.id, { email_verified: true, status: 'active' } as Partial<User>);

        res.status(200).json({ success: true, message: 'Email verified successfully. Your account is now active.' });

    } catch (error) {
        next(error);
    }
};

export const getSellerProducts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication error: User ID not found.' });
        }

        const sellerId = await UserModel.getSellerIdByUserId(userId);

        if (!sellerId) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Updated queries to include 'purpose' and ensure consistent naming
        // For houses, we determine purpose based on price availability
        const houses = await query(`
            SELECT id, title as name, 'house' as type, 
            CASE WHEN monthly_rent_price IS NOT NULL AND purchase_price IS NOT NULL THEN 'both'
                 WHEN purchase_price IS NOT NULL THEN 'sale'
                 ELSE 'rent' END as purpose,
            status, created_at FROM houses WHERE seller_id = ?
        `, [sellerId]);

        const accommodations = await query("SELECT id, name, type, purpose, status, created_at FROM accommodations WHERE seller_id = ?", [sellerId]);
        
        const vehicles = await query("SELECT id, CONCAT(make, ' ', model) as name, 'vehicle' as type, purpose, status, created_at FROM vehicles WHERE seller_id = ?", [sellerId]);

        const allProducts = [...(houses as any[]), ...(accommodations as any[]), ...(vehicles as any[])];
        
        // Sort by date: most recent first
        allProducts.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
        });

        res.status(200).json({ success: true, data: allProducts });
    } catch (error) {
        console.error('[GET_SELLER_PRODUCTS_ERROR]:', error);
        next(error);
    }
};
