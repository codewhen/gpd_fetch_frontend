import { useRef, useState } from "react";
import axios from 'axios'
import { baseUrl } from "./config";
import classes from "./App.module.css"
import { Portal } from 'react-portal'
import { BounceLoader } from "react-spinners";

//BCL2 is a gene. Lithium and Ortho Evra are some drugs. Lo Loestrin Fe is for birth control. Depo-Provera is dash separated

function App() {
  const inputRef = useRef();
  const [output, setOutput] = useState(null);
  const [moreInfoExternal, setMoreInfoExternal] = useState(null);
  const [moreInfo, setMoreInfo] = useState();
  const [moreInfoKeys, setMoreInfoKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(null);
  const [fetchType, setFetchType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const onFetchGene = async (e)=>{
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 200);
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
    clearTimeout(timer);
    setIsLoading(false);
    console.log(response);
  }

  const onFetchDrug = async (e)=>{
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 200);
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
    clearTimeout(timer);
    setIsLoading(false);
  }

  const onFetchProtein = async (e)=>{
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 200);    e.preventDefault();
    const input = inputRef.current.value;
    
    const response = await axios.post(
      `${baseUrl}/protein`,
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
    setFetchType('protein');
    setOutput(content);
    console.log(response);
    clearTimeout(timer);
    setIsLoading(false);
  }

  const onReuseDrug = async (e)=>{
    setIsLoading(true);
    e.preventDefault();
    const input = inputRef.current.value;
    
    const response = await axios.post(
      `${baseUrl}/reuse_drug`,
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
    content = content.map((e)=>{
      return `<li>${e}</li>`
    }).join(" ")
    setFetchType('reuse_drug');
    setOutput(content);
    console.log(response);
    setIsLoading(false);
  }

  const clickHandler =(e)=>{
    e.preventDefault();
    const el = e.target.closest("mark");
    if (el && e.currentTarget.contains(el)) {
      const elementName = (el.innerText.trim().split(" ").slice(0, -1)).join(" ");
      console.log(elementName)
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
    <div className={`App`}>
        <nav className={classes.nav}>
          <span>DDH TM-1</span>
          <ul>
            <li><a className="active" href="/">Home</a></li>
            <li><a href="api">API</a></li>
          </ul>
        </nav>
        <form action="drug" method="post">
          <div className={classes.inputTile}>
            <textarea className={classes._input_} ref={inputRef} type="text"></textarea>
            <div className={classes.buttonTile}>
              <input className={classes.btn} type="button" value="Gene Fetch" onClick={onFetchGene}/>
              <input className={classes.btn} type="button" value="Drug Fetch" onClick={onFetchDrug}/>
              <input className={classes.btn} type="button" value="Protein Fetch" onClick={onFetchProtein}/>
              <input className={classes.btn} type="button" value="Reuseable Drug" onClick={onReuseDrug}/>
            </div>
          </div>
        </form>
      <h1 className={classes.output_lbl}>Output</h1>
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
                  return <li key={e}><span>{e}</span>: {String(moreInfo[e])}</li>
                }): 
                "Loading..."
              }
            </div>
        </div>
      </Portal>}
      {isLoading && <Portal node={document && document.getElementById('loader')}>
        <div className="loader-context">
        <BounceLoader color={"#ffffff"} loading={true} size={60} />
        </div>
      </Portal>}
    </div>
  );
}

export default App;
