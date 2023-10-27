import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

interface GoogleLoginButtonProps {
  onLoginWithGoogle: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onLoginWithGoogle }) => {
  return (
    <Button
      variant="contained"
      onClick={onLoginWithGoogle}
      sx={{
        my: '5%', 
        mx: 10.5,
        background: '#fff',
        color: 'rgba(0, 0, 0, 0.54)',
        '&:hover': {
          background: '#fff',
          color: 'rgba(0, 0, 0, 0.54)',
        },
      }}
    >
      <GoogleIcon sx={{ mr: '10px' }} />
      Sign in with Google
    </Button>
  );
};

export default GoogleLoginButton;
