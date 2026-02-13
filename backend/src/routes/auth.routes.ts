import { Router } from 'express';
import { registerClient, registerAgent, login } from '../controllers/auth.controller';

const router = Router();

router.post('/register/client', registerClient);
router.post('/register/agent', registerAgent);
router.post('/login', login);

export default router;
