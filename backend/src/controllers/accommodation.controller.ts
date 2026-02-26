import { Request, Response, NextFunction } from 'express';
import * as AccommodationModel from '../models/Accommodation.model';
import * as UserModel from '../models/User.model';
import * as SellerModel from '../models/Seller.model';
import fs from 'fs';
import path from 'path';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const sanitizeAccommodationData = (body: any, imagePaths: string[] | null) => {
    const data: any = { ...body };
    
    if (imagePaths) {
        data.images = JSON.stringify(imagePaths);
    }

    // Process boolean fields
    const boolFields = ['wifi', 'parking', 'garden', 'decoration', 'has_elevator', 'is_furnished'];
    boolFields.forEach(field => {
        if (body[field] !== undefined) {
            data[field] = ['true', true, 1, 'on'].includes(body[field]) ? 1 : 0;
        }
    });

    // Process numeric fields
    if (body.max_guests) data.max_guests = parseInt(body.max_guests);
    if (body.capacity) data.capacity = parseInt(body.capacity);
    if (body.floor_number) data.floor_number = parseInt(body.floor_number);
    if (body.price_per_night) data.price_per_night = parseFloat(body.price_per_night);
    if (body.price_per_event) data.price_per_event = parseFloat(body.price_per_event);
    if (body.sale_price) data.sale_price = parseFloat(body.sale_price);

    delete data.agreed_to_commission;
    return data;
};

export const getAccommodations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query;
    const accommodations = await AccommodationModel.getAllAccommodations(filters);
    res.status(200).json({ success: true, data: accommodations });
  } catch (error) {
    next(error);
  }
};

export const getAccommodation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accommodation = await AccommodationModel.getAccommodationById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ success: false, message: 'Accommodation not found' });
    }
    res.status(200).json({ success: true, data: accommodation });
  } catch (error) {
    next(error);
  }
};

export const createAccommodation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication error.' });

    const sellerId = await UserModel.getSellerIdByUserId(userId);
    if (!sellerId) return res.status(403).json({ success: false, message: 'User is not a valid seller.' });

    const seller = await SellerModel.findSellerById(sellerId);
    if (!seller) return res.status(404).json({ success: false, message: 'Seller profile not found.' });

    if (seller.status !== 'approved') {
        return res.status(403).json({ success: false, message: 'Your seller account has not been approved yet.' });
    }

    const { agreed_to_commission } = req.body;
    if (!seller.agreed_to_commission && String(agreed_to_commission) !== 'true' && agreed_to_commission !== true) {
        return res.status(403).json({ success: false, message: 'You must agree to the commission terms.' });
    }

    if (!seller.agreed_to_commission && (String(agreed_to_commission) === 'true' || agreed_to_commission === true)) {
        await SellerModel.updateSeller(sellerId, { agreed_to_commission: true });
    }

    const imagePaths: string[] = [];
    if (req.files) {
      (req.files as Express.Multer.File[]).forEach(file => {
        imagePaths.push(`/uploads/accommodations/${path.basename(file.path)}`);
      });
    }

    const data = sanitizeAccommodationData(req.body, imagePaths);
    data.seller_id = sellerId;

    const newId = await AccommodationModel.createAccommodation(data);
    res.status(201).json({ success: true, message: 'Accommodation created!', data: { id: newId } });
  } catch (error) {
    next(error);
  }
};

export const updateAccommodation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const imagePaths: string[] | null = req.files && (req.files as Express.Multer.File[]).length > 0 
        ? (req.files as Express.Multer.File[]).map(file => `/uploads/accommodations/${path.basename(file.path)}`)
        : null;

    const data = sanitizeAccommodationData(req.body, imagePaths);
    await AccommodationModel.updateAccommodation(id, data);
    res.status(200).json({ success: true, message: 'Accommodation updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteAccommodation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const accommodation = await AccommodationModel.getAccommodationById(id);
    if (accommodation && accommodation.images) {
        try {
            const images = JSON.parse(accommodation.images as string);
            images.forEach((imgPath: string) => {
                const fullPath = path.join(__dirname, '../../', imgPath);
                if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
            });
        } catch(e) { console.error("Error deleting images:", e); }
    }
    await AccommodationModel.deleteAccommodation(id);
    res.status(200).json({ success: true, message: 'Accommodation deleted' });
  } catch (error) {
    next(error);
  }
};
