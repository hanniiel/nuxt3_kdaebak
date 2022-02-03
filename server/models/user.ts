import config from '#config'
import mongoose from 'mongoose'
const { Schema, model } = mongoose
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import IUser from '~~/interfaces/IUser'

const schema = new Schema<IUser>({
    _id:String,
    name:String,
    currency:{
        type:Number,
        default:100
    },
    password:{
        type:String,
        trim:true
    },
    role:{
        type:String,
        enum:['user','admin','editor'],
        required:true,
        default:"user"
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid');
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    
},{
    timestamps:true
})

schema.methods.toJSON = function(){
    const user = this;
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens

    return userObj
}
schema.methods.genAuthToken =async function(){
    const user = this
    let token = jwt.sign({_id:user._id}, config.JWT_KEY,{expiresIn:'7d'})

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

schema.statics.findByCredentials = async(email,password)=>{
    let user = await User.findOne({email})
    if(!user){
        throw new Error("failed to login")
    }

    let isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error("user or password not found")
    }

    return user
}

schema.pre("save",async function(next){
    var user = this
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
});

const User = model<IUser>("user",schema)

export { User, schema}