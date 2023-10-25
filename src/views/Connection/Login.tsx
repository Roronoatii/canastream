import React, { useState } from 'react'
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import {
  Stack,
  Typography,
  Paper,
  InputBase,
  Button,
  Container,
  Grid
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
import Image from '../../components/molecules/atoms/images/background_login_signin.png';

const LoginPage = () => {
  const auth = getAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authing, setAuthing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('Utilisateur connecté avec Google:', user.uid)
      navigate('/')
    } catch (error) {
      console.error('Erreur de connexion avec Google:', error)
      setError("Une erreur s'est produite lors de la connexion.")
    }
  }

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
    }
};

  return (
    <Paper style={styles.paperContainer}>
    <Container maxWidth='md'>
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'
      >
        <Typography variant='h3' sx={{ textAlign: 'center', mb: '20px' }}>
          🗒️ Connect to your account 🗒️
        </Typography>
        {error && <Typography color='error'>{error}</Typography>}
        <Paper component='form' sx={{ borderRadius: '5px', mb: '10px' }}>
          <Stack p={2} spacing={2}>
            <Typography variant='h6'>Email</Typography>
            <InputBase
              placeholder='example@domain.com'
              inputProps={{ 'aria-label': 'Email' }}
              fullWidth
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Typography variant='h6'>Password</Typography>
            <InputBase
              placeholder='Password'
              inputProps={{ 'aria-label': 'Password' }}
              fullWidth
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Stack>
        </Paper>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSignInWithEmail}
          disabled={authing}
          sx={{ mb: '10px' }}
        >
          Sign in with Email
        </Button>
        <Button
          variant='contained'
          onClick={handleSignInWithGoogle}
          sx={{
            background: '#fff',
            color: 'rgba(0, 0, 0, 0.54)',
            '&:hover': {
              background: '#fff',
              color: 'rgba(0, 0, 0, 0.54)'
            }
          }}
        >
          <GoogleIcon sx={{ mr: '10px' }} />
          Sign in with Google
        </Button>

        <p>
          Don't have an account ? <Link to='/signin'>Register</Link>
        </p>
      </Grid>
    </Container>
    </Paper>
  )
}

export default LoginPage
