import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";

import * as Papa from "papaparse";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";

import Header from "./Header";
import Footer from "./Footer";
import GraphGenerator from "./GraphGenerator";
import Tray from "./Tray";
import AppCore from "./AppCore";
import ParamsController from "./ParamsController";

import { ReadyProvider } from "./context/ReadyContext";
import { ActiveProvider } from "./context/ActiveContext";
import { GraphProvider } from "./context/GraphContext";
import { HighlightedProvider } from "./context/HighlightedContext";
import { SelectedProvider } from "./context/SelectedContext";
import { AgencyLevelProvider } from "./context/AgencyLevelContext";
import { HelpersProvider } from "./context/HelpersContext";
import { TrayProvider } from "./context/TrayContext";
import { generateTwoDigitYear } from "./helperFuncs/generateTwoDigitYear";

import sources from "./constants/sources";

import "./theme/styles.scss";

function App() {
  const currentYear = new Date().getFullYear().toString();
  const [data, setData] = useState([]);
  const [dataCache, setDataCache] = useState([]);
  //See discussion 69-73 below (.filter((year) => +year <= currentYear))
  //const [inputYear, setInputYear] = useState(currentYear);
  //const [shortYear, setShortYear] = useState(generateTwoDigitYear(currentYear));
  const [inputYear, setInputYear] = useState(undefined);
  const [shortYear, setShortYear] = useState(undefined);
  const [dataYears, setDataYears] = useState([inputYear]);
  const [graph, setGraph] = useState({});
  const [active, setActive] = useState([null, null]);
  const [ready, setReady] = useState([true, true]);
  const [highlighted, setHighlighted] = useState({ links: [], nodes: [] });
  const [selected, setSelected] = useState([null, null]);
  const [agencyLevel, setAgencyLevel] = useState(0);
  const [showHelpers, setShowHelpers] = useState(true);
  const [showTray, setShowTray] = useState(false);

  const dataSource = sources[process.env.REACT_APP_DATA];

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    filterDataByYear();
  }, [inputYear]);

  const getInitialData = async () => {
    await fetch(dataSource).then((res) =>
      res.text().then((txt) => {
        Papa.parse(txt, {
          header: true,
          skipEmptyLines: true,
          complete: (parsed) => {
            const yearCol = new Set();
            parsed.data.map((row) => yearCol.add(row.fy));

            const availableYears = [...yearCol]
              //Current data process involves filtering data for only the years we want to display, even though the original data includes projections for current/future years
              //So, by the time we get the data into the app, it should only include past/current data anyway
              //For now, let's take this filter out because it will make it harder to manage the 2023 -> 2024 year change, as well as future year changes
              //But, in the future, might want to bring this back in case there's a more complex relationship between the current year and current/future data
              //.filter((year) => +year <= currentYear)
              .sort((a, b) => b - a);
            setDataYears(availableYears);

            const latestYear = availableYears[0];
            setInputYear(latestYear);
            setShortYear(generateTwoDigitYear(latestYear));

            const parsedPromise = Promise.resolve(parsed);

            parsedPromise.then((value) => {
              const currentData = value.data.filter(
                (row) => row.fy === inputYear
              );
              setDataCache(value.data);
              setData(currentData);
            });
          },
        });
      })
    );
  };

  const filterDataByYear = () => {
    const filteredData = dataCache.filter((row) => row.fy === inputYear);
    setData(filteredData);
  };

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    const shortened = generateTwoDigitYear(selectedYear);
    setShortYear(shortened);
    setInputYear(selectedYear);
  };

  const activeIndex = active.findIndex((a) => a !== null);
  const totalActive = active.findLastIndex((a) => a !== null) + 1;
  const totalReady = ready.findLastIndex((r) => r !== false) + 1;
  const activeNodes =
    graph && graph.nodes
      ? totalActive === 1
        ? graph.nodes.length / 2
        : graph.nodes.length
      : 0;

  return (
    <HelpersProvider value={{ showHelpers, setShowHelpers }}>
      <ActiveProvider value={{ active, setActive }}>
        <GraphProvider value={{ graph, setGraph }}>
          <SelectedProvider value={{ selected, setSelected }}>
            <AgencyLevelProvider value={{ agencyLevel, setAgencyLevel }}>
              {data !== null && (
                <GraphGenerator data={data} inputYear={inputYear} />
              )}
              <ReadyProvider value={{ ready, setReady }}>
                <div
                  className={`App${
                    activeIndex !== -1 ? " first_active-" + activeIndex : ""
                  }${
                    totalActive !== 0 ? " has_active-" + totalActive : ""
                  } has_ready-${totalReady} ${
                    showHelpers ? "tutorial-active" : ""
                  } ${showTray ? "show-tray" : ""}`}
                >
                  <div className="app__inner">
                    {/* {window.innerWidth >= 841 && ( */}
                      <React.Fragment>
                        <Header
                          inputYear={inputYear}
                          shortYear={shortYear}
                          data={data}
                        />
                        <DndProvider backend={HTML5Backend}>
                          <div className="app-wrapper">
                            <HighlightedProvider
                              value={{ highlighted, setHighlighted }}
                            >
                              <main className="app-main">
                                <AppCore shortYear={shortYear} />
                              </main>
                              <TrayProvider value={{ showTray, setShowTray }}>
                                <Tray data={data} shortYear={shortYear} />
                              </TrayProvider>
                            </HighlightedProvider>
                          </div>
                          <Footer
                            handleYearChange={handleYearChange}
                            dataYears={dataYears}
                            shortYear={shortYear}
                          />
                          <Router>
                            <ParamsController />
                          </Router>
                        </DndProvider>
                      </React.Fragment>
                    {/*})}
                    {window.innerWidth < 841 && (
                      <React.Fragment>
                        <div class="app__top">
                          <Header
                            inputYear={inputYear}
                            shortYear={shortYear}
                            data={data}
                          />
                        </div>
                        <div className="app__middle">
                          <DndProvider
                            backend={TouchBackend}
                            opts={{ enableMouseEvents: true }}
                          >
                            <div className="app-wrapper">
                              <HighlightedProvider
                                value={{ highlighted, setHighlighted }}
                              >
                                <main className="app-main">
                                  <AppCore shortYear={shortYear} />
                                </main>
                              </HighlightedProvider>
                            </div>
                          </DndProvider>
                        </div>
                        <div class="app__bottom">
                          <DndProvider
                            backend={TouchBackend}
                            opts={{ enableMouseEvents: true }}
                          >
                            <Footer
                              handleYearChange={handleYearChange}
                              dataYears={dataYears}
                              shortYear={shortYear}
                            />
                            <Router>
                              <ParamsController />
                            </Router>
                          </DndProvider>
                        </div>
                      </React.Fragment>
                    )}*/}
                  </div>
                </div>
              </ReadyProvider>
            </AgencyLevelProvider>
          </SelectedProvider>
        </GraphProvider>
      </ActiveProvider>
    </HelpersProvider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
