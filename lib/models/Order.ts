import mongoose from 'mongoose';
import { IUser } from './User';
import { IMeal } from './Meal';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrder extends mongoose.Document {
  user: mongoose.Types.ObjectId | IUser;
  meal: mongoose.Types.ObjectId | IMeal;
  chef: mongoose.Types.ObjectId | IUser;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    required: [true, 'Meal ID is required'],
  },
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Chef ID is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  deliveryNotes: {
    type: String,
    maxlength: [200, 'Delivery notes cannot exceed 200 characters'],
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ chef: 1, createdAt: -1 });
OrderSchema.index({ meal: 1 });
OrderSchema.index({ status: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);