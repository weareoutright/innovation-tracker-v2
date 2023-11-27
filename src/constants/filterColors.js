/* TODO for 11/22: 
  - adjust tracker to be aligned in the center (since budget chart has been removed)
  - check breakpoints (see PAIC breakpoints - take note of this and document the breakpoints somewhere - share with Gray)
  - Add logic to gray out filters being used OR create a button with a z-index of -1 under the filter and disable the button. This way, when the filter is dragged, the grayed out button is left behind
  - Another approach can be to programmatically gray out the filter in the footer and disable it from being dragged. Will have to find a way that allows the filter in the header well to not be stylistically altered
  - Color-code the headers in sidebar view
  - Update package.json: Remove NIRH info and add EDF info - check in with kevin about this
*/

export const filterColors = {
  stage: "#A1E214",
  sector: "#009933",
  solution: "#B76CD9",
  funding_type: "#33CCFF",
  funding_source: "#FFD83A",
  default: "#0033CC",
};
