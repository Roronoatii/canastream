import React from "react";

interface ThemeContextSchema {
  toggleColorMode: () => void;
}

export const ThemeContext = React.createContext<ThemeContextSchema>(
  {} as ThemeContextSchema
);
