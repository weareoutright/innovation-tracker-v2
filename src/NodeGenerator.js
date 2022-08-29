const NodeGenerator = (data, primary, secondary=null, tertiary=null) => {

  const cols = {
    "agency": [
      "agency"
    ],
    "sector": [
      "power",  
      "transportation",  
      "industry",
      "agriculture", 
      "buildings"
    ]
  }

  const getNodes = (type) => {
    let nodes = [];
    let col = cols[type];
    if (type === 'agency') {
      nodes = [
        ...new Set(
          data.map(d => d[col] && d[col].length ? d[col].trim() : null)
        )
      ];
    } else {
      nodes = col;
    }
    return nodes.filter(n => n !== null);
  }

  const getLinks = (data,primary,secondary) => {
    let links = [];
    primary.forEach(p => {
      secondary.forEach(s => {
        let link = {
          source:graph.nodes.indexOf(p),
          target:graph.nodes.indexOf(s),
          value:0
        };
        if (link.source !== -1 && link.target !== -1) {
          data.forEach(datum => {
            if (datum.include === 'Y' && datum.fy === '2021' && datum.agency.trim() === p) {
              const value = parseInt(datum[s]);
              if (value) link.value += value;
            }
          })
          if (link.value) {
            links.push(link);
          }
        }
      })
    })

    return links;
  }

  let graph = {
    nodes: [],
    links: []
  };

  const primaryNodes = getNodes(primary);
  const secondaryNodes = getNodes(secondary);

  graph.nodes = primaryNodes.concat(secondaryNodes);
  graph.links = getLinks(data,primaryNodes,secondaryNodes);
  graph.nodes = graph.nodes.map(n => {
    return {'name':n};
  });

  return graph;
}

export default NodeGenerator;