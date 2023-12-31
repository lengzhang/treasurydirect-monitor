import { Box, Container } from "@mui/material";
import type { Metadata } from "next";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import AppBar from "@/components/AppBar";

export const metadata: Metadata = {
  title: "TD Monitor by LengZ",
  description: "An app to track TD securities from public APIs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AppBar />
        <Container maxWidth="lg">
          <Box paddingTop={2} paddingBottom={2}>
            {children}
          </Box>
        </Container>
      </body>
    </html>
  );
}
