import { query } from '../database/connection';
import { RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';

// This interface is for agent commissions
export interface Commission extends RowDataPacket {
  id: string;
  agent_id: string;
  booking_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  earned_at: Date;
  paid_at?: Date;
}

// This function correctly creates a commission record for an AGENT
export const createCommission = async (data: { agent_id: string, booking_id: string, amount: number }): Promise<void> => {
  const commissionId = uuidv4();
  const sql = `
    INSERT INTO commissions (id, agent_id, booking_id, amount, status, earned_at)
    VALUES (?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
  `;
  await query(sql, [commissionId, data.agent_id, data.booking_id, data.amount]);
};

// Restored function for agents to get their commissions
export const getCommissionsByAgentId = async (agentId: string): Promise<Commission[]> => {
  const sql = 'SELECT * FROM commissions WHERE agent_id = ? ORDER BY earned_at DESC';
  return await query<Commission[]>(sql, [agentId]);
};

// Restored function for agent stats
export const getAgentStats = async (agentId: string): Promise<any> => {
  const totalEarnedSql = 'SELECT SUM(amount) as totalEarned FROM commissions WHERE agent_id = ? AND status IN ("approved", "paid")';
  const pendingSql = 'SELECT SUM(amount) as totalPending FROM commissions WHERE agent_id = ? AND status = "pending"';
  const clientsSql = 'SELECT COUNT(DISTINCT client_id) as totalClients FROM bookings WHERE agent_id = ?';
  
  const [totalEarnedResult] = await query<any[]>(totalEarnedSql, [agentId]);
  const [pendingResult] = await query<any[]>(pendingSql, [agentId]);
  const [clientsResult] = await query<any[]>(clientsSql, [agentId]);

  return {
    totalEarned: totalEarnedResult.totalEarned || 0,
    totalPending: pendingResult.totalPending || 0,
    totalClients: clientsResult.totalClients || 0,
  };
};

export const updateCommissionStatus = async (id: string, status: string): Promise<void> => {
  let sql = 'UPDATE commissions SET status = ?';
  const params: any[] = [status];
  
  if (status === 'paid') {
    sql += ', paid_at = CURRENT_TIMESTAMP';
  }
  
  sql += ' WHERE id = ?';
  params.push(id);

  await query(sql, params);
};
