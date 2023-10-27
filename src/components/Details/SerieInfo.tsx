import React from 'react';
import { Typography, Stack } from '@mui/material';

interface SerieInfoProps {
  seriesDetails: SeriesDetails;
}

interface SeriesDetails {
  name: string;
  overview: string;
  poster_path: string;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: { name: string }[];
  first_air_date: string;
  backdrop_path: string;
}

const SerieInfo: React.FC<SerieInfoProps> = ({ seriesDetails }) => {
  return (
    <Stack sx={{ darkOverlay: {
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
      } }}>
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
  );
}

export default SerieInfo;
export type { SeriesDetails };
