export interface Link{
    id:number
    short_code:string
    original_url:string
    title?:string,
    created_at:Date
    expires_at?:Date
}

export interface CreateLinkRequest{
    url:string
    title?:string
}

export interface CreateLinkInput{
    short_code:string
    url:string
    title?:string
}

export interface CreateLinkResponse{
    short_code:string
    shorten_url:string
}