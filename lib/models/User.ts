import mongoose from 'mongoose';

export type UserRole = 'student' | 'admin' | 'chef';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  image?: string;
  emailVerified?: Date;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    select: false, // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'chef'],
    required: [true, 'Please provide a role'],
    default: 'student',
  },
  image: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
  provider: {
    type: String,
    default: 'credentials',
  },
}, {
  timestamps: true,
});

// Export the model, creating it if it doesn't exist
// Handle case where mongoose.models might be undefined
const User = (mongoose.models && mongoose.models.User) || mongoose.model<IUser>('User', UserSchema);
export default User;