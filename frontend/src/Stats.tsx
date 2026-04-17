import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { StatResponse } from "@shared/types/stat";
import { BarChart,Bar,XAxis,YAxis,Tooltip } from "recharts";
import { LineChart,Line } from "recharts";
function Stats(){
    const [stat,setStat] = useState<StatResponse | null>(null);
    const {code} = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        async function fetchStat(){
            const token = localStorage.getItem('token');
            if(!token) return navigate('/auth');
            const response = await fetch(`/api/${code}/stats`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        });

        const data = await response.json();
        setStat(data.data);
        }

        fetchStat();
    },[]);
    console.log("Stat",stat);
    return(
        <>
           {stat && (
            <div>
                <p>Total Clicks : {stat.total_clicks}</p>
                <p>Unique Visitors : {stat.unique_visitors}</p>
                <p>Clciks Today : {stat.clicks_today}</p>
            </div>
           )}

           <BarChart width={400} height={300} data={stat?.clicks_by_browser}>
            <XAxis dataKey="browser"/>
            <YAxis />
            <Tooltip />
            <Bar dataKey="count"/>
           </BarChart>

           <BarChart width={400} height={300} data={stat?.clicks_by_device}>
            <XAxis dataKey="device"/>
            <YAxis />
            <Tooltip />
            <Bar dataKey="count"/>
           </BarChart>

           <LineChart width={400} height={300} data={stat?.clicks_over_time}>
            <XAxis dataKey="day"/>
            <YAxis />
            <Tooltip />
            <Line dataKey="count"/>
           </LineChart>

        </>
    )
}

export default Stats;