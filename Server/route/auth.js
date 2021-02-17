import express from 'express';
import { body } from 'express-validator';
import userCtrl from '../controller/auth.ctrl.js';
const router = express.Router();

//@user Registration Route
//@route   Post api/users
//@desc    create new user route
//@access  Public

router.route('/signin').post(
    [
     //Email must be an email
     body('email', 'invalid email format').isEmail(),
     //Password must me at least 6 chars long
     body('password', 'password is invalid').exists(),
      ],
    
    userCtrl.userSignIn
  )
 


 export default router