import { CreateLinkService } from "../services/links.services";
import { Request,Response } from "express";

export async function createLink(req:Request,res:Response){
    try{
        const {url} = req.body;
        if(!url){
            return res.status(400).json({
                error:"URL is required"
            });
        }

        const link = await CreateLinkService({url});

        return res.status(201).json({
            success:true,
            data:link
        });
    }catch(error){
        console.log("Create Link Error ",error);

        res.status(500).json({
            error:"Internal Server Error"
        })
    }   
}