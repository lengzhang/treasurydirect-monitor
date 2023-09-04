import {
  GridColDef,
  GridTreeNodeWithRender,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Dayjs } from "dayjs";

import { DATE_FORMAT } from "@/constancts";

const dateValueGetter = (
  params: GridValueGetterParams<any, Dayjs, GridTreeNodeWithRender>,
) => {
  return params.value?.format(DATE_FORMAT);
};

const priceValueGetter = (
  params: GridValueGetterParams<any, number, GridTreeNodeWithRender>,
) => {
  if (!params.value) return null;
  return "$" + params.value?.toFixed(2);
};

const rateValueGetter = (
  params: GridValueGetterParams<any, number, GridTreeNodeWithRender>,
) => {
  if (!params.value) return null;
  return params.value?.toFixed(2) + "%";
};

const useDataGridColumns = () => {
  const columns: GridColDef[] = [
    { field: "cusip", headerName: "cusip", flex: 2, minWidth: 104 },
    {
      field: "securityType",
      headerName: "type",
      flex: 1,
      align: "left",
      minWidth: 104,
      disableColumnMenu: true,
    },
    {
      field: "securityTerm",
      headerName: "term",
      flex: 1,
      align: "right",
      minWidth: 104,
      valueGetter: (params) => params.value.replaceAll("-", " "),
      filterable: false,
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

  return { columns };
};

export default useDataGridColumns;
