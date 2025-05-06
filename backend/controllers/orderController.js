import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import cityModal from '../models/city.modal.js'
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import * as XLSX from 'xlsx'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  const city = await cityModal.findById(shippingAddress.city)

  let user = null

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1] 

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
  
      user = await User.findById(decoded.id).select('-password') 
    }

  if (!city) {
    res.status(400)
    throw new Error('City not found')
  }

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = new Order({
      orderItems,
      user: user?._id,
      shippingAddress:{
        ...shippingAddress,
        deliveryFees: city.deliveryFees
      },
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  /*const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )*/

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }) // Fetch orders by user ID

  if (!orders) {
    res.status(404)
    throw new Error('No orders found')
  }

  res.json(orders)
})


// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

const exportOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name')
    .populate('orderItems')

const data = [
  ['Order ID', 'username', 'client_name', 'phone', 'address', 'Service_Category','itemPrices', 'totalPrice', 'quantity', 'name', 'Payment_Type', 'Service', 'City', 'ReturnServiceType', 'Packagevolume'],
];

orders.forEach(order => {
  // Collect item details
  const itemNames = order.orderItems.map(item => item.name).join(', ');
  const itemQuantities = order.orderItems.map(item => item.qty).join(', ');
  const itemPrices = order.orderItems.map(item => item.price).join(', ');

  // Calculate total price (optional)
  const totalPrice = order.orderItems.reduce((sum, item) => sum + (item.qty * item.price), 0);

  data.push([
    String(order._id),
    order.user?.name || '',
    order.shippingAddress?.client_name || '',
    order.shippingAddress?.phoneNumber || '',
    order.shippingAddress?.address || '',
    'Delivery',
    itemPrices,
    totalPrice, // or itemPrices if you want per-item price string
    itemQuantities,
    itemNames,
    'Cash-on-Delivery',
    order.createdAt.toDateString() === new Date().toDateString() ? 'Same Day' : 'Next Day',
    order.shippingAddress?.city?.name || '',
    'Door-to-Door',
    'Small',
  ]);
});


  const worksheet = XLSX.utils.aoa_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx')
  res.send(buffer)
})

// @desc    Delete an order by ID (admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      await order.remove()
      res.json({ message: 'Order removed' })
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Toggle paid status for an order
// @route   PATCH /api/orders/:id/pay-status
// @access  Private/Admin
const updateOrderPaymentStatus = async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = !order.isPaid
    order.paidAt = order.isPaid ? Date.now() : null
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
}

const updateOrderDeliverStatus = async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = !order.isDelivered
    order.deliveredAt = order.isDelivered ? Date.now() : null
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
}


export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  exportOrders,
  deleteOrderById,
  updateOrderPaymentStatus,
  updateOrderDeliverStatus,
}
