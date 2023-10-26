import { Drawer, IconButton, Stack, useTheme } from "@mui/material";
import React, { useContext, useMemo } from "react";
import { useMobileThreshold } from "../../../hooks/useMobileThreshold";
import { NavigationContext } from "../../../views/Layout/NavigationContext";
import {
  NAVIGATIONBAR_WIDTH,
  NAVIGATIONBAR_WIDTH_MINIFIED,
  TOPBAR_HEIGHT,
} from "../../consts";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  const {
    mobileDrawerOpen,
    drawerSubState,
    handleDrawerSubStateToggle,
    handleMobileDrawerToggle,
  } = useContext(NavigationContext);
  const isMobile = useMobileThreshold();
  const drawerVariant = useMemo<"persistent" | "temporary">(() => {
    if (isMobile) {
      return "temporary";
    }
    return "persistent";
  }, [isMobile]);
  const theme = useTheme();

  return (
    <Drawer
      open={mobileDrawerOpen || !isMobile}
      variant={drawerVariant}
      onClose={handleMobileDrawerToggle}
      ModalProps={{
        keepMounted: isMobile,
      }}
      sx={{
        transition: (theme) =>
          theme.transitions.create(["width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        ...(drawerSubState === "normal" && {
          transition: theme.transitions.create(["width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
        width:
          drawerSubState === "normal" || isMobile
            ? NAVIGATIONBAR_WIDTH
            : NAVIGATIONBAR_WIDTH_MINIFIED,
        "& .MuiDrawer-paper": {
          transition: (theme) =>
            theme.transitions.create(["width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(drawerSubState === "normal" && {
            transition: theme.transitions.create(["width"], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          width:
            drawerSubState === "normal" || isMobile
              ? NAVIGATIONBAR_WIDTH
              : NAVIGATIONBAR_WIDTH_MINIFIED,
        },
      }}
    >
      <Stack
        direction={"row"}
        height={`${TOPBAR_HEIGHT}px`}
        padding={(theme) => theme.spacing(0, 1)}
        alignItems="center"
        justifyContent={
          drawerSubState === "normal" || isMobile ? "flex-end" : "center"
        }
      >
        {!isMobile && (
          <IconButton onClick={() => handleDrawerSubStateToggle()}>
            {drawerSubState === "normal" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        )}
        {isMobile && (
          <IconButton>
            <ChevronLeftIcon onClick={handleMobileDrawerToggle} />
          </IconButton>
        )}
      </Stack>
    </Drawer>
  );
};

export { NavigationBar };
