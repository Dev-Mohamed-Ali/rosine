import express from 'express'
const router = express.Router()
import {
  addOrderItems, // endpoint code which writes to mongodb
  getOrderById, // endpoint code which read a selected order (by id) from mongodb
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(addOrderItems).get(getOrders)
//router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/myorders').get(getMyOrders)
//router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(getOrderById)
//router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

export default router
