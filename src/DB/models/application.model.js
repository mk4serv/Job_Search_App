import mongoose from "mongoose";
import { jobOpportunityStatus } from "../../constants/constants.js";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobOpportunity",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userCV: {
      secure_url: {
        type: String,
        required: true,
        match: [/\.pdf$/, "CV must be in PDF format"],
      },
      public_id: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: Object.values(jobOpportunityStatus),
      default: jobOpportunityStatus.PENDING,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
