import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  InputBase,
  Stack,
  Typography,
  Paper,
  Container,
  Grid,
  Input,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {
  EmailAuthProvider,
  User,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { auth, firestore } from "../../database/firebase.config";
import Image from "../../components/molecules/atoms/images/background_login_signin.png";
import axios from "axios";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [isNotified, setIsNotified] = useState(false);
  const [notificationPreference, setNotificationPreference] = useState(() => {
    const storedPreference = localStorage.getItem("notificationPreference");
    return storedPreference || '';
  });
  const seriesId = 1234;
  const nextAirEpisodes = [];
  const apiKey = "2955ed558f1e71d9871ec2a96694678a";
  const preferenceKey = `notificationPreference_${auth.currentUser?.uid}`;

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
        getListIdSubs();
      })
      .catch((error) => {
        console.error(error);
      });

    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = collection(firestore, "users");
        const userQuery = query(userRef, where("id", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0];
          const userDocRef = doc(firestore, "users", docSnapshot.id);

          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const isNotifiedValue = userDoc.data().is_notified;
            setIsNotified(isNotifiedValue);
          }
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData();
      } else {
        setUser(null);
        navigate("/login");
      }
    });

    const storedPreference = localStorage.getItem(preferenceKey);
    setNotificationPreference(storedPreference || '');
    
    return () => unsubscribe();

  }, [navigate, auth, preferenceKey]);

  const handleDisplayNameUpdate = async () => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: newDisplayName,
        });
        setNewDisplayName(newDisplayName);
        setIsEditing(false);
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du nom d'utilisateur :",
          error
        );
      }
    }
  };

  const getListIdSubs = async () => {
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
                  await auth.currentUser.reload();
                  if (auth.currentUser.emailVerified) {
                    clearInterval(interval);
                    console.log("user d'avant :", auth.currentUser);
                    console.log("new email :", newEmail);
                    console.log("user d'après :", auth.currentUser);
                  }
                }
              }, 30000);
            });

            await sendEmailVerification(auth.currentUser);
console.log("Nem e-mail de vérification envoyé.");

            await new Promise((resolve) => {
              const interval = setInterval(async () => {
                if (auth.currentUser) {
                  await auth.currentUser.reload();
                  if (auth.currentUser.emailVerified) {
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


  const handleNotificationToggle = async () => {
    setIsNotified(!isNotified);

    if (auth.currentUser) {
      const userRef = collection(firestore, "users");
      const userQuery = query(userRef, where("id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        const userDocRef = doc(firestore, "users", docSnapshot.id);

        await updateDoc(userDocRef, {
          is_notified: !isNotified, 
        });
      }
    }
  };

  const updateNotificationPreference = async (preference: string) => {
    if (auth.currentUser) {
      const userRef = collection(firestore, "users");
      const userQuery = query(userRef, where("id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(userQuery);
  
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        const userDocRef = doc(firestore, "users", docSnapshot.id);
  
        await updateDoc(userDocRef, {
          time_notif: preference, 
        });
        localStorage.setItem(preferenceKey, preference);
      }
    }
  };  

  if (!user) {
    return null;
  }

  const currentDisplayName = user.displayName || '';

  const styles = {
    paperContainer: {
      backgroundImage: `url(${Image})`,
      backgroundSize: "cover",
      height: "88vh",
    },
  };

  return (
    <Paper style={styles.paperContainer}>
      <Container maxWidth="md">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <Typography variant="h3" sx={{ textAlign: "center", mb: "20px" }}>
            {currentDisplayName || "Anonym"}'s Profile
          </Typography>
          <Paper
            component="form"
            sx={{
              borderRadius: "5px",
              mb: "10px",
              p: 10, 
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
            <strong>Username :</strong>
              {isEditing ? (
                <Stack sx={{ alignItems: "center" }}>
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
                  >
                    Update Username
                  </Button>
                </Stack>
              ) : (
                <Typography variant="subtitle1">
                  {currentDisplayName || "Undefined"}
                </Typography>
              )}
              {!isEditing && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  sx={{ mb: "10px", bgcolor: "#499b4a", '&:hover': { bgcolor: '#397A3E' } }}
                >
                  Modify Username
                </Button>
              )}
            </Typography>
            <Typography variant="h6">
            <strong>Email :</strong> <br />
              <Typography variant="subtitle1">
                {user.email || "Undefined"}
              </Typography>
            </Typography>
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={handleEmailUpdate}
              sx={{ mb: 2, bgcolor: "#499b4a", '&:hover': { bgcolor: '#397A3E' } }}
            >
              Modify Email
            </Button>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <strong>Notifications : </strong>
              <Checkbox
                checked={isNotified}
                onChange={handleNotificationToggle}
                sx={{
                  appearance: "none", 
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                  outline: "none",
                  "&.Mui-checked": {
                    color: "#499b4a", 
                  },
                  ":checked": {
                    backgroundColor: "#499b4a", 
                  },
                }}
              />
            </Typography>
            {isNotified && (
              <FormControl sx={{ mb: 2 }}>
                <InputLabel sx={{ visibility: notificationPreference ? 'hidden' : 'visible' }}>
                  Notification Preference
                </InputLabel>
                <Select
                  value={notificationPreference}
                  onChange={(e) => {
                    const preference = e.target.value;
                    setNotificationPreference(preference);
                    updateNotificationPreference(preference); 
                  }}
                  sx={{ width: '200px' }}
                >
                  <MenuItem value="A Day">A day</MenuItem>
                  <MenuItem value="One Week">One week</MenuItem>
                  <MenuItem value="Two Weeks">Two weeks</MenuItem>
                </Select>
              </FormControl>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handlePasswordUpdate}
              sx={{ mb: "10px", bgcolor: "#499b4a", '&:hover': { bgcolor: '#397A3E' } }}
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
