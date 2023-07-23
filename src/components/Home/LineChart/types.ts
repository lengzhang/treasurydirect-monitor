import { ChartDataset } from "chart.js";

export interface TermType {
  averagePrice: number;
  averageRate: number;
  hidden: boolean;
  color: string;
  dates: Record<string, { price: number; rate: number }>;
}
export type TermsType = Record<string, Record<string, TermType>>;

export type DatasetType = ChartDataset<"line", (number | null)[]>;

export interface State {
  labels: string[];
  terms: TermsType;
  datasets: DatasetType[];
}

export type Action =
  | {
      type: "set-labels";
      labels: string[];
    }
  | {
      type: "set-terms";
      terms: TermsType;
    }
  | {
      type: "set-datasets";
      datasets: DatasetType[];
    };

export interface LineChartInterface {
  data: Record<string, string>[];
  isPriceMode: boolean;
}
