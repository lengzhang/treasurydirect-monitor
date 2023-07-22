"use client";

import { FC } from "react";
import { SECURITY_TYPES_TYPE } from "@/constancts";
import useRecentLineChart from "./useRecentLineChart";

import { Line } from "react-chartjs-2";

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
import {
  Box,
  Chip,
  FormControlLabel,
  FormLabel,
  Grid,
  LinearProgress,
  Switch,
} from "@mui/material";

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

const RecentLineChart: FC<{ securityType: SECURITY_TYPES_TYPE }> = ({
  securityType,
}) => {
  const { isLoading, data, terms, onClickLegend, onTriggerAll } =
    useRecentLineChart(securityType);

  return isLoading ? (
    <Box marginTop={2}>
      <LinearProgress /> Loading data...
    </Box>
  ) : (
    <Box>
      <Line
        data={data}
        options={{ spanGaps: true, plugins: { legend: { display: false } } }}
      />
      <Grid container spacing={1} marginTop={2} direction={"column"}>
        {Object.keys(terms)
          .sort((a, b) => a.localeCompare(b))
          .map((unit) => {
            const isAllHide =
              Object.values(terms[unit]).findIndex((term) => !term.hidden) ===
              -1;
            return (
              <Grid key={unit} item>
                <FormControlLabel
                  checked={!isAllHide}
                  control={<Switch size="small" />}
                  label={<FormLabel>{unit}</FormLabel>}
                  labelPlacement="start"
                  style={{ marginLeft: 0 }}
                  onClick={onTriggerAll(unit, isAllHide)}
                />
                <Grid container spacing={2} paddingTop={1}>
                  {Object.keys(terms[unit])
                    .sort((a, b) => parseInt(a) - parseInt(b))
                    .map((term) => {
                      const { averagePrice, color, hidden } = terms[unit][term];
                      return (
                        <Grid key={term} item>
                          <Chip
                            style={{ color: hidden ? "gray" : color }}
                            label={term + ": $" + averagePrice.toFixed(2)}
                            size="small"
                            variant="outlined"
                            onClick={onClickLegend(unit, term)}
                          />
                        </Grid>
                      );
                    })}
                </Grid>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
};

export default RecentLineChart;
