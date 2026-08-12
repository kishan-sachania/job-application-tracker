import { model, Schema } from 'mongoose'

interface UserType {
    userName: string;
    email: string;
    password: string;
}

const userSchema = new Schema<UserType>({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },

});

export const User = model('User', userSchema)