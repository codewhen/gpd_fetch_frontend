import { useRef, useState } from "react";
import axios from 'axios'
import { baseUrl } from "./config";
import classes from "./App.module.css"
import { Portal } from 'react-portal'

function App() {
  const inputRef = useRef();
  const [output, setOutput] = useState(null);
  const [moreInfo, setMoreInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(null);


  const onFetchGene = async (e)=>{
    e.preventDefault();
    const input = inputRef.current.value;
    
    const response = await axios.post(
      `${baseUrl}/gene`,
      {
        header: {
            'Content-Type':'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        input: input
      }
    );
    let content = response.data['output'];
    setOutput(content);
    console.log(response);
  }

  const clickHandler =(e)=>{
    e.preventDefault();
    const el = e.target.closest("mark");
    if (el && e.currentTarget.contains(el)) {
      const elementName = el.innerText.split(" ")[0];
      setMoreInfo(null);
      setModalOpen(elementName);
      onGeneClick(elementName);
    } 
  }

  const onGeneClick = async (geneName)=>{
    const response = await axios.post(
      `${baseUrl}/gene/details/${geneName}`,
      {
        header: {
            'Content-Type':'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
      }
    )
    console.log(response)
    const result = response.data['output']['DocumentSummarySet']['DocumentSummary'][0]['Summary'];
    setMoreInfo(result)
  }

  return (
    <div className={`App ${classes.pad}`}>
      <h1> DDH-TM </h1>
      <br/>
      <br/>
      <form action="drug" method="post">
        <textarea ref={inputRef} rows="4" cols="50" type="text"></textarea>
        <br/>
        <br/>
        <input type="button" value="Gene Fetch" onClick={onFetchGene}/>
        <input type="button" value="Drug Fetch"/>
        <input type="button" value="Protein Fetch"/>
        <input type="button" value="Reuseable Drug"/>
      </form>
      <br/>
      <h1>Output</h1>
      <div className={classes.fetch_output_button} onClick={clickHandler} dangerouslySetInnerHTML={{ __html: output }} />
      {modalOpen && <Portal node={document && document.getElementById('loader')}>
         <div className="loader-context" onClick={()=>setModalOpen(false)}>
            <div className={classes.modal}>
              <p>{modalOpen}</p>
              <hr/>
              {moreInfo?moreInfo: "Loading..."}
            </div>
        </div>
      </Portal>}
    </div>
  );
}

export default App;
