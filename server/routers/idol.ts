import {Request, Router} from 'express'

import {Idol} from '../models/idol'
const router = Router()

import moment from "moment"


router.route("/idol")
.get(async(req:Request<unknown,unknown,unknown,{
    id?:string,
    page?:number,
    per_page?:number,
    name?:string,

}>,res)=>{
    let {id,page,per_page,name} = req.query
    //pagination
    
    page = page | 0
    per_page = per_page | 20
    //
    try{

        if(id){
            let idol = await Idol.findById(id).populate("group").exec();
            res.status(200).send(idol);

        }
        else if(name){
            let name = req.query.name;

            let idols = await Idol.find({ 
                $or:[
                    {name:{ $regex: name,$options:'i' }},
                    {hangul:{ $regex: name,$options:'i' }}
                ] 
            });
            if(idols.length===0){
                return res.status(400).send("coincidence not found");
            }
            res.send(idols);
        }
        else{
            let idols = await Idol.find({},{},{skip:page*per_page,limit:per_page}).populate("group").exec();
            res.status(200).send(idols);
        }

    }catch(e){
        res.status(400).send("errro"+e);
    }
})

export default router;
