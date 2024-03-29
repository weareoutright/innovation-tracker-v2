const labels = {
  labels: {
    agency: "Agency",
    stage: "Innovation Stage",
    solution: "Solution",
    sector: "Sector",
    category: "Innovation Category",
    DOT: "DOT",
    DOE: "DOE",
    USDA: "USDA",
    DOI: "DOI (IRA/IIJA only)",
    Interior: "DOI (IRA/IIJA only)",
    EPA: "EPA (IRA/IIJA only)",
    Treasury: "Treasury",
    power: "Power",
    transportation_sector: "Transportation",
    transportation: "Transportation",
    industry: "Industry",
    agriculture_sector: "Agriculture",
    agriculture: "Agriculture",
    buildings: "Buildings",
    forestry: "Forestry",
    efficiency: "Efficiency",
    clean_electricity: "Clean Electricity",
    electrification: "Electrification",
    fuels: "Low-Carbon Fuels",
    carbon_management: "Carbon Management",
    non_co2: "Non-CO2 Reductions",
    land_sink: "Land Sink",
    other: "Other",
    rd: "R&D",
    piloting: "Piloting & Demos",
    deployment: "Deployment",
    fy21_omni: "FY21 Omnibus",
    fy22_omni: "FY22 Omnibus",
    fy23_omni: "FY23 Omnibus",
    iija: "IIJA",
    ira: "IRA",
    approps: "Annual Appropriations",
    one_time: "One-Time Appropriations",
    tax_credit: "Tax Credits",
    funding_type: "Funding Type",
    funding_source: "Funding Source",
    annual_appropriations: "Annual Appropriations",
  },
  getLabel: function (label) {
    return this.labels[label] ? this.labels[label] : label;
  },
};

export default labels;
