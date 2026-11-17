import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, default: "" },
  key: { type: String, required: true, uppercase: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, role: { type: String, enum: ["Admin","Manager","Developer","Viewer"], default: "Developer" } }]
}, { timestamps: true });
projectSchema.index({ key: 1, owner: 1 });
export default mongoose.model("Project", projectSchema);
