import { findByCode } from "../db/queries/links";
import { randomInt } from "crypto";

const shortener:string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export async function generateShortCode():Promise<string>{
    let shortened_code:string = '';
    for(let i=0;i<7;i++){
        const randomIndex = randomInt(0,62);
        shortened_code += shortener[randomIndex];
    }

    if(await findByCode(shortened_code)!=null){
        return generateShortCode();
    }
    return shortened_code;
}