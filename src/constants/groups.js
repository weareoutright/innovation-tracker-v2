const groups = [
  "agency",
  "sector",
  "solution",
  "stage",
  "funding_type",
  "funding_source",
];

/*
 * * mappedGroups must be exact matches to columns present in spreadsheet data, otherwise
 * * app will crash
 */

export const mappedGroups = {
  agency: ["agency"],
  sector: [
    "power",
    "transportation_sector",
    "industry",
    "agriculture_sector",
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
  funding_type: ["approps", "one_time", "tax_credit"],
  funding_source: [
    "fy21_omni",
    "fy22_omni",
    "fy23_omni",
    "iija",
    "ira",
  ],
};

export default groups;
