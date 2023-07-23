"use client";
import {
  Box,
  Button,
  ButtonBase,
  Container,
  Divider,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Link from "next/link";

const AppBar = () => {
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: "dark",
          primary: {
            main: "#1976d2",
          },
        },
      })}
    >
      <MuiAppBar position="static">
        <Toolbar>
          <ButtonBase LinkComponent={Link} href="/">
            <Typography variant="h6" component={"div"}>
              TDM
            </Typography>
          </ButtonBase>
          <Stack
            spacing={2}
            direction={"row"}
            marginLeft={"auto"}
            marginRight={"auto"}
          >
            <ButtonBase LinkComponent={Link} href="/">
              Recent Year
            </ButtonBase>
            <ButtonBase LinkComponent={Link} href="/monitor">
              Monitor
            </ButtonBase>
          </Stack>
        </Toolbar>
      </MuiAppBar>
    </ThemeProvider>
  );
};

export default AppBar;
