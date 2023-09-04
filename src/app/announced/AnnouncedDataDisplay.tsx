import { FC } from "react";
import {
  Box,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { SECURITY_TYPES_TYPE } from "@/constancts";
import useAnnouncedDataDisplay from "./useAnnouncedDataDisplay";
import useDataGridColumns from "./useDataGridColumns";

interface AnnouncedDataDisplayProps {
  securityType: SECURITY_TYPES_TYPE;
  days: number;
}

const AnnouncedDataDisplay: FC<AnnouncedDataDisplayProps> = ({
  securityType,
  days,
}) => {
  const {
    isMount,
    isFetching,
    displayDataSet,
    securityTerms,
    onSecurityTermClick,
  } = useAnnouncedDataDisplay(securityType, days);
  const { columns } = useDataGridColumns();

  if (!isMount || isFetching)
    return (
      <Box>
        <LinearProgress />
        Loading data...
      </Box>
    );

  return (
    <>
      <Grid container spacing={1} direction="row" marginBottom={1}>
        <Grid item>
          <Typography variant="subtitle2">Security terms: </Typography>
        </Grid>
        {securityTerms.map(({ securityTerm, show, color }, index) => (
          <Grid item key={securityTerm} onClick={onSecurityTermClick(index)}>
            <Chip
              style={{ color, cursor: "default" }}
              label={securityTerm}
              size="small"
              variant="outlined"
              disabled={!show}
            />
          </Grid>
        ))}
      </Grid>
      <DataGrid
        columns={columns}
        rows={displayDataSet}
        autoHeight
        pageSizeOptions={[5, 25, 50, 100]}
        density="compact"
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
      />
    </>
  );
};

export default AnnouncedDataDisplay;
