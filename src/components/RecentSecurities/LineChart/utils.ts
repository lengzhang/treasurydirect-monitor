import { getChartJSColor } from "@/utils";
import { DatasetType, TermsType } from "./types";

export const getLabelsAndTerms = (data: Record<string, string>[]) => {
  const { labels, terms } = data.reduce<{ labels: string[]; terms: TermsType }>(
    (
      { labels, terms },
      {
        issueDate,
        securityTerm,
        pricePer100,
        averageMedianDiscountRate,
        interestRate,
      },
    ) => {
      const issueDateStr = issueDate.replace(/T.*/, "");
      if (!labels.includes(issueDateStr)) labels.push(issueDateStr);

      const price = parseFloat(pricePer100);
      if (isNaN(price)) return { labels, terms };

      const unit = securityTerm.split(/\b/)[2];
      const rate = parseFloat(interestRate || averageMedianDiscountRate);

      if (!terms[unit]) terms[unit] = {};
      if (!terms[unit][securityTerm])
        terms[unit][securityTerm] = {
          hidden: false,
          color: "",
          dates: {},
        };
      if (!terms[unit][securityTerm].dates[issueDateStr])
        terms[unit][securityTerm].dates[issueDateStr] = { price, rate };
      terms[unit][securityTerm].dates[issueDateStr].price =
        (terms[unit][securityTerm].dates[issueDateStr].price + price) / 2;
      terms[unit][securityTerm].dates[issueDateStr].rate =
        (terms[unit][securityTerm].dates[issueDateStr].rate + rate) / 2;

      return { labels, terms };
    },
    { labels: [], terms: {} },
  );

  for (const unit of Object.keys(terms)) {
    const list = Object.keys(terms[unit]).sort(
      (a, b) => parseInt(a) - parseInt(b),
    );
    for (let i = 0; i < list.length; i++) {
      const term = list[i];
      terms[unit][term].color = getChartJSColor(i);
    }
  }

  return { labels: labels.reverse(), terms };
};

export const generateChartData =
  (mode: "price" | "rate") => (labels: string[], terms: TermsType) => {
    const datasets: DatasetType[] = [];
    for (const unit of Object.keys(terms)) {
      for (const term of Object.keys(terms[unit]).sort(
        (a, b) => parseInt(a) - parseInt(b),
      )) {
        const dataset: DatasetType = {
          label: term,
          data: labels.map((lb) => terms[unit][term].dates[lb]?.[mode] || null),
          borderColor: terms[unit][term].color,
          backgroundColor: terms[unit][term].color,
          hidden: terms[unit][term].hidden,
        };
        datasets.push(dataset);
      }
    }

    return datasets;
  };
