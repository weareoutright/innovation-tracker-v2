import React from 'react'
const ReadyContext = React.createContext({
  Ready: [true,true],
  setReady: () => {}
})
export const ReadyProvider = ReadyContext.Provider
export default ReadyContext