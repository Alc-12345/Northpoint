import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, trim: true, maxlength: 4000 },
  category: { type: String, enum: ['Account', 'Attendance', 'Documents', 'Projects', 'Other'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  replies: [{ author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, name: String, message: { type: String, maxlength: 4000 }, at: { type: Date, default: Date.now } }],
}, { timestamps: true });
schema.index({ status: 1, createdAt: -1 });
export default mongoose.model('SupportTicket', schema);
