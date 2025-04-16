import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'City name is required'],
			unique: true,
			trim: true,
			maxlength: [50, 'City name must be less than 50 characters'],
		},
		deliveryFees: {
			type: Number,
			required: [true, 'Delivery fees are required'],
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('City', citySchema);
