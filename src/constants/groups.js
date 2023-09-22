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
    "transportation_sector",
    "transportation",
    "industry",
    "agriculture_sector",
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
  funding_source: [
    "energy_water",
    "transportation_fs",
    "agriculture_fs",
    "interior_environment",
    "iija",
    "ira",
  ],
};

export default groups;
