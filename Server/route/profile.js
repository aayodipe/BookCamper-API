import express from 'express';
import auth from '../middleware/default.js';
import Profile from '../model/Profile.js'; 
import User from '../model/Users.js'; 
import { body, validationResult, check } from 'express-validator';
import config from '../config/default.js'
import request from 'request'

import { Octokit } from "@octokit/core";
const router = express.Router();

//@route api/users/profile/me
router.route('/me')
.get(auth , async (req,res)=> {
  
    try{
    
        const profile = await Profile.find({user: req.user}). populate('user', ['name', 'avatar']);
    
        if(!profile){
            return res.status(400). send('No Profile for the user')
        }

         res.status(200).json(profile)
    }catch(err){
        return res.status(500).send('Server Error')

    }
})
//get All profile
//@route api/user/list
//access Private
router.route('/list')
.get(async (req,res)=> {
  
    try{
    
        const profile = await Profile.find().populate('user', ['name', 'avatar'], );

        if(!profile){
            return res.status(400). send('No Profile found')
        }

         res.status(200).json(profile)
    }catch(err){
        return res.status(500).send('Server Error')

    }
})
//get One user's profile
//@route api/user/user/:userid
//access Private
router.route('/user/:user_id')
.get(async (req,res)=> {
  
    try{
    
        const profile = await Profile.findOne({_id:req.params.user_id}).populate('user',['name', 'avatar'])

        if(!profile){
            return res.status(400). send('Profile not found ')
        }
        
        res.status(200).json(profile)
    }catch(err){
   
        if(err.kind ==='ObjectId')  return res.status(400). send('Profile not found ')
        return res.status(500).send('Server Error')

    }
})

//@router    /api/users/profile/me
// @access Private

router.route('/:id')
.post([auth, 
    [
        //Name must be at least 4 chars long
        body('skills', 'Provide at least 3 Skills').not().isEmpty(),
        //Email must be an email
        body('education', 'message required').isArray({min:1}),
        //Email must be an email
        check('website', "website is required").not().isEmpty(),
        //Email must be an email
        check('status', "status is required").not().isEmpty(),
        //Password must me at least 6 chars long
        body('location', 'Location is required').exists(),
    ]],
    async (req,res)=> {

        
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array() })
        }
        
        //destructure data from body 
        let {
            company, website, location,skills, bio, status, githubusername, youtube, facebook, twitter, instagram, linkedin,education, experience
        } = req.body
        
        
        //building profile Object
        const profileFields = {};
        profileFields.user = req.user;
        
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = status;
        if(githubusername) profileFields.githubusername = githubusername;
        if(skills) {
            profileFields.skills = skills.split(',').map(skill =>skill.trim());
            
            if(education) profileFields.education = education;
            if(experience) profileFields.experience = experience;
            
            
            
        }//buidling social object
        profileFields.social = {};
        if(youtube) profileFields.social.youtube = youtube;
        if(twitter) profileFields.social.twitter = twitter;
        if(facebook) profileFields.social.facebook = facebook;
        if(linkedin) profileFields.social.linkedin = linkedin;
        if(instagram) profileFields.social.instagram = instagram;
        try {
            
            //Save profile information into database
            
            let profile = await Profile.findOne({user: req.user});
            
            if(profile){
                
                //update
                profile =  await Profile.findOneAndUpdate(
                    {user:req.user},{$set: profileFields },
                    //    {new: true}
                    {useFindAndModify: true}
                    
                    );   
                    return res.json(profile)   
                }
                
                
                
                // if profile do not exist, create profile
                profile = new Profile(profileFields);
                
                
                await profile.save();
                
                return res.status(200).json(profile);
                
            }catch(err){
                throw err
                return res.status(500).send('Server Error');
                
            };
        })
        
        // Delete single profile
        //@route api/user/user/:userid
        //access Private
        router.route('/')
        .delete(auth, async (req,res)=> {
          
            try{
            
                const profile = await Profile.findOneAndRemove({user:req.user})
           
                if(!profile){
                    return res.status(400). send('Profile not found ')
                }
                //Delete Profile
                Profile.findByIdAndRemove({user: req.user.id})
                //Delete User
                User.findByIdAndRemove({_id: req.user.id})
                res.status(200).json({msg: 'Profile Deleted!'})
            }catch(err){
           
                if(err.kind ==='ObjectId')  return res.status(400). send('Profile not found ')
                return res.status(500).send('Server Error')
        
            }
        })

        //route Get api/profile/github/username
        //@desc Get user repos from Github
        //@access Public
        router.route('/github/:username')
        .get(async (req,res)=> {
            try{
                     const octokit = new Octokit({
                        auth: `${config.githubAuth}`,
                        baseUrl: "https://api.github.com",
                        userAgent: "node js",
                     });
                     
                     const { data } = await octokit.request(`/users/${req.params.username}/repos?per_page=5&sort=created:asc`);  
                    res.status(200).send(data)
                  
                  
             }catch(err){
                    console.log(err.message)
                    return res.status(500).send('Server Error')
        
             }
        })
        export default router