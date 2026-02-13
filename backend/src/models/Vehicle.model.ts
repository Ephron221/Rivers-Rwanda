import { query } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export interface Vehicle extends RowDataPacket {
  id: string;
  purpose: 'rent' | 'buy' | 'both';
  make: string;
  model: string;
  year: number;
  vehicle_type: string;
  transmission: string;
  fuel_type: string;
  seating_capacity: number;
  daily_rate?: number;
  sale_price?: number;
  status: 'available' | 'rented' | 'sold' | 'maintenance';
  images: any;
  created_at: Date;
}

export const getAllVehicles = async (filters: any): Promise<Vehicle[]> => {
  let sql = 'SELECT * FROM vehicles WHERE 1=1';
  const params: any[] = [];

  if (filters.purpose) {
    sql += ' AND purpose = ?';
    params.push(filters.purpose);
  }

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.make) {
    sql += ' AND make = ?';
    params.push(filters.make);
  }

  return await query<Vehicle[]>(sql, params);
};

export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  const sql = 'SELECT * FROM vehicles WHERE id = ?';
  const results = await query<Vehicle[]>(sql, [id]);
  return results[0] || null;
};

export const createVehicle = async (data: any): Promise<string> => {
  const sql = `
    INSERT INTO vehicles (id, purpose, make, model, year, vehicle_type, transmission, fuel_type, seating_capacity, daily_rate, sale_price, status, images)
    VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await query(sql, [
    data.purpose,
    data.make,
    data.model,
    data.year,
    data.vehicle_type,
    data.transmission,
    data.fuel_type,
    data.seating_capacity,
    data.daily_rate || null,
    data.sale_price || null,
    data.status || 'available',
    data.images || JSON.stringify([])
  ]);
  
  const result = await query<any[]>('SELECT id FROM vehicles ORDER BY created_at DESC LIMIT 1');
  return result[0].id;
};

export const updateVehicle = async (id: string, data: any): Promise<void> => {
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  let sql = 'UPDATE vehicles SET ';
  const params: any[] = [];
  
  fields.forEach((field, index) => {
    sql += `${field} = ?${index === fields.length - 1 ? '' : ', '}`;
    params.push(data[field]);
  });
  
  sql += ' WHERE id = ?';
  params.push(id);
  
  await query(sql, params);
};

export const deleteVehicle = async (id: string): Promise<void> => {
  const sql = 'DELETE FROM vehicles WHERE id = ?';
  await query(sql, [id]);
};
