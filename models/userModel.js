import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    lastName: {
        type: String,
        default: 'lastName',
    },
    location: {
        type: String,
        default: 'my city'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: String,
    avatarPublicId: String,

}, {timestamps: true});

UserSchema.methods.toJSON = function() {
    //deliberately using function keyword rather than arrow syntax because we want to make use of scope to use function keyword: this

    let obj = this.toObject();
    delete obj.password;
    return obj;
};

export default mongoose.model('User', UserSchema);