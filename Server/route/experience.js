import express from 'express';
import { check } from 'express-validator';
import  experCrtl from '../controller/Experience.js';
const router = express.Router();
import auth from '../middleware/default.js';
//@user Protected Route
//@route   get api/users
//@desc    post Experience
//@access  Private
router.route('/').post(
    [
    auth, 
    [
        check('title', "title is required").not().isEmpty(),
        check('from', "from is required").not().isEmpty(),
        check('to', "to is required").not().isEmpty(),
        check('current', 'current is required').exists()
    ]
], 
experCrtl.updateExperience)

//@user Delete Experience
//@route   delete api/profile/experience/:id
//@desc    delete Experience
//@access  Private
router.route('/:exp_Id').delete(auth, experCrtl.removeExperience)



 export default  router