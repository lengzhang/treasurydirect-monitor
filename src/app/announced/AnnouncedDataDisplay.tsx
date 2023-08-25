import { DATE_FORMAT, SECURITY_TYPES_TYPE } from "@/constancts";
import { FC } from "react";
import useAnnouncedDataDisplay from "./useAnnouncedDataDisplay";
import {
  DataGrid,
  GridColDef,
  GridTreeNodeWithRender,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Dayjs } from "dayjs";
import { Box, LinearProgress } from "@mui/material";

interface AnnouncedDataDisplayProps {
  securityType: SECURITY_TYPES_TYPE;
  days: number;
}

const dateValueGetter = (
  params: GridValueGetterParams<any, Dayjs, GridTreeNodeWithRender>
) => {
  return params.value?.format(DATE_FORMAT);
};

const priceValueGetter = (
  params: GridValueGetterParams<any, number, GridTreeNodeWithRender>
) => {
  if (!params.value) return null
  return "$" + params.value?.toFixed(2);
};

const rateValueGetter = (
  params: GridValueGetterParams<any, number, GridTreeNodeWithRender>
) => {
  if (!params.value) return null
  return params.value?.toFixed(2) + "%";
};

const columns: GridColDef[] = [
  { field: "cusip", headerName: "cusip", flex: 2, minWidth: 104 },
  {
    field: "securityType",
    headerName: "type",
    flex: 1,
    align: "left",
    minWidth: 104,
  },
  {
    field: "securityTerm",
    headerName: "term",
    flex: 1,
    align: "right",
    minWidth: 104,
    valueGetter: (params) => params.value.replace("-", " "),
  },
  {
    field: "auctionDate",
    headerName: "auction date",
    valueGetter: dateValueGetter,
    flex: 2,
    align: "center",
    minWidth: 152,
  },
  {
    field: "issueDate",
    headerName: "issue date",
    valueGetter: dateValueGetter,
    flex: 2,
    align: "center",
    minWidth: 136,
  },
  {
    field: "price",
    headerName: "price",
    valueGetter: priceValueGetter,
    flex: 1,
    align: "right",
    minWidth: 104,
  },
  {
    field: "rate",
    headerName: "rate",
    valueGetter: rateValueGetter,
    flex: 1,
    align: "right",
    minWidth: 104,
  },
];

const AnnouncedDataDisplay: FC<AnnouncedDataDisplayProps> = ({
  securityType,
  days,
}) => {
  const { isMount, isFetching, displayDataSet } = useAnnouncedDataDisplay(
    securityType,
    days
  );

  if (!isMount || isFetching)
    return (
      <Box>
        <LinearProgress />
        Loading data...
      </Box>
    );

  return (
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
  );
};

export default AnnouncedDataDisplay;
