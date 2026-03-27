import { pool } from "../index";
import {Link,CreateLinkInput} from '@shared/types/links'
export async function findByCode(code:string):Promise<Link | null>{
    const result = await pool.query<Link>(
        'SELECT * FROM links WHERE short_code = $1',
        [code]
    );

    return result.rows[0] || null;
}

export async function createLink(data : CreateLinkInput):Promise<Link>{
    const result = await pool.query<Link>(
        'INSERT INTO links(original_url,short_code) VALUES ($1,$2) RETURNING *',
        [data.url,data.short_code]
    );

    return result.rows[0];
}

export async function listlinks():Promise<Link[]>{
    const result = await pool.query<Link>(
        'SELECT * FROM links ORDER BY created_at DESC'
    );
    return result.rows;
}