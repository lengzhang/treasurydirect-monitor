import { FC } from "react";
import useLineChart from "./useLineChart.";
import { Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import { LineChartInterface } from "./types";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import LegendsGroup from "./LegendsGroup";

ChartJS.register(
  CategoryScale,
  Colors,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart: FC<LineChartInterface> = ({ data, isPriceMode }) => {
  const { state, onClickLegend, onTriggerAllLegends } = useLineChart(
    data,
    isPriceMode
  );
  return (
    <>
      <Box>
        <Line
          data={{ labels: state.labels, datasets: state.datasets }}
          options={{ spanGaps: true, plugins: { legend: { display: false } } }}
        />
      </Box>
      <LegendsGroup
        terms={state.terms}
        onTriggerAllLegends={onTriggerAllLegends}
        onClickLegend={onClickLegend}
      />
    </>
  );
};

export default LineChart;
