import express from 'express';
import { check } from 'express-validator';
import  educationCrtl from '../controller/education.js';
import auth from '../middleware/default.js';

const router = express.Router();
//@user Protected Route
//@route   Post api/user
//@desc    Post Page
//@access  Private
router.route('/').post(
    [
    auth, 
    [
        check('degree', "degree is required").not().isEmpty(),
        check('fieldofstudy', "fieldofstudy is required").not().isEmpty(),
        check('from', "from is required").not().isEmpty(),
        check('current', 'current is required').exists()
    ]
], 
educationCrtl.updateEducation)

//@user Delete Experience
//@route   delete api/profile/experience/:id
//@desc    delete Experience
//@access  Private
router.route('/:edu_Id').delete(auth, educationCrtl.removeEducation)

export default router