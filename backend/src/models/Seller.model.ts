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
    const sql = 'INSERT INTO sellers (id, user_id, first_name, last_name, phone_number, national_id, status) VALUES (UUID(), ?, ?, ?, ?, ?, "pending")';
    await query(sql, [
        sellerData.user_id, 
        sellerData.first_name, 
        sellerData.last_name, 
        sellerData.phone_number, 
        sellerData.national_id
    ]);
    
    const result = await query<any[]>('SELECT id FROM sellers WHERE user_id = ?', [sellerData.user_id]);
    return result[0].id;
};

export const findSellerById = async (id: string): Promise<Seller | null> => {
  const sql = 'SELECT * FROM sellers WHERE id = ?';
  const results = await query<Seller[]>(sql, [id]);
  return results[0] || null;
};

export const updateSeller = async (id: string, data: any): Promise<void> => {
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  let sql = 'UPDATE sellers SET ';
  const params: any[] = [];
  
  fields.forEach((field, index) => {
    sql += `${field} = ?${index === fields.length - 1 ? '' : ', '}`;
    params.push(data[field]);
  });
  
  sql += ' WHERE id = ?';
  params.push(id);
  
  await query(sql, params);
};
