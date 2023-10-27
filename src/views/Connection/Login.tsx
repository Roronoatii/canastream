import React, { useEffect, useState } from 'react'
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  onAuthStateChanged
} from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import {
  Typography,
  Paper,
  Container,
  Grid
} from '@mui/material'
import Image from '../../components/molecules/atoms/images/background_login_signin.png';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../database/firebase.config";
import LoginForm from '../../components/Connection/Login/LoginForm';
import GoogleLoginButton from '../../components/Connection/Login/GoogleLoginButton';

const LoginPage = () => {
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
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, auth]);

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
      setError("Une erreur s'est produite lors de la connexion.")
    }
  };
  

  const handleSignInWithEmail = async () => {
    setAuthing(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log('Utilisateur connecté avec e-mail:', email)
      navigate('/')
    } catch (error: any) {
      console.error('Erreur de connexion avec e-mail:', error)

      if (error && error.code === 'auth/invalid-login-credentials') {
        setError(
          'Les informations de connexion sont invalides. Vérifiez votre e-mail et votre mot de passe.'
        )
      } else if (error && error.code === 'auth/user-not-found') {
        setError("Aucun utilisateur avec cet e-mail n'a été trouvé.")
      } else if (error && error.code === 'auth/wrong-password') {
        setError('Le mot de passe est incorrect.')
      } else {
        setError("Une erreur s'est produite lors de la connexion.")
      }
      setAuthing(false)
    }
  }
  const styles = {
    paperContainer: {
      backgroundImage: `url(${Image})`,
      backgroundSize: 'cover',
      height: '88vh',
    },
  };

  return (
    <Paper style={styles.paperContainer}>
      <Container maxWidth="md">
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Typography variant="h3" sx={{ textAlign: 'center', mb: '20px' }}>
            🗒️ Connect to your account 🗒️
          </Typography>
          <LoginForm
            onLogin={handleSignInWithEmail}
            authing={authing}
            error={error}
            setEmail={setEmail}
            setPassword={setPassword}
            email={email}
            password={password}
          />
          <GoogleLoginButton onLoginWithGoogle={handleSignInWithGoogle} />
          <p>
            Don't have an account ? <Link to="/signup">Register</Link>
          </p>
        </Grid>
      </Container>
    </Paper>
  );
};

export default LoginPage;
