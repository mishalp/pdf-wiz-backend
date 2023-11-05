import mongoose from 'mongoose'
const Schema = mongoose.Schema;
import bcrypt from 'bcryptjs'

const UserSchema = new Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true } 
});

UserSchema.pre('save', async function(next){
    var user = this;
    if(!user.isModified('password')) {return next()}
    user.password = await bcrypt.hash(user.password, 10);
    next();
});

export default mongoose.model('User', UserSchema);