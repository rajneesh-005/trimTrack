import { findUserbyEmail,createUser } from "../db/queries/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config";
const validate = (email:string,password:string) => {
    if(!email || !password){
        throw new Error('Empty Fields');
    }

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailReg.test(email)){
        throw new Error('Invalid Email Format');
    }

    if(password.length < 6){
        throw new Error('Password too small')
    }
}
export async function registerUser(email:string,password:string){
    validate(email,password)
    const exist = await findUserbyEmail(email);
    if(exist) throw new Error(`${email} already exists`);

    const hashedPasswrod = await bcrypt.hash(password,10);

    const newUser = await createUser(email,hashedPasswrod);

    const secret = config.JWT_SECRET;
    const token = jwt.sign({id:newUser.id, email:email},secret,{"expiresIn":"7d"});
    return {
        token, 
        email
    }
}

export async function loginUser(email:string, password:string){
    validate(email,password);

    const userExists = await findUserbyEmail(email);
    if(!userExists) throw new Error("User doesn't exists");

    const passwordMatch = await bcrypt.compare(password,userExists.user_password);
    if(!passwordMatch) throw new Error('Incorrect Password');

    const secret = config.JWT_SECRET;
    const token = jwt.sign({id:userExists.id,email:email},secret,{"expiresIn":"7d"});

    return {
        token,
        email
    }
}