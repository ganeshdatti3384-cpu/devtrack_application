import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState("");

  const fetchIssues = async () => {
    const res = await axios.get("/api/issues");
    setIssues(res.data);
  };

  const createIssue = async () => {
    await axios.post("/api/issues", {
      title,
      status: "OPEN"
    });
    setTitle("");
    fetchIssues();
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>DevTrack Issue Dashboard 🚀</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Issue title"
      />
      <button onClick={createIssue}>Create Issue</button>

      <ul>
        {issues.map((i) => (
          <li key={i.id}>
            {i.title} - {i.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
