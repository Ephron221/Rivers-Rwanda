import { Request, Response, NextFunction } from 'express';
import * as ContactModel from '../models/Contact.model';

export const submitInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ContactModel.createInquiry(req.body);
    res.status(201).json({ success: true, message: 'Inquiry submitted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getInquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiries = await ContactModel.getAllInquiries();
    res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
    next(error);
  }
};

export const updateInquiryStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await ContactModel.updateInquiryStatus(id, status);
    res.status(200).json({ success: true, message: 'Inquiry status updated' });
  } catch (error) {
    next(error);
  }
};
