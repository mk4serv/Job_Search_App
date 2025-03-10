import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [2, "Company name must be at least 2 characters"],
      maxLength: [100, "Company name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minLength: [10, "Description must be at least 10 characters"],
    },

    industry: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    numberOfEmployees: {
      type: Number,
      required: true,
      validate: {
          validator: function(value) {
              return value >= 11 && value <= 20; // Validate that the value is between 11 and 20
          },
          message: 'numberOfEmployees must be between 11 and 20'
      }
  },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    logo: {
      secure_url: String,
      public_id: String,
    },

    cover: {
      secure_url: String,
      public_id: String,
    },

    HRs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    bannedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },

    legalAttachment: {
      secure_url: String,
      public_id: String,
    },

    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Company || mongoose.model('Company', companySchema);