import mongoose from 'mongoose';


const { Schema } = mongoose

const postSchema = new Schema({

    user : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name : {
        type: String,
        required:true,
   
    },
    text: {
        type: String
    },
    avatar : {
        type: String,
   
    },
    likes : [
        {
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
        }],
    comments : [
        {
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }, 
        text: {
            type:String,
            required:true,
        },
        name: {
            type:String
        },
        avatar: {
            type:String
        },
        date:{
            type: Date,
            default: Date.now
        }
        }],

    date:{
            type: Date,
            default: Date.now
        }
})

export default mongoose.model('Post', postSchema)
