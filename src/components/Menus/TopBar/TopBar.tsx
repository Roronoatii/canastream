import React, { useContext } from "react";
import { SwitchModeButton } from "../../molecules/atoms/ThemeSwitchButton";
import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useMobileThreshold } from "../../../hooks/useMobileThreshold";
import { NavigationContext } from "../../../views/Layout/NavigationContext";
import FrontEditorDrawer from "../FrontEditor/FrontEditorDrawer";

const TopBar = () => {
  const theme = useTheme();
  const { drawerSubState, handleMobileDrawerToggle } =
    useContext(NavigationContext);

  const isMobile = useMobileThreshold();

  return (
    <AppBar
      position="relative"
      elevation={0}
      sx={{
        px: 1,
        transition: (theme) =>
          theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        ...(drawerSubState === "normal" && {
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
      }}
    >
      <Toolbar disableGutters>
        <Stack
          width={"100%"}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleMobileDrawerToggle}
              edge="start"
              sx={{
                mx: 1,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6">Exo React</Typography>
        </Stack>
        <SwitchModeButton />
        <FrontEditorDrawer />
      </Toolbar>
    </AppBar>
  );
};

export { TopBar };
