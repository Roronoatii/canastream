import React, { useEffect, useState } from 'react'
import {
  Stack,
  IconButton,
  InputBase,
  Paper,
  Box,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'


interface Genre {
  id: number
  name: string
}

interface TVShow {
  id: number
  name: string
  genre_ids: number[]
  poster_path: string
}

const Home = () => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [activeGenre, setActiveGenre] = useState<string>('All')
  const [tvShows, setTVShows] = useState<TVShow[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const apiKey = '2955ed558f1e71d9871ec2a96694678a'
  const [currentPage, setCurrentPage] = useState(1)
  const showsPerRow = 5
  const rowsPerPage = 4

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`)
      .then((response: { data: { genres: Genre[] } }) => {
        setGenres(response.data.genres)
      })
      .catch((error: any) => {
        console.error(error)
      })

    axios
      .get(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`)
      .then((response: { data: { results: TVShow[] } }) => {
        setTVShows(response.data.results)
      })
      .catch((error: any) => {
        console.error(error)
      })
  }, [])

  const handleGenreClick = (genreName: string) => {
    setActiveGenre(genreName)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filteredTVShows = tvShows.filter(show => {
    const genreMatch =
      activeGenre === 'All' ||
      show.genre_ids.includes(genres.find(g => g.name === activeGenre)?.id || 0)
    const searchMatch = show.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return genreMatch && searchMatch
  })

  const startIndex = (currentPage - 1) * rowsPerPage * showsPerRow
  const endIndex = startIndex + rowsPerPage * showsPerRow

  const paginatedTVShows = filteredTVShows.slice(startIndex, endIndex)

  const nextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <Stack>
      <Stack>
        <Paper component='form' sx={{ borderRadius: '5px', mb: '10px' }}>
          <IconButton aria-label='search'>
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder='Search…'
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ ml: 1, flex: 1, width: '95%' }}
          />
        </Paper>
        <Stack direction='row' sx={{ mb: '10px' }}>
          <Stack
            sx={{
              borderRadius: '5px',
              backgroundColor: activeGenre === 'All' ? '#499b4a' : '#e0e0e0',
              color: '#000000',
              textAlign: 'center',
              fontSize: '12px',
              p: '5px',
              mx: '5px',
              cursor: 'pointer'
            }}
            onClick={() => handleGenreClick('All')}
          >
            All
          </Stack>
          {genres.map((genre: Genre) => (
            <Stack
              key={genre.id}
              sx={{
                borderRadius: '5px',
                backgroundColor:
                  activeGenre === genre.name ? '#499b4a' : '#e0e0e0',
                color: '#000000',
                fontSize: '12px',
                textAlign: 'center',
                p: '5px',
                mx: '5px',
                cursor: 'pointer'
              }}
              onClick={() => handleGenreClick(genre.name)}
            >
              {genre.name}
            </Stack>
          ))}
        </Stack>
      </Stack>

      {Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${showsPerRow}, 1fr)`,
            gap: '10px',
            mb: '10px'
          }}
        >
          {paginatedTVShows
            .slice(rowIndex * showsPerRow, (rowIndex + 1) * showsPerRow)
            .map((show: TVShow) => (
              <Box key={show.id} sx={{ width: '100%', position: 'relative' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w185${show.poster_path}`}
                  alt={show.name}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '5%',
                    right: '35%',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '5px',
                    color: '#000000'
                  }}
                >
                  <AddIcon />
                </IconButton>

                <Typography
                  sx={{ fontSize: '12px', transform: 'uppercase', mt: '5px' }}
                >
                  {show.name}
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
                  {show.genre_ids.length > 0
                    ? genres.find(g => g.id === show.genre_ids[0])?.name ||
                      'Unknown Genre'
                    : 'Unknown Genre'}
                </Stack>
              </Box>
            ))}
        </Box>
      ))}

      <Stack
        direction='row'
        sx={{ justifyContent: 'center', alignItems: 'center', mt: '10px' }}
      >
        <IconButton disabled={currentPage === 1}>
          <ArrowBackIcon onClick={prevPage} />
        </IconButton>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredTVShows.length / (rowsPerPage * showsPerRow))}
          onPageClick={page => setCurrentPage(page)}
        />
        <IconButton disabled={startIndex + rowsPerPage * showsPerRow >= filteredTVShows.length}>
          <ArrowForwardIcon onClick={nextPage} />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default Home


type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageClick: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageClick }: PaginationProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
      {pageNumbers.map((page) => (
        <Typography
          key={page}
          onClick={() => onPageClick(page)}
          sx={{
            cursor: 'pointer',
            color: currentPage === page ? '#499b4a' : '#000000',
            fontSize: '16px',
            p: '5px',
          }}
        >
          {page}
        </Typography>
      ))}
    </Stack>
  );
};