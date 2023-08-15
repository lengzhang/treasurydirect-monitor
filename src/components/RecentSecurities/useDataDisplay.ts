"use client";

import { DATE_FORMAT, SECURITY_TYPES_TYPE } from "@/constancts";
import useMount from "@/hooks/useMount";
import dayjs from "dayjs";
import { useEffect, useReducer } from "react";

interface State {
  isFetching: boolean;
  data: Record<string, string>[];
}

type Action =
  | { type: "fetching" | "fetched" }
  | {
      type: "set-data";
      value: Record<string, string>[];
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "fetching":
      return { ...state, isFetching: true };
    case "fetched":
      return { ...state, isFetching: false };
    case "set-data":
      return { ...state, data: action.value };
    default:
      return state;
  }
};

const initialState: State = {
  isFetching: false,
  data: [],
};

const useDataDisplay = (
  securityType: SECURITY_TYPES_TYPE,
  startDate: string
) => {
  const isMount = useMount();
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = async () => {
    const data: Record<string, string>[] = [];

    const url = new URL(`${location.href}api/securities/search`);
    url.searchParams.set("format", "json");
    url.searchParams.set("type", securityType);
    url.searchParams.set("dateFieldName", "issueDate");

    const endDate = dayjs().format(DATE_FORMAT);

    url.searchParams.set("endDate", endDate);
    url.searchParams.set("startDate", startDate);
    url.searchParams.set("pagesize", "250");

    let pagenum = 0,
      hasNext = true;
    while (hasNext) {
      url.searchParams.set("pagenum", pagenum.toString());
      const res = await fetch(url);
      if (res.status === 200) {
        const resData = await res.json();
        if (resData.data?.length > 0) data.push(...resData.data);
        else hasNext = false;
      } else {
        console.error(res);
        hasNext = false;
      }
      pagenum++;
    }

    dispatch({ type: "set-data", value: data });
    dispatch({ type: "fetched" });
  };

  useEffect(() => {
    if (isMount) {
      dispatch({ type: "fetching" });
      fetchData();
    }
  }, [isMount, securityType, startDate]);

  return { state };
};

export default useDataDisplay;
