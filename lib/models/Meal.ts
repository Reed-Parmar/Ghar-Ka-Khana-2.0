import mongoose from 'mongoose';
import { IUser } from './User';

export interface IMeal extends mongoose.Document {
  chef: mongoose.Types.ObjectId | IUser;
  mealName: string;
  description: string;
  price: number;
  imageUrl?: string;
  availableTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema = new mongoose.Schema({
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Chef ID is required'],
  },
  mealName: {
    type: String,
    required: [true, 'Meal name is required'],
    trim: true,
    maxlength: [100, 'Meal name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  imageUrl: {
    type: String,
    default: null,
  },
  availableTime: {
    type: String,
    required: [true, 'Available time is required'],
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
MealSchema.index({ chef: 1, isActive: 1 });
MealSchema.index({ isActive: 1, createdAt: -1 });

// Export the model, creating it if it doesn't exist
// Handle case where mongoose.models might be undefined
const Meal = (mongoose.models && mongoose.models.Meal) || mongoose.model<IMeal>('Meal', MealSchema);
export default Meal;