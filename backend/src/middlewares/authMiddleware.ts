import { NextFunction, Request,Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { JwtUserPayload } from "@shared/express";

export function authMiddleware(req:Request,res:Response,next:NextFunction){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message : "Unauthorized Access"});
    }

    const token = authHeader.split(' ')[1];
    const secret = config.JWT_SECRET;

    try{
        const decoded = jwt.verify(token,secret) as JwtUserPayload;
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({message:"Cannot get decoded"});
    }
}

