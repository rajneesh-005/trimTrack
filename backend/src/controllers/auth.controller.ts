import { Request,Response } from "express";
import { registerUser,loginUser } from "../services/auth.services";

export async function register(req:Request,res:Response){
    try{
        const {email,password} = req.body;

        const result = await registerUser(email,password);

        res.status(201).json(result)

    }catch(err){
        res.status(400).json({
            message:err instanceof Error ? err.message : "Error inside regiter controller"
        })
    }
}

export async function login(req:Request,res:Response){
    try{
        const {email,password} = req.body;
        const result = await loginUser(email,password);
        res.status(200).json(result);
    }catch(err){
        res.status(400).json({
            msg:err instanceof Error ? err.message : "Error Inside login controller"
        });
    }
}