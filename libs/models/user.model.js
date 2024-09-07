import {Schema, model} from 'mongoose';

const UserSchema = new Schema({
    userName: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    repeatedPassword: {type:String}
});

const User=model('User', UserSchema);

export {User} ;