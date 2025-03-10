import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, { timestamps: true });

export default mongoose.models.Message || mongoose.model('Message', messageSchema);