import { query } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export interface Accommodation extends RowDataPacket {
  id: string;
  type: 'apartment' | 'hotel_room' | 'event_hall';
  purpose: 'rent' | 'sale' | 'both';
  name: string;
  description: string;
  city: string;
  district: string;
  price_per_night?: number;
  price_per_event?: number;
  sale_price?: number;
  status: 'pending_approval' | 'available' | 'unavailable' | 'maintenance' | 'rejected';
  images: any;
  amenities: any;
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

  if (filters.purpose) {
    sql += ' AND (purpose = ? OR purpose = \'both\')';
    params.push(filters.purpose);
  }

  if (filters.maxPrice) {
    sql += ' AND (price_per_night <= ? OR price_per_event <= ? OR sale_price <= ?)';
    params.push(filters.maxPrice, filters.maxPrice, filters.maxPrice);
  }

  return await query<Accommodation[]>(sql, params);
};

export const getAccommodationById = async (id: string): Promise<Accommodation | null> => {
  const sql = 'SELECT * FROM accommodations WHERE id = ?';
  const results = await query<Accommodation[]>(sql, [id]);
  return results[0] || null;
};

export const createAccommodation = async (data: any): Promise<string> => {
  const sql = `
    INSERT INTO accommodations (
      id, seller_id, type, purpose, name, description, 
      city, district, price_per_night, price_per_event, sale_price,
      status, images, amenities
    )
    VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await query(sql, [
    data.seller_id,
    data.type,
    data.purpose || 'rent',
    data.name,
    data.description,
    data.city,
    data.district,
    data.price_per_night || null,
    data.price_per_event || null,
    data.sale_price || null,
    'pending_approval',
    data.images || JSON.stringify([]),
    data.amenities || JSON.stringify([])
  ]);
  
  const result = await query<any[]>('SELECT id FROM accommodations ORDER BY created_at DESC LIMIT 1');
  return result[0].id;
};

export const updateAccommodation = async (id: string, data: any): Promise<void> => {
  let sql = 'UPDATE accommodations SET ';
  const params: any[] = [];
  const fields = Object.keys(data).filter(f => f !== 'id');
  
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
