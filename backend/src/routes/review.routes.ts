import { Router } from 'express';
import { submitReview, getTargetReviews } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, submitReview);
router.get('/:type/:id', getTargetReviews);

export default router;
