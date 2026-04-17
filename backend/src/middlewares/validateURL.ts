import {NextFunction,Request,Response} from "express";
import * as dns from "dns";
import { promisify } from "util";
import * as ipaddr from "ipaddr.js";

const lookup = promisify(dns.lookup);
async function isSafeUrl(urlString:string):Promise<boolean>{
    try{
        const url = new URL(urlString);
        if(url.protocol !== "http:" && url.protocol !== "https:") return false;
        const {address} = await lookup(url.hostname);
        const addr = ipaddr.parse(address);
        const range = addr.range();


        return range == "unicast";
    }catch(err){
        return false;
    }
}
function isHTTPorHTTPS(url:string):boolean{
    try{
        const parsed = new URL(url);

        return parsed.protocol==="https:" || parsed.protocol==="http:";
    }catch(err){
        return false;
    }
}

export async function validateURL(req:Request,res:Response,next:NextFunction){
    const {url} = req.body;
    if(!url){
        return res.status(404).json({
            message:"No URL"
        });
    }
    const valid = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    if(!valid.test(url)){
        return res.status(400).json({
            message:"Invalid URL Format"
        });
    }

    if(!isHTTPorHTTPS(url)){
        return res.status(400).json({
            message:"must only be HTTP or HTTPs"
        });
    }

    if(!await isSafeUrl(url)){
        return res.status(400).json({
            message:"No Private IPs allowed"
        });
    }
    next();
}