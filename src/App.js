import { useRef, useState } from "react";
import axios from 'axios'
import { baseUrl } from "./config";
import classes from "./App.module.css"
import { Portal } from 'react-portal'

function App() {
  const inputRef = useRef();
  const [output, setOutput] = useState(null);
  const [moreInfoExternal, setMoreInfoExternal] = useState(null);
  const [moreInfo, setMoreInfo] = useState();
  const [moreInfoKeys, setMoreInfoKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(null);
  const [fetchType, setFetchType] = useState(null);


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
    setFetchType('gene');
    setOutput(content);
    console.log(response);
  }

  const onFetchDrug = async (e)=>{
    e.preventDefault();
    const input = inputRef.current.value;
    
    const response = await axios.post(
      `${baseUrl}/drug`,
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
    setFetchType('drug');
    setOutput(content);
    console.log(response);
  }

  const clickHandler =(e)=>{
    e.preventDefault();
    const el = e.target.closest("mark");
    if (el && e.currentTarget.contains(el)) {
      console.log(el.innerText.split(" ").slice(0, -1))
      const elementName = el.innerText.split(" ").slice(0, -1).join(" ");
      setModalOpen(elementName);
      switch (fetchType) {
        case "gene":
          onGeneClick(elementName);
          break;
        case "drug":
          onDrugClick(elementName);
          break;
        case "protein":
          onProteinClick(elementName);
          break;
        default:
          break;
      }
    } 
  }

  const onGeneClick = async (geneName)=>{
    setMoreInfo(null)
    setMoreInfoKeys(null)
    setMoreInfoExternal(null)
    
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
    const result = response.data['output']['DocumentSummarySet']['DocumentSummary'][0];
    const id = response.data['id'];
    console.log(response.data);
    const keys = Object.keys(result);
    for (let i in keys){
      if(typeof result[keys[i]] != "string"){
        delete result[keys[i]];
        delete keys[i];
      }
    }
    setMoreInfo(result)
    setMoreInfoKeys(keys)
    setMoreInfoExternal(`https://www.ncbi.nlm.nih.gov/gene/${id}`)
  }

  const onProteinClick = async (proteinName)=>{
    setMoreInfo(null)
    setMoreInfoKeys(null)
    setMoreInfoExternal(null)
    
    const response = await axios.post(
      `${baseUrl}/protein/details/${proteinName}`,
      {
        header: {
            'Content-Type':'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
      }
    )
    const result = response.data['output'][0];
    const id = response.data['id'];
    console.log(response.data);
    const keys = Object.keys(result);
    for (let i in keys){
      if(typeof result[keys[i]] != "string"){
        delete result[keys[i]];
        delete keys[i];
      }
    }
    setMoreInfo(result)
    setMoreInfoKeys(keys)
    setMoreInfoExternal(`https://www.ncbi.nlm.nih.gov/protein/${id}`)
  }

  const onDrugClick = async (drugName)=>{
    setMoreInfo(null)
    setMoreInfoKeys(null)
    setMoreInfoExternal(null)
    
    const response = await axios.post(
      `${baseUrl}/drug/details/${drugName}`,
      {
        header: {
            'Content-Type':'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
      }
    )
    const result = response.data['output'];
    const id = response.data['id'];
    console.log(response.data);
    const keys = Object.keys(result);
    for (let i in keys){
      if(typeof result[keys[i]] == "object"){
        delete result[keys[i]];
        delete keys[i];
      }
    }
    setMoreInfo(result)
    setMoreInfoKeys(keys)
    setMoreInfoExternal(`https://www.ebi.ac.uk/chembl/document_report_card/${id}`)
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
        <input type="button" value="Drug Fetch" onClick={onFetchDrug}/>
        <input type="button" value="Protein Fetch"/>
        <input type="button" value="Reuseable Drug"/>
      </form>
      <br/>
      <h1>Output</h1>
      <div className={classes.fetch_output_button} onClick={clickHandler} dangerouslySetInnerHTML={{ __html: output }} />
      {modalOpen && <Portal node={document && document.getElementById('loader')}>
         <div className="loader-context" onClick={()=>setModalOpen(false)}>
            <div className={classes.modal}>
              <div className={classes.flex_1}>
                <span>{modalOpen}</span>
                {moreInfoExternal&&<a href={moreInfoExternal}>Goto External</a>}
              </div>
              <hr/>
              {moreInfo&&moreInfoKeys?
                moreInfoKeys.map((e)=>{
                  return <li><span>{e}</span>: {String(moreInfo[e])}</li>
                }): 
                "Loading..."
              }
            </div>
        </div>
      </Portal>}
    </div>
  );
}

export default App;
