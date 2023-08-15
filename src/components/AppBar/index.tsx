"use client";
import {
  Box,
  ButtonBase,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Link from "next/link";

const AppBarButton = styled(ButtonBase)({
  borderBottom: "white",
  paddingBottom: 2,
});

const LINKS = [
  { href: "/", label: "Recent" },
  { href: "/announced", label: "Announced" },
];

const AppBar = () => {
  const pathname = location.pathname;
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
          <Box position={"absolute"}>
            <ButtonBase LinkComponent={Link} href="/">
              <Typography variant="h6" component={"div"}>
                TDM
              </Typography>
            </ButtonBase>
          </Box>
          <Stack
            spacing={2}
            direction={"row"}
            marginLeft={"auto"}
            marginRight={"auto"}
          >
            {LINKS.map(({ href, label }) => (
              <AppBarButton
                key={label}
                LinkComponent={Link}
                /*@ts-ignore*/
                href={href}
                style={{
                  borderStyle: pathname === href ? "solid" : "none",
                }}
              >
                {label}
              </AppBarButton>
            ))}
          </Stack>
        </Toolbar>
      </MuiAppBar>
    </ThemeProvider>
  );
};

export default AppBar;
