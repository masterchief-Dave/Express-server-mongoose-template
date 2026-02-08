import { model, Schema } from "mongoose";
import { RolesEnum, type UserInterface } from "./user.interface";

const UserSchema: Schema<UserInterface> = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "Please provide a username"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Please provide a last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email address"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Please provide a valid email address",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(RolesEnum),
      default: RolesEnum.guest,
    },
    passwordVersion: {
      type: Number,
      default: 1,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = model<UserInterface>("User", UserSchema);
export default User;
