import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import * as Papa from 'papaparse';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Header from "./Header";
import Sankey from "./Sankey";
import Footer from "./Footer";
import NodeGenerator from "./NodeGenerator";


import "./theme/styles.scss";

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
              const graph = NodeGenerator(parsed.data,"agency","sector");
              setData(graph);
            },
          })
        })
      )
  }, []);

  return (
    <div className="App">
      <Header />
      <Sankey data={data} />
      <Footer />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
