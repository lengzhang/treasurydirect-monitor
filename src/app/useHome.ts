import { SECURITY_TYPES, SECURITY_TYPES_TYPE } from "@/constancts";
import { useEffect, useState, useReducer } from "react";

const abortFetchController = new AbortController();

interface State {
  isFetching: boolean;
  data: Record<string, string>[];
  securityType: SECURITY_TYPES_TYPE;
  displayMode: boolean;
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
  };

const initialState: State = {
  isFetching: true,
  data: [],
  securityType: SECURITY_TYPES[0],
  displayMode: true,
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
    default:
      return state;
  }
};

const useHome = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    return () => {
      abortFetchController.abort();
    };
  }, []);

  const fetchData = async (type: SECURITY_TYPES_TYPE) => {
    const data: Record<string, string>[] = [];

    const url = new URL(`${location.href}api/securities/search`);
    url.searchParams.set("format", "json");
    url.searchParams.set("type", type);
    url.searchParams.set("dateFieldName", "issueDate");

    const today = new Date();
    const year = today.getUTCFullYear();
    const month = (today.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = today.getUTCDate().toString().padStart(2, "0");
    const endDate = `${year}-${month}-${day}`;
    const startDate = `${year - 1}-${month}-${day}`;

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
        console.log(res);
        hasNext = false;
      }
      pagenum++;
    }

    dispatch({ type: "set-data", data });
    dispatch({ type: "fetched" });
  };

  useEffect(() => {
    dispatch({ type: "fetching" });
    fetchData(state.securityType);
    return () => {
      abortFetchController.abort();
    };
  }, [state.securityType]);

  const onSelectSecurityType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as SECURITY_TYPES_TYPE;
    if (value !== state.securityType) dispatch({ type: 'set-security-type', securityType: value })
  }

  const onSwitchDisplayMode = () => {
    dispatch({type: 'switch-display-mode'})
  }

  return {state, onSelectSecurityType, onSwitchDisplayMode};
};

export default useHome;
