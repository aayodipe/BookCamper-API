import express from 'express';
import { body } from 'express-validator';
import userCtrl from '../controller/user.ctrl.js';
import auth from '../middleware/default.js';
const router = express.Router();

//@user Registration Route
//@route   Post api/users/signup
//@desc    create new user route
//@access  Public

router.route('/signup').post(
   [
    //Name must be at least 4 chars long
    body('name', 'Name must be at least 4 char').isLength({ min: 4}),
    //Email must be an email
    body('email', 'invalid email format').isEmail(),
    //Password must me at least 6 chars long
    body('password', 'password is invalid').exists(),
 ],
    userCtrl.userRegisteration

)
router.route('/').get(auth,  userCtrl.getAllUser)
//@user Protected Route
//@route   get api/users
//@desc    get Page
//@access  Private
router.route('/:id').get(auth,  userCtrl.getProtectedRoute)
       // Delete single profile
        //@route api/user/user/:userid
        //access Private
router.route('/').delete(auth,  userCtrl.deleteUser)
       // Delete single profile
        //@route api/user/user/:userid
        //access Private


export default router