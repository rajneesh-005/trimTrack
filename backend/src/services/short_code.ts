import { findByCode } from "../db/queries/links";
import { randomInt } from "crypto";

const shortener:string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export async function generateShortCode():Promise<string>{
    while(true){
        let short_code:string = '';
        for(let i=0;i<7;i++){
            short_code += shortener[randomInt(0,62)];
        }

        const exist = await findByCode(short_code);
        if(!exist) return short_code;
    }
}