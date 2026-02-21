import { Request, Response, NextFunction } from 'express';
import * as HouseModel from '../models/House.model';
import path from 'path';

const processRequestData = (body: any, files: any) => {
    const data = { ...body };

    // Sanitize boolean fields, ensuring they are always 1 or 0
    const booleanFields = ['has_parking', 'has_garden', 'has_wifi'];
    booleanFields.forEach(field => {
        data[field] = ['true', true, 1, 'on'].includes(data[field]) ? 1 : 0;
    });

    // Sanitize number and price fields, ensuring they are numbers or null
    const numericFields = ['total_rooms', 'bedrooms', 'bathrooms'];
    numericFields.forEach(field => {
        data[field] = parseInt(data[field] || '0', 10);
    });

    // ** THE FIX for the error **
    // Convert empty, zero, or invalid numbers for prices to null for the database
    data.monthly_rent_price = parseFloat(data.monthly_rent_price) > 0 ? parseFloat(data.monthly_rent_price) : null;
    data.purchase_price = parseFloat(data.purchase_price) > 0 ? parseFloat(data.purchase_price) : null;

    // Handle images
    if (files && Array.isArray(files) && files.length > 0) {
        const imagePaths = files.map((file: any) => {
            const relativePath = path.relative(path.join(__dirname, '../../'), file.path);
            return '/' + relativePath.replace(/\\/g, '/');
        });
        data.images = JSON.stringify(imagePaths);
    } else if (body.images) {
        // This handles re-saving existing images during an update
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

export const createHouse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sanitizedData = processRequestData(req.body, req.files);
    const houseId = await HouseModel.createHouse(sanitizedData);
    res.status(201).json({ success: true, id: houseId });
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
