import { query } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  id: string;
  email: string;
  password_hash: string;
  role: 'client' | 'agent' | 'admin';
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

export const getAgentIdByUserId = async (userId: string): Promise<string | null> => {
    const sql = 'SELECT id FROM agents WHERE user_id = ?';
    const results = await query<any[]>(sql, [userId]);
    return results[0]?.id || null;
};

export const createUser = async (userData: {
  email: string;
  password_hash: string;
  role: 'client' | 'agent' | 'admin';
  status?: string;
}): Promise<string> => {
  const sql = `
    INSERT INTO users (id, email, password_hash, role, status)
    VALUES (UUID(), ?, ?, ?, ?)
  `;
  const status = userData.status || (userData.role === 'agent' ? 'pending' : 'active');
  await query(sql, [userData.email, userData.password_hash, userData.role, status]);
  const user = await findUserByEmail(userData.email);
  return user!.id;
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

export const createAgentProfile = async (userId: string, profile: { firstName: string, lastName: string, phoneNumber: string }) => {
    const sql = 'INSERT INTO agents (id, user_id, first_name, last_name, phone_number, status) VALUES (UUID(), ?, ?, ?, ?, "pending")';
    await query(sql, [userId, profile.firstName, profile.lastName, profile.phoneNumber]);
};
