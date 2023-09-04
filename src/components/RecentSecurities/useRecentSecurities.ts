"use client";

import { SECURITY_TYPES, SECURITY_TYPES_TYPE } from "@/constancts";
import useMount from "@/hooks/useMount";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useReducer } from "react";

interface State {
  initialized: boolean;
  securityType: SECURITY_TYPES_TYPE;
  displayMode: "price" | "rate";
  sinceFrom: Dayjs;
}

type Action =
  | { type: "init"; value: State }
  | { type: "set-security-type"; value: SECURITY_TYPES_TYPE }
  | { type: "set-display-mode"; value: "price" | "rate" }
  | { type: "set-since-from"; value: Dayjs };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "init":
      return { ...action.value, initialized: true };
    case "set-security-type":
      return { ...state, securityType: action.value };
    case "set-display-mode":
      return { ...state, displayMode: action.value };
    case "set-since-from":
      return { ...state, sinceFrom: action.value };
    default:
      return state;
  }
};

const initialState: State = {
  initialized: false,
  securityType: SECURITY_TYPES[0],
  displayMode: "price",
  sinceFrom: dayjs().subtract(1, "year"),
};

const fromLocalStorage = (ls?: Storage) => {
  if (!ls) return initialState;
  const obj = JSON.parse(ls.getItem("recent-page") || "{}");
  const state: State = initialState;
  if (obj.securityType && SECURITY_TYPES.includes(obj.securityType)) {
    state.securityType = obj.securityType;
  }
  if (
    obj.displayMode &&
    (obj.displayMode === "price" || obj.displayMode === "rate")
  ) {
    state.displayMode = obj.displayMode;
  }
  if (obj.sinceFrom) {
    const date = dayjs(obj.sinceFrom);
    if (date.isValid()) state.sinceFrom = date;
  }
  return state;
};

const toLocalStorage = (state: State, ls?: Storage) => {
  if (!ls) return;
  const obj = {
    securityType: state.securityType,
    displayMode: state.displayMode,
    sinceFrom: state.sinceFrom.toISOString(),
  };
  ls.setItem("recent-page", JSON.stringify(obj));
};

const useRecentSecurities = () => {
  const isMount = useMount();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (isMount) {
      dispatch({ type: "init", value: fromLocalStorage(localStorage) });
    }
  }, [isMount]);

  useEffect(() => {
    if (isMount && state.initialized) {
      toLocalStorage(state, localStorage);
    }
  }, [
    isMount,
    state.initialized,
    state.securityType,
    state.displayMode,
    state.sinceFrom,
  ]);

  const onChangeSecurityType = (
    event: React.MouseEvent<HTMLElement>,
    value: SECURITY_TYPES_TYPE,
  ) => {
    dispatch({ type: "set-security-type", value: value });
  };

  const onChangeDisplayMode = (
    event: React.MouseEvent<HTMLElement>,
    value: "price" | "rate",
  ) => {
    dispatch({ type: "set-display-mode", value: value });
  };

  const onChangeSinceFrom = (value: Dayjs | null) => {
    if (!value) return;
    dispatch({ type: "set-since-from", value });
  };

  return {
    isMount,
    state,
    onChangeSecurityType,
    onChangeDisplayMode,
    onChangeSinceFrom,
  };
};

export default useRecentSecurities;
