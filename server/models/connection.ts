import config from '#config'
import mongoose from "mongoose"

export default async function connect(){
    try{
        await mongoose.connect(config.MONGO_PATH)
        console.log("Connected to mongo");
    }catch(e){
        console.log(e);
    }
    
}