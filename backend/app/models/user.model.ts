import { model, Schema } from 'mongoose'

export interface IUser {
  _id: string;
  userName: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.set("toJSON", {
  transform: (doc: any, ret: Record<string, any>) => {
    ret.id = ret._id;
    delete ret.password;
    delete ret.__v;
  },
});

export const User = model<IUser>('User', userSchema)