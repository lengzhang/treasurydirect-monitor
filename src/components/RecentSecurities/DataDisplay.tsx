import { DATE_FORMAT, SECURITY_TYPES_TYPE } from "@/constancts";
import { Dayjs } from "dayjs";
import { FC, memo } from "react";
import useDataDisplay from "./useDataDisplay";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import LineChart from "./LineChart";

interface DataDisplayProps {
  securityType: SECURITY_TYPES_TYPE;
  displayMode: "price" | "rate";
  sinceFrom: Dayjs;
}

const DataDisplay: FC<DataDisplayProps> = ({
  securityType,
  displayMode,
  sinceFrom,
}) => {
  const { state } = useDataDisplay(securityType, sinceFrom.format(DATE_FORMAT));

  return state.isFetching ? (
    <Box marginTop={2}>
      <LinearProgress /> Loading data...
    </Box>
  ) : (
    <LineChart data={state.data} isPriceMode={displayMode === "price"} />
  );
};

export default memo(DataDisplay);
