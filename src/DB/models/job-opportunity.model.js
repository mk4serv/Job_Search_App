import mongoose from "mongoose";
import { jobOpportunityLocation, jobOpportunitySeniorityLevel, jobOpportunityWorkingTime } from "../../constants/constants.js";

const jobOpportunitySchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Job title must be at least 3 characters"],
      maxLength: [100, "Job title cannot exceed 100 characters"],
    },

    jobLocation: {
      type: String,
      required: true,
      enum: Object.values(jobOpportunityLocation),
    },

    workingTime: {
      type: String,
      required: true,
      enum: Object.values(jobOpportunityWorkingTime),
    },

    seniorityLevel: {
      type: String,
      required: true,
      enum: Object.values(jobOpportunitySeniorityLevel),
    },

    jobDescription: {
      type: String,
      required: true,
      trim: true,
      minLength: [10, "Job description must be at least 10 characters"],
    },

    technicalSkills: {
      type: [String],
      required: true,
      validate: {
        validator: (skills) => skills.length > 0,
        message: "At least one technical skill is required",
      },
    },

    softSkills: {
      type: [String],
      required: true,
      validate: {
        validator: (skills) => skills.length > 0,
        message: "At least one soft skill is required",
      },
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    closed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.JobOpportunity || mongoose.model('JobOpportunity', jobOpportunitySchema);
