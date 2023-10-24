import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React, { useState } from "react";

const CookieClickerButton: React.FC = () => {
  const [cookies, setCookies] = useState(0);

  const handleClick = () => {
    setCookies(cookies + 1);
  };

  return (
    <Stack direction="column" alignItems="center" justifyContent="center">
      <Button variant="outlined" onClick={handleClick}>
        Cliquez
      </Button>
      <p>{cookies}</p>
    </Stack>
  );
};

export default CookieClickerButton;
