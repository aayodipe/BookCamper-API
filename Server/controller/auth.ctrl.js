import User from '../model/Users.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import config from '../config/default.js'
import { validationResult } from 'express-validator';
const userSignIn  = async  (req,res)=> {
          
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() })
      }
      
    //Destruction body elements from req
    let { email, password} = req.body
 
    try{
            //Check if users already existed
        let user =  await User.findOne({email})

        if(!user) { 
            return res.status(400).json(
            {errors: [{messages:'Invalid Credentials... No email Found'}]
            });             
            };
           // Check if Email and Password match
           const isMatch = await bcrypt.compare(password, user.password)

           if(!isMatch) {
               return res
               .status(400)
               .json({
                 errors: [{mgs:'Invalid Credential'}]                
               })           
           };
             //if successful authenticated => generate token and send  with cookier back to client
   
          jwt.sign({'id': user._id}, config.jwtSecret, {expiresIn: '1h'}, (err, token)=> {
          if(err) throw err
          return res.json({                  
              token, 
              user:{
              _id: user._id,
              name: user.name,
              email: user.email
            }})
            });                                     
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error!')
    }
  }


export default {userSignIn}