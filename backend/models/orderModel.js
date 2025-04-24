import mongoose from 'mongoose'
import mongooseAutopopulate from 'mongoose-autopopulate'

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      autopopulate: {
        select: '_id name email',
      },
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      client_name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true, autopopulate: true },
      phoneNumber: { type: String, required: true },
      deliveryFees: { type: Number, required: true },
      //postalCode: { type: String, required: true },
      //country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      //email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

orderSchema.plugin(mongooseAutopopulate);

const Order = mongoose.model('Order', orderSchema)

export default Order
