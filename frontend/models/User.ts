import { Schema, model, models, Document } from "mongoose";

interface IUser extends Document {
  userId: string;
  username: string;
  email: string;
  contactNumber: string;
  password: string;
  photographUri: string;
  status: string;
  contacts: string[];
}

const userSchema = new Schema<IUser>({
  userId: { type: String, unique: true },
  username: { type: String },
  email: { type: String, unique: true },
  contactNumber: { type: String },
  password: { type: String },
  photographUri: { type: String },
  status: { type: String },
  contacts: { type: [String] },
}, { timestamps: true });

const User = models.User || model<IUser>("User", userSchema);
export default User;
