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
import SignUpPage from "../Connection/SignUp";
import FirebaseUser from "../../models/FirebaseUser";
import { auth } from "../../database/firebase.config";
import Profile from "../Profile/Profile";
import SerieDetails from "../Details/SerieDetails";

const Layout = () => {
  const [user, setUser] = useState<null | FirebaseUser>(null);

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
        <BrowserRouter basename="/">
          <NavigationBar />
          <Stack sx={{ height: "100%", width: "100%" }}>
            <TopBar />
            <Box
              component="main"
              sx={{ minHeight: "0px", width: "100%", flex: 1, p: 1 }}
              overflow="auto"
            >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/series/:seriesId" element={<SerieDetails />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
            </Box>
          </Stack>
        </BrowserRouter>
      </NavigationContext.Provider>
    </Stack>
  );
};

export { Layout };
