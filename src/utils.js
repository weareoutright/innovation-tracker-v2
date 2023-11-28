const utils = {
  toCurrency: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format,
  toMillions: function (val, digits = 2) {
    const groups = ["K", "M", "B"];
    if (val < 1000) {
      return "< $1k";
    } else {
      let group = 0;
      while (val > 999) {
        val = val / 1000;
        group++;
      }
      return this.toCurrency(val) + groups[group];
    }
  },
  toPercentage: (val, digits = 1) => {
    if (val * 100 < 0.1) {
      return "< .1%";
    } else {
      return (val * 100).toFixed(digits) + "%";
    }
  },
  getTruncatedWords: (str, length = 50) => {
    if (str.length > length) {
      let truncated = str.slice(0, length).split(/\s/gi);
      return truncated.slice(0, truncated.length - 1).join(" ") + " ...";
    }
    return str;
  },
};

export default utils;
