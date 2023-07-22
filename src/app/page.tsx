"use client";

import { Box } from "@mui/material";

import RecentLineChart from "@/components/RecentLineChart";

const Home = () => {
  return (
    <Box padding={2} paddingLeft={8} paddingRight={8}>
      <RecentLineChart />
    </Box>
  );
};

export default Home;
