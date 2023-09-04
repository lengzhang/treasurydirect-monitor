"use client";

import { SECURITY_TYPES_TYPE } from "@/constancts";
import useMount from "@/hooks/useMount";
import { getRandomColor } from "@/utils";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";

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

interface SecurityTermListItem {
  securityTerm: string;
  show: boolean;
  color: string;
}

const unitList = ["Day", "Week", "Month", "Year"];
const getSecurityTermList = (data: DisplayData[]) => {
  return data
    .reduce<string[]>((acc, { securityTerm }) => {
      if (!acc.includes(securityTerm)) acc.push(securityTerm);
      return acc;
    }, [])
    .sort((A, B) => {
      const a = A.split(/[\- ]/);
      const b = B.split(/[\- ]/);

      if (a[1] !== b[1]) {
        return unitList.indexOf(a[1]) - unitList.indexOf(b[1]);
      }
      if (a[0] !== b[0]) {
        return parseInt(a[0]) - parseInt(b[0]);
      }

      if (a[3] !== b[3]) {
        return unitList.indexOf(a[3]) - unitList.indexOf(b[3]);
      }
      if (a[2] !== b[2]) {
        return parseInt(a[2]) - parseInt(b[2]);
      }

      return A.localeCompare(B);
    });
};

const useAnnouncedDataDisplay = (
  securityType: SECURITY_TYPES_TYPE,
  days: number,
) => {
  const isMount = useMount();
  const [isFetching, setIsFetching] = useState(false);
  const [displayDataSet, setDisplayDataSet] = useState<DisplayData[]>([]);
  const [securityTermList, setSecurityTermList] = useState<
    SecurityTermListItem[]
  >([]);

  const fetchData = async () => {
    const data: Record<string, string>[] = [];

    const url = new URL(`${location.origin}/api/securities/announced`);
    url.searchParams.set("format", "json");
    url.searchParams.set("pagesize", "250");

    url.searchParams.set("type", securityType);
    url.searchParams.set("days", days.toString());

    const res = await fetch(url);
    if (res.status === 200) {
      const resData = await res.json();
      if (resData.data?.length > 0) data.push(...resData.data);
    } else {
      console.error(res);
    }

    const newDataSet = data.map(
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
          interestRate,
        },
        index,
      ) => {
        const price = parseFloat(pricePer100);
        const rate = parseFloat(interestRate || averageMedianDiscountRate);

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
      },
    );

    setDisplayDataSet(newDataSet);
    setSecurityTermList(
      getSecurityTermList(newDataSet).map((v) => ({
        securityTerm: v,
        show: true,
        color: getRandomColor({ lightness: 55 }),
      })),
    );
    setIsFetching(false);
  };

  useEffect(() => {
    if (isMount) {
      setIsFetching(true);
      fetchData();
    }
  }, [isMount, securityType, days]);

  const getDisplayDataSet = useCallback(() => {
    const termsShouldShow = securityTermList
      .filter((v) => v.show)
      .map((v) => v.securityTerm);
    return displayDataSet.filter((v) =>
      termsShouldShow.includes(v.securityTerm),
    );
  }, [displayDataSet, securityTermList]);

  const onSecurityTermClick = (index: number) => () => {
    console.log(index);
    setSecurityTermList((prevState) => {
      prevState[index].show = !prevState[index].show;
      return [...prevState];
    });
  };

  return {
    isMount,
    isFetching,
    displayDataSet: getDisplayDataSet(),
    securityTerms: securityTermList,
    onSecurityTermClick,
  };
};

export default useAnnouncedDataDisplay;
