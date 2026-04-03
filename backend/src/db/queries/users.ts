import { pool } from "../index";
export async function findUserbyEmail(email:string){
    const user = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );

    return user.rows[0] || null;
}

export async function createUser(email:string,hashedPasswod:string){
    const insertedUser = await pool.query(
        'INSERT INTO users(email,user_password) VALUES($1,$2) RETURNING *',
        [email,hashedPasswod]
    );

    return insertedUser.rows[0];
}