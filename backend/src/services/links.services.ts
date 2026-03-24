import { createLink } from "../db/queries/links";
import { CreateLinkRequest, Link } from "@shared/types/links";
import { generateShortCode } from "./short_code";
import { config } from "../config";

export async function CreateLinkService(data:CreateLinkRequest){
    const short_code = await generateShortCode();
    const new_link:Link = await createLink({short_code,url:data.url});

    return {
        short_code:new_link.short_code,
        short_url: config.BASE_URL + '/' + short_code //building short url from short_code
    }
}