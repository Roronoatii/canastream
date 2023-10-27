import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React from 'react'

interface SeasonListProps {
  seasons: Season[]
}

interface Season {
  season_number: number
  episode_count: number
  name: string
  overview: string
  poster_path: string
}

const SeasonList: React.FC<SeasonListProps> = ({ seasons }) => {
  return (
    <Stack>
      {seasons.map(season => (
        <Accordion key={season.season_number}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='subtitle1'>
              Season {season.season_number}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper sx={{ marginTop: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {season.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
                    alt={`Poster of season ${season.season_number}`}
                    style={{ width: '20%', marginRight: '20px' }}
                  />
                )}
                <Stack>
                  <ListSubheader>Season {season.season_number}</ListSubheader>
                  <Typography variant='subtitle1'>{season.overview}</Typography>
                </Stack>
              </div>
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
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  )
}

export default SeasonList
export type { Season }
