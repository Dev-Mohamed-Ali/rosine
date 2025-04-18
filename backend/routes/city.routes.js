import express from 'express'
const router = express.Router()
import cityController from '../controllers/city.controller.js'
import { protect } from '../middleware/authMiddleware.js';

router.get('/',cityController. getCities);
router.get('/:id',cityController. getCity);
router.post('/',protect,cityController. createCity);
router.put('/:id',protect,cityController. updateCity);
router.delete('/:id',protect,cityController. deleteCity);

export default router
