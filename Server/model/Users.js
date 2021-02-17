import mongoose from 'mongoose';

const { Schema } = mongoose

const userSchema = new Schema({
    name : {
        type: String,
        require: true,      
        trim: true,  
    },
    email: {
        type: String,
        require: [true, 'Email is required'],
        unique: 'Email already exist',
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password:{
        type: String,
        required: "Password is require"
    },  
    avatar: {
        type: String,
    },
    create : {
        type : Date,
        default: Date.now
    },
 
})


export default mongoose.model('User', userSchema);