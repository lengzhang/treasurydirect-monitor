import { useCallback, useEffect, useReducer } from "react";
import { Action, State } from "./types";
import { generateChartData, getLabelsAndTerms } from "./utils";

const initialState: State = {
  labels: [],
  terms: {},
  datasets: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-labels":
      return { ...state, labels: action.labels };
    case "set-terms":
      return { ...state, terms: action.terms };
    case "set-datasets":
      return { ...state, datasets: action.datasets };
    default:
      return state;
  }
};

const useLineChart = (data: Record<string, string>[], isPriceMode: boolean) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const { labels, terms } = getLabelsAndTerms(data);
    dispatch({ type: "set-labels", labels });
    dispatch({ type: "set-terms", terms });
  }, [data]);

  useEffect(() => {
    const datasets = generateChartData(isPriceMode ? "price" : "rate")(
      state.labels,
      state.terms
    );
    dispatch({ type: "set-datasets", datasets });
  }, [isPriceMode, state.labels, state.terms]);

  const onClickLegend = useCallback(
    (unit: string, term: string) => () => {
      const terms = Object.assign({}, state.terms);
      terms[unit][term].hidden = !terms[unit][term].hidden;
      dispatch({ type: "set-terms", terms });
    },
    [state.terms]
  );

  const onTriggerAllLegends = useCallback(
    (unit: string, isAllHide: boolean) => () => {
      const terms = Object.assign({}, state.terms);

      for (const term of Object.keys(terms[unit])) {
        terms[unit][term].hidden = !isAllHide;
      }

      dispatch({ type: "set-terms", terms });
    },
    [state.terms]
  );

  return { state, onClickLegend, onTriggerAllLegends };
};

export default useLineChart;
