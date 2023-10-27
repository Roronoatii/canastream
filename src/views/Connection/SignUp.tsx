import React, { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Paper, Typography, Container, Grid } from '@mui/material';
import Image from '../../components/molecules/atoms/images/background_login_signin.png';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../database/firebase.config';
import AuthForm from '../../components/Connection/SignUp/AuthForm';
import AuthButton from '../../components/Connection/SignUp/AuthButton';
import BackgroundImage from '../../components/Connection/SignUp/BackgroundImage';

const SignUpPage: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser) {
        setUser(currentUser);
        navigate("/");
      } else {
        setUser(null);
        navigate("/signup");
      }
    });

    return () => unsubscribe();
  }, [navigate, auth]);

  const handleSignUp = async () => {
    setAuthing(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Utilisateur inscrit avec e-mail :', email);

      const userRef = collection(firestore, 'users');
      if (auth.currentUser) {
        const userDoc = await addDoc(userRef, {
          id: auth.currentUser.uid,
          is_notified: true,
          time_notif: '',
          subscriptions: [],
          fav: []
        });
      }

      await signOut(auth);
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erreur d'inscription avec e-mail :", error);
        setError(error.message);
      } else {
        console.error("Erreur d'inscription avec e-mail :", error);
        setError("Une erreur s'est produite.");
      }
      setAuthing(false);
    }
  };

  return (
    <BackgroundImage imageUrl={Image}>
      <Container maxWidth='md'>
        <Grid container direction='column' justifyContent='center' alignItems='center'>
          <Typography variant='h3' sx={{ textAlign: 'center', mb: '20px' }}>
            📝Create an account 📝
          </Typography>
          {error && <Typography color='error'>{error}</Typography>}
          <Paper component='form' sx={{ borderRadius: '5px', mb: '10px', width: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <AuthForm
              email={email}
              password={password}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
            />
          </Paper>
          <AuthButton text="Create an account" onClick={handleSignUp} disabled={authing} />
          <p>
            Already have an account ? <Link to='/login'>Login</Link>
          </p>
        </Grid>
      </Container>
    </BackgroundImage>
  );
}

export default SignUpPage;