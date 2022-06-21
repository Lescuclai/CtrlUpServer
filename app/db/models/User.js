import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  pseudo: String,
  email: String,
  pwd: String,
  // projects_id: [String],
});
export default mongoose.model("User", userSchema);
