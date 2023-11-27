/* TODO for 11/22: 
  - replace brand colors in this file
  - replace brand colors in scss files
  - adjust tracker to be aligned in the center (since budget chart has been removed)
  - check breakpoints (see PAIC breakpoints - take note of this and document the breakpoints somewhere - share with Gray)
  - Add logic to gray out filters being used OR create a button with a z-index of -1 under the filter and disable the button. This way, when the filter is dragged, the grayed out button is left behind
  - Another approach can be to programmatically gray out the filter in the footer and disable it from being dragged. Will have to find a way that allows the filter in the header well to not be stylistically altered
  - Color-code the headers in sidebar view
  - Update package.json: Remove NIRH info and add EDF info - check in with kevin about this
*/

export const filterColors = {
  stage: "#029EDA",
  sector: "#8BD2C1",
  solution: "#EBB700",
  funding_type: "#C8DA2C",
  funding_source: "#9C5FB5",
  default: "#1D5C42",
};
