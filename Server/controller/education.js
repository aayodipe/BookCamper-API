import Profile from '../model/Profile.js';
import {validationResult } from 'express-validator';



const updateEducation =async (req, res, next) => {

           
        // Finds the validation errors in this request and wraps them in an object with handy functions
const errors = validationResult(req);
        
if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array() })
}

let {school, degree, fieldofstudy, location, from, to, current, description} = req.body

//Save the updated data to an object
let newExp = {school, degree, fieldofstudy, location, from, to, current, description}

let profile = await Profile.findOne({user: req.user});

profile.education.unshift(newExp)

await profile.save()
res.status(200).json(profile)


};


//Delete Experience Controller
const removeEducation= async (req, res)=> {
    try{
    const profile = await Profile.findOne({user: req.user})

    //find Index
    const removeIndex = profile.education
     .map(item => item._id.toString())
     .indexOf(req.params.edu_Id);

    profile.education.splice(removeIndex, 1)

    await profile.save()
     res.status(200).json(profile)
    }catch(err){
        cnsole.log(err.message)
        return res.send('Error from server')
    }
}

export default {updateEducation, removeEducation}


