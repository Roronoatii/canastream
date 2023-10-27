import React from 'react';
import { Button } from '@mui/material';

interface AuthButtonProps {
  text: string;
  onClick: () => void;
  disabled: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <Button variant='contained' color='primary' onClick={onClick} disabled={disabled} sx={{ mb: '10px' }}>
      {text}
    </Button>
  );
}

export default AuthButton;
