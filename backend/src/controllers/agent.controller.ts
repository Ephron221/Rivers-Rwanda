import { Request, Response, NextFunction } from 'express';
import * as CommissionModel from '../models/Commission.model';
import { query } from '../database/connection';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

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

export const getMyCommissions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

export const getMyStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

export const confirmPayoutReceipt = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const agentId = await getAgentId(req.user?.userId);
        
        const [commission] = await query<any[]>('SELECT * FROM commissions WHERE id = ? AND agent_id = ?', [id, agentId]);
        
        if (!commission) {
            return res.status(404).json({ success: false, message: 'Commission record not found or unauthorized.' });
        }

        if (commission.status !== 'paid') {
            return res.status(400).json({ success: false, message: 'Payout has not been marked as paid by Admin yet.' });
        }

        await CommissionModel.updateCommissionStatus(id, 'completed');
        res.status(200).json({ success: true, message: 'Payout receipt confirmed. Thank you!' });
    } catch (error) {
        next(error);
    }
};

export const rejectPayoutReceipt = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const agentId = await getAgentId(req.user?.userId);
        
        const [commission] = await query<any[]>('SELECT * FROM commissions WHERE id = ? AND agent_id = ?', [id, agentId]);
        
        if (!commission) {
            return res.status(404).json({ success: false, message: 'Commission record not found or unauthorized.' });
        }

        if (commission.status !== 'paid') {
            return res.status(400).json({ success: false, message: 'Only paid commissions can be rejected.' });
        }

        // Set status back to approved so admin can re-upload proof or correct payment
        await CommissionModel.updateCommissionStatus(id, 'approved');
        // Clear the bad proof path? Or keep it for history? Let's clear it to allow fresh upload
        await query('UPDATE commissions SET payout_proof_path = NULL WHERE id = ?', [id]);

        res.status(200).json({ success: true, message: 'Payout rejected. Admin has been notified to re-verify payment.' });
    } catch (error) {
        next(error);
    }
};

export const deleteMyCommission = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const agentId = await getAgentId(req.user?.userId);
        await query('DELETE FROM commissions WHERE id = ? AND agent_id = ?', [id, agentId]);
        res.status(200).json({ success: true, message: 'Commission record removed from your view.' });
    } catch (error) {
        next(error);
    }
};

export const getMyReferralCode = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

export const getMyClients = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
