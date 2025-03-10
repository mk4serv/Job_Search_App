import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (value) {
          const sender = await mongoose.model("User").findById(value);
          return sender && (sender.role === "Admin" || sender.role === "HR");
        },
        message: "Sender must be an HR or Company Owner",
      },
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messages: [
      {
        message: { type: String, required: true, trim: true },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);
