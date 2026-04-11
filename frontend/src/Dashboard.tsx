import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Link } from '@shared/types';
function Dashboard(){
    const navigate = useNavigate();
    const [Links,setLinks] = useState<Link[]>([]);
    useEffect(()=>{
        async function fetchlinks(){
            const token = localStorage.getItem('token');
            if(!token) return navigate('/auth');

            const response = await fetch('/api/links',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                }
            });

            const data = await response.json();
            setLinks(data.data);
        }

        fetchlinks();
    },[])


    return(
        <>
            {
                Links.map(link=>(
                    <div key={link.short_code}>
                        <p>{link.original_url}</p>
                        <p>{link.short_code}</p>
                        <button onClick={()=>navigate(`/stat/${link.short_code}`)}>View Stat</button>
                    </div>
                ))
            }
        </>
    )
}

export default Dashboard;