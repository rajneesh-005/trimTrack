import { Request,Response } from "express";
import { getStat } from "../db/queries/clicks";
import { findByCode } from "../db/queries/links";

export async function stats(req:Request,res:Response){
    try{
        const code = req.params.code as string;
        if(!code){
            return res.status(400).json({
                error:"No Code is found!"
            });
        }

        const found = await findByCode(code);
        if(found==null){
            return res.status(404).json({
                msg:"Link Does Not Exists"
            });
        }

        const stat = await getStat(code);

        return res.status(200).json({
            success:true,
            data:stat
        });
    }catch(err){
        console.log("Error is stat controller ",err);

        return res.status(500).json({
            error:"Stat Error in Controller"
        });
    }
}