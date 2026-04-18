import { Request,Response } from "express";
import { findByCode } from "../db/queries/links";
import { ParsingData } from "../services/tracker";

export async function redirect(req:Request,res:Response){
    try{
        const code = req.params.code as string;
        if(!code){
            return res.status(400).json({
                error : "No Code is found"
            });
        }
        //calculate time per redirect
        const start = Date.now();
        const found = await findByCode(code);
        if(found==null){
            return res.status(404).json({
                msg : "Does Not Exists"
            });
        }
        console.log(`DB lookup took: ${Date.now()-start}ms`);

        res.redirect(302,found.original_url);
        ParsingData(
            code,
            req.ip ?? '',
            req.headers['user-agent'] ?? '',
            req.headers['referer'] as string ?? ''
        )
    }catch(err){
        console.log("Redirect Error ",err);

        return res.status(500).json({
            error:"Internal Redirect Error"
        });
    }
}