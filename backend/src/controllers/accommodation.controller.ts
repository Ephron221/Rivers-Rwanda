import { Request, Response, NextFunction } from 'express';
import * as AccommodationModel from '../models/Accommodation.model';
import * as UserModel from '../models/User.model';
import * as SellerModel from '../models/Seller.model';
import fs from 'fs';
import path from 'path';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

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
    if (!seller.agreed_to_commission && String(agreed_to_commission) !== 'true') {
        return res.status(403).json({ success: false, message: 'You do not have permission to perform this action.' });
    }

    if (!seller.agreed_to_commission && String(agreed_to_commission) === 'true') {
        await SellerModel.updateSeller(sellerId, { agreed_to_commission: true } as Partial<SellerModel.Seller>);
    }

    const imagePaths: string[] = [];
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      files.forEach(file => {
        const urlPath = `/uploads/accommodations/${path.basename(file.path)}`;
        imagePaths.push(urlPath);
      });
    }

    const data = {
      ...req.body,
      seller_id: sellerId,
      images: JSON.stringify(imagePaths)
    };

    const newId = await AccommodationModel.createAccommodation(data);
    res.status(201).json({ success: true, message: 'Accommodation created and is pending approval.', data: { id: newId } });
  } catch (error) {
    next(error);
  }
};

export const updateAccommodation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const files = req.files as Express.Multer.File[];
      const newImagePaths: string[] = files.map(file => `/uploads/accommodations/${path.basename(file.path)}`);
      data.images = JSON.stringify(newImagePaths);
    }

    await AccommodationModel.updateAccommodation(id, data);
    res.status(200).json({ success: true, message: 'Accommodation updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteAccommodation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const accommodation = await AccommodationModel.getAccommodationById(id);

    if (accommodation && accommodation.images) {
        try {
            const images = JSON.parse(accommodation.images as string);
            images.forEach((imgPath: string) => {
                const fullPath = path.join(__dirname, '../../', imgPath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        } catch(e) {
            console.error("Error deleting images:", e);
        }
    }

    await AccommodationModel.deleteAccommodation(id);
    res.status(200).json({ success: true, message: 'Accommodation deleted' });
  } catch (error) {
    next(error);
  }
};
