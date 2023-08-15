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
  return params.value?.toFixed(4);
};

const rateValueGetter = (
  params: GridValueGetterParams<any, number, GridTreeNodeWithRender>
) => {
  return params.value?.toFixed(4) + "%";
};

const columns: GridColDef[] = [
  { field: "cusip", headerName: "cusip", flex: 2 },
  { field: "securityType", headerName: "type", flex: 1, align: "left" },
  { field: "securityTerm", headerName: "term", flex: 1, align: "right" },
  {
    field: "auctionDate",
    headerName: "auction date",
    valueGetter: dateValueGetter,
    flex: 2,
    align: "center",
  },
  {
    field: "issueDate",
    headerName: "issue date",
    valueGetter: dateValueGetter,
    flex: 2,
    align: "center",
  },
  {
    field: "maturingDate",
    headerName: "maturing date",
    valueGetter: dateValueGetter,
    flex: 2,
    align: "center",
  },
  {
    field: "price",
    headerName: "price",
    valueGetter: priceValueGetter,
    flex: 1,
    align: "right",
  },
  {
    field: "rate",
    headerName: "rate",
    valueGetter: rateValueGetter,
    flex: 1,
    align: "right",
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
      loading={!isMount || isFetching}
    />
  );
};

export default AnnouncedDataDisplay;
