import React from 'react'
const HelpersContext = React.createContext({
  showHelpers: true,
  setShowHelpers: () => {}
})
export const HelpersProvider = HelpersContext.Provider
export default HelpersContext