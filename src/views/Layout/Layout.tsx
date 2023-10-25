import React, { useEffect, useState } from "react";
import { NavigationBar, TopBar } from "../../components/Menus/index";
import { Box, Stack } from "@mui/material";
import {
  NavigationContext,
  defaultNavigationContext,
} from "./NavigationContext";
import Home from "../Home/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../Connection/Login";

const Layout = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(
    defaultNavigationContext.mobileDrawerOpen
  );
  const [drawerSubState, setDrawerSubState] = useState<"normal" | "minified">(
    localStorage.getItem("drawerSubState")
      ? JSON.parse(localStorage.getItem("drawerSubState") || "{}")
      : defaultNavigationContext.drawerSubState
  );

  useEffect(() => {
    localStorage.setItem("drawerSubState", JSON.stringify(drawerSubState));
  }, [drawerSubState]);

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleDrawerSubStateToggle = () => {
    if (drawerSubState === "normal") {
      setDrawerSubState("minified");
    } else {
      setDrawerSubState("normal");
    }
  };
  return (
    <Stack direction="row">
      <NavigationContext.Provider
        value={{
          mobileDrawerOpen,
          drawerSubState,
          handleMobileDrawerToggle,
          handleDrawerSubStateToggle,
        }}
      >
        <NavigationBar />
        <Stack sx={{ height: "100%", width: "100%" }}>
          <TopBar />
          <Box
            component="main"
            sx={{ minHeight: "0px", width: "100%", flex: 1, p: 1 }}
            overflow="auto"
          >
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </BrowserRouter>
          </Box>
        </Stack>
      </NavigationContext.Provider>
    </Stack>
  );
};

export { Layout };
