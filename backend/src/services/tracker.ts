import { UAParser } from "ua-parser-js";
import { insertClicks } from "../db/queries/clicks";

export async function ParsingData(short_code:string,ip:string,userAgent:string,referrer:string){
    const parser = new UAParser(userAgent);
    const data = parser.getResult();

    await insertClicks({
        short_code,
        ip_address:ip,
        device:data.device.type,
        browser:data.browser.name,
        os:data.os.name,
        referrer
    })
}