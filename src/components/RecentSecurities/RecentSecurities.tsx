"use client";

import { Box, LinearProgress, Typography } from "@mui/material";
import ControlSection from "./ControlSection";
import useRecentSecurities from "./useRecentSecurities";
import DataDisplay from "./DataDisplay";

const RecentSecurities = () => {
  const {
    isMount,
    state,
    onChangeSecurityType,
    onChangeDisplayMode,
    onChangeSinceFrom,
  } = useRecentSecurities();

  return (
    <>
      <Typography variant="h5">Recent securities</Typography>
      {!isMount || !state.initialized ? (
        <Box marginTop={2}>
          <LinearProgress /> Loading...
        </Box>
      ) : (
        <>
          <ControlSection
            securityType={state.securityType}
            displayMode={state.displayMode}
            sinceFrom={state.sinceFrom}
            onChangeSecurityType={onChangeSecurityType}
            onChangeDisplayMode={onChangeDisplayMode}
            onChangeSinceFrom={onChangeSinceFrom}
          />
          <DataDisplay
            securityType={state.securityType}
            displayMode={state.displayMode}
            sinceFrom={state.sinceFrom}
          />
        </>
      )}
    </>
  );
};

export default RecentSecurities;
