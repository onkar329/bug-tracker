import mongoose from "mongoose";
const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, default: "" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: { type: String, enum: ["To Do","In Progress","Done"], default: "To Do" },
  priority: { type: String, enum: ["Low","Medium","High","Critical"], default: "Medium" },
  type: { type: String, enum: ["Bug","Feature","Task"], default: "Bug" },
  attachments: [{ filename: String, path: String }]
}, { timestamps: true });
ticketSchema.index({ project:  1, status: 1, priority: 1 });
export default mongoose.model("Ticket", ticketSchema);
