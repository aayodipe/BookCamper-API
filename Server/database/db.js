//Set Up database
import mongoose from 'mongoose';
import config from '../config/default.js';

const connectDB = async () => {

    try {

        //Database
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        let db = mongoose.connection;

        db.on("error", console.error.bind(console, "connection error:"));

        db.once("open", function() {
            console.log("Connection Successful!");
        });
       
    }catch(err){
        console.error(err)
        process.exit(1)
    }

}

export default connectDB;