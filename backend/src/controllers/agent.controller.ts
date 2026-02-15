import { Request, Response, NextFunction } from 'express';
import * as CommissionModel from '../models/Commission.model';
import { query } from '../database/connection';

// Helper function to get agent ID from user ID
const getAgentId = async (userId: string | undefined): Promise<string | null> => {
    if (!userId) return null;
    try {
        const result = await query<any[]>('SELECT id FROM agents WHERE user_id = ?', [userId]);
        return result.length > 0 ? result[0].id : null;
    } catch (error) {
        console.error("Error fetching agent ID:", error);
        return null;
    }
};

export const getMyCommissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agentId = await getAgentId(req.user?.userId);
    if (!agentId) {
      return res.status(404).json({ success: false, message: 'Agent profile not found.' });
    }
    const commissions = await CommissionModel.getCommissionsByAgentId(agentId);
    res.status(200).json({ success: true, data: commissions });
  } catch (error) {
    next(error);
  }
};

export const getMyStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agentId = await getAgentId(req.user?.userId);
    if (!agentId) {
      return res.status(404).json({ success: false, message: 'Agent profile not found.' });
    }
    const stats = await CommissionModel.getAgentStats(agentId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getMyReferralCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated.' });
    }
    const result = await query<any[]>('SELECT referral_code FROM agents WHERE user_id = ?', [userId]);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Agent profile not found.' });
    }
    res.status(200).json({ success: true, data: { referral_code: result[0].referral_code } });
  } catch (error) {
    next(error);
  }
};

export const getMyClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const agentId = await getAgentId(req.user?.userId);
        if (!agentId) {
            return res.status(404).json({ success: false, message: 'Agent profile not found.' });
        }

        const sql = `
            SELECT DISTINCT c.first_name, c.last_name, u.email, b.created_at as referred_at
            FROM bookings b
            INNER JOIN clients c ON b.client_id = c.id
            INNER JOIN users u ON c.user_id = u.id
            WHERE b.agent_id = ?
            ORDER BY referred_at DESC
        `;
        const clients = await query(sql, [agentId]);
        res.status(200).json({ success: true, data: clients });
    } catch (error) {
        next(error);
    }
};
