import React from 'react';
import { Box, IconButton, Stack, Typography, ImageListItem, ImageListItemBar } from '@mui/material';
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
            <ImageListItem>
            <img
                src={`https://image.tmdb.org/t/p/w185${posterPath}`}
                alt={name}
                style={{ maxWidth: '100%', height: 'auto' }}
            />
            <ImageListItemBar sx={{mx: '5%', my: '5%', background: 'transparent'}} actionIcon={
                <IconButton sx={{ backgroundColor: '#e0e0e0',
                borderRadius: '5px',
                color: '#000000',
                '&:hover': {
                    backgroundColor: '#499b4a',
                 }}}>
                    {isInWatchList ? <CheckIcon /> : <AddIcon />}
                </IconButton>
            }/>
            </ImageListItem>
            <Typography variant="button" sx={{ fontSize: '12px', mt: '5px' }}>
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
                    cursor: 'pointer',
                }}
            >
                {genres.length > 0
                    ? genres.find((g) => g.id === genres[0].id)?.name || 'Unknown Genre'
                    : 'Unknown Genre'}
            </Stack>
        </Box>
    );
}
