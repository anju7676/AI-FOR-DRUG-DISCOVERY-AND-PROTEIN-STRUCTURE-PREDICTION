import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export default function UploadPage(){
  const [type, setType] = useState("protein");
  const [value, setValue] = useState("");
  const [job, setJob] = useState(null);

  async function submit(){
    const payload = { input_type: type, input_value: value };
    const res = await axios.post(`${API}/submit`, payload);
    setJob(res.data);
    alert(`Job queued: ${res.data.id}`);
  }

  return (
    <div style={{padding:20}}>
      <h2>Submit sequence / SMILES</h2>
      <select value={type} onChange={e=>setType(e.target.value)}>
        <option value="protein">Protein sequence</option>
        <option value="dna">DNA sequence</option>
        <option value="rna">RNA sequence</option>
        <option value="smiles">SMILES</option>
      </select>
      <br/>
      <textarea rows="8" cols="60" value={value} onChange={e=>setValue(e.target.value)} />
      <br/>
      <button onClick={submit}>Submit</button>
      {job && <p>Job ID: {job.id}. Check status at /results?job={job.id}</p>}
    </div>
  );
}
