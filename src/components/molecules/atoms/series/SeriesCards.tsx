import { useState, useEffect } from 'react'
import {
  Box,
  IconButton,
  Stack,
  Typography,
  ImageListItem,
  ImageListItemBar
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import { auth, firestore } from '../../../../database/firebase.config'
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  onSnapshot
} from 'firebase/firestore'
import { Link } from 'react-router-dom'

interface SeriesCardProps {
  id: number
  posterPath: string
  name: string
  genres: { id: number; name: string }[]
}

export default function SeriesCard(props: SeriesCardProps) {
  const { id, posterPath, name, genres } = props
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscription = async (subscription: string) => {
    const userRef = collection(firestore, 'users')
    if (auth.currentUser) {
      const userQuery = query(userRef, where('id', '==', auth.currentUser.uid))
      const querySnapshot = await getDocs(userQuery)
      console.log(querySnapshot)
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0]
        const userDocRef = doc(firestore, 'users', docSnapshot.id)

        await updateDoc(userDocRef, {
          subscriptions: arrayUnion(subscription)
        })
      }
    }
  }

  useEffect(() => {
    async function checkSubscription() {
      if (auth.currentUser) {
        const userRef = collection(firestore, 'users')
        const userQuery = query(
          userRef,
          where('id', '==', auth.currentUser.uid)
        )
        const querySnapshot = await getDocs(userQuery)

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0]
          const userData = docSnapshot.data()
          if (userData.subscriptions.includes(name)) {
            setIsSubscribed(true)
          } else {
            setIsSubscribed(false)
          }
        }
      }
    }

    checkSubscription()

    const unsubscribe = onSnapshot(collection(firestore, 'users'), snapshot => {
      snapshot.docs.forEach(doc => {
        const userData = doc.data()
        if (userData.id === auth.currentUser?.uid) {
          if (userData.subscriptions.includes(name)) {
            setIsSubscribed(true)
          } else {
            setIsSubscribed(false)
          }
        }
      })
    })

    return () => unsubscribe()
  }, [name])

  return (
    <Box key={id} sx={{ width: '75%', position: 'relative', mx: 'auto'}}>
      <Link
  to={`/series/${id}`}
  style={{ textDecoration: 'none', color: 'inherit' }}
>

        <ImageListItem>
          <img
            src={`https://image.tmdb.org/t/p/w185${posterPath}`}
            alt={name}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <ImageListItemBar
            sx={{ mx: '5%', my: '5%', background: 'transparent' }}
            actionIcon={
              <IconButton
                sx={{
                  backgroundColor: isSubscribed ? '#499b4a' : '#e0e0e0',
                  borderRadius: '5px',
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: '#499b4a'
                  }
                }}
                onClick={e => {
                  e.preventDefault()
                  handleSubscription(name)
                }}
              >
                {isSubscribed ? <CheckIcon /> : <AddIcon />}{' '}
              </IconButton>
            }
          />
        </ImageListItem>
        <Typography variant='button' sx={{ fontSize: '12px', mt: '5px', textDecoration: 'none' }}>
          {name}
        </Typography>
        <Stack
          sx={{
            borderRadius: '5px',
            backgroundColor: '#e0e0e0',
            color: '#000000',
            textDecoration: 'none',
            fontSize: '12px',
            textAlign: 'center',
            width: 'fit-content',
            p: '5px',
            cursor: 'pointer'
          }}
        >
          {genres.length > 0
            ? genres.find(g => g.id === genres[0].id)?.name || 'Unknown Genre'
            : 'Unknown Genre'}
        </Stack>
      </Link>
    </Box>
  )
}
