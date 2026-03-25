function App() {

  return (
    <div className="flex items-center justify-center h-screen bg-black font-mono">
      <div className="text-center">
        <h1 className="font-extraboldld py-3 text-6xl text-amber-100">trimTrack</h1>
        <h3 className="font-semibold text-amber-100 py-3 text-2xl">trim it, track it! </h3>
        <input type="url" id="org_url" className="bg-amber-100 border rounded-lg block w-xl cursor-text px-2 py-2" 
          placeholder="paste url"
        ></input>  
      </div> 
      <div>
          <div></div>  
          <button></button>  
          <button></button>  
      </div> 
    </div>
  )
}

export default App
