import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { Stack, Typography, Paper, Button, InputBase, Container, Grid } from '@mui/material'
import Image from '../../components/molecules/atoms/images/background_login_signin.png';


const SignUpPage = () => {
  const auth = getAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authing, setAuthing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async () => {
    setAuthing(true)
    setError(null)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      console.log('Utilisateur inscrit avec e-mail :', email)
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erreur d'inscription avec e-mail :", error)
        setError(error.message)
      } else {
        console.error("Erreur d'inscription avec e-mail :", error)
        setError("Une erreur s'est produite.")
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
          📝Create an account 📝
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
          onClick={handleSignUp}
          disabled={authing}
          sx={{ mb: '10px' }}
        >
          Create an account
        </Button>
        <p>
          Already have an account ? <Link to='/login'>Login</Link>
        </p>
      </Grid>
    </Container>
  </Paper>
  )
}

export default SignUpPage
