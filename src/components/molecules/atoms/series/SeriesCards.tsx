import React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { auth, firestore } from "../../../../database/firebase.config";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

interface SeriesCardProps {
  id: number;
  posterPath: string;
  name: string;
  genres: { id: number; name: string }[];
}

export default function SeriesCard(props: SeriesCardProps) {
  const { id, posterPath, name, genres } = props;
  const handleSubscription = async (subscription: string) => {
    const userRef = collection(firestore, "users");
    if (auth.currentUser) {
      const userQuery = query(userRef, where("id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(userQuery);
      console.log(querySnapshot);
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        const userDocRef = doc(firestore, "users", docSnapshot.id);

        await updateDoc(userDocRef, {
          subscriptions: arrayUnion(subscription),
        });
      }
    }
  };

  return (
    <Box key={id} sx={{ width: "100%", position: "relative" }}>
      <img
        src={`https://image.tmdb.org/t/p/w185${posterPath}`}
        alt={name}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      if (isInWatchlist){" "}
      {
        <IconButton
          sx={{
            position: "absolute",
            top: "5%",
            right: "35%",
            backgroundColor: "#499b4a",
            borderRadius: "5px",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#499b4a",
            },
          }}
        >
          <CheckIcon />
        </IconButton>
      }{" "}
      else{" "}
      {
        <IconButton
          onClick={() => handleSubscription(name)}
          sx={{
            position: "absolute",
            top: "5%",
            right: "35%",
            backgroundColor: "#e0e0e0",
            borderRadius: "5px",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#499b4a",
            },
          }}
        >
          <AddIcon />
        </IconButton>
      }
      <Typography sx={{ fontSize: "12px", transform: "uppercase", mt: "5px" }}>
        {name}
      </Typography>
      <Stack
        sx={{
          borderRadius: "5px",
          backgroundColor: "#e0e0e0",
          color: "#000000",
          fontSize: "12px",
          textAlign: "center",
          width: "fit-content",
          p: "5px",
          cursor: "pointer",
        }}
      >
        {genres.length > 0
          ? genres.find((g) => g.id === genres[0].id)?.name || "Unknown Genre"
          : "Unknown Genre"}
      </Stack>
    </Box>
  );
}
