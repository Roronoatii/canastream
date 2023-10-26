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

interface ProfileProps {
  user: FirebaseUser | null
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const navigate = useNavigate()
  const [newDisplayName, setNewDisplayName] = useState('')
  const [isEditing, setIsEditing] = useState(false)

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
        setIsEditing(false)
      } catch (error) {
        console.error("Erreur lors de la mise à jour du nom d'utilisateur :", error)
      }
    }
  }

  const styles = {
    paperContainer: {
      backgroundImage: `url(${Image})`,
      backgroundSize: 'cover',
      height: '88vh',
    },
  }

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
            {user.displayName || 'Anonym'}'s Profile
          </Typography>
          <Typography>
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
              <span>{user.displayName || 'Undefined'} <br /></span>
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
          <p>
            <strong>Email :</strong> {user.email || 'Undefined'}
          </p>
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
