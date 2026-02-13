import { Request, Response, NextFunction } from 'express';
import * as AccommodationModel from '../models/Accommodation.model';
import fs from 'fs';
import path from 'path';

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

export const createAccommodation = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
      images: JSON.stringify(imagePaths)
    };

    const newId = await AccommodationModel.createAccommodation(data);
    res.status(201).json({ success: true, message: 'Accommodation created', data: { id: newId } });
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
