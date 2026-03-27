import {pool} from '../index';
import { ClickEvent } from '@shared/types/clicks';
export async function insertClicks(data:ClickEvent){
    const insertedClick = await pool.query(
        'INSERT INTO clicks(short_code,ip_address) VALUES ($1,$2) RETURNING *',
        [data.short_code,data.ip_address]
    );

    return insertedClick.rows[0];
}