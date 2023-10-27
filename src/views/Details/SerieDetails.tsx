import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Container,
  Typography,
  Paper,
  Stack,
} from '@mui/material'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  addDoc,
} from 'firebase/firestore'
import { User, onAuthStateChanged } from "firebase/auth";
import { firestore, auth } from '../../database/firebase.config'
import BackgroundImage from '../../components/Details/BackgroundImage'
import SerieInfo from '../../components/Details/SerieInfo'
import SubscriptionButton from '../../components/Details/SubscriptionButton'
import SeasonList from '../../components/Details/SeasonList'
import CastList from '../../components/Details/CastList'
import ReviewList from '../../components/Details/ReviewList'

import { SeriesDetails } from '../../components/Details/SerieInfo';
import { Season } from '../../components/Details/SeasonList';
import { Review } from '../../components/Details/ReviewList';
import { CastMember } from '../../components/Details/CastList'; 

const SerieDetails = () => {
  const navigate = useNavigate();
  const { seriesId } = useParams()
  const [seriesDetails, setSeriesDetails] = useState<SeriesDetails | null>(null)
  const [seasons, setSeasons] = useState<Season[]>([])
  const [cast, setCast] = useState<CastMember[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);

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

  const handleUnsubscription = async (subscription: string) => {
    if (auth.currentUser && seriesDetails) {
      const userRef = collection(firestore, 'users');
      const userQuery = query(
        userRef,
        where('id', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(userQuery);
  
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        const userDocRef = doc(firestore, 'users', docSnapshot.id);
  
        const userData = docSnapshot.data();
        if (userData.subscriptions.includes(subscription)) {
          await updateDoc(userDocRef, {
            subscriptions: userData.subscriptions.filter((item: string) => item !== subscription)
          });
        }
      }
    }
  };
  

  const toggleSubscription = () => {
    if (seriesDetails) {
      if (isSubscribed) {
        handleUnsubscription(seriesDetails.name);
      } else {
        handleSubscription(seriesDetails.name);
      }
    }
  };

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser) {
        setUser(currentUser);
      } 
    });

    return () => unsubscribe();
  }, [navigate, auth]);

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

  const submitReview = async () => {
    if (auth.currentUser) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const reviewData = {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
        seriesId: seriesId,
        rating: rating,
        comment: comment,
        timestamp: Date.now(),
      };

      const docRef = await addDoc(collection(firestore, 'reviews'), reviewData);

      setRating(0);
      setComment('');

      const newReviewId = docRef.id;
      const newReview = { ...reviewData, id: newReviewId };

      setReviews((prevReviews) => [...prevReviews, newReview]);

      console.log('Avis ajouté avec ID : ', docRef.id);
    }else {
      navigate("/login");
    }
  };

  useEffect(() => {
    async function fetchReviews() {
      const reviewsRef = collection(firestore, 'reviews');
      const reviewsQuery = query(reviewsRef, where('seriesId', '==', seriesId));
      const querySnapshot = await getDocs(reviewsQuery);
    
      const reviewsData: Review[] = [];
      querySnapshot.forEach((doc) => {
        const review = doc.data() as Review;
        reviewsData.push(review);
      });
    
      setReviews(reviewsData);
    }
    
  
    fetchReviews();
  }, [seriesId]);
  

  if (!seriesDetails) {
    return <div>Loading...</div>
  }

  if (user) {
    const currentDisplayName = user.displayName || '';
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
        <BackgroundImage imageUrl={`https://image.tmdb.org/t/p/w500${seriesDetails.backdrop_path}`}>
          <SubscriptionButton isSubscribed={isSubscribed} onClick={toggleSubscription} />
        </BackgroundImage>
        <Paper sx={{ mb: '30px' }}>
          <SerieInfo seriesDetails={seriesDetails} />
        </Paper>
        <Typography variant='h5' sx={{ mt: 2, mb: 2 }}>
          Seasons
        </Typography>
        <SeasonList seasons={seasons} />
        <Typography variant='h5' sx={{ mt: 4 }}>
          Cast
        </Typography>
        <CastList cast={cast} />

        <Stack>
          <h3>Leave a Review</h3>
          <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
            <option value="0">Select a Rating</option>
            <option value="1">1 - Bad</option>
            <option value="2">2 - Average</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very good</option>
            <option value="5">5 - Excellent</option>
          </select>
          <textarea
            placeholder="Add a Comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={submitReview}>Submit</button>
        </Stack>

        <Typography variant='h5' sx={{ marginTop: 2 }}>
          Reviews and Comments
        </Typography>
        <ReviewList reviews={reviews} />
      </Container>
    
  );
};

export default SerieDetails;
