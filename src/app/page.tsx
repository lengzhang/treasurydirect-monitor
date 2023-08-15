"use client";

import { Box, LinearProgress, Typography } from "@mui/material";

import ControlSection from "@/components/Home/ControlSection";

import useHome from "./useHome";
import LineChart from "@/components/Home/LineChart";

const Home = () => {
  const {
    isMount,
    state,
    onSelectSecurityType,
    onSwitchDisplayMode,
    onChangeSinceFrom,
  } = useHome();

  if (!isMount)
    return (
      <Box marginTop={2}>
        <LinearProgress /> Loading...
      </Box>
    );

  return (
    <>
      <Typography variant="h5">Recent securities</Typography>
      <ControlSection
        type={state.securityType}
        isPriceDisplayMode={state.displayMode}
        sinceFrom={state.sinceFrom}
        onSelectSecurityType={onSelectSecurityType}
        onSwitchDisplayMode={onSwitchDisplayMode}
        onChangeSinceFrom={onChangeSinceFrom}
      />
      {state.isFetching ? (
        <Box marginTop={2}>
          <LinearProgress /> Loading data...
        </Box>
      ) : (
        <LineChart data={state.data} isPriceMode={state.displayMode} />
      )}
    </>
  );
};

export default Home;
