import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

const User = mongoose.model('User', UserSchema); // 'User' → 'users' - MongoDB does it automatically.
export default User;