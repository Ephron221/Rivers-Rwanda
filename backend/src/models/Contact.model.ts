import { query } from '../database/connection';

export const createInquiry = async (data: any): Promise<void> => {
  const sql = `
    INSERT INTO contact_inquiries (id, full_name, email, phone_number, subject, message, status)
    VALUES (UUID(), ?, ?, ?, ?, ?, 'new')
  `;
  await query(sql, [
    data.fullName,
    data.email,
    data.phoneNumber,
    data.subject,
    data.message
  ]);
};

export const getAllInquiries = async (): Promise<any[]> => {
  const sql = 'SELECT * FROM contact_inquiries ORDER BY created_at DESC';
  return await query(sql);
};

export const updateInquiryStatus = async (id: string, status: string): Promise<void> => {
  const sql = 'UPDATE contact_inquiries SET status = ? WHERE id = ?';
  await query(sql, [status, id]);
};
