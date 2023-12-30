import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        uniqe: true
    }
})

UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', UserSchema);

export { User }