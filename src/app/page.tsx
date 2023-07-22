"use client";

import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useState } from "react";
import useHome from "./useHome";

import RecentLineChart from "@/components/RecentLineChart";
import { SECURITY_TYPES, SECURITY_TYPES_TYPE } from "@/constancts";

const Home = () => {
  const {} = useHome();

  const [type, setType] = useState<SECURITY_TYPES_TYPE>(SECURITY_TYPES[0]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType((event.target as HTMLInputElement).value as SECURITY_TYPES_TYPE);
  };

  return (
    <Box padding={2} paddingLeft={8} paddingRight={8}>
      <FormControl>
        <FormLabel id="security-type-label">Security Type</FormLabel>
        <RadioGroup row name="security-type-group" value={type} onChange={handleChange}>
          {SECURITY_TYPES.map((type) => (
            <FormControlLabel
              key={type}
              value={type}
              control={<Radio />}
              label={type}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <RecentLineChart securityType={type} />
    </Box>
  );
};

export default Home;
