import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = mongoose.Schema({
    tz:{type:Number, required:true},
    firstName:{type: String, required:true},
    lastName:{type: String, required:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    isAdmin:{ type: Boolean, default:false }
},{collection:'users'})
userSchema.plugin(uniqueValidator)

export const User = mongoose.model('User', userSchema)