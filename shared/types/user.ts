export interface User{
    id:number,
    email:string,
    user_password:string,
    created_at:Date
}

export interface RegisterRequest{
    email:string,
    password:string
}

export interface LoginRequest{
    email:string,
    password:string
}

export interface AuthResponse{
    token:string,
    email:string,
}