import React from 'react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

interface SubscriptionButtonProps {
  isSubscribed: boolean;
  onClick: () => void;
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({ isSubscribed, onClick }) => {
  return (
    <IconButton
      sx={{
        width: '50px',
        height: '50px',
        backgroundColor: isSubscribed ? '#499b4a' : '#e0e0e0',
        borderRadius: '5px',
        color: '#000000',
        '&:hover': {
          backgroundColor: '#499b4a',
        },
      }}
      onClick={onClick}
    >
      {isSubscribed ? <CheckIcon /> : <AddIcon />}{' '}
    </IconButton>
  );
}

export default SubscriptionButton;
