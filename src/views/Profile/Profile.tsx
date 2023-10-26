<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react'
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
import { EmailAuthProvider, User, onAuthStateChanged, reauthenticateWithCredential, sendEmailVerification, signOut, updateEmail, updatePassword, updateProfile } from 'firebase/auth'
import { auth } from '../../database/firebase.config'
import Image from '../../components/molecules/atoms/images/background_login_signin.png'
=======
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateEmail,
  sendEmailVerification,
  signOut,
  User,
  onAuthStateChanged,
  Auth,
  getAuth,
} from "firebase/auth";
import {
  Button,
  Container,
  Grid,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { auth, firestore } from "../../database/firebase.config";
import axios from "axios";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
interface SeriesCalendar {
  id: number;
  name: string;
  air_date: string;
}
>>>>>>> Stashed changes

const Profile: React.FC = () => {
  const seriesId = 1233;
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
<<<<<<< Updated upstream
  const [currentDisplayName, setCurrentDisplayName] = useState(user?.displayName || 'Anonym');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
=======
  const [calendar, setCalendar] = useState<SeriesCalendar[]>([]);
  const nextAirEpisodes: { seriesName: any; nextEpisode: any }[] = [];
  const apiKey = "2955ed558f1e71d9871ec2a96694678a";

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&append_to_response=seasons`
      )
      .then((response) => {
        const nextEpisode = response.data.next_episode_to_air;
        const seriesName = response.data.name;

        nextAirEpisodes.push({
          seriesName,
          nextEpisode,
        });
      })
      .catch((error) => {
        console.error(error);
      });
    getListIdSub();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
>>>>>>> Stashed changes
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, auth]);

<<<<<<< Updated upstream

=======
  const getListIdSub = async () => {
    const userRef = collection(firestore, "users");
    if (auth.currentUser) {
      const userQuery = query(userRef, where("id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        const userDocRef = doc(firestore, "users", docSnapshot.id);

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const subscriptions = userDoc.data().subscriptions;
          console.log("Subscriptions:", subscriptions);
        } else {
          console.log("User document does not exist.");
        }
      }
    }
  };
>>>>>>> Stashed changes
  const handleDisplayNameUpdate = async () => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
<<<<<<< Updated upstream
          displayName: newDisplayName
        })
        setNewDisplayName(newDisplayName)
        setCurrentDisplayName(newDisplayName)
        setIsEditing(false)
=======
          displayName: newDisplayName,
        });
        setNewDisplayName(newDisplayName);
        setIsEditing(false);
>>>>>>> Stashed changes
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du nom d'utilisateur :",
          error
<<<<<<< Updated upstream
        )
=======
        );
>>>>>>> Stashed changes
      }
    }
  };

  const handleEmailUpdate = async () => {
    const newEmail = prompt("Nouvel email :");

    if (newEmail) {
      if (auth.currentUser) {
        try {
          const password = prompt("Mot de passe actuel :");

          if (password !== null) {
            const credential = EmailAuthProvider.credential(
              auth.currentUser.email!,
              password
            );
            await reauthenticateWithCredential(auth.currentUser, credential);

            await sendEmailVerification(auth.currentUser);
            console.log("E-mail de vérification envoyé.");

            // Old

            await new Promise((resolve) => {
              const interval = setInterval(async () => {
                if (auth.currentUser) {
                  console.log("user");
                  await auth.currentUser.reload();
                  if (auth.currentUser.emailVerified) {
                    console.log("vérifié");
                    clearInterval(interval);
                    console.log("user d'avant :", auth.currentUser);
                    console.log("new email :", newEmail);
                    console.log("user d'après :", auth.currentUser);
                  }
                }
              }, 30000);
            });

            // New

            await sendEmailVerification(auth.currentUser);
            console.log("Nem e-mail de vérification envoyé.");

            await new Promise((resolve) => {
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
            console.error("Mot de passe non saisi");
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'e-mail :", error);
        }
      }
    }
  };

  const handlePasswordUpdate = async () => {
    const newPassword = prompt("Nouveau mot de passe :");

    if (newPassword) {
      if (auth.currentUser) {
        try {
          await updatePassword(auth.currentUser, newPassword);
        } catch (error) {
          console.error(
            "Erreur lors de la mise à jour du mot de passe :",
            error
          );
        }
      }
    }
  };
  if (!user) {
    navigate("/login");
    return null;
  }

  const styles = {
    paperContainer: {
      backgroundImage: `url(${Image})`,
<<<<<<< Updated upstream
      backgroundSize: 'cover',
      height: '88vh'
    }
  }
=======
      backgroundSize: "cover",
      height: "88vh",
    },
  };
>>>>>>> Stashed changes

  return (
    <Paper style={styles.paperContainer}>
      <Container maxWidth="md">
        <Grid
          container
<<<<<<< Updated upstream
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
                <Stack sx={{alignItems:'center'}}>
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
=======
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h3" sx={{ textAlign: "center", mb: "20px" }}>
            {user.displayName || "Anonym"}'s Profile
          </Typography>
          <Typography>
            Username :{" "}
            {isEditing ? (
              <Stack>
                <InputBase
                  placeholder="Modify your username"
                  inputProps={{ "aria-label": "Username" }}
                  fullWidth
                  onChange={(e) => setNewDisplayName(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDisplayNameUpdate}
                  sx={{ mb: "10px" }}
>>>>>>> Stashed changes
                >
                  Modify Username
                </Button>
<<<<<<< Updated upstream
              )}
            </Typography>{' '}
            <Typography variant='h6'>
              Email : <br />{' '}
              <Typography variant='subtitle1'>
                {user.email || 'Undefined'}
              </Typography>
            </Typography>
          <Button
            variant='contained'
            color='primary'
=======
              </Stack>
            ) : (
              <span>
                {user.displayName || "Undefined"} <br />
              </span>
            )}
            {!isEditing && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
                sx={{ mb: "10px" }}
              >
                Modify Username
              </Button>
            )}
          </Typography>{" "}
          <p>
            <strong>Email :</strong> {user.email || "Undefined"}
          </p>
          <Button
            variant="contained"
            color="error"
>>>>>>> Stashed changes
            onClick={handleEmailUpdate}
            sx={{ mb: "10px" }}
          >
            Modify Email
          </Button>
          <br />
          <Button
<<<<<<< Updated upstream
            variant='contained'
            color='primary'
=======
            variant="contained"
            color="error"
>>>>>>> Stashed changes
            onClick={handlePasswordUpdate}
            sx={{ mb: "10px" }}
          >
            Modify Password
          </Button>
          </Paper>
          <Button
            variant="contained"
            color="error"
            onClick={() => signOut(auth)}
            sx={{ mb: "10px" }}
          >
            Log out
          </Button>
        </Grid>
      </Container>
    </Paper>
  );
};

export default Profile;
<<<<<<< Updated upstream
function setUser(currentUser: User) {
  throw new Error('Function not implemented.')
}

=======
>>>>>>> Stashed changes
