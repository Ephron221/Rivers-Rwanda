import { Request, Response, NextFunction } from 'express';
import { query } from '../database/connection';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  const role = req.user?.role;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'No user ID in token' });
  }

  try {
    let profileData: any = null;

    try {
      let tableName: string | null = null;
      let extraFields = '';
      let alias = '';

      switch (role) {
        case 'client':
          tableName = 'clients';
          alias = 'c';
          break;
        case 'agent':
          tableName = 'agents';
          alias = 'a';
          extraFields = ', a.referral_code';
          break;
        case 'admin':
          tableName = 'admin_profiles';
          alias = 'ap';
          break;
      }
      
      if (tableName) {
        const sql = `
          SELECT u.email, u.role, u.status, 
                 ${alias}.first_name, ${alias}.last_name, ${alias}.phone_number, ${alias}.profile_image
                 ${extraFields} 
          FROM users u 
          LEFT JOIN ${tableName} ${alias} ON u.id = ${alias}.user_id 
          WHERE u.id = ?
        `;
        const results = await query<any[]>(sql, [userId]);
        profileData = results && results.length > 0 ? results[0] : null;
      } else {
        const fallbackSql = 'SELECT id, email, role, status FROM users WHERE id = ?';
        const results = await query<any[]>(fallbackSql, [userId]);
        profileData = results && results.length > 0 ? results[0] : null;
      }
    } catch (dbErr: any) {
      console.warn('[PROFILE QUERY WARNING]:', dbErr.message);
      
      const fallbackSql = 'SELECT id, email, role, status FROM users WHERE id = ?';
      const results = await query<any[]>(fallbackSql, [userId]);
      profileData = results && results.length > 0 ? results[0] : null;
    }

    if (!profileData) {
      return res.status(404).json({ success: false, message: 'User record not found' });
    }

    res.status(200).json({ 
      success: true, 
      data: {
        ...profileData,
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        phone_number: profileData.phone_number || '',
        profile_image: profileData.profile_image || null
      } 
    });
  } catch (error: any) {
    console.error('[PROFILE FATAL ERROR]:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { firstName, lastName, phoneNumber } = req.body;
    const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : undefined;

    if (!userId || !role) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const roleToTableMap: { [key: string]: string | null } = {
        client: 'clients',
        agent: 'agents',
        admin: 'admin_profiles',
    };
    const table = roleToTableMap[role] || null;

    if (!table) {
        return res.status(400).json({ success: false, message: 'Profile updates not allowed for this role' });
    }

    // 1. Ensure record exists
    const checkSql = `SELECT id FROM ${table} WHERE user_id = ?`;
    const checkResult = await query<any[]>(checkSql, [userId]);

    if (!checkResult || checkResult.length === 0) {
      const createSql = `INSERT INTO ${table} (id, user_id, first_name, last_name, phone_number) VALUES (UUID(), ?, ?, ?, ?)`;
      await query(createSql, [userId, firstName || '', lastName || '', phoneNumber || '']);
    }

    // 2. Perform Update
    try {
      let sql = `UPDATE ${table} SET first_name = ?, last_name = ?, phone_number = ?`;
      const params: any[] = [firstName, lastName, phoneNumber];
      
      if (profileImage) {
        sql += ', profile_image = ?';
        params.push(profileImage);
      }
      
      sql += ' WHERE user_id = ?';
      params.push(userId);
      await query(sql, params);
    } catch (updErr: any) {
      if (updErr.message.includes('profile_image')) {
        let sql = `UPDATE ${table} SET first_name = ?, last_name = ?, phone_number = ? WHERE user_id = ?`;
        await query(sql, [firstName, lastName, phoneNumber, userId]);
      } else {
        throw updErr;
      }
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error: any) {
    console.error('[UPDATE PROFILE ERROR]:', error);
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};
