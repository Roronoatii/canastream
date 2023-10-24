import React, { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Drawer, IconButton } from '@mui/material';
import DrawerContent from './DrawerContent';

type T_Anchor = 'top' | 'left' | 'bottom' | 'right';

const FrontEditorDrawer = () => {
  const anchor: T_Anchor = 'right';
  const [drawerState, setDrawerState] = useState<boolean>(false);
  const toggleDrawer = () => {
    setDrawerState(!drawerState);
  };

  return (
    <div>
      <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleDrawer}>
        <SettingsIcon />
      </IconButton>
      <Drawer
        anchor={anchor}
        open={drawerState}
        onClose={() => setDrawerState(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <DrawerContent />
        </Box>
      </Drawer>
    </div>
  );
};

export default FrontEditorDrawer;
