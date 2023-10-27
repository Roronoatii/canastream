import React from 'react';
import { Typography, Paper, InputBase, Button, Stack } from '@mui/material';
import GoogleLoginButton from './GoogleLoginButton';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { auth, firestore } from '../../../database/firebase.config';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleSignInWithGoogle = async () => {

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Utilisateur connecté avec Google :", user.uid);
      
      const userRef = collection(firestore, 'users');
      const userQuery = query(userRef, where('id', '==', user.uid));
      const querySnapshot = await getDocs(userQuery);
  
      if (querySnapshot.empty) {
        await addDoc(userRef, {
          id: user.uid,
          is_notified: true,
          time_notif: '',
          subscriptions: [],
          fav: []
        });
      }
  
      navigate("/");
    } catch (error) {
      console.error('Erreur de connexion avec Google:', error)
      
    }
  };

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
        sx={{ mb: '10px', mx: 10.5, bgcolor: "#499b4a", '&:hover': { bgcolor: '#397A3E' } }}
      >
        Log in with Email
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      <GoogleLoginButton onLoginWithGoogle={handleSignInWithGoogle}/>
    </Paper>
  );
};

export default LoginForm;
