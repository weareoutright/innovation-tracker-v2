import React from 'react'
const HighlightedContext = React.createContext({
  highlighted: {links:[],nodes:[]},
  setHighlighted: () => {}
})
export const HighlightedProvider = HighlightedContext.Provider
export default HighlightedContext