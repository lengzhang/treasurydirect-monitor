"use client";

import { Box, LinearProgress, Typography } from "@mui/material";

import ControlSection from "@/components/Home/ControlSection";

import useHome from "./useHome";
import LineChart from "@/components/Home/LineChart";

const Home = () => {
  const { state, onSelectSecurityType, onSwitchDisplayMode } = useHome();

  return (
    <Box paddingTop={2} paddingBottom={2}>
      <Typography variant="h5">Securities in recent year</Typography>
      <ControlSection
        type={state.securityType}
        isPriceDisplayMode={state.displayMode}
        onSelectSecurityType={onSelectSecurityType}
        onSwitchDisplayMode={onSwitchDisplayMode}
      />
      {state.isFetching ? (
        <Box marginTop={2}>
          <LinearProgress /> Loading data...
        </Box>
      ) : (
        <LineChart data={state.data} isPriceMode={state.displayMode} />
      )}
    </Box>
  );
};

export default Home;
