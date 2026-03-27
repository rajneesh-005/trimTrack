import {pool} from '../index';
import { ClickEvent } from '@shared/types/clicks';
export async function insertClicks(data:ClickEvent){
    const insertedClick = await pool.query(
        'INSERT INTO clicks(short_code,ip_address,device,browser,os,referrer) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [data.short_code,data.ip_address,data.device,data.browser,data.os,data.referrer]
    );

    return insertedClick.rows[0];
}