"use client";

import { SECURITY_TYPES_TYPE } from "@/constancts";
import useMount from "@/hooks/useMount";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

const abortFetchController = new AbortController();

interface DisplayData {
  id: string;
  cusip: string;
  securityType: string;
  securityTerm: string;
  auctionDate: Dayjs | null;
  issueDate: Dayjs | null;
  maturingDate: Dayjs | null;
  price: number | null;
  rate: number | null;
}

const useAnnouncedDataDisplay = (
  securityType: SECURITY_TYPES_TYPE,
  days: number
) => {
  const isMount = useMount();
  const [isFetching, setIsFetching] = useState(false);
  const [displayDataSet, setDisplayDataSet] = useState<DisplayData[]>([]);

  const fetchData = async () => {
    const data: Record<string, string>[] = [];

    const url = new URL(`${location.origin}/api/securities/announced`);
    url.searchParams.set("format", "json");
    url.searchParams.set("pagesize", "250");

    url.searchParams.set("type", securityType);
    url.searchParams.set("days", days.toString());

    const res = await fetch(url, { signal: abortFetchController.signal });
    if (res.status === 200) {
      const resData = await res.json();
      if (resData.data?.length > 0) data.push(...resData.data);
    } else {
      console.error(res);
    }

    setDisplayDataSet(
      data.map(
        (
          {
            cusip,
            securityType,
            securityTerm,
            auctionDate,
            issueDate,
            maturingDate,
            pricePer100,
            averageMedianDiscountRate,
          },
          index
        ) => {
          const price = parseFloat(pricePer100);
          const rate = parseFloat(averageMedianDiscountRate);

          return {
            id: `${index}-${cusip}`,
            cusip,
            securityType,
            securityTerm,
            auctionDate: dayjs(auctionDate),
            issueDate: dayjs(issueDate),
            maturingDate: dayjs(maturingDate),
            price: Number.isNaN(price) ? null : price,
            rate: Number.isNaN(rate) ? null : rate,
          };
        }
      )
    );
    setIsFetching(false);
  };

  useEffect(() => {
    return () => {
      abortFetchController.abort();
    };
  }, []);

  useEffect(() => {
    if (isMount) {
      setIsFetching(true);
      fetchData();
    }
  }, [isMount, securityType, days]);
  return { isMount, isFetching, displayDataSet };
};

export default useAnnouncedDataDisplay;
