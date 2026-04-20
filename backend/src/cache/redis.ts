import { createClient } from "redis";
import { config } from "../config";

const client = createClient({url:config.REDIS_URL});

client.connect();

export async function getCode(code:string){
    return await client.get(code);
}

export async function setCode(code:string,url:string){
    await client.set(code,url,{EX:3600});
}

export async function deleteCode(code:string){
    await client.del(code); 
}

export default client;