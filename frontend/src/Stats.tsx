import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { StatResponse } from "@shared/types/stat";
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
        <></>
    )
}

export default Stats;