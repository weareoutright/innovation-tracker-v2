const groups = [
  "agency",
  "sector",
  "solution",
  "stage",
  "funding_type",
  "funding_source",
];

export const mappedGroups = {
  agency: ["agency"],
  sector: [
    "power",
    "transportation",
    "industry",
    "agriculture",
    "buildings",
    "forestry",
  ],
  solution: [
    "efficiency",
    "clean_electricity",
    "electrification",
    "fuels",
    "carbon_management",
    "non_co2",
    "land_sink",
    "other",
  ],
  stage: ["rd", "piloting", "deployment"],
  funding_type: ["approps", "one_time"],
  funding_source: ["energy_water", "transportation", "agriculture", "interior_environment", "iija", "ira"],
};

export default groups;
