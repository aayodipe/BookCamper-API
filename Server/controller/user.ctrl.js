import User from '../model/Users.js'
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import config from '../config/default.js'
import { validationResult } from 'express-validator';
const userRegisteration = async  (req,res)=> {
          
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array() })
          }
          
          //Destruction body elements from req
          let {name, email, password} = req.body
   
    try{
                  //Check if users already existed
             let user =  await User.findOne({email})
        
             if(user) { 
                 return res.status(400).json(
                 {errors: [{messages:'User already exist'}]}) 
                 
               };
          //AVATER IMAGE
          let avatar = gravatar.url(email, {
              s:'200',
              r: 'pg',
              d:'mm'
          })
          avatar = `https:${avatar}`

          // Hash Password
           let salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
   
            //create instance  of user
          user = new User({
              name,
              email,
              avatar, 
              password
          })
           await user.save({name, email,password, avatar})
              user =  await User.findOne({email})
             .select('id name email avatar create password')

          //   if successful authenticated => generate token and send  with cookier back to client
       
              jwt.sign({'id': user._id}, config.jwtSecret, {expiresIn: '4h'}, (err, token)=> {
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
              res.status(500).send('Server Error')
             }
      }

//Protected Route
      const getAllUser =  async (req,res)=> {

        try {
            let user = await User.find()
                 res.status(200).json({ user })
        }catch(err){
            console.error(err);
            res.status(500).send('Server error')
        }
       
    }
//Protected Route
      const getProtectedRoute =  async (req,res)=> {

        try {
            let user = await User.findById(req.user).select('-password')
                 res.status(200).json({ user })
        }catch(err){
            console.error(err);
            res.status(500).send('Server error')
        }
       
    }

//Protected Route
      const deleteUser =  async (req,res)=> {

        try{
        
            const user = await User.findOneAndRemove({id:req.user.id})// Look at this
    
            if(!user){
                return res.status(400). send('User not found ')
            }
        
            //Delete User
            User.findByIdAndRemove({_id: req.user}) // Look at this

            res.status(200).json({msg: 'User Deleted!'})
        }catch(err){
       
            if(err.kind ==='ObjectId')  return res.status(400). send('User not foun* ')
            return res.status(500).send('Server Error')
    
        }
       
    }

export default {userRegisteration, getProtectedRoute, deleteUser, getAllUser}