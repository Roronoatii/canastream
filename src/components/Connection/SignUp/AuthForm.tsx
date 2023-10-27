import React, { useState } from 'react';
import { InputBase, Stack, Typography } from '@mui/material';

interface AuthFormProps {
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ email, password, onEmailChange, onPasswordChange }) => {
  return (
    <Stack p={2} spacing={2}>
      <Typography variant='h6' sx={{ display: 'flex', justifyContent: 'center' }}>Email</Typography>
      <InputBase
        placeholder='example@domain.com'
        inputProps={{ 'aria-label': 'Email' }}
        fullWidth
        value={email}
        onChange={onEmailChange}
      />
      <Typography variant='h6' sx={{ display: 'flex', justifyContent: 'center' }}>Password</Typography>
      <InputBase
        placeholder='Password'
        inputProps={{ 'aria-label': 'Password' }}
        fullWidth
        type='password'
        value={password}
        onChange={onPasswordChange}
      />
    </Stack>
  );
}

export default AuthForm;
