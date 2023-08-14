"use client";
import {
  SECURITY_TYPES,
  SECURITY_TYPES_TYPE,
  QUERY_DATE_FORMAT,
} from "@/constancts";
import useMount from "@/hooks/useMount";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useReducer } from "react";

const abortFetchController = new AbortController();

interface State {
  isFetching: boolean;
  data: Record<string, string>[];
  securityType: SECURITY_TYPES_TYPE;
  displayMode: boolean;
  sinceFrom: Dayjs | null;
}

type Action =
  | {
      type: "fetching" | "fetched" | "switch-display-mode";
    }
  | {
      type: "set-data";
      data: Record<string, string>[];
    }
  | {
      type: "set-security-type";
      securityType: SECURITY_TYPES_TYPE;
    }
  | {
      type: "set-since-from";
      value: Dayjs;
    };

type LocalStorageState = Partial<
  Pick<State, "securityType" | "displayMode">
> & {
  sinceFrom?: string;
};

const initialState: State = {
  isFetching: true,
  data: [],
  securityType: SECURITY_TYPES[0],
  displayMode: true,
  sinceFrom: dayjs().subtract(1, "year"),
};

const toState = (obj: LocalStorageState) => {
  console.log(obj);
  const state = initialState;
  if (
    obj?.securityType &&
    SECURITY_TYPES.includes(obj.securityType as SECURITY_TYPES_TYPE)
  ) {
    state.securityType = obj.securityType as SECURITY_TYPES_TYPE;
  }
  if (obj?.displayMode === false) state.displayMode = false;
  if (obj?.sinceFrom) {
    const date = dayjs(obj.sinceFrom);
    if (date.isValid()) state.sinceFrom = date;
  }
  return state;
};

const fromState = (state: State): string => {
  const obj: LocalStorageState = {
    securityType: state.securityType,
    displayMode: state.displayMode,
    sinceFrom: state.sinceFrom?.toISOString(),
  };
  return JSON.stringify(obj);
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "fetching":
      return { ...state, isFetching: true };
    case "fetched":
      return { ...state, isFetching: false };
    case "set-data":
      return { ...state, data: action.data };
    case "set-security-type":
      return { ...state, securityType: action.securityType };
    case "switch-display-mode":
      return { ...state, displayMode: !state.displayMode };
    case "set-since-from":
      return { ...state, sinceFrom: action.value };
    default:
      return state;
  }
};

const useHome = () => {
  const isMount = useMount();
  const [state, dispatch] = useReducer(
    reducer,
    toState(
      JSON.parse(isMount ? localStorage.getItem("home-page") || "{}" : "{}")
    )
  );

  useEffect(() => {
    return () => {
      localStorage.setItem("home-page", fromState(state));
    };
  }, [state]);

  useEffect(() => {
    return () => {
      abortFetchController.abort();
    };
  }, []);

  const fetchData = async (
    type: SECURITY_TYPES_TYPE,
    sinceFrom: Dayjs | null
  ) => {
    if (sinceFrom === null) sinceFrom = dayjs().subtract(1, "year");
    const data: Record<string, string>[] = [];

    const url = new URL(`${location.href}api/securities/search`);
    url.searchParams.set("format", "json");
    url.searchParams.set("type", type);
    url.searchParams.set("dateFieldName", "issueDate");

    const endDate = dayjs().format(QUERY_DATE_FORMAT);
    const startDate = sinceFrom.format(QUERY_DATE_FORMAT);

    url.searchParams.set("endDate", endDate);
    url.searchParams.set("startDate", startDate);
    url.searchParams.set("pagesize", "250");

    let pagenum = 0,
      hasNext = true;
    while (hasNext) {
      url.searchParams.set("pagenum", pagenum.toString());
      const res = await fetch(url, { signal: abortFetchController.signal });
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

    dispatch({ type: "set-data", data });
    dispatch({ type: "fetched" });
  };

  useEffect(() => {
    if (isMount) {
      dispatch({ type: "fetching" });
      fetchData(state.securityType, state.sinceFrom);
    }
  }, [isMount, state.securityType, state.sinceFrom]);

  const onSelectSecurityType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as SECURITY_TYPES_TYPE;
    if (value !== state.securityType)
      dispatch({ type: "set-security-type", securityType: value });
  };

  const onSwitchDisplayMode = () => {
    dispatch({ type: "switch-display-mode" });
  };

  const onChangeSinceFrom = (value: Dayjs | null) => {
    if (value === null) return;
    dispatch({ type: "set-since-from", value });
  };

  return {
    isMount,
    state,
    onSelectSecurityType,
    onSwitchDisplayMode,
    onChangeSinceFrom,
  };
};

export default useHome;
