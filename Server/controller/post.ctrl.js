import {validationResult} from 'express-validator'
import Post from '../model/Post.js';
import User from '../model/Users.js';

// Create new post
const newPost = async  (req,res,next)=> {
    const error  = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array() })
    };
    try {

    const user = await User.findById({_id:req.user}).select('-password');
    

    //Get text from body
    const newPost  = new Post ({
        text: req.body.text,
        name: req.body.name,
        avatar:user.avatar,
        user : req.user,

    })

    const post =  await newPost.save();

    res.status(200).json(post)
          

}catch(err){
    console.error(err.message)
    return res.status(500).send(err.message)
}

}

// Get all post
const getAllPost = async  (req,res)=> {
    
    try {
  
    const post = await Post.find().sort({date:-1}).select('-password');

    res.status(200).json(post)          

}catch(err){
    console.error(err.message)
    return res.status(500).send(err.message)
}

}
// Get Single post
const getSinglePost = async  (req,res)=> {
    
    try {
  
    const post = await Post.findById({_id:req.params.id}).select('-password');

    if(!post) return res.status(400).send('Post not found')

    res.status(200).json(post)          

}catch(err){
    
    console.error(err.message)
    if(err.kind ==='ObjectId') return res.status(400).send('Post not found')
    return res.status(500).send(err.message)
}

}
// Delete Single post
const deleteSinglePost = async  (req,res)=> {
    
    try {
  
    const post = await Post.findById({_id:req.params.id});

    if(!post) return res.status(400).send('Post not found')

    if(post.user.toString() !== req.user) return res.status(404).json({msg:'You can only delete your post'})

    await Post.findByIdAndRemove({_id:req.params.id});
    res.status(200).json({msg:'Post Successfully deleted'})          

}catch(err){
    
    console.error(err.message)
    if(err.kind ==='ObjectId') return res.status(400).send('Post not found')
    return res.status(500).send(err.message)
}

}

export default {newPost, getAllPost, getSinglePost, deleteSinglePost}