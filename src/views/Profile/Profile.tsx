import React, { useState } from 'react';
import FirebaseUser from '../../models/FirebaseUser';
import { auth } from '../../database/firebase.config';
import { signOut, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';

interface ProfileProps {
  user: FirebaseUser | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleDisplayNameUpdate = async () => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: newDisplayName,
        });
        setNewDisplayName(newDisplayName);
        setIsEditing(false);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du nom d\'utilisateur :', error);
      }
    }
  };
  

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
      <button onClick={() => signOut(auth)}>Déconnexion</button>
    </Stack>
  );
};

export default Profile;
