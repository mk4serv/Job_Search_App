import mongoose from "mongoose";
import { systemRoles, ProvidersEnum, genders } from "../../constants/constants.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "First name must be at least 2 characters"],
      maxLength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "Last name must be at least 2 characters"],
      maxLength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be at least 8 characters"],
    },
    provider: {
      type: String,
      enum: Object.values(ProvidersEnum),
      default: ProvidersEnum.SYSTEM,
    },
    gender: {
      type: String,
      enum: Object.values(genders),
      default: genders.UNSPECIFIED,
    },
    DOB: {
      type: Date,
      validate: {
        validator: function (value) {
          const age = Math.floor(
            (Date.now() - new Date(value).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
          );
          return age >= 18;
        },
        message: "User must be at least 18 years old",
      },
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      default: systemRoles.USER,
      enum: Object.values(systemRoles),
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    bannedAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    changeCredentialTime: {
      type: Date,
      default: null,
    },
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    forgetOtp: {
      type: String,
      expiresIn: {
        type: Date,
      },
    },
    confirmOtp: {
      type: String,
      expiresIn: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a virtual property `username` with a getter and setter.
userSchema.virtual('username')
  .get(function () {
    return `${this.firstName}${this.lastName}`.toLowerCase();
  })
  .set(function (v) {
    // Set firstName and lastName to lowercase
    const firstName = v.substring(0, v.indexOf(' ')).toLowerCase();
    const lastName = v.substring(v.indexOf(' ') + 1).toLowerCase();
    this.set({ firstName, lastName });
  });

export default mongoose.models.User || mongoose.model("User", userSchema);
