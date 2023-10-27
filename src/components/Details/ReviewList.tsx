import React from 'react'
import { Stack, Typography, Paper, Grid, Rating } from '@mui/material'
import SpaIcon from '@mui/icons-material/Spa'

interface ReviewListProps {
  reviews: Review[]
}

interface Review {
  id: string
  userId: string
  userName: string | null
  rating: number
  comment: string
  seriesId: string | undefined
  timestamp: number
}

const customIcon = {
  filled: <SpaIcon style={{ color: '#499b4a' }} />,
  empty: (
    <SpaIcon style={{ color: 'transparent', border: '1px solid #e0e0e0' }} />
  )
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <Grid container spacing={2}>
      {reviews.map((review, index) => (
        <Grid item xs={12} key={index}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 5 }}>
            <Stack direction='column'>
              <Stack direction='row' sx={{ alignItems: 'center' }}>
                <Typography variant='h6'>
                  <strong>Rating :</strong>
                  <Rating
                    name='read-only'
                    value={review.rating}
                    readOnly
                    icon={<SpaIcon style={{ color: '#499b4a' }} />}
                    emptyIcon={<SpaIcon />}
                  />
                </Typography>
              </Stack>
              <Typography variant='subtitle1'>
                <strong>{review.userName || 'Anonymous'}</strong>
              </Typography>
              <Typography variant='body1'>{review.comment}</Typography>
              <Typography variant='body2'>
                <strong>Date :</strong>{' '}
                {new Date(review.timestamp).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default ReviewList
export type { Review }
