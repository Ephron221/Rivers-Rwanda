import { Router } from 'express';
import { 
  getMyCommissions, 
  getMyStats, 
  getMyReferralCode, 
  getMyClients 
} from '../controllers/agent.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All agent routes require authentication and the 'agent' role.
router.use(authenticate, authorize('agent'));

// Define the routes for agent-specific data
router.get('/commissions', getMyCommissions);
router.get('/stats', getMyStats);
router.get('/referral-code', getMyReferralCode);
router.get('/clients', getMyClients);

export default router;
