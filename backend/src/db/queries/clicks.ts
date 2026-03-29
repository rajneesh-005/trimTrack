import {pool} from '../index';
import { ClickEvent } from '@shared/types/clicks';
export async function insertClicks(data:ClickEvent){
    const insertedClick = await pool.query(
        'INSERT INTO clicks(short_code,ip_address,device,browser,os,referrer) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [data.short_code,data.ip_address,data.device,data.browser,data.os,data.referrer]
    );

    return insertedClick.rows[0];
}
//Total Clicks for One Short Code 
export async function getTotalClicks(code:string){
    const totalClicks = await pool.query<{count:string}>(
        'SELECT COUNT(*) FROM clicks WHERE short_code = $1',[code]
    );

    return parseInt(totalClicks.rows[0].count);
}

//Total Unique Visitors ( by IP Address ) 
export async function getUniqueVisitors(code:string){
    const totalUnique = await pool.query<{count:string}>(
        'SELECT COUNT(DISTINCT ip_address) FROM clicks WHERE short_code = $1',[code]
    );

    return parseInt(totalUnique.rows[0].count);
}

//Clicks where clicked_at is today 
export async function getClicksToday(code:string){
    const clicksToday = await pool.query<{count:string}>(
        `SELECT COUNT(*) FROM clicks WHERE short_code = $1 AND DATE_TRUNC('day',clicked_at) = CURRENT_DATE`,[code]
    );

    return parseInt(clicksToday.rows[0].count);
}

//Clicks by Day 
export async function getClicksOverTime(code:string){
    const clicksOverTime = await pool.query<{day:Date, count:string}>(
        `SELECT DATE_TRUNC('day',clicked_at) as day, COUNT(*) as count 
        FROM clicks 
        WHERE short_code = $1 
        GROUP BY day 
        ORDER BY count DESC`,[code]
    );

    return clicksOverTime.rows.map(row=>({
        day: row.day,
        count:parseInt(row.count)
    }));
}

//Clicks By Device 
export async function getClicksByDevice(code:string){
    const clicksByDevice = await pool.query<{device:string;count:string}>(
        `SELECT device,COUNT(*) as count
        FROM clicks
        WHERE short_code = $1
        GROUP BY device
        ORDER BY count DESC`,[code]
    );

    return clicksByDevice.rows.map(row=>({
        device : row.device,
        count : parseInt(row.count)
    }));
}

//Clicks By Browsers 
export async function getClicksByBrowser(code:string){
    const browserClicks = await pool.query<{browser:string;count:string}>(
        `SELECT browser,COUNT(*) as count
        FROM clicks
        WHERE short_code = $1
        GROUP BY browser
        ORDER BY count DESC`,[code]
    );

    return browserClicks.rows.map(row=>({
        browser:row.browser,
        count : parseInt(row.count)
    }));
}

// Clicks By Referrer 
export async function getClicksByReferrer(code:string){
    const referrerClicks = await pool.query<{referrer:string,count:string}>(
        `SELECT referrer,COUNT(*) as count
        FROM clicks
        WHERE short_code = $1
        GROUP BY referrer
        ORDER BY count DESC`,[code]
    );
    return referrerClicks.rows.map(row=>({
        referrer:row.referrer,
        count:parseInt(row.count)
    }));
}