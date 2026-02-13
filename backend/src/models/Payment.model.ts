import { query } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export interface Payment extends RowDataPacket {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: string;
  transaction_id?: string;
  payment_proof_path?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: Date;
}

export const createPayment = async (data: any): Promise<void> => {
  const sql = `
    INSERT INTO payments (id, booking_id, amount, payment_method, transaction_id, payment_proof_path, status)
    VALUES (UUID(), ?, ?, ?, ?, ?, 'pending')
  `;
  await query(sql, [
    data.booking_id,
    data.amount,
    data.payment_method,
    data.transaction_id || null,
    data.payment_proof_path || null
  ]);
};

export const updatePaymentStatus = async (id: string, status: string): Promise<void> => {
  const sql = 'UPDATE payments SET status = ? WHERE id = ?';
  await query(sql, [status, id]);
};

export const getPaymentsByBookingId = async (bookingId: string): Promise<Payment[]> => {
  const sql = 'SELECT * FROM payments WHERE booking_id = ?';
  return await query<Payment[]>(sql, [bookingId]);
};
