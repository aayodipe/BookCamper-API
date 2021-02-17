
import Post from '../model/Post.js';
import User from '../model/Users.js'


//@desc Like a post
const likePost = async (req, res)=> {

    try{

        const post = await Post.findById(req.params.id);

        if(post.likes.filter(like => like.user.toString()===req.user).length > 0) return res.status(404).json({msg:'Post already liked'})
        
        post.likes.unshift({user:req.user})

        await post.save()
     
    res.status(200).json(post)
        
 
    }catch(err){
        console.error(err.message)
        return res.status(500).json({
            msg: 'Server Error'
        })
    }
}


//@desc UnLike a post
const unLikePost = async (req, res)=> {

    try{

        const post = await Post.findById(req.params.id);
        

        if(post.likes.filter(like => like.user.toString() === req.user).length === 0) return res.status(404).json({msg:'Post has not yet been like'})
  
        
        const removedIndex = post.likes.map(like => like.user.toString()).indexOf(req.user)
     
         post.likes.splice(removedIndex, 1)
        await post.save()
     
        res.status(200).json({
            mgs:'Post Unliked',
            post
        })
        
 
    }catch(err){
        console.error(err.message)
        return res.status(500).json({
            msg: 'Server Error'
        })
    }
}

// Comments

// Create new comment
const newComment = async  (req,res)=> {
 
  
    try {

    const user = await User.findById(req.user);
    const post = await Post.findById(req.params.id);
    

    //Get text from body
    const comment = ({
        text: req.body.text,
        name: user.name,
        avatar:user.avatar,
        user : req.user,

    })

    post.comments.unshift(comment)
    post.save()

    res.status(200).json(post)
          

}catch(err){
console.error(err.message)
    return res.status(500).send(err.message)
}

}

// delete comment
const deleteComment = async  (req,res)=> {

    // const comment = post.comments.find(item=> )
    try {

        let post = await Post.findById(req.params.id)
        const comment = post.comments.find(item=> item._id.toString() ===req.params.comment_id)
        if(!comment) return res.status(400).json({message: 'Comment does not exist'})
        console.log(comment.user.toString())
        console.log(req.user)
        if(comment.user.toString() !==req.user) {return res.status(400).json({message: 'Comment can only be delete by comment\'s owner'})}else {
            const commentIndex = post.comments.indexOf(comment)
        if(commentIndex > -1){
            post.comments.splice(commentIndex, 1)
           await post.save()  
        
           return res.status(200).json({ message: 'Comment Successfully Deleted!'})
        }else{
            return res.status(400).send('No Comment Found!');
        };
         
        };         

}catch(err){
console.error(err.message)
    return res.status(500).send(err.message)
}

}



export default {likePost, unLikePost, newComment, deleteComment}