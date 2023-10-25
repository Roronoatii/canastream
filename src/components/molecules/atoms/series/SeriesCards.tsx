import React from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

interface SeriesCardProps {
    id: number;
    posterPath: string;
    name: string;
    genres: { id: number; name: string }[];
    isInWatchList?: boolean;
}

export default function SeriesCard(props: SeriesCardProps) {
    const { id, posterPath, name, genres } = props;
    const isInWatchList = props.isInWatchList || false;

    return (
        <Box key={id} sx={{ width: '100%', position: 'relative' }}>
            <img
                src={`https://image.tmdb.org/t/p/w185${posterPath}`}
                alt={name}
                style={{ maxWidth: '100%', height: 'auto' }}
            />            
            {isInWatchList ? (
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: '5%',
                        right: '35%',
                        backgroundColor: '#499b4a',
                        borderRadius: '5px',
                        color: '#000000',
                        '&:hover': {
                            backgroundColor: '#499b4a',
                        },
                    }}
                >
                    <CheckIcon />
                </IconButton>
            ) : null}

            {!isInWatchList && (
                <IconButton
                    onClick={() => {
                        console.log('Add to watchlist');
                    }}
                    sx={{
                        position: 'absolute',
                        top: '5%',
                        right: '35%',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '5px',
                        color: '#000000',
                        '&:hover': {
                            backgroundColor: '#499b4a',
                        },
                    }}
                >
                    <AddIcon />
                </IconButton>
            )}

            <Typography sx={{ fontSize: '12px', transform: 'uppercase', mt: '5px' }}>
                {name}
            </Typography>
            <Stack
                sx={{
                    borderRadius: '5px',
                    backgroundColor: '#e0e0e0',
                    color: '#000000',
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
        </Box>
    );
}