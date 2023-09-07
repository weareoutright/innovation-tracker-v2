import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react"

import ActiveContext from './context/ActiveContext'
import SelectedContext from './context/SelectedContext'
import HelpersContext from './context/HelpersContext'
import AgencyLevelContext from './context/AgencyLevelContext'

const ParamsController = () => {

  const {active, setActive} = useContext(ActiveContext);
  const {selected, setSelected} = useContext(SelectedContext);
  const {agencyLevel, setAgencyLevel} = useContext(AgencyLevelContext);
  const {showHelpers, setShowHelpers} = useContext(HelpersContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [init,setInit] = useState(true);

  const compareEquals = (array1,array2) => array1.length === array2.length && array1.every((value, index) => value === array2[index]);

  const paramsExtract = (param) => {
    let searchParam = searchParams.getAll(param);
    if (param === 'active' || param === 'selected') {
      let paramsArray = [null,null];
      if (searchParam) {
        searchParam.forEach((p,i) => {
          paramsArray[i] = p === "null" ? null : p;
        })
      }
      return paramsArray;
    } else if (param === 'agencyLevel') {
      return isNaN(parseInt(searchParam)) ? 0 : parseInt(searchParam);
    }
    return null;
  }

  const syncParamsToApp = (activeParam,selectedParam,agencyLevelParam) => {
    if (selectedParam && !compareEquals(selected,selectedParam)) setSelected(selectedParam);
    if (activeParam && !compareEquals(active,activeParam)) setActive(activeParam);
    if (agencyLevelParam !== null && agencyLevel !== agencyLevelParam) setAgencyLevel(agencyLevelParam);

    if ((searchParams.getAll('selected').length || searchParams.getAll('active').length) && showHelpers) setShowHelpers(false); 
  }

  const syncAppToParams = (activeParam,selectedParam,agencyLevelParam) => {
    let needsSync = false;
    let params = {};
    params.selected = selected.map(s => s === null ? "null" : s);
    params.active = active.map(a => a === null ? "null" : a);
    params.agencyLevel = agencyLevel;
    if (!compareEquals(selected,selectedParam) || !compareEquals(active,activeParam ) || agencyLevel !== agencyLevelParam) needsSync = true;
    if (needsSync) setSearchParams(params);
  }

  useEffect(() => {
    if (init) {
      syncParamsToApp(paramsExtract('active'),paramsExtract('selected'),paramsExtract('agencyLevel'));
      setInit(false);
    } else {
      syncAppToParams(paramsExtract('active'),paramsExtract('selected'),paramsExtract('agencyLevel'));
    }
  })
  
  return null;
}

export default ParamsController;