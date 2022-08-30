import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";

import * as Papa from 'papaparse';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Header from "./Header";
import Sankey from "./Sankey";
import Footer from "./Footer";
import DroppableWells from "./DroppableWells";
import GraphGenerator from "./GraphGenerator";

import { ActiveProvider } from './context/ActiveContext'
import { GraphProvider } from './context/GraphContext'

import "./theme/styles.scss";

function App() {
  const [data, setData] = useState(null);
  const [graph, setGraph] = useState({});
  const [active, setActive] = useState([null,null,null]);

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
    <ActiveProvider value={{active, setActive}}>
      <GraphProvider value={{graph, setGraph}}>
        <div className="App">
          {data !== null && <GraphGenerator data={data} />}
          <Header />
          <DndProvider backend={HTML5Backend}>
            <main className="app-main">
              <DroppableWells />
              <Sankey />
            </main>
            <Footer />
          </DndProvider>
        </div>
      </GraphProvider>
    </ActiveProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
