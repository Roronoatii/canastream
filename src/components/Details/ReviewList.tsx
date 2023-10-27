import React from 'react';
import { List, ListItem, Stack, Typography } from '@mui/material';

interface ReviewListProps {
    reviews: Review[];
}

interface Review {
    id: string;
    userId: string; 
    userName: string | null;
    rating: number; 
    comment: string; 
    seriesId: string | undefined; 
    timestamp: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <List>
      {reviews.map((review, index) => (
          <ListItem key={index} sx={{ border: '1px solid #e0e0e0', borderRadius: '5px', margin: '5px' }}>
            <Stack direction="column">
              <Typography variant="subtitle1">
                <strong>Rating :</strong> {review.rating}
              </Typography>
              <Typography variant="body2">
                <strong>{review.userName}</strong>
              </Typography>
              <Typography variant="body2">{review.comment}</Typography>
              <Typography variant="body2">
                <strong>Date :</strong> {new Date(review.timestamp).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Stack>
          </ListItem>
        ))}
    </List>
  );
}

export default ReviewList;
export type { Review };
