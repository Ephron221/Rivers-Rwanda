import { query } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  id: string;
  email: string;
  password_hash: string;
  role: 'client' | 'seller' | 'admin';
  status: 'active' | 'pending' | 'suspended' | 'deleted';
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const results = await query<User[]>(sql, [email]);
  return results[0] || null;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const results = await query<User[]>(sql, [id]);
  return results[0] || null;
};

export const getAllUsers = async (): Promise<User[]> => {
  const sql = 'SELECT id, email, role, status, created_at FROM users ORDER BY created_at DESC';
  return await query<User[]>(sql);
};

export const getClientIdByUserId = async (userId: string): Promise<string | null> => {
    const sql = 'SELECT id FROM clients WHERE user_id = ?';
    const results = await query<any[]>(sql, [userId]);
    return results[0]?.id || null;
};

export const getSellerIdByUserId = async (userId: string): Promise<string | null> => {
    const sql = 'SELECT id FROM sellers WHERE user_id = ?';
    const results = await query<any[]>(sql, [userId]);
    return results[0]?.id || null;
};

export const createUser = async (userData: {
  email: string;
  password_hash: string;
  role: 'client' | 'seller' | 'admin';
  status?: string;
}): Promise<string> => {
  const sql = `
    INSERT INTO users (id, email, password_hash, role, status)
    VALUES (UUID(), ?, ?, ?, ?)
  `;
  const status = userData.status || (userData.role === 'seller' ? 'pending' : 'active');
  await query(sql, [userData.email, userData.password_hash, userData.role, status]);
  const user = await findUserByEmail(userData.email);
  return user!.id;
};

export const storeOtp = async (userId: string, otpCode: string, purpose: string) => {
    const sql = 'INSERT INTO otps (user_id, otp_code, purpose, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))';
    await query(sql, [userId, otpCode, purpose]);
};

export const verifyOtp = async (userId: string, otpCode: string): Promise<boolean> => {
    const sql = 'SELECT * FROM otps WHERE user_id = ? AND otp_code = ? AND expires_at > NOW() AND is_used = false';
    const results = await query<any[]>(sql, [userId, otpCode]);
    if (results.length > 0) {
        const updateSql = 'UPDATE otps SET is_used = true WHERE id = ?';
        await query(updateSql, [results[0].id]);
        return true;
    }
    return false;
};

export const updateUser = async (id: string, data: Partial<User>): Promise<void> => {
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  let sql = 'UPDATE users SET ';
  const params: any[] = [];
  
  fields.forEach((field, index) => {
    sql += `${field} = ?${index === fields.length - 1 ? '' : ', '}`;
    params.push((data as any)[field]);
  });
  
  sql += ' WHERE id = ?';
  params.push(id);
  
  await query(sql, params);
};

export const deleteUser = async (id: string): Promise<void> => {
  const sql = 'DELETE FROM users WHERE id = ?';
  await query(sql, [id]);
};

export const createClientProfile = async (userId: string, profile: { firstName: string, lastName: string, phoneNumber?: string }) => {
    const sql = 'INSERT INTO clients (id, user_id, first_name, last_name, phone_number) VALUES (UUID(), ?, ?, ?, ?)';
    await query(sql, [userId, profile.firstName, profile.lastName, profile.phoneNumber]);
};

export const createSellerProfile = async (userId: string, profile: { firstName: string, lastName: string, phoneNumber: string, nationalId: string }) => {
    const sql = 'INSERT INTO sellers (id, user_id, first_name, last_name, phone_number, national_id, status) VALUES (UUID(), ?, ?, ?, ?, ?, "pending")';
    await query(sql, [userId, profile.firstName, profile.lastName, profile.phoneNumber, profile.nationalId]);
};
