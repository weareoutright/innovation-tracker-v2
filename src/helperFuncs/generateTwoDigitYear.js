export const generateTwoDigitYear = (yearString) => {
  return yearString.split("").slice(2).join("");
};
