import React from 'react'
const ActiveContext = React.createContext({
  active: [null,null],
  setActive: () => {}
})
export const ActiveProvider = ActiveContext.Provider
export default ActiveContext