import React, {useEffect} from "react";
import { init } from "./Web3Client";

function App() {

  useEffect(async ()=>{
    init()
  })

  return <div className="App"></div>
}

export default App;
