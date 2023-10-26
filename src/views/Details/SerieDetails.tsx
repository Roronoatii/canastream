import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  IconButton
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot
} from 'firebase/firestore'
import { firestore, auth } from '../../database/firebase.config'

interface SeriesDetails {
  name: string
  overview: string
  poster_path: string
  number_of_seasons: number
  number_of_episodes: number
  genres: { name: string }[]
  first_air_date: string
  backdrop_path: string
}

interface Season {
  season_number: number
  episode_count: number
  name: string
  overview: string
}

interface CastMember {
  name: string
  character: string
}

const SerieDetails = () => {
  const { seriesId } = useParams()
  const [seriesDetails, setSeriesDetails] = useState<SeriesDetails | null>(null)
  const [seasons, setSeasons] = useState<Season[]>([])
  const [cast, setCast] = useState<CastMember[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)

  const apiKey = '2955ed558f1e71d9871ec2a96694678a'

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
    axios
      .get(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}`)
      .then(response => {
        setSeriesDetails(response.data)
      })
      .catch(error => {
        console.error(error)
      })

    axios
      .get(
        `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&append_to_response=seasons`
      )
      .then(response => {
        setSeasons(response.data.seasons)
      })
      .catch(error => {
        console.error(error)
      })

    axios
      .get(
        `https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${apiKey}`
      )
      .then(response => {
        setCast(response.data.cast)
      })
      .catch(error => {
        console.error(error)
      })
  }, [seriesId])

  useEffect(() => {
    async function checkSubscription() {
      if (auth.currentUser && seriesDetails) {
        const userRef = collection(firestore, 'users')
        const userQuery = query(
          userRef,
          where('id', '==', auth.currentUser.uid)
        )
        const querySnapshot = await getDocs(userQuery)

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0]
          const userData = docSnapshot.data()
          if (userData.subscriptions.includes(seriesDetails.name)) {
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
        if (userData.id === auth.currentUser?.uid && seriesDetails) {
          if (userData.subscriptions.includes(seriesDetails.name)) {
            setIsSubscribed(true)
          } else {
            setIsSubscribed(false)
          }
        }
      })
    })

    return () => unsubscribe()
  }, [seriesDetails, auth.currentUser])

  if (!seriesDetails) {
    return <div>Loading...</div>
  }

  const styles = {
    paperContainer: {
      backgroundImage: `url(https://image.tmdb.org/t/p/w500${seriesDetails.backdrop_path})`,
      backgroundSize: 'cover',
      height: '75vh',
      padding: '16px',
      color: 'white',
      position: 'relative'
    },
    darkOverlay: {
      content: '""',
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '16px',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    buttonContainer: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      zIndex: 1
    },
    button: {
      backgroundColor: isSubscribed ? '#499b4a' : '#e0e0e0',
      borderRadius: '5px',
      color: '#000000',
      '&:hover': {
        backgroundColor: '#499b4a'
      }
    }
  }

  return (
    <Container>
      <Paper sx={styles.paperContainer}>
        <Stack sx={styles.darkOverlay}>
          <Typography variant='h5'>{seriesDetails.name}</Typography>
          <Typography variant='subtitle1' sx={{ mb: 1 }}>
            {seriesDetails.overview}
          </Typography>
          <Stack direction='row'>
            <Typography
              sx={{
                borderRadius: '5px',
                backgroundColor: '#e0e0e0',
                color: '#000000',
                fontSize: '12px',
                textAlign: 'center',
                p: '5px',
                mx: '5px',
                cursor: 'pointer'
              }}
            >{`${seriesDetails.number_of_seasons} seasons`}</Typography>
            <Typography
              sx={{
                borderRadius: '5px',
                backgroundColor: '#e0e0e0',
                color: '#000000',
                fontSize: '12px',
                textAlign: 'center',
                p: '5px',
                mx: '5px',
                cursor: 'pointer'
              }}
            >{`${seriesDetails.number_of_episodes} episodes`}</Typography>
            {seriesDetails.genres.map(genre => (
              <Typography
              sx={{
                borderRadius: '5px',
                backgroundColor: '#e0e0e0',
                color: '#000000',
                fontSize: '12px',
                textAlign: 'center',
                p: '5px',
                mx: '5px',
                cursor: 'pointer'
              }}
            >{`${genre.name}`}</Typography>
            ))}
            <Typography
              sx={{
                borderRadius: '5px',
                backgroundColor: '#e0e0e0',
                color: '#000000',
                fontSize: '12px',
                textAlign: 'center',
                p: '5px',
                mx: '5px',
                cursor: 'pointer'
              }}
            >{`${seriesDetails.first_air_date}`}</Typography>
          </Stack>
        </Stack>
        <IconButton
          sx={styles.button}
          onClick={e => {
            e.preventDefault()
            handleSubscription(seriesDetails.name)
          }}
        >
          {isSubscribed ? <CheckIcon /> : <AddIcon />}{' '}
        </IconButton>
      </Paper>

      {seasons.map(season => (
        <div key={season.season_number}>
          <Paper sx={{ marginTop: 2 }}>
            <ListSubheader>Season {season.season_number}</ListSubheader>
            <Typography variant='subtitle1'>{season.overview}</Typography>
            <div
              style={{
                display: 'flex',
                overflowX: 'auto'
              }}
            >
              {Array.from({ length: season.episode_count }, (_, index) => (
                <ListItem
                  key={index}
                  sx={{
                    flex: '0 0 auto',
                    width: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: '5px',
                    margin: '5px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#e0e0e0'
                    }
                  }}
                >
                  <ListItemText primary={`Episode ${index + 1}`} />
                </ListItem>
              ))}
            </div>
          </Paper>
        </div>
      ))}
      <Typography variant='h5' sx={{ marginTop: 2 }}>
        Cast
      </Typography>
      <List>
        {cast.map(member => (
          <ListItem key={member.name}>
            <ListItemText primary={member.name} secondary={member.character} />
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default SerieDetails
