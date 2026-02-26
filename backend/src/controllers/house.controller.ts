import { Request, Response, NextFunction } from 'express';
import * as HouseModel from '../models/House.model';
import * as UserModel from '../models/User.model';
import * as SellerModel from '../models/Seller.model';
import path from 'path';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const processRequestData = (body: any, files: any) => {
    const data = { ...body };

    const booleanFields = ['has_parking', 'has_garden', 'has_wifi', 'has_tiles', 'has_electricity', 'has_water'];
    booleanFields.forEach(field => {
        data[field] = ['true', true, 1, 'on'].includes(data[field]) ? 1 : 0;
    });

    const numericFields = ['total_rooms', 'bedrooms', 'bathrooms', 'balconies'];
    numericFields.forEach(field => {
        data[field] = parseInt(data[field] || '0', 10);
    });

    data.size_sqm = parseFloat(data.size_sqm) || null;
    data.monthly_rent_price = parseFloat(data.monthly_rent_price) > 0 ? parseFloat(data.monthly_rent_price) : null;
    data.purchase_price = parseFloat(data.purchase_price) > 0 ? parseFloat(data.purchase_price) : null;

    if (files && Array.isArray(files) && files.length > 0) {
        const imagePaths = files.map((file: any) => {
            const relativePath = path.relative(path.join(__dirname, '../../'), file.path);
            return '/' + relativePath.replace(/\\/g, '/');
        });
        data.images = JSON.stringify(imagePaths);
    } else if (body.images) {
        data.images = body.images;
    }

    return data;
};

export const getHouses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const houses = await HouseModel.getAllHouses(req.query);
    res.status(200).json({ success: true, data: houses });
  } catch (error) {
    next(error);
  }
};

export const getHouse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const house = await HouseModel.getHouseById(req.params.id);
    if (house) {
      res.status(200).json({ success: true, data: house });
    } else {
      res.status(404).json({ success: false, message: 'House not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const createHouse = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication error.' });
    }

    const sellerId = await UserModel.getSellerIdByUserId(userId);
    if (!sellerId) {
        return res.status(403).json({ success: false, message: 'User is not a valid seller.' });
    }
    
    const seller = await SellerModel.findSellerById(sellerId);
    if (!seller) {
        return res.status(404).json({ success: false, message: 'Seller profile not found.' });
    }

    if (seller.status !== 'approved') {
        return res.status(403).json({ success: false, message: 'Your seller account has not been approved.' });
    }

    const { agreed_to_commission } = req.body;
    if (!seller.agreed_to_commission && agreed_to_commission !== 'true' && agreed_to_commission !== true) {
        return res.status(403).json({ success: false, message: 'You must agree to the commission terms.' });
    }

    if (!seller.agreed_to_commission && (agreed_to_commission === 'true' || agreed_to_commission === true)) {
        await SellerModel.updateSeller(sellerId, { agreed_to_commission: true });
    }

    const sanitizedData = processRequestData(req.body, req.files);
    sanitizedData.seller_id = sellerId;

    const houseId = await HouseModel.createHouse(sanitizedData);
    res.status(201).json({ success: true, message: 'House created successfully and is pending approval.', id: houseId });
  } catch (error) {
    next(error);
  }
};

export const updateHouse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sanitizedData = processRequestData(req.body, req.files);
    await HouseModel.updateHouse(req.params.id, sanitizedData);
    res.status(200).json({ success: true, message: 'House updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteHouse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await HouseModel.deleteHouse(req.params.id);
    res.status(200).json({ success: true, message: 'House deleted successfully' });
  } catch (error) {
    next(error);
  }
};
