"use client";

import { SECURITY_TYPES, SECURITY_TYPES_TYPE } from "@/constancts";
import useMount from "@/hooks/useMount";
import { useEffect, useReducer } from "react";

interface State {
  securityType: SECURITY_TYPES_TYPE;
  days: number;
}

type Action =
  | {
      type: "set-security-type";
      value: SECURITY_TYPES_TYPE;
    }
  | { type: "set-days"; value: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-security-type":
      return { ...state, securityType: action.value };
    case "set-days":
      return { ...state, days: action.value };
    default:
      return state;
  }
};

const initialState: State = {
  securityType: SECURITY_TYPES[0],
  days: 0,
};

const fromLocalStorage = (ls?: Storage) => {
  if (!ls) return initialState;
  const obj = JSON.parse(ls.getItem("announce-page") || "{}");
  const state: State = initialState;
  if (obj.securityType && SECURITY_TYPES.includes(obj.securityType)) {
    state.securityType = obj.securityType;
  }
  if (obj.days) state.days = obj.days;
  return state;
};

const useAnnounced = () => {
  const isMount = useMount();
  const [state, dispatch] = useReducer(
    reducer,
    fromLocalStorage(isMount ? localStorage : undefined)
  );

  useEffect(() => {
    if (isMount) localStorage.setItem("announce-page", JSON.stringify(state));
  }, [isMount, state.securityType, state.days]);

  const onChangeSecurityType = (
    event: React.MouseEvent<HTMLElement>,
    value: SECURITY_TYPES_TYPE
  ) => {
    dispatch({ type: "set-security-type", value });
  };

  const onChangeDays = (
    event: React.MouseEvent<HTMLElement>,
    value: number
  ) => {
    dispatch({ type: "set-days", value });
  };

  return { state, onChangeSecurityType, onChangeDays };
};

export default useAnnounced;
