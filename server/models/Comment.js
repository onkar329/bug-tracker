import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true, maxlength: 3000 }
}, { timestamps: true });
export default mongoose.model("Comment", commentSchema);
