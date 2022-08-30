import React from 'react'
const GraphContext = React.createContext({
  graph: {},
  setGraph: () => {}
})
export const GraphProvider = GraphContext.Provider
export default GraphContext