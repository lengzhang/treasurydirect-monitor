"use client";

import Typography from "@mui/material/Typography";
import useAnnounced from "./useAnnounced";
import AnnouncedControlSection from "./AnnouncedControlSection";
import AnnouncedDataDisplay from "./AnnouncedDataDisplay";

const Announced = () => {
  const { state, onChangeSecurityType, onChangeDays } = useAnnounced();

  return (
    <>
      <Typography variant="h5">Announced securities</Typography>
      <AnnouncedControlSection
        securityType={state.securityType}
        days={state.days}
        onChangeSecurityType={onChangeSecurityType}
        onChangeDays={onChangeDays}
      />
      <AnnouncedDataDisplay
        securityType={state.securityType}
        days={state.days}
      />
    </>
  );
};

export default Announced;
