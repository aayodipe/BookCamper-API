import config from '../config/default.js';
import jwt from 'jsonwebtoken';


export default function(req, res, next){
    const token = req.header('x-auth-token')
    if(!token)  return res.status(401). json({msg: 'No token, authorization failed'});

    //verify token
    try {

        const decode = jwt.decode(token, config.jwtSecret)
     
        req.user = decode.id;

        next();
    }catch(err){
        res.status(401).json({mgs:'Token is not valid'})
    }
}