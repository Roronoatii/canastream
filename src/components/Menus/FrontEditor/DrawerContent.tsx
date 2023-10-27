import { Stack } from "@mui/material";
import { User } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth, firestore } from "../../../database/firebase.config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const DrawerContent = () => {
  const [notificationRef, setNotificationRef] = useState("");

  useEffect(() => {
    const getNotification = async () => {
      if (auth.currentUser) {
        const userRef = collection(firestore, "users");
        const userQuery = query(
          userRef,
          where("id", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0];
          const userDocRef = doc(firestore, "users", docSnapshot.id);

          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && userDoc.data().is_notified) {
            const newNotificationRef = userDoc.data().time_notif;
            setNotificationRef(newNotificationRef);
            console.log(newNotificationRef);
          }
        }
      }
    };

    getNotification();
  }, []);

  return <Stack>{notificationRef}</Stack>;
};

export default DrawerContent;
