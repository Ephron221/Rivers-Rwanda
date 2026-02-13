import { Request, Response, NextFunction } from 'express';
import * as VehicleModel from '../models/Vehicle.model';
import fs from 'fs';
import path from 'path';

export const getVehicles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query;
    const vehicles = await VehicleModel.getAllVehicles(filters);
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    next(error);
  }
};

export const getVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await VehicleModel.getVehicleById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

export const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imagePaths: string[] = [];
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      files.forEach(file => {
        const urlPath = `/uploads/vehicles/${path.basename(file.path)}`;
        imagePaths.push(urlPath);
      });
    }

    const data = {
      ...req.body,
      images: JSON.stringify(imagePaths)
    };

    const newId = await VehicleModel.createVehicle(data);
    res.status(201).json({ success: true, message: 'Vehicle created', data: { id: newId } });
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const files = req.files as Express.Multer.File[];
      const newImagePaths: string[] = files.map(file => `/uploads/vehicles/${path.basename(file.path)}`);
      data.images = JSON.stringify(newImagePaths);
    }

    await VehicleModel.updateVehicle(id, data);
    res.status(200).json({ success: true, message: 'Vehicle updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const vehicle = await VehicleModel.getVehicleById(id);

    if (vehicle && vehicle.images) {
      try {
        const images = JSON.parse(vehicle.images as string);
        images.forEach((imgPath: string) => {
          const fullPath = path.join(__dirname, '../../', imgPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      } catch (e) {
        console.error("Error deleting images:", e);
      }
    }

    await VehicleModel.deleteVehicle(id);
    res.status(200).json({ success: true, message: 'Vehicle deleted' });
  } catch (error) {
    next(error);
  }
};
