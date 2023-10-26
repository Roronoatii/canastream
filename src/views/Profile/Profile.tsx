<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword, updateEmail, sendEmailVerification, signOut, User, onAuthStateChanged, Auth, getAuth } from 'firebase/auth';
import { Stack } from '@mui/material';
import { auth } from '../../database/firebase.config';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, auth]);

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
<<<<<<< HEAD
  };

  const handleEmailUpdate = async () => {
    const newEmail = prompt('Nouvel email :');
  
    if (newEmail) {
      if (auth.currentUser) {
        try {
          const password = prompt('Mot de passe actuel :');
  
          if (password !== null) {
            const credential = EmailAuthProvider.credential(auth.currentUser.email!, password);
            await reauthenticateWithCredential(auth.currentUser, credential);
  
            await sendEmailVerification(auth.currentUser);
            console.log('E-mail de vérification envoyé.');
            
            // Old

            await new Promise(resolve => {
              const interval = setInterval(async () => {
                if (auth.currentUser) {
                  console.log("user");
                  await auth.currentUser.reload();
                  if (auth.currentUser.emailVerified) {
                    console.log("vérifié");
                    clearInterval(interval);
                    console.log("user d'avant :", auth.currentUser);
                    console.log("new email :", newEmail)
                    console.log("user d'après :", auth.currentUser);
                  }
                }
              }, 30000); 
            });

            // New

            await sendEmailVerification(auth.currentUser);
            console.log('Nem e-mail de vérification envoyé.');
            
            await new Promise(resolve => {
              const interval = setInterval(async () => {
                if (auth.currentUser) {
                  console.log("user2");
                  await auth.currentUser.reload();
                  if (auth.currentUser.emailVerified) {
                    console.log("vérifié2");
                    clearInterval(interval);
                    await updateEmail(auth.currentUser, newEmail);
                  }
                }
              }, 30000); 
            });
          } else {
            console.error('Mot de passe non saisi');
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'e-mail :', error);
        }
      }
    }
  };
  

  const handlePasswordUpdate = async () => {
    const newPassword = prompt('Nouveau mot de passe :');

    if (newPassword) {
      if (auth.currentUser) {
        try {
          await updatePassword(auth.currentUser, newPassword);
        } catch (error) {
          console.error('Erreur lors de la mise à jour du mot de passe :', error);
        }
      }
    }
  };
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Stack>
      <h2>Profil de {user.displayName || 'Anonyme'}</h2>
      <p><strong>Nom d'utilisateur :</strong> {isEditing ? (
        <Stack>
          <input
            type="text"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
          <button onClick={handleDisplayNameUpdate}>Mettre à jour</button>
        </Stack>
      ) : (
        <span>{user.displayName || 'Non défini'}</span>
      )}
      {!isEditing && (
        <button onClick={() => setIsEditing(true)}>Modifier</button>
      )}
      </p>
      <p><strong>Email :</strong> {user.email || 'Non défini'}</p>
      <button onClick={handleEmailUpdate}>Modifier Email</button>
      <button onClick={handlePasswordUpdate}>Modifier Mot de passe</button>
      <button onClick={() => signOut(auth)}>Déconnexion</button>
    </Stack>
  );
};
=======
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
>>>>>>> origin/ethan

export default Profile
