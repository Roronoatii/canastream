import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  InputBase,
  Stack,
  Typography,
  Paper,
  Container,
  Grid
} from '@mui/material'
import { signOut, updateProfile } from 'firebase/auth'
import FirebaseUser from '../../models/FirebaseUser'
import { auth } from '../../database/firebase.config'
import Image from '../../components/molecules/atoms/images/background_login_signin.png'
import SeriesCard from '../../components/molecules/atoms/series/SeriesCards'

interface ProfileProps {
  user: FirebaseUser | null
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const navigate = useNavigate()
  const [newDisplayName, setNewDisplayName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [currentDisplayName, setCurrentDisplayName] = useState(user?.displayName || 'Anonym');

  if (!user) {
    navigate('/')
    return null
  }

  const handleDisplayNameUpdate = async () => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: newDisplayName
        })
        setNewDisplayName(newDisplayName)
        setCurrentDisplayName(newDisplayName)
        setIsEditing(false)
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du nom d'utilisateur :",
          error
        )
      }
    }
  }

  const styles = {
    paperContainer: {
      backgroundImage: `url(${Image})`,
      backgroundSize: 'cover',
      height: '88vh'
    }
  }

  return (
    <Paper style={styles.paperContainer}>
      <Container maxWidth='md'>
        <Grid
          container
          direction='column'
          justifyContent='center'
          alignItems='center'
          sx={{ height: '100%' }}
        >
          <Typography variant='h3' sx={{ textAlign: 'center', mb: '20px' }}>
            {currentDisplayName || 'Anonym'}'s Profile
          </Typography>
          <Paper
            component='form'
            sx={{
              borderRadius: '5px',
              mb: '10px',
              p: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant='h6'>
              Username :{' '}
              {isEditing ? (
                <Stack>
                  <InputBase
                    placeholder='Modify your username'
                    inputProps={{ 'aria-label': 'Username' }}
                    fullWidth
                    onChange={e => setNewDisplayName(e.target.value)}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleDisplayNameUpdate}
                    sx={{ mb: '10px' }}
                  >
                    Update Username
                  </Button>
                </Stack>
              ) : (
                <Typography variant='subtitle1'>
                  {currentDisplayName || 'Undefined'}
                </Typography>
              )}
              {!isEditing && (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => setIsEditing(true)}
                  sx={{ mb: '10px' }}
                >
                  Modify Username
                </Button>
              )}
            </Typography>{' '}
            <Typography variant='h6'>
              Email : <br />{' '}
              <Typography variant='subtitle1'>
                {user.email || 'Undefined'}
              </Typography>
            </Typography>
          </Paper>
          <Button
            variant='contained'
            color='error'
            onClick={() => signOut(auth)}
            sx={{ mb: '10px' }}
          >
            Log out
          </Button>
        </Grid>
      </Container>
    </Paper>
  )
}

export default Profile
