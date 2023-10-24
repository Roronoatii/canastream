import { IconButton, useTheme } from "@mui/material";
import DarkIcon from "@mui/icons-material/Brightness4";
import LightIcon from "@mui/icons-material/Brightness7";
import React from "react";

import { ThemeContext } from "../../../ThemeContext";

export const SwitchModeButton = () => {
  const theme = useTheme();
  const themeContext = React.useContext(ThemeContext);

  return (
    <IconButton
      sx={{ ml: 1 }}
      onClick={themeContext.toggleColorMode}
      color="inherit"
    >
      {theme.palette.mode === "dark" ? <LightIcon /> : <DarkIcon />}
    </IconButton>
  );
};
