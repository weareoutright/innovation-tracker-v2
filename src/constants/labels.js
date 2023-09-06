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
    power: "Power",
    transportation: "Transportation",
    industry: "Industry",
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
    appropriations: "Appropriations",
    bill: "Bill",
    tax_credit: "Tax Credit",
    loan: "Loan",
    funding_type: "Funding Type",
    funding_source: "Funding Source",
    annual_appropriations: "Annual Appropriations"
  },
  getLabel: function (label) {
    return this.labels[label] ? this.labels[label] : label;
  },
};

export default labels;
