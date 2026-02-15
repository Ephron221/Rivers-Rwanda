import { query } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export interface Commission extends RowDataPacket {
  id: string;
  agent_id: string;
  booking_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  earned_at: Date;
  paid_at?: Date;
}

export const createCommission = async (data: any): Promise<void> => {
  const sql = `
    INSERT INTO commissions (id, agent_id, booking_id, amount, status)
    VALUES (UUID(), ?, ?, ?, 'pending')
  `;
  await query(sql, [data.agent_id, data.booking_id, data.amount]);
};

export const getCommissionsByAgentId = async (agentId: string): Promise<Commission[]> => {
  const sql = 'SELECT * FROM commissions WHERE agent_id = ? ORDER BY earned_at DESC';
  try {
    return await query<Commission[]>(sql, [agentId]);
  } catch (error) {
    console.error('Database error in getCommissionsByAgentId:', error);
    return [];
  }
};

export const updateCommissionStatus = async (id: string, status: string): Promise<void> => {
  const sql = 'UPDATE commissions SET status = ?, paid_at = ? WHERE id = ?';
  const paidDate = status === 'paid' ? new Date() : null;
  await query(sql, [status, paidDate, id]);
};

export const getAgentStats = async (agentId: string): Promise<any> => {
  const sql = `
    SELECT 
      IFNULL(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as paid,
      IFNULL(SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END), 0) as approved,
      IFNULL(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending
    FROM commissions 
    WHERE agent_id = ?
  `;
  try {
    const results = await query(sql, [agentId]);
    return results[0] || { paid: 0, approved: 0, pending: 0 };
  } catch (error) {
    return { paid: 0, approved: 0, pending: 0 };
  }
};
