import { Request,Response } from "express";
import { findByCode } from "../db/queries/links";
import { ParsingData } from "../services/tracker";
import { getCode, setCode } from "../cache/redis";

export async function redirect(req:Request,res:Response){
    try{
        const code = req.params.code as string;
        if(!code){
            return res.status(400).json({
                error : "No Code is found"
            });
        }
        const start = Date.now();
        let url:string|null;
        const cached = await getCode(code);
        if(cached){
            url = cached;
            console.log(`Redis hit: ${Date.now()-start}ms`)
        }else{
            const found = await findByCode(code);
            if(!found) return res.status(404).json({message:"Does Not Exists"});
            url = found.original_url;
            await setCode(code,url);
            console.log(`DB lookup took: ${Date.now()-start}ms`);
        }
        res.redirect(302,url);
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