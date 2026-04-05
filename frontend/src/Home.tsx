import React,{useState} from "react";
function Home() {
  const [url,setUrl] = useState('');
  const [shortUrl,setShortUrl] = useState('');

  const UrlSetter = (event:React.ChangeEvent<HTMLInputElement>) =>{
    setUrl(event.target.value);
  }

  async function handleSave(){
    const response = await fetch('/api/shorten',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({url:url})
    })

    const data = await response.json();
    setShortUrl(data.data.short_url);
  }

  const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key==='Enter'){
      handleSave();
    }
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
            <div className="bg-amber-100 cursor-pointer p-2 rounded-lg font-semibold" onClick={handleSave}>save</div>  
            <div className="bg-amber-100 cursor-pointer p-2 rounded-lg font-semibold">copy</div>  
        </div> 
      }
    </div>
  )
}

export default Home