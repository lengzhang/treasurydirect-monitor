"use client";

import { FC } from "react";
import { SECURITY_TYPES } from "@/constancts";
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
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  LinearProgress,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
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

const RecentLineChart: FC = () => {
  const {
    type,
    isPriceMode,
    isLoading,
    data,
    terms,
    handleSecurityTypeChange,
    onClickLegend,
    onTriggerAll,
    onSwitchDataMode,
  } = useRecentLineChart();

  return (
    <>
      <Typography variant="h5">Securities in recent year</Typography>
      <Stack direction={"row"} spacing={2} flexWrap={"wrap"}>
        <FormControl>
          <FormLabel id="security-type-label">Security Type</FormLabel>
          <RadioGroup
            row
            name="security-type-group"
            value={type}
            onChange={handleSecurityTypeChange}
          >
            {SECURITY_TYPES.map((type) => (
              <FormControlLabel
                key={type}
                value={type}
                control={<Radio />}
                label={type}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel id="data-mode-label">Data Mode</FormLabel>
          <Stack direction={"row"} flexWrap={"nowrap"} alignItems={"center"}>
            <Typography>Rate</Typography>
            <Switch checked={isPriceMode} onClick={onSwitchDataMode} />
            <Typography>Price</Typography>
          </Stack>
        </FormControl>
      </Stack>
      {isLoading ? (
        <Box marginTop={2}>
          <LinearProgress /> Loading data...
        </Box>
      ) : (
        <Box>
          <Line
            data={data}
            options={{
              spanGaps: true,
              plugins: { legend: { display: false } },
            }}
          />
          <Grid container spacing={1} marginTop={2} direction={"column"}>
            {Object.keys(terms)
              .sort((a, b) => a.localeCompare(b))
              .map((unit) => {
                const isAllHide =
                  Object.values(terms[unit]).findIndex(
                    (term) => !term.hidden
                  ) === -1;
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
                          const { averagePrice, color, hidden } =
                            terms[unit][term];
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
      )}
    </>
  );
};

export default RecentLineChart;
