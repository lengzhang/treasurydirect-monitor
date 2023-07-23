"use client";

import { SECURITY_TYPES, SECURITY_TYPES_TYPE } from "@/constancts";
import { getChartJSColor } from "@/utils";
import { ChartDataset } from "chart.js";
import { useCallback, useEffect, useState } from "react";

type TermsType = Record<
  string,
  Record<
    string,
    {
      averagePrice: number;
      averageRate: number;
      hidden: boolean;
      color: string;
      dates: Record<string, { price: number; rate: number }>;
    }
  >
>;

const abortFetchController = new AbortController();

const useRecentLineChart = () => {
  const [securityType, setSecurityType] = useState<SECURITY_TYPES_TYPE>(
    SECURITY_TYPES[0]
  );
  const [isPriceMode, setIsPriceMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [labels, setLabels] = useState<string[]>([]);
  const [terms, setTerms] = useState<TermsType>({});

  useEffect(() => {
    return () => {
      abortFetchController.abort();
    };
  }, []);

  const fetchData = async (type: SECURITY_TYPES_TYPE) => {
    const result = [];
    const url = new URL(`${location.href}api/securities/search`);
    url.searchParams.set("format", "json");
    url.searchParams.set("type", type.toString());
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
        if (resData.data?.length > 0) result.push(...resData.data);
        else hasNext = false;
      } else {
        console.log(res);
        hasNext = false;
      }
      pagenum++;
    }

    const { labels, terms } = result.reduce<{
      labels: string[];
      terms: TermsType;
    }>(
      (
        { labels, terms },
        { issueDate, securityTerm, pricePer100, averageMedianDiscountRate }
      ) => {
        const issueDateStr = issueDate.replace(/T.*/, "");
        if (!labels.includes(issueDateStr)) labels.push(issueDateStr);

        const price = parseFloat(pricePer100);
        if (isNaN(price)) return { labels, terms };

        const unit = securityTerm.split(/\b/)[2];
        const rate = parseFloat(averageMedianDiscountRate);

        if (!terms[unit]) terms[unit] = {};
        if (!terms[unit][securityTerm])
          terms[unit][securityTerm] = {
            hidden: false,
            color: "",
            dates: {},
            averagePrice: price,
            averageRate: rate,
          };
        if (!terms[unit][securityTerm].dates[issueDateStr])
          terms[unit][securityTerm].dates[issueDateStr] = { price, rate };
        terms[unit][securityTerm].dates[issueDateStr].price =
          (terms[unit][securityTerm].dates[issueDateStr].price + price) / 2;
        terms[unit][securityTerm].dates[issueDateStr].rate =
          (terms[unit][securityTerm].dates[issueDateStr].rate + rate) / 2;

        terms[unit][securityTerm].averagePrice =
          (terms[unit][securityTerm].averagePrice + price) / 2;
        terms[unit][securityTerm].averageRate =
          (terms[unit][securityTerm].averageRate + price) / 2;

        return { labels, terms };
      },
      { labels: [], terms: {} }
    );

    for (const unit of Object.keys(terms)) {
      const list = Object.keys(terms[unit]).sort(
        (a, b) => parseInt(a) - parseInt(b)
      );
      for (let i = 0; i < list.length; i++) {
        const term = list[i];
        terms[unit][term].color = getChartJSColor(i);
      }
    }

    setLabels(labels.reverse());
    setTerms(terms);
    setIsLoading(false);
  };

  useEffect(() => {
    if (securityType) {
      setIsLoading(true);
      fetchData(securityType);
    }
  }, [securityType]);

  const generateChartData = useCallback(() => {
    const mode = isPriceMode ? "price" : "rate";
    const datasets: ChartDataset<"line", (number | null)[]>[] = [];
    for (const unit of Object.keys(terms)) {
      for (const term of Object.keys(terms[unit]).sort(
        (a, b) => parseInt(a) - parseInt(b)
      )) {
        const dataset: ChartDataset<"line", (number | null)[]> = {
          label: term,
          data: labels.map((lb) => terms[unit][term].dates[lb]?.[mode] || null),
          borderColor: terms[unit][term].color,
          backgroundColor: terms[unit][term].color,
          hidden: terms[unit][term].hidden,
        };
        datasets.push(dataset);
      }
    }

    return { labels, datasets };
  }, [labels, terms, isPriceMode]);

  const handleSecurityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as SECURITY_TYPES_TYPE;
    if (value !== securityType) setSecurityType(value);
  };

  const onClickLegend = (legendUnit: string, legendTerm: string) => () => {
    setTerms((prevTerms) => {
      const newTerms = Object.assign({}, prevTerms);
      newTerms[legendUnit][legendTerm].hidden =
        !newTerms[legendUnit][legendTerm].hidden;
      return newTerms;
    });
  };

  const onTriggerAll = (legendUnit: string, isAllHide: boolean) => () => {
    setTerms((prevTerms) => {
      const newTerms = Object.assign({}, prevTerms);

      for (const term of Object.keys(terms[legendUnit])) {
        terms[legendUnit][term].hidden = !isAllHide;
      }

      return newTerms;
    });
  };

  const onSwitchDataMode = () => {
    setIsPriceMode((prev) => !prev);
  };

  return {
    type: securityType,
    isPriceMode,
    isLoading,
    data: generateChartData(),
    terms,
    handleSecurityTypeChange,
    onClickLegend,
    onTriggerAll,
    onSwitchDataMode,
  };
};

export default useRecentLineChart;