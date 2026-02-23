import { query } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export interface Seller extends RowDataPacket {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  national_id: string;
  status: 'pending' | 'approved' | 'rejected';
  profile_image: string;
  business_name: string;
  agreed_to_commission: boolean;
  bank_account_details: any;
  mobile_money_details: any;
  created_at: Date;
  updated_at: Date;
}

export const createSeller = async (sellerData: any): Promise<string> => {
    const sql = 'INSERT INTO sellers (user_id, first_name, last_name, phone_number, national_id) VALUES (UUID(), ?, ?, ?, ?, ?)';
    const result = await query(sql, [sellerData.user_id, sellerData.first_name, sellerData.last_name, sellerData.phone_number, sellerData.national_id]);
    return (result as any).insertId;
};

export const findSellerById = async (id: string): Promise<Seller | null> => {
  const sql = 'SELECT * FROM sellers WHERE id = ?';
  const results = await query<Seller[]>(sql, [id]);
  return results[0] || null;
};

export const updateSeller = async (id: string, data: Partial<Seller>): Promise<void> => {
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  let sql = 'UPDATE sellers SET ';
  const params: any[] = [];
  
  fields.forEach((field, index) => {
    const key = field as keyof Partial<Seller>;
    sql += `${key} = ?${index === fields.length - 1 ? '' : ', '}`;
    params.push(data[key]);
  });
  
  sql += ' WHERE id = ?';
  params.push(id);
  
  await query(sql, params);
};
