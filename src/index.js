import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Sankey from "./Sankey";
import * as Papa from 'papaparse';

import "./styles.css";

function App() {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetch("/data/master.csv")
      .then(res => res.text()
        .then(txt => {
          Papa.parse(txt, {
            header: true,
            skipEmptyLines: true,
            complete: (parsed) => {
              setData(parsed.data);
            },
          })
        })
      )
  }, []);

  return (
    <div className="App">
      <Sankey data={data} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
