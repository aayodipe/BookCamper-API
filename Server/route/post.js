import express from 'express';
import {check} from 'express-validator';
import auth from '../middleware/default.js';
import postCtrl from '../controller/post.ctrl.js'
import  comLikCtrl from '../controller/comments_and_likes.js';

 
const router = express.Router();

//Desc  create new post
//@route api/user/post
//access Private
router.route('/')
.post([auth, check('text', 'Text is required').not().isEmpty()],  postCtrl.newPost )


//Desc Get all Post
//@route api/user/post
//access Private
.get(auth, postCtrl.getAllPost)

//Desc Get single Post
//@route api/post/:id
//access Private
router.route('/:id').get(auth, postCtrl.getSinglePost)

//Desc delete single Post
//@route api/post/:id
//access Private
router.route('/:id').delete(auth, postCtrl.deleteSinglePost)

//@route PUT api/posts/like/:id
//@desc Like a post
//@access Private
router.route('/like/:id').put(
    
    auth, 
    comLikCtrl.likePost
)
//@route PUT api/posts/unlike/:id
//@desc unlike a post
//@access Private
router.route('/unlike/:id').put(
    
    auth, 
    comLikCtrl.unLikePost
)


//Comments

//Desc  create new comment
//@route api/user/comment/:id
//access Private
router.route('/comment/:id')
.put([auth, check('text', 'Text is required').not().isEmpty()],  comLikCtrl.newComment )

//Desc  delete new comment
//@route api/user/comment/:id/:comment_id
//access Private
router.route('/comment/:id/:comment_id')
.delete(auth, comLikCtrl.deleteComment )

export default router