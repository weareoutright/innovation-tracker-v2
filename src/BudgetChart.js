import { getPieChart } from "./constants/budgetPieCharts";

const BudgetChart = ({ shortYear }) => {
  return <>{getPieChart(shortYear)}</>;
};

export default BudgetChart;
