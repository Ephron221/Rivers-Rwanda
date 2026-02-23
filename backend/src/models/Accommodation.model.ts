import { query } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export interface Accommodation extends RowDataPacket {
  id: string;
  type: 'apartment' | 'hotel_room' | 'event_hall';
  name: string;
  description: string;
  city: string;
  district: string;
  price_per_night?: number;
  price_per_event?: number;
  status: 'available' | 'unavailable' | 'maintenance';
  images: any;
  created_at: Date;
}

export const getAllAccommodations = async (filters: any): Promise<Accommodation[]> => {
  let sql = 'SELECT * FROM accommodations WHERE status = \'available\'';
  const params: any[] = [];

  if (filters.type) {
    sql += ' AND type = ?';
    params.push(filters.type);
  }

  if (filters.city) {
    sql += ' AND city = ?';
    params.push(filters.city);
  }

  return await query<Accommodation[]>(sql, params);
};

export const getAccommodationById = async (id: string): Promise<Accommodation | null> => {
  const sql = 'SELECT * FROM accommodations WHERE id = ? AND status = \'available\'';
  const results = await query<Accommodation[]>(sql, [id]);
  return results[0] || null;
};

export const createAccommodation = async (data: Partial<Accommodation>): Promise<string> => {
  const sql = `
    INSERT INTO accommodations (id, seller_id, type, name, description, city, district, price_per_night, price_per_event, status, images)
    VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await query(sql, [
    (data as any).seller_id,
    data.type,
    data.name,
    data.description,
    data.city,
    data.district,
    data.price_per_night || null,
    data.price_per_event || null,
    'pending_approval',
    data.images || JSON.stringify([])
  ]);
  
  const result = await query<any[]>('SELECT id FROM accommodations ORDER BY created_at DESC LIMIT 1');
  return result[0].id;
};

export const updateAccommodation = async (id: string, data: any): Promise<void> => {
  let sql = 'UPDATE accommodations SET ';
  const params: any[] = [];
  const fields = Object.keys(data);
  
  fields.forEach((field, index) => {
    sql += `${field} = ?${index === fields.length - 1 ? '' : ', '}`;
    params.push(data[field]);
  });
  
  sql += ' WHERE id = ?';
  params.push(id);
  
  await query(sql, params);
};

export const updateAccommodationStatus = async (id: string, status: string): Promise<void> => {
  const sql = 'UPDATE accommodations SET status = ? WHERE id = ?';
  await query(sql, [status, id]);
};

export const deleteAccommodation = async (id: string): Promise<void> => {
  const sql = 'DELETE FROM accommodations WHERE id = ?';
  await query(sql, [id]);
};
