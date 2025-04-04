import { Router } from 'express';
import { fetchUserDataHandler, updateUserDataHandler } from '../controller/api';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/fetch-user-data', fetchUserDataHandler);

router.post('/update-user-data', updateUserDataHandler);

export default router;
