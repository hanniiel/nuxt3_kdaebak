import {Request, Router} from 'express'

import {Group} from '../models/group'

const router = Router()
router.route('/group')
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
    //pagination
    try{
        if(id){
            let group = await Group.findById(id).populate("members.member").populate("exmembers.member").populate('subgroups').exec();
            res.send(group);

        }else if(name){
            let groups = await Group.find({ 
                $or:[
                    {name:{ $regex: name,$options:'i' }},
                    {hangul:{ $regex: name,$options:'i' }}
                ] 
            });
            if(groups.length===0){
                return res.status(400).send("coincidence not found");
            }
            res.send(groups);
        }else{
            var groups = await Group.find({},{},{skip:page*per_page,limit:per_page}).populate("members.member").populate("exmembers.member").populate('subgroups').exec();
            res.send(groups);
        }
        
    }catch(e){
        res.status(400).send({error:e});
    }
})

export default router