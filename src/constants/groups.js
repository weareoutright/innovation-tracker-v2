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
  funding_type: ["appropriations", "bill", "tax_credit", "loan"],
  funding_source: ["annual_appropriations", "IRA", "IIJA"],
};

export default groups;
