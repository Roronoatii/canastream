import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../database/firebase.config";

const LoginPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          email: user.email,
          is_notified: true,
          time_notif: '',
          subscriptions: [],
          fav: []
        });
      }
  
      navigate("/");
    } catch (error) {
      console.error("Erreur de connexion avec Google :", error);
      setError("Une erreur s'est produite lors de la connexion.");
    }
  };
  

  const handleSignInWithEmail = async () => {
    setAuthing(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Utilisateur connecté avec e-mail :", email);
      navigate("/");
    } catch (error: any) {
      console.error("Erreur de connexion avec e-mail :", error);

      if (error && error.code === "auth/invalid-login-credentials") {
        setError(
          "Les informations de connexion sont invalides. Vérifiez votre e-mail et votre mot de passe."
        );
      } else if (error && error.code === "auth/user-not-found") {
        setError("Aucun utilisateur avec cet e-mail n'a été trouvé.");
      } else if (error && error.code === "auth/wrong-password") {
        setError("Le mot de passe est incorrect.");
      } else {
        setError("Une erreur s'est produite lors de la connexion.");
      }
      setAuthing(false);
    }
  };

  return (
    <Stack>
      <h1>Page de connexion</h1>
      {error && <Stack>{error}</Stack>}
      <Stack>
        <label>Email :</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Stack>
      <Stack>
        <label>Mot de passe :</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Stack>
      <button onClick={handleSignInWithEmail} disabled={authing}>
        Se connecter par e-mail
      </button>
      <button onClick={handleSignInWithGoogle}>
        Se connecter avec Google
      </button>
      <p>
        Vous n'avez pas de compte ?{" "}
        <Link to="/signin">
          Inscrivez-vous
        </Link>
      </p>
    </Stack>
  );
};

export default LoginPage;
