import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface SeriesDetails {
  name: string;
  overview: string;
  poster_path: string;
}

interface Season {
  season_number: number;
  episode_count: number;
  name: string;
}

interface CastMember {
  name: string;
  character: string;
}

const SerieDetails = () => {
  const { seriesId } = useParams();
  const [seriesDetails, setSeriesDetails] = useState<SeriesDetails | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const apiKey = "2955ed558f1e71d9871ec2a96694678a";

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}`)
      .then((response) => {
        setSeriesDetails(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&append_to_response=seasons`)
      .then((response) => {
        setSeriesDetails(response.data);
        setSeasons(response.data.seasons);
      })
      .catch((error) => {
        console.error(error);
      });
    
    

    axios
      .get(`https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${apiKey}`)
      .then((response) => {
        setCast(response.data.cast);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [seriesId]);

  if (!seriesDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{seriesDetails.name}</h2>
      <img
        src={`https://image.tmdb.org/t/p/w500${seriesDetails.poster_path}`}
        alt={seriesDetails.name}
      />
      <p>{seriesDetails.overview}</p>

      <h3>Seasons</h3>
      <ul>
        {seasons.map((season) => (
          <li key={season.season_number}>
            Season {season.season_number} - {season.episode_count} episodes
          </li>
        ))}
      </ul>

      <h3>Cast</h3>
      <ul>
        {cast.map((member) => (
          <li key={member.name}>
            {member.name} as {member.character}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SerieDetails;
