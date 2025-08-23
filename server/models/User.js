import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    profilePic: {
      type: String,
      default: "" // Default empty string for profile picture
    },
    bio: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true // This adds createdAt and updatedAt fields
  }
);

// Add index for better query performance
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;