import { Request, Response, NextFunction } from 'express';
import * as ReviewModel from '../models/Review.model';

export const submitReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clientId = req.user?.userId;
    if (!clientId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const reviewData = {
      ...req.body,
      client_id: clientId
    };

    await ReviewModel.createReview(reviewData);
    res.status(201).json({ success: true, message: 'Review submitted for moderation' });
  } catch (error) {
    next(error);
  }
};

export const getTargetReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, id } = req.params;
    if (type !== 'accommodation' && type !== 'vehicle') {
        return res.status(400).json({ success: false, message: 'Invalid target type' });
    }
    const reviews = await ReviewModel.getReviewsByTarget(type, id);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};
