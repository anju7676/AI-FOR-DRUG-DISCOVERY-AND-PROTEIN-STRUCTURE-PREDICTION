import React, { useState } from "react";
import axios from "axios";
import NGLViewer from "../components/NGLViewer";

const API = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export default function FetchPDBPage() {
  const [pdbId, setPdbId] = useState("");
  const [pdbData, setPdbData] = useState(null);
  const [error, setError] = useState(null);

  async function fetchPDB() {
    try {
      const res = await axios.get(`${API}/fetch_pdb/${pdbId}`);
      setPdbData(res.data.pdb_data);
      setError(null);
    } catch (err) {
      setError("Could not fetch PDB data. Please check the ID.");
      setPdbData(null);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Fetch PDB Structure from RCSB</h2>
      <input
        type="text"
        placeholder="Enter PDB ID (e.g. 6LU7)"
        value={pdbId}
        onChange={(e) => setPdbId(e.target.value.toUpperCase())}
      />
      <button onClick={fetchPDB}>Fetch</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {pdbData && (
        <div style={{ height: "500px", marginTop: "20px" }}>
          <NGLViewer pdbString={pdbData} />
        </div>
      )}
    </div>
  );
}
