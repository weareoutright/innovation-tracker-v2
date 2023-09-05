import React from 'react'
const SelectedContext = React.createContext({
  selected: [null,null],
  setSelected: () => {}
})
export const SelectedProvider = SelectedContext.Provider
export default SelectedContext