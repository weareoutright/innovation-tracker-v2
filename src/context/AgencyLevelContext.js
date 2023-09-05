import React from 'react'
const AgencyLevelContext = React.createContext({
  agencyLevel: 0,
  setAgencyLevel: () => {}
})
export const AgencyLevelProvider = AgencyLevelContext.Provider
export default AgencyLevelContext