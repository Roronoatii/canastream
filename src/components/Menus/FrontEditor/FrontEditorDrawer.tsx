import React, { useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Box, Drawer, IconButton, Badge } from '@mui/material';
import DrawerContent from './DrawerContent';

type T_Anchor = 'top' | 'left' | 'bottom' | 'right';

const FrontEditorDrawer = () => {
  const anchor: T_Anchor = 'right';
  const [drawerState, setDrawerState] = useState<boolean>(false);
  const numberOfNotifications = 5;

  const toggleDrawer = () => {
    setDrawerState(!drawerState);
  };

  return (
    <div>
      <IconButton sx={{ mx: 1 }} color="inherit" onClick={toggleDrawer}>
        <Badge badgeContent={numberOfNotifications} color="error">
          <NotificationsIcon />
        </Badge>
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
