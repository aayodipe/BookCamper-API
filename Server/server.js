import express from 'express';
import config from './config/default.js'
import ConnectDB from './database/db.js'
import userRouter from './route/users.js'
import authRouter from './route/auth.js'
import profileRouter from './route/profile.js'
import postRouter from './route/post.js';
import expRouter from './route/Experience.js';
import eduRouter from './route/education.js';

const app = express();

//Connect database
ConnectDB()

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//define Route
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/users/profile', profileRouter)
app.use('/api/profile/experience', expRouter)
app.use('/api/profile/education', eduRouter)
app.use('/api/post', postRouter)


// End Point 
app.get('/', (req,res)=> {
    res.send('Hello')
})


     
app.listen(config.port, ()=> {
    console.log('Server listen on Port '+ config.port)
})
