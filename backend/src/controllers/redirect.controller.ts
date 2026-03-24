import { Request,Response } from "express";
import { findByCode } from "../db/queries/links";

export async function redirect(req:Request,res:Response){
    try{
        const code = req.params.code as string;
        if(!code){
            return res.status(400).json({
                error : "No Code is found"
            })
        }
        const found = await findByCode(code);
        if(found==null){
            return res.status(404).json({
                msg : "Does Not Exists"
            })
        }

        res.redirect(302,found.original_url);
    }catch(err){
        console.log("Redirect Error ",err);

        return res.status(500).json({
            error:"Internal Redirect Error"
        })
    }
}