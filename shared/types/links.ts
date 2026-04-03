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
}

export interface CreateLinkInput{
    short_code:string
    url:string
    user_id:number
}

export interface CreateLinkResponse{
    short_code:string
    short_url:string
}