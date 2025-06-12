import { Router } from 'express';
import { getParkingData, updateParking, } from '../controllers/parkingController.js';
import { adminProtect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/status', getParkingData);
router.post('/add-parking', adminProtect, updateParking);

export default router;
