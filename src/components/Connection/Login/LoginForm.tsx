import React from 'react';
import { Typography, Paper, InputBase, Button, Stack } from '@mui/material';

interface LoginFormProps {
  onLogin: () => void;
  authing: boolean;
  error: string | null;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, authing, error, setEmail, setPassword, email, password }) => {
  return (
    <Paper component="form" sx={{ borderRadius: '5px', mb: '10px', width: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Stack p={2} spacing={2}>
        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center' }}>Email</Typography>
        <InputBase
          placeholder="example@domain.com"
          inputProps={{ 'aria-label': 'Email' }}
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center' }}>Password</Typography>
        <InputBase
          placeholder="Password"
          inputProps={{ 'aria-label': 'Password' }}
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Stack>
      <Button
        variant="contained"
        color="primary"
        onClick={onLogin}
        disabled={authing}
        sx={{ mb: '10px', ml: 10.5, mr: 10.5}}
      >
        Log in with Email
      </Button>
      {error && <Typography color="error">{error}</Typography>}
    </Paper>
  );
};

export default LoginForm;
