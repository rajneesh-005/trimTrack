import dotenv from 'dotenv'
dotenv.config();

export const config = {
    PORT : Number(process.env.PORT) || 3000,
    DATABASE_URL : process.env.DATEBASE_URL!,
    BASE_URL : process.env.BASE_URL!
}