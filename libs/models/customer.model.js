import {Schema,model} from 'mongoose';

const CustomerSchema = new Schema({
    name: {type:String, required:true},
    email: {type:String, required:true},
    phone: {type:String, required:true},
    address: {type:String, required:true},
    owner: {type: Schema.Types.ObjectId, ref:'User'},
});
const Customer = model('Customer',CustomerSchema);

export {Customer};