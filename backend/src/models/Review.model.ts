import { query } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export interface Review extends RowDataPacket {
  id: string;
  client_id: string;
  accommodation_id?: string;
  vehicle_id?: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
}

export const createReview = async (data: any): Promise<void> => {
  const sql = `
    INSERT INTO reviews (id, client_id, accommodation_id, vehicle_id, rating, comment, status)
    VALUES (UUID(), ?, ?, ?, ?, ?, 'pending')
  `;
  await query(sql, [
    data.client_id,
    data.accommodation_id || null,
    data.vehicle_id || null,
    data.rating,
    data.comment
  ]);
};

export const getReviewsByTarget = async (type: 'accommodation' | 'vehicle', targetId: string): Promise<Review[]> => {
  const column = type === 'accommodation' ? 'accommodation_id' : 'vehicle_id';
  const sql = `
    SELECT r.*, c.first_name, c.last_name 
    FROM reviews r 
    JOIN clients c ON r.client_id = c.id 
    WHERE r.${column} = ? AND r.status = 'approved' 
    ORDER BY r.created_at DESC
  `;
  return await query<Review[]>(sql, [targetId]);
};

export const updateReviewStatus = async (id: string, status: string): Promise<void> => {
  const sql = 'UPDATE reviews SET status = ? WHERE id = ?';
  await query(sql, [status, id]);
};
