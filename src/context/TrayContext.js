import React from 'react'
const TrayContext = React.createContext({
  tray: false,
  setTray: () => {}
})
export const TrayProvider = TrayContext.Provider
export default TrayContext