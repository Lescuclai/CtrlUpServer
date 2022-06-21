import mongoose from "mongoose";
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: String,
  tags: [String],
  participants: [String],
});
export default mongoose.model("Project", projectSchema);
