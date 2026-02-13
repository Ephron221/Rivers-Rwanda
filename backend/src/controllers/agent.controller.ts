import { Request, Response, NextFunction } from 'express';
import * as CommissionModel from '../models/Commission.model';
import { query } from '../database/connection';

export const getMyCommissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    // We need the agent_id from the agents table using the user_id
    const agentResult = await query('SELECT id FROM agents WHERE user_id = ?', [userId]);
    
    if (agentResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Agent profile not found' });
    }

    const agentId = agentResult[0].id;
    const commissions = await CommissionModel.getCommissionsByAgentId(agentId);
    res.status(200).json({ success: true, data: commissions });
  } catch (error) {
    next(error);
  }
};

export const getMyStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const agentResult = await query('SELECT id FROM agents WHERE user_id = ?', [userId]);
    
    if (agentResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Agent profile not found' });
    }

    const agentId = agentResult[0].id;
    const stats = await CommissionModel.getAgentStats(agentId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getMyReferralCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const agentResult = await query('SELECT referral_code FROM agents WHERE user_id = ?', [userId]);
    
    if (agentResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Agent profile not found' });
    }

    res.status(200).json({ success: true, data: { referral_code: agentResult[0].referral_code } });
  } catch (error) {
    next(error);
  }
};

export const getMyClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        const agentResult = await query('SELECT id FROM agents WHERE user_id = ?', [userId]);
        
        if (agentResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Agent profile not found' });
        }

        const agentId = agentResult[0].id;
        // Clients referred by this agent (found in bookings)
        const sql = `
            SELECT DISTINCT c.first_name, c.last_name, u.email, b.created_at as referred_at
            FROM bookings b
            JOIN clients cl ON b.client_id = cl.id
            JOIN users u ON cl.user_id = u.id
            JOIN clients c ON cl.id = c.id
            WHERE b.agent_id = ?
        `;
        const clients = await query(sql, [agentId]);
        res.status(200).json({ success: true, data: clients });
    } catch (error) {
        next(error);
    }
};
