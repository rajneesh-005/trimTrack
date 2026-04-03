export interface JwtUserPayload{
    id:number,
    email:string
}
declare global{
    namespace Express{
        interface Request{
            user?:JwtUserPayload
        }
    }
}