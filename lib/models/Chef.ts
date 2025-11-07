import mongoose from 'mongoose';

export interface IChef extends mongoose.Document {
  userId: mongoose.Types.ObjectId | string;
  name: string;
  bio: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChefSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  bio: {
    type: String,
    default: '',
  },
  approved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Export the model, creating it if it doesn't exist
const Chef = (mongoose.models && mongoose.models.Chef) || mongoose.model<IChef>('Chef', ChefSchema);
export default Chef;
