import Profile from '../model/Profile.js';
import {validationResult } from 'express-validator';



const updateExperience =async (req, res, next) => {

           
        // Finds the validation errors in this request and wraps them in an object with handy functions
const errors = validationResult(req);
        
if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array() })
}

let {title, company, location, from, to, current} = req.body

//Save the updated data to an object
let newExp = {title, company,location,from,to,current}

let profile = await Profile.findOne({user: req.user});

profile.experience.unshift(newExp)

await profile.save()
res.status(200).json(profile)


};

const removeExperience = async (req, res)=> {
    try{


    //look for the User Profile
    const profile = await Profile.findOne({user: req.user})

//Remove Index
    const removeIndex = profile.experience
     .map(item => item._id.toString())
     .indexOf(req.params.exp_Id);

    profile.experience.splice(removeIndex, 1)

    await profile.save()
     res.status(200).json(profile)
    }catch(err){
        cnsole.log(err.message)
        return res.send('Error from server')
    }
}

export default {updateExperience, removeExperience}