import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import NGLViewer from "../components/NGLViewer";

const API = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export default function ResultsPage(){
  const [query] = useSearchParams();
  const [job, setJob] = useState(null);
  const jobId = query.get("job");

  useEffect(()=>{
    if(!jobId) return;
    const id = jobId;
    async function fetchStatus(){
      const r = await axios.get(`${API}/status/${id}`);
      setJob(r.data);
    }
    fetchStatus();
    const iv = setInterval(fetchStatus, 5000);
    return ()=>clearInterval(iv);
  }, [jobId]);

  if(!jobId) return <div>Open this page with ?job=<em>JOB_ID</em></div>;
  if(!job) return <div>Loading...</div>;
  return (
    <div style={{padding:20}}>
      <h3>Job {job.id} — {job.status}</h3>
      <pre>{JSON.stringify(job.result, null, 2)}</pre>
      {job.result && job.result.type === "structure_prediction" && (
        <div style={{height:500}}>
          {/* NGL viewer will expect a PDB string; demo uses toy atoms */}
          <NGLViewer atoms={job.result.atoms} />
        </div>
      )}
      {job.result && job.result.type === "virtual_screening" && (
        <div>
          <h4>Top Candidates</h4>
          <ul>
            {job.result.candidates.map((c,i)=>(
              <li key={i}>{c.smiles} — score: {c.score.toFixed(3)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
