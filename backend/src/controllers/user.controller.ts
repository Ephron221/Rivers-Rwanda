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
      profileData = results[0];
    } else {
        const fallbackSql = 'SELECT id, email, role, status FROM users WHERE id = ?';
        const results = await query<any[]>(fallbackSql, [userId]);
        profileData = results[0];
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
    next(error); // Pass errors to the global error handler
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        
        const body = req.body || {};
        const { firstName, lastName, phoneNumber } = body;
        const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : undefined;

        if (!userId || !role) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const roleToTableMap: { [key: string]: string | null } = {
            client: 'clients',
            agent: 'agents',
            admin: 'admin_profiles',
        };
        const table = roleToTableMap[role];

        if (!table) {
            return res.status(400).json({ success: false, message: 'Profile updates are not supported for this role.' });
        }

        const checkSql = `SELECT user_id FROM ${table} WHERE user_id = ?`;
        const existingProfile = await query<any[]>(checkSql, [userId]);

        if (existingProfile.length > 0) {
            // Update existing profile
            const setClauses: string[] = [];
            const params: any[] = [];

            if (firstName !== undefined) { setClauses.push('first_name = ?'); params.push(firstName); }
            if (lastName !== undefined) { setClauses.push('last_name = ?'); params.push(lastName); }
            if (phoneNumber !== undefined) { setClauses.push('phone_number = ?'); params.push(phoneNumber); }
            if (profileImage !== undefined) { setClauses.push('profile_image = ?'); params.push(profileImage); }

            if (setClauses.length > 0) {
                params.push(userId);
                const updateSql = `UPDATE ${table} SET ${setClauses.join(', ')} WHERE user_id = ?`;
                await query(updateSql, params);
            }
        } else {
            // Insert new profile - with strict validation
            if (!firstName || !lastName) {
                 return res.status(400).json({ success: false, message: 'First name and last name are required.' });
            }
            if (role === 'agent' && !phoneNumber) {
                return res.status(400).json({ success: false, message: 'Phone number is required for new agent profiles.' });
            }

            const insertSql = `INSERT INTO ${table} (user_id, first_name, last_name, phone_number, profile_image) VALUES (?, ?, ?, ?, ?)`;
            await query(insertSql, [userId, firstName, lastName, phoneNumber || null, profileImage || null]);
        }

        res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (error: any) {
        console.error('[UPDATE PROFILE ERROR]:', error.message);
        next(error); // Pass all errors to the global handler to prevent crashes
    }
};
