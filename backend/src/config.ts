import dotenv from 'dotenv'
dotenv.config();
console.log(process.env.DATABASE_URL);
export const config = {
    PORT : Number(process.env.PORT) || 3000,
    DATABASE_URL : process.env.DATABASE_URL!,
    BASE_URL : process.env.BASE_URL!,
    JWT_SECRET : process.env.JWT_SECRET!,
    REDIS_URL:process.env.REDIS_URL!
}