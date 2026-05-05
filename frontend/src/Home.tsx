import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const [url,setUrl] = useState('');
  const [shortUrl,setShortUrl] = useState('');
  const [copy,setcopy] = useState(false);
  const [save,setsaved]=useState(false);

  const UrlSetter = (event:React.ChangeEvent<HTMLInputElement>) =>{
    setUrl(event.target.value);
  }

  async function handleSave(){
    const token = localStorage.getItem('token');
    if(shortUrl) return;
    if(!token){
      return navigate('/auth');
    }
    console.log(token);
    const response = await fetch('/api/shorten',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      },
      body: JSON.stringify({url:url})
    })

    if(!response.ok){
      const text = await response.text();
      console.error("Request Failed:",response.status,text);
      return;
    }
    let data;
    try{
      data = await response.json();
    }catch(err){
      console.error("Invalid Json response",err);
      return;
    }
    if(response.status==401){
      localStorage.removeItem('token');
      navigate('/auth');
      return;
    }
    setShortUrl(data.data.short_url);
  }

  function handleSaved(){
    setsaved(true);
    setTimeout(()=>{
      setsaved(false);
    },2000);
  }

  const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key==='Enter'){
      handleSave();
    }
  }

  async function handlecopy(){
    await navigator.clipboard.writeText(shortUrl);
    setcopy(true);
    setTimeout(() => {
      setcopy(false);
    }, 2000);
  }

  function redirect2Dashboard(){
    return navigate("/dashboard");
  }
  return (
    <div className="flex flex-col items-center  h-screen bg-black font-mono ">
        <div className="flex flex-col mt-5 ">
          <h1 className="text-center font-extrabold py-3 text-6xl text-amber-100">trimTrack</h1>
          <h3 className="text-center font-semibold text-amber-200 py-3 text-2xl">trim it, track it! </h3>
          <input type="url" id="org_url" className="bg-amber-100 border rounded-lg block w-xl cursor-text px-2 py-2" 
            placeholder="paste url" value={url} onChange={UrlSetter} onKeyDown={handleKeyDown}></input>  
        </div> 

      {shortUrl &&
        <div className="flex flex-row  gap-3 mt-4 w-xl ">
            <div className="flex-1 text-black px-3 py-2 bg-amber-100 rounded-lg max-w-xl">
              {shortUrl}
            </div>  
            <div className="bg-amber-100 cursor-pointer p-2 rounded-lg font-semibold" onClick={handleSaved}>{save?'Saved!':'Save'}</div>  
            <div className="bg-amber-100 cursor-pointer p-2 rounded-lg font-semibold" onClick={handlecopy}>{copy?'Copied!':'Copy'}</div>  
        </div> 
      }
      <div>
        <button onClick={redirect2Dashboard}>Check your Dashboard</button>
      </div>
    </div>
  )
}

export default Home