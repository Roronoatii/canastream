import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../database/firebase.config';

const SignInPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setAuthing(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Utilisateur inscrit avec e-mail :', email);
  
      const userRef = collection(firestore, 'users');
      if (auth.currentUser){
        const userDoc = await addDoc(userRef, {
          id: auth.currentUser.uid,
          email: auth.currentUser.email,
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
        console.error('Erreur d\'inscription avec e-mail :', error);
        setError(error.message);
      } else {
        console.error('Erreur d\'inscription avec e-mail :', error);
        setError('Une erreur s\'est produite.');
      }
      setAuthing(false);
    }
  };
  
  return (
    <Stack>
      <h1>Inscription</h1>
      {error && <div>{error}</div>}
      <Stack>
        <label>Email :</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Stack>
      <Stack>
        <label>Mot de passe :</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Stack>
      <button onClick={handleSignUp} disabled={authing}>S'inscrire par e-mail</button>
      <p>Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
    </Stack>
  );
};

export default SignInPage;
